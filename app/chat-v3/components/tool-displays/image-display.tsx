'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageDisplayProps {
  imageUrl: string;
  prompt: string;
}

export function ImageDisplay({ imageUrl, prompt }: ImageDisplayProps) {
  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>Generated Image</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={imageUrl} alt={prompt} className="rounded-lg" />
        <p className="text-sm text-muted-foreground mt-2">{prompt}</p>
      </CardContent>
    </Card>
  );
}
