'use server';
/**
 * @fileOverview An AI agent for interpreting palm lines from a photo.
 * Includes a robust logic-driven fallback system.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getGenericPalmInterpretation } from '@/lib/palmistry-logic';

const InterpretPalmLinesInputSchema = z.object({
  photoDataUri: z.string(),
});
export type InterpretPalmLinesInput = z.infer<typeof InterpretPalmLinesInputSchema>;

const InterpretPalmLinesOutputSchema = z.object({
  interpretation: z.string(),
});
export type InterpretPalmLinesOutput = z.infer<typeof InterpretPalmLinesOutputSchema>;

const interpretPalmLinesPrompt = ai.definePrompt({
  name: 'interpretPalmLinesPrompt',
  input: {schema: InterpretPalmLinesInputSchema},
  output: {schema: InterpretPalmLinesOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `Analyze the provided palm image. Focus on Heart, Head, and Life lines. 
  Provide a detailed interpretation based on Samudrika Shastra.
  
  Photo: {{media url=photoDataUri}}`,
});

export async function interpretPalmLines(input: InterpretPalmLinesInput): Promise<InterpretPalmLinesOutput> {
  try {
    const {output} = await interpretPalmLinesPrompt(input);
    if (output) return output;
    throw new Error('AI interpretation failed');
  } catch (error) {
    console.warn("Palmistry AI Quota Exhausted. Using internal Samudrika logic.");
    return {
      interpretation: getGenericPalmInterpretation()
    };
  }
}
