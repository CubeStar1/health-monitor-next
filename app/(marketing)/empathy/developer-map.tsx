'use client';

import React from 'react';

const DeveloperEmpathyMap = () => {
  const stickyNoteStyle = "rounded-lg p-3 shadow-md max-w-[400px] m-2";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Healthcare Systems Developer Empathy Map</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Says</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-amber-200`}>
              &quot;HIPAA and GDPR compliance are non-negotiable&quot;
            </div>
            <div className={`${stickyNoteStyle} bg-amber-100`}>
              &quot;We need end-to-end encryption for all health data&quot;
            </div>
            <div className={`${stickyNoteStyle} bg-amber-200`}>
              &quot;AI should support, not replace medical professionals&quot;
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Thinks</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-green-100`}>
              How to maintain privacy while enabling data sharing
            </div>
            <div className={`${stickyNoteStyle} bg-green-200`}>
              Integration with existing EHR systems is crucial
            </div>
            <div className={`${stickyNoteStyle} bg-green-100`}>
              Clear data usage policies must be established
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Does</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-rose-200`}>
              Implements strict access control systems
            </div>
            <div className={`${stickyNoteStyle} bg-rose-100`}>
              Designs comprehensive audit logging
            </div>
            <div className={`${stickyNoteStyle} bg-rose-200`}>
              Develops data anonymization protocols
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Feels</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-blue-100`}>
              Responsible for protecting sensitive health data
            </div>
            <div className={`${stickyNoteStyle} bg-blue-200`}>
              Challenged by complex integration requirements
            </div>
            <div className={`${stickyNoteStyle} bg-blue-100`}>
              Committed to maintaining medical data standards
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-4xl">👩‍💻</span>
        </div>
        <div className="text-center mt-2 bg-white px-2 py-1 rounded shadow">
          <span className="font-semibold">Saritha PV</span>
          <br />
          <span className="text-sm">Senior Staff Systems Designer</span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperEmpathyMap; 