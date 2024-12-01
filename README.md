Backend
    chat.ts:
        API endpoint (/api/chat) to handle user requests and generate movie recommendations.
        Validates API keys for secure access.
        Parses user input for IMDb URLs and fetches movie details using axios and cheerio.
        Integrates with OpenAI to generate personalized recommendations.
Frontend
    Components:
        ChatBox.tsx: Displays user and assistant messages in a scrollable chat interface.
        InputBox.tsx: Collects user input and handles message submission.
    Page:
        index.tsx:
            Main interface for FilmFinder.
            Includes a welcome modal, chatbox, and input box.
Utils
    Types: Shared TypeScript definitions: ChatRequest, ChatResponse, MovieData.
    Constants: Includes global constants like WORD_LIMIT and DEFAULT_MOVIES.

Tech Stack
    Frontend: React, Next.js, Tailwind CSS
    Backend: Next.js API routes, OpenAI API, IMDb scraping with axios and cheerio
    Utilities: TypeScript, Validator.js

How to Run:

Install Dependencies:
    npm install

Set Up Environment Variables: Create a .env
    NEXT_PUBLIC_VALID_API_KEY=your-frontend-api-key
    VALID_API_KEY=your-backend-api-key
    OPENAI_API_KEY=your-openai-api-key

Run the Development Server:
    npm run dev

Usage:
Describe Your Preferences:
    Example: "I’m looking for an action movie to watch with my friends."
Include IMDb URLs (Optional):
    Example: "Barbie (https://www.imdb.com/title/tt1517268/?ref_=sr_t_28) I’m looking for a fun movie to watch with my friends."
Get Recommendations:
    FilmFinder will suggest movies based on your input.




