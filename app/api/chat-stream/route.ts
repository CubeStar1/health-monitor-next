import { NextRequest } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';
const DB_CREDENTIALS = {
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_name: process.env.DB_NAME,
};

export async function POST(req: NextRequest) {
  const { messages, llm_choice } = await req.json();

  try {
    const response = await fetch(`${API_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, db_credentials: DB_CREDENTIALS, llm_choice }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from backend');
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}