import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ScoredTweet } from './types.js';

const SCORE_SECTIONS: Array<{ score: 5 | 4 | 3; heading: string }> = [
  { score: 5, heading: 'Score 5 — Post immediately' },
  { score: 4, heading: 'Score 4 — Good engagement' },
  { score: 3, heading: 'Score 3 — Worth a comment' },
];

function engagementLabel(level: string): string {
  switch (level) {
    case 'additive':
      return 'additive';
    case 'forward':
      return 'forward';
    case 'direct':
      return 'direct';
    default:
      return level;
  }
}

function formatTweetSection(tweet: ScoredTweet, isDry: boolean): string {
  const lines: string[] = [];
  lines.push(`**@${tweet.username}** · [link](${tweet.url})`);
  lines.push(`> ${tweet.text.replace(/\n/g, '\n> ')}`);
  lines.push('');

  if (!isDry && tweet.draft) {
    lines.push(`**Suggested reply (${engagementLabel(tweet.engagementLevel)}):**`);
    lines.push(`> ${tweet.draft.replace(/\n/g, '\n> ')}`);
  } else if (isDry) {
    lines.push(`**Engagement level:** ${engagementLabel(tweet.engagementLevel)}`);
    lines.push(`**Reasoning:** ${tweet.reasoning}`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

interface DigestStats {
  queriesRun: number;
  postsFetched: number;
  postsScored: number;
  postsSkipped: number;
  isDry: boolean;
}

export function buildDigest(
  tweets: ScoredTweet[],
  date: string,
  stats: DigestStats
): string {
  const lines: string[] = [];

  lines.push(`# Lucent Engage — ${date}`);
  lines.push('');

  if (stats.isDry) {
    lines.push('> **Dry run** — scoring only, no drafts generated.');
    lines.push('');
  }

  // Scored sections (5, 4, 3)
  for (const { score, heading } of SCORE_SECTIONS) {
    const group = tweets.filter((t) => t.score === score);
    if (group.length === 0) continue;

    lines.push(`## ${heading}`);
    lines.push('');

    for (const tweet of group) {
      lines.push(formatTweetSection(tweet, stats.isDry));
    }
  }

  // Skipped section
  const skipped = tweets.filter((t) => t.score <= 2);
  if (skipped.length > 0) {
    lines.push('## Skipped (score 1–2)');
    lines.push('');
    for (const tweet of skipped) {
      lines.push(`- **@${tweet.username}**: ${tweet.reasoning}`);
    }
    lines.push('');
  }

  // Stats footer
  lines.push('---');
  lines.push('');
  lines.push('## Stats');
  lines.push('');
  lines.push(`- Queries run: ${stats.queriesRun}`);
  lines.push(`- Posts fetched: ${stats.postsFetched}`);
  lines.push(`- Posts scored: ${stats.postsScored}`);
  lines.push(`- Posts skipped: ${stats.postsSkipped}`);
  lines.push('');

  return lines.join('\n');
}

export interface DigestData {
  date: string;
  tweets: ScoredTweet[];
  stats: DigestStats;
}

export function saveDigest(
  content: string,
  data: DigestData,
  outputDir: string,
  date: string
): string {
  mkdirSync(outputDir, { recursive: true });
  const filePath = join(outputDir, `${date}.md`);
  writeFileSync(filePath, content, 'utf-8');
  writeFileSync(join(outputDir, `${date}.json`), JSON.stringify(data, null, 2), 'utf-8');
  return filePath;
}
