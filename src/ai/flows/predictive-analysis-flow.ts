
/**
 * @fileOverview A predictive analysis AI agent for clinical trials.
 *
 * This file defines a Genkit flow that can be used to generate predictions
 * about various aspects of a clinical trial, such as site enrollment timelines.
 *
 * - getPrediction - A function that handles the prediction generation process.
 * - PredictionInput - The input type for the getPrediction function.
 * - PredictionOutput - The return type for the getPrediction function.
 */
'use server';
import { z } from 'zod';
import { ai } from '../genkit';

const PredictionInputSchema = z.object({
  type: z.string().describe('The type of prediction to generate (e.g., "site-enrollment").'),
  parameters: z.string().describe('A JSON string of parameters for the prediction model.'),
});
export type PredictionInput = z.infer<typeof PredictionInputSchema>;

const PredictionOutputSchema = z.object({
  prediction: z
    .string()
    .describe('The generated prediction based on the input parameters.'),
});
export type PredictionOutput = z.infer<typeof PredictionOutputSchema>;


export async function getPrediction(input: PredictionInput): Promise<PredictionOutput> {
  return predictiveAnalysisFlow(input);
}


const prompt = ai.definePrompt({
  name: 'predictiveAnalysisPrompt',
  input: { schema: PredictionInputSchema },
  output: { schema: PredictionOutputSchema },
  prompt: `You are an expert data scientist specializing in clinical trial predictive analytics.
  
You are tasked with generating a prediction based on a given model type and a set of parameters.
You also have access to historical data for context.

**Historical Context Data:**

*   **Average Enrollment Time:** 120 days for a site to become fully enrolled.
*   **Site Performance (Subjects Enrolled):** Site A (86), Site B (120), Site C (75), Site D (92), Site E (110).
*   **Common Adverse Events:** Headache (18 events), Nausea (25 events), Fatigue (12 events).
*   **Factors Affecting Enrollment:**
    *   **Country:** Sites in the USA and Germany enroll 15% faster. Sites in India and China enroll 10% slower.
    *   **Investigator Experience:** High experience leads to 20% faster enrollment. Low experience leads to 30% slower enrollment.
    *   **Patient Population Density:** Urban areas enroll 25% faster than rural areas.

---

**Prediction Request:**

*   **Prediction Model Type:** {{{type}}}
*   **Input Parameters:**
    \`\`\`json
    {{{parameters}}}
    \`\`\`

---

**Your Task:**

Based on the historical context and the input parameters, generate a concise, data-driven prediction.
Provide a clear conclusion and a short explanation for your reasoning.

**Example for Site Enrollment Prediction:**
"Prediction: The new site is predicted to take approximately **108 days** to reach full enrollment.
Reasoning: The site is in the USA (+15% speed), has high investigator experience (+20% speed), and is in an urban area (+25% speed). These positive factors significantly reduce the average enrollment time of 120 days."

Generate the prediction now.
  `,
});

const predictiveAnalysisFlow = ai.defineFlow(
  {
    name: 'predictiveAnalysisFlow',
    inputSchema: PredictionInputSchema,
    outputSchema: PredictionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
