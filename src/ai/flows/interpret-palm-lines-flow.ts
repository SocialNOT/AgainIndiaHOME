'use server';
/**
 * @fileOverview An AI agent for interpreting palm lines from a photo.
 *
 * - interpretPalmLines - A function that handles the palm line interpretation process.
 * - InterpretPalmLinesInput - The input type for the interpretPalmLines function.
 * - InterpretPalmLinesOutput - The return type for the interpretPalmLines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretPalmLinesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type InterpretPalmLinesInput = z.infer<typeof InterpretPalmLinesInputSchema>;

const InterpretPalmLinesOutputSchema = z.object({
  interpretation: z
    .string()
    .describe("A detailed AI-generated interpretation of the major palm lines."),
});
export type InterpretPalmLinesOutput = z.infer<typeof InterpretPalmLinesOutputSchema>;

export async function interpretPalmLines(
  input: InterpretPalmLinesInput
): Promise<InterpretPalmLinesOutput> {
  return interpretPalmLinesFlow(input);
}

const interpretPalmLinesPrompt = ai.definePrompt({
  name: 'interpretPalmLinesPrompt',
  input: {schema: InterpretPalmLinesInputSchema},
  output: {schema: InterpretPalmLinesOutputSchema},
  model: 'googleai/gemini-2.5-flash-image', // Using a multi-modal model for image input
  prompt: `You are Sankhya, an expert in palmistry, numerology, and Vedic astrology. Your task is to analyze the major palm lines in the provided image and give a detailed interpretation of the individual's characteristics and potential life path based on traditional palmistry principles. Focus on the heart line, head line, and life line. Provide your interpretation in a clear, concise manner, suitable for the user.

Palm Photo: {{media url=photoDataUri}}`,
});

const interpretPalmLinesFlow = ai.defineFlow(
  {
    name: 'interpretPalmLinesFlow',
    inputSchema: InterpretPalmLinesInputSchema,
    outputSchema: InterpretPalmLinesOutputSchema,
  },
  async input => {
    const {output} = await interpretPalmLinesPrompt(input);
    return output!;
  }
);
