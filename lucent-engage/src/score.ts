import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import type { Tweet, ScoredTweet, Config, ScoreResult } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSystemPrompt(config: Config): string {
  const template = readFileSync(join(__dirname, '../src/prompts/score.txt'), 'utf-8');

  const competitorLines = config.competitors
    .map((c) => `- ${c.name}: ${c.note.trim()}`)
    .join('\n');

  const skipRuleLines = config.skip_rules.map((r) => `- ${r}`).join('\n');

  const voiceRuleLines = config.voice.rules.map((r) => `- ${r}`).join('\n');

  return template
    .replace('{{PRODUCT_NAME}}', config.product.name)
    .replace('{{PRODUCT_TAGLINE}}', config.product.tagline)
    .replace('{{KEY_CONCEPT}}', config.product.key_concept)
    .replace('{{PRODUCT_URL}}', config.product.url)
    .replace('{{PRODUCT_DIFFERENTIATOR}}', config.product.differentiator.trim())
    .replace('{{VOICE_TONE}}', config.voice.tone)
    .replace('{{VOICE_RULES}}', voiceRuleLines)
    .replace('{{ENGAGEMENT_ADDITIVE}}', config.engagement_levels.additive.trim())
    .replace('{{ENGAGEMENT_FORWARD}}', config.engagement_levels.forward.trim())
    .replace('{{ENGAGEMENT_DIRECT}}', config.engagement_levels.direct.trim())
    .replace('{{COMPETITORS}}', competitorLines)
    .replace('{{SKIP_RULES}}', skipRuleLines);
}

function parseScoreResult(text: string): ScoreResult {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim();

  const parsed = JSON.parse(cleaned) as unknown;

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('score' in parsed) ||
    !('reasoning' in parsed) ||
    !('engagementLevel' in parsed)
  ) {
    throw new Error('Invalid score response shape');
  }

  const score = Number((parsed as Record<string, unknown>)['score']);
  if (score < 1 || score > 5 || !Number.isInteger(score)) {
    throw new Error(`Invalid score value: ${score}`);
  }

  const engagementLevel = (parsed as Record<string, unknown>)['engagementLevel'];
  if (!['additive', 'forward', 'direct', 'skip'].includes(String(engagementLevel))) {
    throw new Error(`Invalid engagementLevel: ${engagementLevel}`);
  }

  return {
    score: score as 1 | 2 | 3 | 4 | 5,
    reasoning: String((parsed as Record<string, unknown>)['reasoning']),
    engagementLevel: engagementLevel as ScoreResult['engagementLevel'],
  };
}

export async function scoreTweets(
  tweets: Tweet[],
  config: Config,
  apiKey: string,
  onProgress?: (index: number, total: number, score: number) => void
): Promise<ScoredTweet[]> {
  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt(config);
  const results: ScoredTweet[] = [];

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    if (!tweet) continue;

    const userMessage = `@${tweet.username} (${tweet.name}):\n\n${tweet.text}`;

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textBlock = message.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text block in response');
      }

      const result = parseScoreResult(textBlock.text);
      results.push({ ...tweet, ...result });
      onProgress?.(i + 1, tweets.length, result.score);
    } catch (err) {
      process.stderr.write(
        `  Warning: scoring tweet ${tweet.id} failed — ${err instanceof Error ? err.message : String(err)}\n`
      );
      // Default to skip on error
      results.push({
        ...tweet,
        score: 1,
        reasoning: 'Scoring error — defaulting to skip.',
        engagementLevel: 'skip',
      });
    }

    if (i < tweets.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  return results;
}
