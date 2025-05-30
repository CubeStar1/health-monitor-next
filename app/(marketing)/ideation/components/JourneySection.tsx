'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface JourneyStage {
  stage: string;
  actions: string;
  touchpoints: string[];
  experience: {
    emoji: string;
    text: string;
  };
  painPoints: string[];
  solutions: string[];
  icon: string;
  color: string;
  bgGradient: string;
}

const journeyData: JourneyStage[] = [
  {
    stage: "AWARENESS",
    actions: "Healthcare providers and patients discover need for AI-powered health data management",
    touchpoints: [
      "Healthcare provider networks",
      "Medical conferences",
      "Digital health platforms"
    ],
    experience: {
      emoji: "😟",
      text: "Overwhelmed by data fragmentation"
    },
    painPoints: [
      "Scattered medical documents",
      "Manual data processing",
      "Inconsistent record formats"
    ],
    solutions: [
      "AI document analysis & categorization",
      "Automated data extraction",
      "Multi-format document support"
    ],
    icon: "🔍",
    color: "bg-amber-100",
    bgGradient: "bg-gradient-to-r from-amber-50 to-amber-100"
  },
  {
    stage: "CONSIDERATION",
    actions: "Exploring AI capabilities and HIPAA compliance features",
    touchpoints: [
      "Interactive platform demos",
      "Security whitepapers",
      "Compliance documentation"
    ],
    experience: {
      emoji: "🤔",
      text: "Evaluating AI capabilities"
    },
    painPoints: [
      "Data security concerns",
      "Complex compliance requirements",
      "Integration with existing systems"
    ],
    solutions: [
      "HIPAA-compliant infrastructure",
      "Natural language processing",
      "Seamless EHR integration"
    ],
    icon: "⚡",
    color: "bg-pink-100",
    bgGradient: "bg-gradient-to-r from-pink-50 to-pink-100"
  },
  {
    stage: "DECISION",
    actions: "Validating platform with real medical data scenarios",
    touchpoints: [
      "Semantic search demo",
      "Real-time analytics preview",
      "Integration testing"
    ],
    experience: {
      emoji: "🎯",
      text: "Convinced by AI accuracy"
    },
    painPoints: [
      "Data migration concerns",
      "Staff training requirements",
      "Implementation timeline"
    ],
    solutions: [
      "Intelligent data migration",
      "Real-time health monitoring",
      "Automated insights generation"
    ],
    icon: "✨",
    color: "bg-blue-100",
    bgGradient: "bg-gradient-to-r from-blue-50 to-blue-100"
  },
  {
    stage: "RETENTION",
    actions: "Leveraging advanced AI features for health insights",
    touchpoints: [
      "Predictive analytics dashboard",
      "Mobile health tracking",
      "Automated reporting"
    ],
    experience: {
      emoji: "🌟",
      text: "Transformed by AI insights"
    },
    painPoints: [
      "Keeping up with AI capabilities",
      "Complex data visualization",
      "Cross-platform consistency"
    ],
    solutions: [
      "Continuous AI learning",
      "Smart health predictions",
      "Cross-device synchronization"
    ],
    icon: "💫",
    color: "bg-green-100",
    bgGradient: "bg-gradient-to-r from-green-50 to-green-100"
  }
];

const JourneySection = () => {
  return (
    <div className="p-6 overflow-x-auto bg-gradient-to-b from-gray-50 to-white">
      <div className="min-w-[1200px] relative p-8">
        {/* Stage Headers with Arrows */}
        <div className="flex mb-16 relative">
          {journeyData.map((stage, index) => (
            <div key={index} className="flex-1 relative px-4">
              <motion.div
                className={`${stage.bgGradient} p-8 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, shadow: "xl" }}
              >
                <div className="text-center">
                  <span className="text-5xl mb-4 block filter drop-shadow-md">{stage.icon}</span>
                  <h3 className="font-bold text-gray-800 text-xl">{stage.stage}</h3>
                </div>
              </motion.div>
              {index < journeyData.length - 1 && (
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <div className="w-8 h-8 rotate-45 border-t-2 border-r-2 border-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Journey Map Content */}
        {['ACTIONS', 'TOUCHPOINTS', 'EXPERIENCE/EMOTIONS', 'PAIN POINTS', 'SOLUTIONS'].map((rowTitle, rowIndex) => (
          <div key={rowTitle} className="flex mb-10">
            <div className="w-48 font-bold text-sm pr-8 py-2 flex items-center text-gray-700">
              <span className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                {rowTitle}
              </span>
            </div>
            <div className="flex-1 flex gap-8">
              {journeyData.map((stage, index) => (
                <motion.div
                  key={index}
                  className="flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (rowIndex * 4 + index) * 0.05 }}
                >
                  <div className={`p-6 rounded-xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all
                    ${rowTitle === 'EXPERIENCE/EMOTIONS' ? `${stage.bgGradient} border-0` : ''}`}>
                    {rowTitle === 'EXPERIENCE/EMOTIONS' ? (
                      <div className="text-center py-2">
                        <span className="text-4xl mb-3 block filter drop-shadow-sm">{stage.experience.emoji}</span>
                        <p className="font-medium text-gray-800">{stage.experience.text}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {rowTitle === 'ACTIONS' && (
                          <p className="text-sm leading-relaxed text-gray-700">{stage.actions}</p>
                        )}
                        {rowTitle === 'TOUCHPOINTS' && (
                          <ul className="text-sm space-y-2">
                            {stage.touchpoints.map((point, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                <span className="text-gray-700">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {rowTitle === 'PAIN POINTS' && (
                          <ul className="text-sm space-y-2">
                            {stage.painPoints.map((point, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                <span className="text-gray-700">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {rowTitle === 'SOLUTIONS' && (
                          <ul className="text-sm space-y-2">
                            {stage.solutions.map((solution, i) => (
                              <li key={i} className="flex items-center gap-3 bg-green-50/50 p-2 rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-gray-800 font-medium">{solution}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneySection; 