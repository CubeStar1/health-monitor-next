import { MedicalSummaryEmail } from '@/emails/medical-summary-email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, medicalSummary } = await request.json();

    if (!email || !medicalSummary) {
      return Response.json(
        { error: 'Email and medical summary are required.' },
        { status: 400 }
      );
    }

    const resendRes = await resend.emails.send({
      from: `Health Monitor <alerts@${process.env.RESEND_DOMAIN}>`,
      to: [email],
      subject: 'Your Health Summary from Health Monitor',
      react: MedicalSummaryEmail({ medicalSummary })
    });

    if (resendRes.error) {
      return Response.json({ error: resendRes.error }, { status: 500 });
    }

    return Response.json({ data: resendRes.data });
  } catch (error) {
    console.error('Error sending alert email:', error);
    return Response.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
