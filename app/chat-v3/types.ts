

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  updated_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: string;
  content: string;
  tool_invocations: string;
  created_at: string;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

export interface TavilySearchResponse {
  answer?: string;
  query: string;
  response_time: number;
  results: TavilySearchResult[];
  images?: { url: string; description: string }[];
}
