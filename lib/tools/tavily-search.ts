import { tool } from 'ai';
import { z } from 'zod';
import tvly from '@/lib/tavily/client';

export const tavilySearchTool = tool({
  description: 'Search the web using Tavily for up-to-date information, news, and research.',
  parameters: z.object({
    query: z.string().describe('The search query to use.'),
  }),
  execute: async ({ query }) => {
    try {
      const searchResult = await tvly.search(query, {
        includeAnswer: true,
        maxResults: 5,
        includeRawContent: false,
        includeImages: true,
      });
      // The result needs to be a JSON string for the client to parse.
      return JSON.stringify(searchResult);
    } catch (error) {
      console.error('Error searching with Tavily:', error);
      return JSON.stringify({ error: 'Failed to perform search. Please try again.' });
    }
  },
});
