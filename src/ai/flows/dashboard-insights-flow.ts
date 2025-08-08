/**
 * @fileOverview A dashboard insight AI agent.
 *
 * This file defines a Genkit flow that can be used to generate insights
 * about dashboard charts.
 *
 * - getDashboardInsight - A function that handles the dashboard insight process.
 * - DashboardInsightInput - The input type for the getDashboardInsight function.
 * - DashboardInsightOutput - The return type for the getDashboardInsight function.
 */
'use server';
import { z } from 'zod';
import { ai } from '../genkit';

const DashboardInsightInputSchema = z.object({
  title: z.string().describe('The title of the chart.'),
  data: z.string().describe('The data of the chart in stringified JSON format.'),
});
export type DashboardInsightInput = z.infer<typeof DashboardInsightInputSchema>;

const DashboardInsightOutputSchema = z.object({
  insight: z
    .string()
    .describe('The insight generated from the chart data.'),
});
export type DashboardInsightOutput = z.infer<typeof DashboardInsightOutputSchema>;


export async function getDashboardInsight(input: DashboardInsightInput): Promise<DashboardInsightOutput> {
  return getDashboardInsightFlow(input);
}


const prompt = ai.definePrompt({
  name: 'dashboardInsightPrompt',
  input: { schema: DashboardInsightInputSchema },
  output: { schema: DashboardInsightOutputSchema },
  prompt: `You are an expert clinical trial data analyst. 
  
You are tasked with providing a clear, concise, and easy-to-understand insight based on the provided chart data.
Analyze the data and explain what it means in simple terms that a non-expert can understand.

The chart data is provided in JSON format.

Chart Title: {{{title}}}
Chart Data:
\`\`\`json
{{{data}}}
\`\`\`
  
Focus on the key takeaways from the data. What is the most important story this data is telling?
Keep your explanation to 2-3 sentences.
  `,
});

const getDashboardInsightFlow = ai.defineFlow(
  {
    name: 'getDashboardInsightFlow',
    inputSchema: DashboardInsightInputSchema,
    outputSchema: DashboardInsightOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
