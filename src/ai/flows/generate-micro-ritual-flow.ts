'use server';
/**
 * @fileOverview A Genkit flow that generates personalized 'Micro-Rituals' as remedies
 * based on an identified energetic imbalance or area for improvement, considering user profile
 * and real-time cosmic context.
 *
 * - generateMicroRitual - A function that handles the micro-ritual generation process.
 * - GenerateMicroRitualInput - The input type for the generateMicroRitual function.
 * - GenerateMicroRitualOutput - The return type for the generateMicroRitual function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMicroRitualInputSchema = z.object({
  imbalanceDescription: z
    .string()
    .describe(
      'A detailed description of the energetic imbalance or area for improvement identified by Sankhya.'
    ),
  userProfile: z.object({
    name: z.string().describe('The user\u0027s full name.'),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format')
      .describe('The user\u0027s birth date in YYYY-MM-DD format.'),
  }).describe('The user\u0027s personal profile information.'),
  currentLatLong: z
    .object({
      lat: z.number().describe('Current latitude.'),
      long: z.number().describe('Current longitude.'),
    })
    .describe('The user\u0027s current geographical coordinates.'),
  planetaryPositions: z
    .array(z.string())
    .describe('An array of strings, each describing a current planetary position or transit.'),
  currentTimestamp: z
    .string()
    .datetime()
    .describe('The current UTC timestamp in ISO 8601 format.'),
});
export type GenerateMicroRitualInput = z.infer<
  typeof GenerateMicroRitualInputSchema
>;

const GenerateMicroRitualOutputSchema = z.object({
  colorRecommendation: z
    .string()
    .describe('Specific color to wear, meditate on, or incorporate into daily life.'),
  musicRecommendation: z
    .string()
    .describe('Description of frequency music, genre, or specific sound to listen to.'),
  ritualActions: z
    .array(z.string())
    .describe('An array of other actionable micro-rituals or habits to perform.'),
  rationale: z
    .string()
    .describe(
      'A concise explanation of why these rituals are recommended, based on the provided data and Sankhya\u0027s expertise.'
    ),
});
export type GenerateMicroRitualOutput = z.infer<
  typeof GenerateMicroRitualOutputSchema
>;

export async function generateMicroRitual(
  input: GenerateMicroRitualInput
): Promise<GenerateMicroRitualOutput> {
  return generateMicroRitualFlow(input);
}

const generateMicroRitualPrompt = ai.definePrompt({
  name: 'generateMicroRitualPrompt',
  input: {schema: GenerateMicroRitualInputSchema},
  output: {schema: GenerateMicroRitualOutputSchema},
  prompt: `You are Sankhya, an AI expert in Pythagorean and Chaldean Numerology, Vedic Astrology (Jyotish), and Vastu Shastra principles. Your primary role is to act as a personalized guide, offering precise and actionable 'Micro-Rituals' to help the user address energetic imbalances and enhance their overall well-being.

When formulating recommendations, you must integrate information from the user's profile, their current geographical location, the prevailing planetary positions, and the specific energetic imbalance identified. Your generated rituals should be practical, easy to implement, and should directly correlate with the provided context.

User Profile:
- Name: {{{userProfile.name}}}
- Birth Date: {{{userProfile.birthDate}}}

Current Context:
- Location (Latitude, Longitude): {{{currentLatLong.lat}}}, {{{currentLatLong.long}}}
- Current Timestamp: {{{currentTimestamp}}}
- Planetary Positions:
{{#each planetaryPositions}}
  - {{{this}}}
{{/each}}

Identified Energetic Imbalance or Area for Improvement:
{{{imbalanceDescription}}}

Based on all the above information and your comprehensive understanding of numerology, astrology, and Vastu, generate specific, actionable 'Micro-Rituals'. These should include a precise color recommendation, a description of suitable frequency or type of music, and any other relevant small, daily ritualistic actions. Crucially, provide a concise rationale for each recommendation, explaining how it addresses the imbalance based on the input data and your fields of expertise.`,
});

const generateMicroRitualFlow = ai.defineFlow(
  {
    name: 'generateMicroRitualFlow',
    inputSchema: GenerateMicroRitualInputSchema,
    outputSchema: GenerateMicroRitualOutputSchema,
  },
  async (input) => {
    const {output} = await generateMicroRitualPrompt(input);
    if (!output) {
      throw new Error('Failed to generate micro-rituals.');
    }
    return output;
  }
);
