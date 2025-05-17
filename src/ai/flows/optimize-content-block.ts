// The optimizeContentBlock flow analyzes content blocks and suggests improvements to layout, fonts, and color combinations.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeContentBlockInputSchema = z.object({
  contentBlock: z
    .string()
    .describe('The content block to be optimized, in HTML format.'),
});
export type OptimizeContentBlockInput = z.infer<typeof OptimizeContentBlockInputSchema>;

const OptimizeContentBlockOutputSchema = z.object({
  suggestedLayout: z
    .string()
    .describe('Suggested alternative layout for the content block, in HTML format.'),
  suggestedFont: z
    .string()
    .describe('Suggested font for the content block, as a CSS font-family value.'),
  suggestedColorCombination: z
    .string()
    .describe('Suggested color combination for the content block, as CSS color and background-color values.'),
  explanation: z.string().describe('Explanation of why the suggestions were made.'),
});
export type OptimizeContentBlockOutput = z.infer<typeof OptimizeContentBlockOutputSchema>;

export async function optimizeContentBlock(input: OptimizeContentBlockInput): Promise<OptimizeContentBlockOutput> {
  return optimizeContentBlockFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeContentBlockPrompt',
  input: {schema: OptimizeContentBlockInputSchema},
  output: {schema: OptimizeContentBlockOutputSchema},
  prompt: `You are an AI assistant that helps users optimize their content blocks for visual appeal and readability.

  You will receive a content block in HTML format and suggest alternative layouts, fonts, and color combinations.
  You will also explain why you made the suggestions.

  Content Block:
  {{contentBlock}}

  Please provide your suggestions in the following format:
  {
    "suggestedLayout": "<suggested HTML layout>",
    "suggestedFont": "<suggested CSS font-family value>",
    "suggestedColorCombination": "<suggested CSS color and background-color values>",
    "explanation": "<explanation of why the suggestions were made>"
  }`,
});

const optimizeContentBlockFlow = ai.defineFlow(
  {
    name: 'optimizeContentBlockFlow',
    inputSchema: OptimizeContentBlockInputSchema,
    outputSchema: OptimizeContentBlockOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
