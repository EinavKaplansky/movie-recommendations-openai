export interface ChatRequest {
    userMessage: string;
    movies: MovieData[];
}

export interface MovieData {
    title: string;
    genre?: string[];
    description?: string;
    releaseDate?: string;
    url?: string;
}

export interface ChatResponse {
    reply: string;
}