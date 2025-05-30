'use client'

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last revised: 28 December 2024
      </p>

      <h2>Introduction</h2>
      <p>
        HealthHub cares about data privacy and security and is committed to fair information practices and to the protection of privacy. This Privacy Policy explains the manner in which HealthHub (&ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) collects, stores, uses and/or discloses information collected from our website and services.
      </p>
      <p>
        This Privacy Policy applies to our website and services and complies with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act) and other applicable healthcare data protection regulations. We also follow the Telemedicine Practice Guidelines issued by the Medical Council of India for handling health information.
      </p>

      <h2>Collection of Information</h2>
      <h3>Information automatically collected</h3>
      <p>
        We automatically track and collect the following categories of information when you visit our website:
      </p>
      <ul>
        <li>IP addresses</li>
        <li>Domain servers</li>
        <li>Types of computers accessing the website</li>
        <li>Types of web browsers used to access the website</li>
        <li>Referring source which may have sent you to the website</li>
        <li>Other information associated with the interaction of your browser and the website</li>
      </ul>

      <h3>Medical Records</h3>
      <p>
        To utilize our AI Health Assistant, AI-generated reports, or Second Opinion services, you may need to provide us with:
      </p>
      <ul>
        <li>Past and current health records</li>
        <li>Medical reports and images</li>
        <li>Diagnostic and laboratory test results</li>
        <li>Health-related information and symptoms</li>
        <li>Medical history and lifestyle descriptions</li>
        <li>Information about medical conditions</li>
        <li>Medications, diagnoses, and treatments</li>
        <li>Physician reports and evaluations</li>
      </ul>
      <p>
        We collect your Medical Information only if you voluntarily submit it. While you may refuse to provide such information, this may limit your access to certain Website features and Services.
      </p>

      <h3>Other Information</h3>
      <p>
        We also collect information that you voluntarily provide when using our interactive tools and Services, including:
      </p>
      <ul>
        <li>Personal Information (email address, demographic data)</li>
        <li>Real-time sensor data from Arduino devices</li>
        <li>Fitness activity data from Strava and Garmin Connect</li>
        <li>Nutrition and dietary information</li>
        <li>Medical Expert search preferences</li>
        <li>Survey and questionnaire responses</li>
        <li>Information provided in free-form text boxes</li>
      </ul>

      <h2>Data Protection and Privacy</h2>
      <p>
        We strongly recommend removing all personally identifiable information before sharing documents. This includes redacting:
      </p>
      <ul>
        <li>Names and addresses</li>
        <li>Contact information</li>
        <li>Social security numbers</li>
        <li>Medical record numbers</li>
        <li>Other personal identifiers</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        You can redact information by blacking it out or using online redaction tools.
      </p>

      <h2>Third-Party Integrations</h2>
      <p>We integrate with third-party services to enhance your experience:</p>
      <ul>
        <li><strong>Strava:</strong> When you connect your Strava account, we access your fitness activities, including routes, duration, and performance metrics.</li>
        <li><strong>Garmin Connect:</strong> Integration with Garmin provides access to your health metrics, activities, and device data.</li>
        <li><strong>OpenAI:</strong> We use OpenAI&apos;s services for AI-assisted analysis and chat functionality.</li>
        <li><strong>Cohere:</strong> Used for processing and analyzing health documentation.</li>
      </ul>

      <h2>Your Protected Health Information</h2>
      <p>
        Your health information is classified as sensitive personal data under India&apos;s DPDP Act. We handle such information with utmost care and in accordance with applicable Indian healthcare data protection regulations. We will use and disclose such information only:
      </p>
      <ul>
        <li>With your explicit consent</li>
        <li>For providing you the requested healthcare services</li>
        <li>When required by Indian law or court orders</li>
        <li>In anonymized form for research and analysis</li>
      </ul>

      <h2>Data Retention</h2>
      <p>
        We retain Personal Information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
      </p>
      <p>
        When we no longer have a legitimate business need to process your personal information, we will either delete or anonymize it. If deletion or anonymization is not immediately possible (for example, because your information is stored in backup archives), we will securely store your information and isolate it from further processing until deletion is possible.
      </p>

      <h2>Security</h2>
      <p>
        The security of your Personal Information is important to us. We follow generally accepted industry standards and adopt appropriate data collection, storage and processing practices, and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
      </p>

      <h2>User Rights and Choices</h2>
      <p>
        You have several choices regarding your information:
      </p>
      <ul>
        <li>You may choose not to provide Personal or Medical information, though this may limit access to certain features</li>
        <li>You can opt-out of marketing emails using the &ldquo;unsubscribe&rdquo; link</li>
        <li>You may disable cookies through your browser settings</li>
        <li>You can request deletion of your personal information by emailing us</li>
      </ul>
      <p>
        Note that you may continue to receive operational messages briefly after opting out while we process your request. Some operational communications, such as password resets and payment confirmations, cannot be opted out of as they are necessary for service delivery.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, the practices of our website, or your dealings with our Services, please contact us at:
      </p>
      <p className="font-medium">privacy@healthhub.com</p>
    </div>
  )
} 