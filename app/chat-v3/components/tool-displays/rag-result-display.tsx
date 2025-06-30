"use client";

import React from 'react';

interface Chunk {
  text: string;
  documentName: string;
}

interface RagResultDisplayProps {
  chunks: Chunk[];
}

export const RagResultDisplay: React.FC<RagResultDisplayProps> = ({ chunks }) => {
  return (
    <div className="flex flex-col gap-4 my-2">
      <h3 className="text-lg font-semibold">Retrieved Information</h3>
      {chunks.map((chunk, index) => (
        <div key={index} className="p-4 border rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground mb-2">
            Source: <span className="font-medium text-primary">{chunk.documentName}</span>
          </p>
          <p className="text-sm">{chunk.text}</p>
        </div>
      ))}
    </div>
  );
};
