import React, { useState } from 'react';
import { ScamperItem } from '../data';
import { motion, AnimatePresence } from 'framer-motion';

interface ScamperSectionProps {
  scamperItems: ScamperItem[];
}

const ScamperSection: React.FC<ScamperSectionProps> = ({ scamperItems }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const brainstormedIdeas: { [key: string]: string[] } = {
    "Substitute": [
      "Replace traditional login with biometric authentication",
      "Substitute manual data entry with automated OCR scanning",
      "Replace text-based navigation with voice commands",
      "Substitute generic alerts with AI-powered personalized notifications",
      "Replace static PDFs with interactive health documents"
    ],
    "Combine": [
      "Merge health records with fitness tracking data",
      "Combine appointment scheduling with real-time doctor availability",
      "Integrate medication tracking with pharmacy ordering system",
      "Merge symptom tracking with AI-powered health predictions",
      "Combine telehealth features with record sharing"
    ],
    "Adapt": [
      "Adapt enterprise security protocols for personal health data",
      "Convert medical jargon to plain language automatically",
      "Adapt social media sharing concepts for secure provider communication",
      "Transform paper records into interactive digital formats",
      "Adapt machine learning for personalized health insights"
    ],
    "Modify": [
      "Enhance data visualization with 3D body mapping",
      "Expand sharing capabilities with granular permission controls",
      "Magnify security with multi-factor authentication layers",
      "Scale down complex medical terms to layman's terms",
      "Increase accessibility with multi-language support"
    ],
    "Put to another use": [
      "Use health data for preventive care recommendations",
      "Repurpose fitness data for medical diagnosis assistance",
      "Use medical history for clinical trial matching",
      "Adapt health records for emergency response scenarios",
      "Repurpose data for research (with consent)"
    ],
    "Eliminate": [
      "Remove manual data entry requirements",
      "Eliminate redundant login processes",
      "Remove unnecessary medical jargon",
      "Eliminate paper-based record keeping",
      "Remove barriers between different health systems"
    ],
    "Reverse": [
      "Invert the traditional doctor-patient data flow",
      "Reverse the health tracking paradigm - predictive vs reactive",
      "Flip the script on medical record ownership",
      "Reverse the way health data is visualized",
      "Turn passive health monitoring into active health management"
    ]
  };

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">SCAMPER Technique Analysis</h2>
        <p className="text-gray-600 mb-8">
          SCAMPER is a creative thinking technique that helps generate new ideas by considering different aspects of modification and innovation.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scamperItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-blue-600">
                  {item.technique}
                </h3>
                <span className="text-gray-500">
                  {expandedIndex === index ? '−' : '+'}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{item.description}</p>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Example Questions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {item.examples.map((example: string, idx: number) => (
                    <li key={idx} className="text-gray-600">{example}</li>
                  ))}
                </ul>
              </div>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <h4 className="font-semibold text-green-600 mb-3">Brainstormed Ideas:</h4>
                    <div className="grid gap-2">
                      {brainstormedIdeas[item.technique].map((idea, ideaIdx) => (
                        <motion.div
                          key={ideaIdx}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: ideaIdx * 0.1 }}
                          className="bg-green-50 p-3 rounded-md text-gray-700"
                        >
                          {idea}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScamperSection; 