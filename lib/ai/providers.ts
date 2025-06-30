import {
    customProvider,
  } from 'ai';
  import { createOpenAI } from '@ai-sdk/openai';
  import { createGoogleGenerativeAI } from '@ai-sdk/google';
  import { createXai } from '@ai-sdk/xai';
  import { createGroq } from "@ai-sdk/groq";


  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const xai = createXai({
    apiKey: process.env.XAI_API_KEY,
  });

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });
  
  export const models = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'gpt-4.1', label: 'GPT-4.1' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gemini-2.5-flash-preview-04-17', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'grok-3-mini', label: 'XAI Grok 3 Mini' },
  { value: 'llama-3.3-70b-versatile', label: 'Groq Llama 3.3' },
];

export const myProvider = customProvider({
  languageModels: {
    'gpt-4o-mini': openai('gpt-4o-mini'),
    'gpt-4.1-mini': openai('gpt-4.1-mini'),
    'gpt-4.1': openai('gpt-4.1'),
    'gemini-2.5-flash-preview-04-17': google('gemini-2.5-flash-preview-04-17'),
    'gemini-2.0-flash': google('gemini-2.0-flash'),
    'gemini-2.5-pro': google('gemini-2.5-pro'),
    'grok-3-mini': xai('grok-3-mini'),
    'llama-3.3-70b-versatile': groq('llama-3.3-70b-versatile'),
  },
  fallbackProvider: openai,
});