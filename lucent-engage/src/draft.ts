import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import type { ScoredTweet, Config } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSystemPrompt(config: Config, engagementLevel: string): string {
  const template = readFileSync(join(__dirname, '../src/prompts/draft.txt'), 'utf-8');

  const voiceRuleLines = config.voice.rules.map((r) => `- ${r}`).join('\n');

  const engagementInstructions =
    engagementLevel === 'additive'
      ? config.engagement_levels.additive.trim()
      : engagementLevel === 'forward'
        ? config.engagement_levels.forward.trim()
        : config.engagement_levels.direct.trim();

  const featureLines = (config.product.features ?? []).map((f) => `- ${f.trim()}`).join('\n');

  return template
    .replace('{{VOICE_TONE}}', config.voice.tone)
    .replace('{{VOICE_RULES}}', voiceRuleLines)
    .replace('{{PRODUCT_NAME}}', config.product.name)
    .replace('{{KEY_CONCEPT}}', config.product.key_concept)
    .replace('{{PRODUCT_URL}}', config.product.url)
    .replace('{{PRODUCT_DIFFERENTIATOR}}', config.product.differentiator.trim())
    .replace('{{PRODUCT_VERSION}}', config.product.current_version ?? '')
    .replace('{{PRODUCT_FEATURES}}', featureLines)
    .replace('{{ENGAGEMENT_LEVEL}}', engagementLevel)
    .replace('{{ENGAGEMENT_INSTRUCTIONS}}', engagementInstructions)
    .replace(/\{\{KEY_CONCEPT\}\}/g, config.product.key_concept)
    .replace(/\{\{PRODUCT_URL\}\}/g, config.product.url);
}

export async function draftReplies(
  tweets: ScoredTweet[],
  config: Config,
  apiKey: string,
  onProgress?: (index: number, total: number) => void
): Promise<ScoredTweet[]> {
  const client = new Anthropic({ apiKey });
  const eligible = tweets.filter((t) => t.score >= 3 && t.engagementLevel !== 'skip');
  const results = [...tweets];

  let draftIndex = 0;
  for (const tweet of eligible) {
    const systemPrompt = buildSystemPrompt(config, tweet.engagementLevel);
    const userMessage = `@${tweet.username} (${tweet.name}):\n\n${tweet.text}`;

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textBlock = message.content.find((b) => b.type === 'text');
      if (textBlock && textBlock.type === 'text') {
        const idx = results.findIndex((t) => t.id === tweet.id);
        if (idx !== -1) {
          results[idx] = { ...results[idx]!, draft: textBlock.text.trim() };
        }
      }
    } catch (err) {
      process.stderr.write(
        `  Warning: drafting for tweet ${tweet.id} failed — ${err instanceof Error ? err.message : String(err)}\n`
      );
    }

    draftIndex++;
    onProgress?.(draftIndex, eligible.length);

    if (draftIndex < eligible.length) {
      await sleep(DELAY_MS);
    }
  }

  return results;
}
