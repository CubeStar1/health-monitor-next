'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MindMapProps, MindMapBranch } from '../types';

const MindMapSection = ({ branches }: MindMapProps) => {
  return (
    <div className="relative p-4 min-h-[400px]">
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-100 p-4 rounded-full shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <span className="font-bold">Health Data Platform</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-8 p-20">
        {branches?.map((branch: MindMapBranch, index: number) => (
          <motion.div
            key={index}
            className="bg-purple-50 p-4 rounded-lg shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <h3 className="font-bold text-lg mb-2">{branch.title}</h3>
            <ul className="space-y-2">
              {branch.items.map((item: string, i: number) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MindMapSection; 