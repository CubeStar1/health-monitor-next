'use client';

import React from 'react';

const ProviderEmpathyMap = () => {
  const stickyNoteStyle = "rounded-lg p-3 shadow-md max-w-[400px] m-2";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Healthcare Provider Empathy Map</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Says</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-amber-200`}>
              &quot;AI should support, not replace clinical judgment&quot;
            </div>
            <div className={`${stickyNoteStyle} bg-amber-100`}>
              &quot;We need seamless data sharing between providers&quot;
            </div>
            <div className={`${stickyNoteStyle} bg-amber-200`}>
              &quot;Documentation takes too much time away from patients&quot;
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Thinks</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-green-100`}>
              How to maintain patient privacy while sharing data
            </div>
            <div className={`${stickyNoteStyle} bg-green-200`}>
              Technology should enhance patient care, not complicate it
            </div>
            <div className={`${stickyNoteStyle} bg-green-100`}>
              Need better ways to track patient progress
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Does</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-rose-200`}>
              Reviews patient records across multiple systems
            </div>
            <div className={`${stickyNoteStyle} bg-rose-100`}>
              Coordinates care with other providers
            </div>
            <div className={`${stickyNoteStyle} bg-rose-200`}>
              Documents everything for compliance
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Feels</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-blue-100`}>
              Concerned about liability and compliance
            </div>
            <div className={`${stickyNoteStyle} bg-blue-200`}>
              Frustrated with fragmented systems
            </div>
            <div className={`${stickyNoteStyle} bg-blue-100`}>
              Optimistic about technology improving care
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-4xl">👨‍⚕️</span>
        </div>
      </div>
    </div>
  );
};

export default ProviderEmpathyMap; 