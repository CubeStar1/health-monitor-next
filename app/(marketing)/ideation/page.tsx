'use client';

import React, { useState } from 'react';
import BrainstormSection from './components/BrainstormSection';
import StoryboardSection from './components/StoryboardSection';
import JourneySection from './components/JourneySection';
import MindMapSection from './components/MindMapSection';
import ScamperSection from './components/ScamperSection';
import { techniques } from './data';

const IdeationMethodologies = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-3xl font-bold mb-6">Ideation Process Overview</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Brainstorming Session</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Individual ideation using sticky notes</li>
                <li>Team members generated ideas independently</li>
                <li>Selected and categorized best ideas</li>
                <li>Integrated complementary concepts</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Visualization Techniques</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Mind Mapping:</span> Explored connections between different aspects
                </li>
                <li>
                  <span className="font-medium">Storyboarding:</span> Visualized key user scenarios
                </li>
                <li>
                  <span className="font-medium">Customer Journey:</span> Mapped user experience flow
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4">Process & Results</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium">1. Individual Ideation</p>
                <p className="text-sm text-gray-600 pl-4">
                  Team members wrote ideas on sticky notes independently
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">2. Idea Selection</p>
                <p className="text-sm text-gray-600 pl-4">
                  Discussed and evaluated each idea as a group
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">3. Integration</p>
                <p className="text-sm text-gray-600 pl-4">
                  Combined and refined the most promising concepts
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-yellow-200">
                <p className="font-medium">✓ Generated 20+ Initial Ideas</p>
                <p className="font-medium">✓ Selected Top Concepts</p>
                <p className="font-medium">✓ Developed Key Features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IdeationPage = () => {
  const [activeTab, setActiveTab] = useState('brainstorm');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Ideation Workshop</h1>
      
      <IdeationMethodologies />
      
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        {Object.keys(techniques).map((technique) => (
          <button
            key={technique}
            className={`px-4 py-2 rounded-lg ${
              activeTab === technique
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab(technique)}
          >
            {techniques[technique].title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'brainstorm' && <BrainstormSection />}
        {activeTab === 'storyboard' && <StoryboardSection storyboards={techniques.storyboard?.storyboards || []} />}
        {activeTab === 'journey' && <JourneySection />}
        {activeTab === 'mindmap' && <MindMapSection branches={techniques.mindmap?.branches || []} />}
        {activeTab === 'scamper' && <ScamperSection scamperItems={techniques.scamper?.scamperItems || []} />}
      </div>
    </div>
  );
};

export default IdeationPage; 