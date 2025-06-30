import { streamText, CoreMessage , smoothStream} from 'ai';
import { getSystemPrompt } from '@/lib/prompts/system-prompt';
import { querySupabaseTool } from '@/lib/tools/query-supabase';
import { generateChart } from '@/lib/tools/generate-chart';
import { tavilySearchTool } from '@/lib/tools/tavily-search';
import { ragRetrievalTool } from '@/lib/tools/rag-retrieval';
import { generateImage } from '@/lib/tools/generate-image';
import { sendHealthReport } from '@/lib/tools/send-health-report';
import { myProvider } from '@/lib/ai/providers';
import { getUser } from '@/hooks/get-user';


export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages, data, selectedModel }: { messages: CoreMessage[], data: any, selectedModel: string } = await req.json();
    const systemPrompt = await getSystemPrompt(user);
    console.log(selectedModel);

    const result = streamText({
      model: myProvider.languageModel(selectedModel as any),
      system: systemPrompt,
      messages,
      tools: {
        querySupabase: querySupabaseTool,
        generateChart: generateChart,
        tavilySearch: tavilySearchTool,
        ragRetrieval: ragRetrievalTool,
        generateImage: generateImage,
        sendHealthReport: sendHealthReport,
      },
      maxSteps: 10, 
      onError: (error) => {
        console.error('Error:', error);
      },
      experimental_transform: smoothStream({
        chunking: 'word',
      }),
      toolCallStreaming: true,
    });

    // Stream the response back to the client so `useChat` can consume it
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('[API] Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
