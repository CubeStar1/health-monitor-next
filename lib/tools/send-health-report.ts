import { z } from 'zod';
import { tool } from 'ai';
import { Resend } from 'resend';
import { MedicalSummaryEmail } from '@/emails/medical-summary-email';

async function getMedicalSummary(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const ragResponse = await fetch(`${baseUrl}/api/rag-query-v2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query:
        'Provide a concise summary of my medical history, including current prescriptions, recent diagnoses, and key health information.',
      match_count: 10,
      llm_choice: 'openai',
      user_id: userId
    })
  });

  const sensorResponse = await fetch(`${baseUrl}/api/chat-v2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: `Provide a summary of my recent health metrics including:
          - Average heart rate in the last 24 hours
          - Latest temperature reading
          - Latest humidity and heat index
         `
        }
      ],
      llm_choice: 'openai'
    })
  });

  if (!ragResponse.ok || !sensorResponse.ok) {
    throw new Error('Failed to fetch medical data.');
  }

  const [ragData, sensorData] = await Promise.all([
    ragResponse.json(),
    sensorResponse.json()
  ]);

  return `# Summary of Medical History

## Patient Information
${ragData.response || ragData.answer}

## Recent Health Metrics
${sensorData.content}

---
Last updated: ${new Date().toLocaleString()}`;
}

const sendHealthReportParameters = z.object({
  email: z.string().describe("The recipient's email address."),
  userId: z.string().describe('The ID of the user to generate the report for.')
});

export const sendHealthReport = tool({
  description:
    "Fetches a user's health summary and sends it as an email report.",
  parameters: sendHealthReportParameters,
  execute: async ({ email, userId }) => {
    try {
      const medicalSummary = await getMedicalSummary(userId);

      const resend = new Resend(process.env.RESEND_API_KEY);

      const { error } = await resend.emails.send({
        from: `Health Monitor <alerts@${process.env.RESEND_DOMAIN}>`,
        to: [email],
        subject: 'Your Health Summary from Health Monitor',
        react: MedicalSummaryEmail({ medicalSummary })
      });

      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return { success: true, message: `Health report sent to ${email}.` };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
});
