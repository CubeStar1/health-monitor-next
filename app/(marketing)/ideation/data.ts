import { Storyboard, JourneyStage, MindMapBranch } from './types';

interface Technique {
  title: string;
  storyboards?: Storyboard[];
  journeyStages?: JourneyStage[];
  branches?: MindMapBranch[];
  scamperItems?: ScamperItem[];
}

export interface ScamperItem {
  technique: string;
  description: string;
  examples: string[];
}

interface Techniques {
  [key: string]: Technique;
  scamper: {
    title: string;
    scamperItems: ScamperItem[];
  };
}

export const techniques: Techniques = {
  brainstorm: {
    title: "Brainstorming"
  },
  storyboard: {
    title: "Storyboards",
    storyboards: [
      {
        title: "First-Time Data Import",
        description: "A patient importing their medical history for the first time",
        scenario: "Sarah receives her medical records and uses the platform to digitize and organize them automatically"
      },
      {
        title: "Emergency Room Visit",
        description: "Quick access to medical history in emergency",
        scenario: "John shares his complete medical history with ER doctors through secure quick access"
      },
      {
        title: "Regular Health Monitoring",
        description: "Daily health data integration",
        scenario: "Maria's wearable device data automatically syncs with her medical records"
      }
    ]
  },
  journey: {
    title: "Customer Journey",
    journeyStages: [
      {
        stage: "Discovery",
        actions: ["Research health data platforms", "Read reviews", "Compare features"],
        emotions: "Hopeful but cautious",
        painPoints: ["Overwhelmed by options", "Concerned about privacy"],
        opportunities: ["Clear security explanations", "Free trial option"]
      },
      {
        stage: "Onboarding",
        actions: ["Upload documents", "Connect devices", "Set up profile"],
        emotions: "Excited but anxious",
        painPoints: ["Time-consuming setup", "Technical challenges"],
        opportunities: ["Guided setup wizard", "24/7 support"]
      },
      {
        stage: "Daily Usage",
        actions: ["Search records", "Monitor health metrics", "Share with providers"],
        emotions: "Confident and relieved",
        painPoints: ["Learning new features", "Integration issues"],
        opportunities: ["Tutorial videos", "AI assistance"]
      }
    ]
  },
  mindmap: {
    title: "Mind Map",
    branches: [
      {
        title: "Security",
        items: ["Encryption", "Access Control", "Audit Logs", "HIPAA Compliance"]
      },
      {
        title: "Data Processing",
        items: ["OCR", "NLP", "Machine Learning", "Real-time Analytics"]
      },
      {
        title: "User Interface",
        items: ["Voice Search", "Visual Timeline", "Mobile App", "Web Portal"]
      },
      {
        title: "Integration",
        items: ["EHR Systems", "IoT Devices", "Lab Systems", "Pharmacy Data"]
      }
    ]
  },
  scamper: {
    title: "SCAMPER",
    scamperItems: [
      {
        technique: "Substitute",
        description: "Replace parts, materials, or people",
        examples: ["What materials could be replaced?", "What rules could be changed?"]
      },
      {
        technique: "Combine",
        description: "Mix, combine with other assemblies or services",
        examples: ["What ideas or purposes could be combined?", "What could be merged together?"]
      },
      {
        technique: "Adapt",
        description: "Alter, change function, use part of another element",
        examples: ["How could this be adjusted for another purpose?", "What else is similar to this?"]
      },
      {
        technique: "Modify",
        description: "Increase or reduce in scale, change shape",
        examples: ["What could be made larger or smaller?", "What could be enhanced?"]
      },
      {
        technique: "Put to another use",
        description: "Use for different purposes",
        examples: ["What else could this be used for?", "Who else could use this?"]
      },
      {
        technique: "Eliminate",
        description: "Remove elements, simplify, reduce to core functionality",
        examples: ["What could be removed?", "What could be simplified?"]
      },
      {
        technique: "Reverse",
        description: "Turn inside out or upside down",
        examples: ["What if we did this backwards?", "What if we reversed the order?"]
      }
    ]
  }
}; 