'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BrainstormSection = () => {
  const ideas = [
    // User Experience Ideas
    "Voice-activated medical history search",
    "Natural language querying of health records",
    "Automated document categorization",
    "Smart document summarization",
    "Multi-language support for records",
    "Visual timeline of medical history",
    "Customizable health dashboards",
    "One-click provider sharing",
    "Secure family access management",
    "Emergency information QR codes",
    
    // Data Processing Ideas
    "AI-powered symptom analysis",
    "Automated lab result interpretation",
    "Medical terminology simplification",
    "Cross-reference between documents",
    "Prescription interaction checker",
    "Treatment effectiveness tracking",
    "Appointment schedule optimization",
    "Real-time health metric monitoring",
    "Predictive health alerts",
    "Automated insurance claim filing",
    
    // Integration Ideas
    "Wearable device data sync",
    "EHR system integration",
    "Pharmacy record integration",
    "Lab result direct import",
    "Medical imaging viewer",
    "Secure provider messaging",
    "Insurance portal connection",
    "Telehealth platform integration",
    "Medical device data streaming",
    "Fitness app data integration",
    
    // Security & Compliance
    "Biometric access control",
    "End-to-end encryption",
    "Granular sharing permissions",
    "Audit trail visualization",
    "HIPAA compliance automation",
    "Data anonymization tools",
    "Secure backup system",
    "Access revocation management"
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Brainstorming Ideas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ideas.map((idea, index) => (
          <motion.div
            key={index}
            className="aspect-square relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Sticky note shadow effect */}
            <div className="absolute inset-0 bg-black opacity-10 translate-x-1 translate-y-1 rounded-lg"></div>
            
            {/* Main sticky note */}
            <motion.div
              className="h-full w-full p-4 rounded-lg flex items-center justify-center text-center"
              style={{
                backgroundColor: index % 2 === 0 ? '#fff7c9' : '#ffeb3b',
                transform: `rotate(${Math.random() * 4 - 2}deg)`,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                transition: { duration: 0.2 }
              }}
            >
              {/* Tape effect */}
              <div 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-gray-200 opacity-50 rounded"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 100%)'
                }}
              ></div>
              
              {/* Content */}
              <p 
                className="text-base md:text-lg font-normal text-gray-800 leading-tight"
                style={{
                  fontFamily: "'Kalam', cursive",
                  maxWidth: '90%',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}
              >
                {idea}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BrainstormSection; 