import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { OpenAI } from 'openai';
import { ChatRequest, ChatResponse, MovieData } from '@/utils/types/chat';
import validator from 'validator';
import { WORD_LIMIT, DEFAULT_MOVIES } from '@/utils/consts';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function parseInput(userInput: string): { description: string; urls: string[] } {
  const urlRegex = /https:\/\/www\.imdb\.com\/title\/tt\d+(\/\S*)?/g;
  const refRegex = /ref_=sr_t_\d+\)?/g;
  const urls = userInput.match(urlRegex) || [];
  const refMatches = [...userInput.matchAll(refRegex)];
  if (refMatches.length > 0) {
    const { index: lastMatchIndex, 0: lastMatch } = refMatches[refMatches.length - 1];
    if (lastMatchIndex !== undefined) {
      const description = userInput.slice(lastMatchIndex + lastMatch.length).trim();
      const sanitize = validator.escape(description)
      return { description: sanitize, urls };
    }
  }
  const sanitizedDescription = validator.escape(
    userInput.replace(urlRegex, "").replace(/\(\s*\)/g, "").trim()
  );
  return { description: sanitizedDescription, urls };
}
async function fetchMoviesFromIMDb(urls: string[]): Promise<MovieData[]> {
  const detailedMovies = await Promise.all(
    urls.map(async (url) => {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      const $ = cheerio.load(data);
      return {
        title: $('h1').text().trim() || 'Unknown Title',
        genre: $('.ipc-chip__text')
          .map((_, el) => $(el).text().trim())
          .get() || [],
        description: $('span[data-testid="plot-xl"]').text().trim() || 'No description available.',
        releaseDate: $('li[data-testid="title-details-releasedate"] a').text().trim() || 'Unknown release date',
        url,
      };
    })
  );
  return detailedMovies;
}
function generateMovieDetails(movies: MovieData[]): string {
  return movies
    .map(movie => {
      const details = [];
      details.push(`Title: ${movie.title}`);
      if (movie.genre?.length) details.push(`Genre: ${movie.genre.join(', ')}`);
      if (movie.description) details.push(`Description: ${movie.description}`);
      if (movie.releaseDate) details.push(`Release Date: ${movie.releaseDate}`);
      return details.join('\n');
    })
    .join('\n\n');
}
function validateApiKey(req: NextApiRequest): boolean {
  const apiKey = req.headers['x-api-key'] as string | undefined;
  return apiKey === process.env.VALID_API_KEY;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.body || typeof req.body.userMessage !== 'string') {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  try {
    const { userMessage }: ChatRequest = req.body;
    if (userMessage.length > WORD_LIMIT) {
      return res.status(400).json({ error: 'Input too long' });
    }
    const { description, urls } = parseInput(userMessage);
    const imdbMovies = urls.length > 0 ? await fetchMoviesFromIMDb(urls) : [];
    const allMovies = [...DEFAULT_MOVIES, ...imdbMovies];
    const movieDetails = generateMovieDetails(allMovies);
    const prompt = `
      User says: "${description}".
      Here are some movies they are considering:
      ${movieDetails}
      Recommend the best movie for them to watch based on their preferences.
    `;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful movie recommendation assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
    });
    const reply: ChatResponse = { reply: response.choices?.[0]?.message?.content?.trim() || '' };
    return res.status(200).json(reply);
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
}