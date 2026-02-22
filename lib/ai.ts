import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { z } from 'zod';

import { supabase } from '@/lib/supabase';

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? '';
const AI_MODEL =
  process.env.EXPO_PUBLIC_AI_MODEL ?? 'google/gemini-2.0-flash-001';

const openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY });

const RecommendationSchema = z.object({
  type: z.enum(['Duplicate', 'Inactive', 'Trial']),
  title: z.string(),
  description: z.string(),
  savings: z.number(),
  confidence: z.number(),
});

const RecommendationsArraySchema = z.object({
  recommendations: z.array(RecommendationSchema),
});

function buildPrompt(
  subscriptions: {
    name: string;
    price: number;
    billing_cycle: string;
    status: string;
    start_date: string;
  }[]
): string {
  const list = subscriptions
    .map(
      (s) =>
        `- ${s.name}: $${s.price}/${s.billing_cycle}, status=${s.status}, started=${s.start_date}`
    )
    .join('\n');

  return `You are a financial advisor AI that analyzes subscription spending.

Given these active subscriptions:
${list}

Analyze the subscriptions and provide up to 5 actionable recommendations. Each recommendation must be one of these types:
- "Duplicate": subscriptions that overlap in functionality
- "Inactive": subscriptions that appear unused or rarely used based on their age and category
- "Trial": subscriptions that may still be in a trial period or were recently started

For each recommendation, provide:
- type: one of "Duplicate", "Inactive", or "Trial"
- title: a short actionable title (e.g. "Cancel duplicate streaming service")
- description: a 1-2 sentence explanation of why this is recommended
- savings: estimated monthly savings in dollars (number)
- confidence: how confident you are in this recommendation from 1 to 100 (number)

Return ONLY valid JSON in this exact format:
{"recommendations": [{"type": "...", "title": "...", "description": "...", "savings": 0, "confidence": 0}]}

If there are no recommendations, return: {"recommendations": []}`;
}

export async function generateRecommendations(userId: string): Promise<
  {
    type: 'Duplicate' | 'Inactive' | 'Trial';
    title: string;
    description: string;
    savings: number;
    confidence: number;
  }[]
> {
  console.log('LOG: Generating AI recommendations for user', userId);

  const { data: subscriptions, error: subError } = await supabase
    .from('subscriptions')
    .select('name, price, billing_cycle, status, start_date')
    .eq('user_id', userId);

  if (subError) {
    console.log(
      'ERROR: Failed to fetch subscriptions for AI:',
      subError.message
    );
    throw subError;
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log('LOG: No subscriptions found, skipping AI generation');
    return [];
  }

  const prompt = buildPrompt(subscriptions);

  try {
    const { text } = await generateText({
      model: openrouter(AI_MODEL),
      prompt,
      temperature: 0.3,
      maxOutputTokens: 1024,
    });

    console.log('LOG: AI response received, parsing recommendations');

    const parsed = JSON.parse(text);
    const validated = RecommendationsArraySchema.parse(parsed);
    console.log(
      'LOG: Parsed',
      validated.recommendations.length,
      'recommendations'
    );
    return validated.recommendations;
  } catch (error) {
    console.log('ERROR: AI recommendation generation failed:', error);
    throw error;
  }
}

export async function generateAndSaveRecommendations(userId: string) {
  console.log('LOG: Starting full AI recommendation pipeline');

  const recommendations = await generateRecommendations(userId);

  if (recommendations.length === 0) {
    console.log('LOG: No recommendations generated');
    return [];
  }

  const { error: deleteError } = await supabase
    .from('recommendations')
    .delete()
    .eq('user_id', userId)
    .eq('is_dismissed', false);

  if (deleteError) {
    console.log(
      'ERROR: Failed to clear old recommendations:',
      deleteError.message
    );
  }

  const rows = recommendations.map((rec) => ({
    user_id: userId,
    type: rec.type,
    title: rec.title,
    description: rec.description,
    savings: rec.savings,
    confidence: rec.confidence,
  }));

  const { data, error } = await supabase
    .from('recommendations')
    .insert(rows)
    .select();

  if (error) {
    console.log('ERROR: Failed to save recommendations:', error.message);
    throw error;
  }

  console.log('LOG: Saved', data.length, 'AI recommendations to database');
  return data;
}
