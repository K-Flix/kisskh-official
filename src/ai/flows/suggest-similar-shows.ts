'use server';

/**
 * @fileOverview A flow for suggesting similar shows based on a given title.
 *
 * - suggestSimilarShows - A function that suggests similar shows.
 * - SuggestSimilarShowsInput - The input type for the suggestSimilarShows function.
 * - SuggestSimilarShowsOutput - The return type for the suggestSimilarShows function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarShowsInputSchema = z.object({
  title: z.string().describe('The title of the movie or TV show.'),
  genre: z.string().describe('The genre of the movie or TV show.'),
  description: z.string().describe('The description of the movie or TV show.'),
});
export type SuggestSimilarShowsInput = z.infer<typeof SuggestSimilarShowsInputSchema>;

const SuggestSimilarShowsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of similar movie or TV show titles.'),
});
export type SuggestSimilarShowsOutput = z.infer<typeof SuggestSimilarShowsOutputSchema>;

export async function suggestSimilarShows(input: SuggestSimilarShowsInput): Promise<SuggestSimilarShowsOutput> {
  return suggestSimilarShowsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSimilarShowsPrompt',
  input: {schema: SuggestSimilarShowsInputSchema},
  output: {schema: SuggestSimilarShowsOutputSchema},
  prompt: `You are a movie and TV show expert. Given the following movie or TV show title, genre, and description, suggest other similar movies or TV shows. Return only the names of the shows.

Title: {{{title}}}
Genre: {{{genre}}}
Description: {{{description}}}

Similar Shows:`,
});

const suggestSimilarShowsFlow = ai.defineFlow(
  {
    name: 'suggestSimilarShowsFlow',
    inputSchema: SuggestSimilarShowsInputSchema,
    outputSchema: SuggestSimilarShowsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
