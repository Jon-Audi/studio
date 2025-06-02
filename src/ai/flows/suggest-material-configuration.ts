
/**
 * @fileOverview An AI agent for suggesting optimal material configurations based on project size and selected materials.
 *
 * - suggestMaterialConfiguration - A function that handles the material configuration suggestion process.
 * - SuggestMaterialConfigurationInput - The input type for the suggestMaterialConfiguration function.
 * - SuggestMaterialConfigurationOutput - The return type for the suggestMaterialConfiguration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMaterialConfigurationInputSchema = z.object({
  projectSize: z
    .string()
    .describe('The size of the project (e.g., small, medium, large).'),
  selectedMaterials: z
    .string()
    .describe('The materials selected for the project (e.g., chain-link, vinyl, wood).'),
});
export type SuggestMaterialConfigurationInput = z.infer<
  typeof SuggestMaterialConfigurationInputSchema
>;

const SuggestMaterialConfigurationOutputSchema = z.object({
  materialSuggestions: z
    .string()
    .describe(
      'AI-powered suggestions for optimal material configurations based on project size and selected materials.'
    ),
});
export type SuggestMaterialConfigurationOutput = z.infer<
  typeof SuggestMaterialConfigurationOutputSchema
>;

export async function suggestMaterialConfiguration(
  input: SuggestMaterialConfigurationInput
): Promise<SuggestMaterialConfigurationOutput> {
  // This flow will likely not work correctly when called directly from the client
  // after removing 'use server'. It's designed for server-side execution.
  return suggestMaterialConfigurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMaterialConfigurationPrompt',
  input: {schema: SuggestMaterialConfigurationInputSchema},
  output: {schema: SuggestMaterialConfigurationOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting optimal material configurations for construction projects.

  Based on the project size and selected materials provided, you will generate suggestions for the most efficient and cost-effective material configurations.

  Project Size: {{{projectSize}}}
  Selected Materials: {{{selectedMaterials}}}

  Provide detailed and actionable suggestions for material configurations.
  `,
});

const suggestMaterialConfigurationFlow = ai.defineFlow(
  {
    name: 'suggestMaterialConfigurationFlow',
    inputSchema: SuggestMaterialConfigurationInputSchema,
    outputSchema: SuggestMaterialConfigurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
