import { tool } from 'ai';
import { z } from 'zod';
import { Ragie } from 'ragie';

const ragie = new Ragie({
  auth: process.env.RAGIE_API_KEY,
});

export const ragRetrievalTool = tool({
  description: 'Retrieve information from uploaded documents.',
  parameters: z.object({
    query: z.string().describe('The query to search for in the documents.'),
  }),
  execute: async ({ query }) => {
    try {
      const response = await ragie.retrievals.retrieve({ query });

      // Return an array of chunks with their source document
      const chunks = response.scoredChunks.map(
        (chunk: { text: string; documentName: string }) => ({
          text: chunk.text,
          documentName: chunk.documentName,
        })
      );

      return { chunks };
    } catch (error: any) {
      console.error('[RAG Tool] Error:', error);
      return { error: 'An unexpected error occurred during retrieval.' };
    }
  },
});
