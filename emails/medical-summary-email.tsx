import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Markdown,
  Preview,
  Section,
  Text
} from '@react-email/components';
import * as React from 'react';

interface MedicalSummaryEmailProps {
  medicalSummary: string;
}

export const MedicalSummaryEmail = ({
  medicalSummary
}: MedicalSummaryEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Health Summary</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Your Health Summary</Heading>
          <Text style={paragraph}>
            Here is a summary of your recent medical history and health metrics.
          </Text>
        </Section>
        <Hr style={hr} />
        <Section style={content}>
          <Markdown
            markdownContainerStyles={{
              padding: '0 20px',
            }}
          >
            {medicalSummary}
          </Markdown>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            This information was generated on {new Date().toLocaleString()}. Please
            consult a healthcare professional for any medical advice.
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Health Monitor. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default MedicalSummaryEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  maxWidth: '680px',
};

const header = {
  padding: '0 40px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '32px',
  textAlign: 'center' as const,
  color: '#484848',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
  color: '#5f5f5f',
};

const content = {
  padding: '0 40px',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '20px 0',
};

const footer = {
  padding: '0 40px',
};

const footerText = {
  fontSize: '12px',
  color: '#8898aa',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};
