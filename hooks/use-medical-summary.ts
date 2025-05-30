import { useQuery } from '@tanstack/react-query';
import useUser from './use-user';

async function fetchMedicalData(userId: string) {
  // Fetch RAG data
  const ragResponse = await fetch('/api/rag-query-v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "Provide a concise summary of my medical history, including current prescriptions, recent diagnoses, and key health information.",
      match_count: 10,
      llm_choice: "openai",
      user_id: userId,
    }),
  });

  // Fetch sensor data
  const sensorResponse = await fetch('/api/chat-v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{
        role: 'user',
        content: `Provide a summary of my recent health metrics including:
          - Average heart rate in the last 24 hours
          - Latest temperature reading
          - Latest humidity and heat index
         `
      }],
      llm_choice: "openai"
    }),
  });

  const [ragData, sensorData] = await Promise.all([
    ragResponse.json(),
    sensorResponse.json()
  ]);

  // Combine the data into a markdown format
  return `# Summary of Medical History

## Patient Information
${ragData.response || ragData.answer}

## Recent Health Metrics
${sensorData.content}

---
Last updated: ${new Date().toLocaleString()}`;
}

export function useMedicalSummary() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['medical-summary', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return fetchMedicalData(user.id);
    },
    enabled: !!user?.id,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
} 