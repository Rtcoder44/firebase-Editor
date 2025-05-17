// Use server directive.
'use server';

/**
 * @fileOverview AI flow to generate a page structure from a user prompt.
 *
 * - generatePage - A function that handles the page generation process.
 * - GeneratePageInput - The input type for the generatePage function.
 * - GeneratePageOutput - The return type for the generatePage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePageInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the desired page content and layout.'),
});
export type GeneratePageInput = z.infer<typeof GeneratePageInputSchema>;

const GeneratePageOutputSchema = z.object({
  pageStructure: z
    .string()
    .describe(
      'The generated page structure in a suitable format (e.g., JSON, HTML) that can be used by the visual editor.'
    ),
});
export type GeneratePageOutput = z.infer<typeof GeneratePageOutputSchema>;

export async function generatePage(input: GeneratePageInput): Promise<GeneratePageOutput> {
  return generatePageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePagePrompt',
  input: {schema: GeneratePageInputSchema},
  output: {schema: GeneratePageOutputSchema},
  prompt: `You are an AI assistant specialized in generating initial page structures based on user prompts.

  Based on the following prompt, generate an initial page structure that can be further customized in a visual editor. Provide the output in JSON format.

  Prompt: {{{prompt}}}`,
});

const generatePageFlow = ai.defineFlow(
  {
    name: 'generatePageFlow',
    inputSchema: GeneratePageInputSchema,
    outputSchema: GeneratePageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
