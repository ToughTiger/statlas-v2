/**
 * @fileOverview Genkit configuration
 *
 * This file configures the AI provider and any plugins.
 */
import 'server-only';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set. Please get a key from Google AI Studio and add it to your .env file.");
}

/**
 * The ai() function is a factory that creates an AI provider.
 * The provider is configured with the Google AI plugin.
 *
 * It is memoized, so it will only be created once.
 *
 * To use a different provider, such as Vertex AI, you would specify
 * that here.
 *
 * @see https://genkit.dev/docs/providers/googleai
 * @see https://genkit.dev/docs/providers/vertexai
 */
export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
});