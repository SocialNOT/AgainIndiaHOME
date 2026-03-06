'use server';
/**
 * @fileOverview An AI agent for analyzing spatial Vastu from a photo.
 *
 * - analyzeVastu - A function that handles the spatial Vastu analysis process.
 * - AnalyzeVastuInput - The input type for the analyzeVastu function.
 * - AnalyzeVastuOutput - The return type for the analyzeVastu function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVastuInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room or floor plan, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  roomType: z.string().optional().describe('The type of room being analyzed (e.g., Bedroom, Kitchen, Office).'),
});
export type AnalyzeVastuInput = z.infer<typeof AnalyzeVastuInputSchema>;

const AnalyzeVastuOutputSchema = z.object({
  analysis: z
    .string()
    .describe("A detailed AI-generated Vastu analysis of the space shown in the image."),
  remedies: z.array(z.string()).describe('Specific actionable Vastu remedies for the identified space.'),
  elementalBalance: z.object({
    fire: z.number().min(0).max(100),
    water: z.number().min(0).max(100),
    earth: z.number().min(0).max(100),
    air: z.number().min(0).max(100),
    space: z.number().min(0).max(100),
  }).describe('The calculated percentage of each element present or needed in the space.'),
});
export type AnalyzeVastuOutput = z.infer<typeof AnalyzeVastuOutputSchema>;

export async function analyzeVastu(
  input: AnalyzeVastuInput
): Promise<AnalyzeVastuOutput> {
  return analyzeVastuFlow(input);
}

const analyzeVastuPrompt = ai.definePrompt({
  name: 'analyzeVastuPrompt',
  input: {schema: AnalyzeVastuInputSchema},
  output: {schema: AnalyzeVastuOutputSchema},
  model: 'googleai/gemini-2.5-flash-image',
  prompt: `You are Sankhya, an expert in Vastu Shastra, architecture, and spatial energy flow. 
Analyze the provided photo of a {{{roomType}}}. 
Identify the likely orientation, placement of objects (furniture, windows, doors), and the overall energetic quality of the space according to traditional Vastu principles. 

Provide:
1. A clear analysis of the strengths and weaknesses of the current layout.
2. 3-4 specific, actionable remedies or adjustments (e.g., color changes, moving furniture, adding elemental symbols).
3. An estimate of the elemental balance (Fire, Water, Earth, Air, Space) based on the visual evidence.

Spatial Photo: {{media url=photoDataUri}}`,
});

const analyzeVastuFlow = ai.defineFlow(
  {
    name: 'analyzeVastuFlow',
    inputSchema: AnalyzeVastuInputSchema,
    outputSchema: AnalyzeVastuOutputSchema,
  },
  async input => {
    const {output} = await analyzeVastuPrompt(input);
    return output!;
  }
);
