'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StoryboardProps, Storyboard } from '../types';

const StoryboardSection = ({ storyboards }: StoryboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {storyboards?.map((story: Storyboard, index: number) => (
        <motion.div
          key={index}
          className="bg-green-50 p-6 rounded-lg shadow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <h3 className="font-bold text-xl mb-2 text-green-800">{story.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{story.description}</p>
          <p className="text-gray-700">{story.scenario}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StoryboardSection; 