import { z } from 'zod';
import { tool, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import createAdmin from '@/lib/supabase/admin';

export const generateImage = tool({
  description: 'Generate an image based on a textual prompt.',
  parameters: z.object({
    prompt: z.string().describe('The prompt for the image generation.'),
  }),
  execute: async ({ prompt }) => {
    try {
      const result = await generateText({
        model: google('gemini-2.0-flash-preview-image-generation'),
        providerOptions: {
          google: { responseModalities: ['TEXT', 'IMAGE'] },
        },
        prompt: `Generate an image of ${prompt}`,
      });

      const imagePart = result.files.find(file => file.mimeType?.startsWith('image/'));

      if (!imagePart) {
        throw new Error('Image generation failed or no image was returned.');
      }

      const supabase = await createAdmin();
      const buffer = Buffer.from((imagePart as any).base64, 'base64');
      const filePath = `public/${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(filePath, buffer, {
          contentType: imagePart.mimeType!,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Failed to upload image to storage.');
      }

      const { data: publicUrlData } = supabase.storage
        .from('generated-images')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for the image.');
      }

      return {
        imageUrl: publicUrlData.publicUrl,
        prompt: prompt,
      };
    } catch (error) {
      console.error('Error generating image:', error);
      // Return a structured error that the client can display
      return { error: 'Sorry, I was unable to generate the image.' };
    }
  },
});
