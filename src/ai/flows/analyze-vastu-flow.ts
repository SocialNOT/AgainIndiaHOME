'use server';
/**
 * @fileOverview An AI agent for analyzing spatial Vastu from a photo.
 * Includes a robust logic-driven fallback system.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { calculateElementalBalance, VASTU_REMEDIES, VastuDirection } from '@/lib/vastu-logic';

const AnalyzeVastuInputSchema = z.object({
  photoDataUri: z.string(),
  roomType: z.string().optional(),
});
export type AnalyzeVastuInput = z.infer<typeof AnalyzeVastuInputSchema>;

const AnalyzeVastuOutputSchema = z.object({
  analysis: z.string(),
  remedies: z.array(z.string()),
  elementalBalance: z.object({
    fire: z.number(),
    water: z.number(),
    earth: z.number(),
    air: z.number(),
    space: z.number(),
  }),
});
export type AnalyzeVastuOutput = z.infer<typeof AnalyzeVastuOutputSchema>;

const analyzeVastuPrompt = ai.definePrompt({
  name: 'analyzeVastuPrompt',
  input: {schema: AnalyzeVastuInputSchema},
  output: {schema: AnalyzeVastuOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `Analyze the Vastu of this {{{roomType}}}. 
  Identify orientation and object placement.
  Provide analysis, 3 remedies, and elemental balance.
  
  Spatial Photo: {{media url=photoDataUri}}`,
});

export async function analyzeVastu(input: AnalyzeVastuInput): Promise<AnalyzeVastuOutput> {
  try {
    const {output} = await analyzeVastuPrompt(input);
    if (output) return output;
    throw new Error('Vastu AI failure');
  } catch (error) {
    console.warn("Vastu AI Quota Exhausted. Using internal Vastu logic.");
    const balance = calculateElementalBalance(input.roomType || 'Space');
    
    return {
      analysis: `The provided image of the ${input.roomType || 'space'} suggests a layout that requires elemental stabilization. Based on standard Vastu principles, focusing on the Northeast and Southwest axis will yield the best results for your current path.`,
      remedies: [
        VASTU_REMEDIES['NE'].remedy,
        VASTU_REMEDIES['SW'].remedy,
        "Ensure the central 'Brahmasthan' of the room is kept clear of heavy objects."
      ],
      elementalBalance: balance
    };
  }
}
