'use client';

import React from 'react';

const PatientEmpathyMap = () => {
  const stickyNoteStyle = "rounded-lg p-3 shadow-md max-w-[400px] m-2";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Patient Empathy Map</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Says Quadrant */}
        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Says</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-amber-200`}>
              &quot;I need all my medical documents in one place&quot;
            </div>
            <div className={`${stickyNoteStyle} bg-amber-100`}>
              &quot;Which portal has my latest scan results?&quot;
            </div>
            <div className={`${stickyNoteStyle} bg-amber-200`}>
              &quot;I wish I could just search through all my reports at once&quot;
            </div>
          </div>
        </div>

        {/* Thinks Quadrant */}
        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Thinks</h2>
          <div className="flex flex-wrap w-full">
            <div className={`${stickyNoteStyle} bg-green-100`}>
              Managing all these documents is overwhelming
            </div>
            <div className={`${stickyNoteStyle} bg-green-200`}>
              What if I miss something important?
            </div>
            <div className={`${stickyNoteStyle} bg-green-100`}>
              There must be a better way to organize all this
            </div>
          </div>
        </div>

        {/* Does Quadrant */}
        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Does</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-rose-200`}>
              Takes photos of every medical document
            </div>
            <div className={`${stickyNoteStyle} bg-rose-100`}>
              Maintains multiple folders for different tests
            </div>
            <div className={`${stickyNoteStyle} bg-rose-200`}>
              Manually enters test results in spreadsheets
            </div>
          </div>
        </div>

        {/* Feels Quadrant */}
        <div className="border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Feels</h2>
          <div className="flex flex-wrap">
            <div className={`${stickyNoteStyle} bg-blue-100`}>
              Frustrated when can&apos;t find specific test results
            </div>
            <div className={`${stickyNoteStyle} bg-blue-200`}>
              Anxious about keeping track of everything
            </div>
            <div className={`${stickyNoteStyle} bg-blue-100`}>
              Overwhelmed by different portals and systems
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-4xl">👤</span>
        </div>
      </div>
    </div>
  );
};

export default PatientEmpathyMap;