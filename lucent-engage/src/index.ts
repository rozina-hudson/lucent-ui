#!/usr/bin/env node
import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { Command } from 'commander';
import yaml from 'js-yaml';
import type { Config, SeenPosts } from './types.js';
import { fetchTweets } from './fetch.js';
import { scoreTweets } from './score.js';
import { draftReplies } from './draft.js';
import { buildDigest, saveDigest, type DigestData } from './digest.js';
import { startServer } from './server.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const CONFIG_PATH = join(ROOT_DIR, 'config.yml');
const SEEN_POSTS_PATH = join(ROOT_DIR, 'seen-posts.json');
const OUTPUT_DIR = join(ROOT_DIR, 'output');

function loadConfig(): Config {
  if (!existsSync(CONFIG_PATH)) {
    process.stderr.write(`Error: config.yml not found at ${CONFIG_PATH}\n`);
    process.exit(1);
  }
  const raw = readFileSync(CONFIG_PATH, 'utf-8');
  return yaml.load(raw) as Config;
}

function loadSeenPosts(): SeenPosts {
  if (!existsSync(SEEN_POSTS_PATH)) {
    return { ids: [] };
  }
  const raw = readFileSync(SEEN_POSTS_PATH, 'utf-8');
  return JSON.parse(raw) as SeenPosts;
}

function saveSeenPosts(seen: SeenPosts): void {
  writeFileSync(SEEN_POSTS_PATH, JSON.stringify(seen, null, 2), 'utf-8');
}

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    process.stderr.write(`Error: ${name} environment variable is not set.\n`);
    process.stderr.write(`Create a .env file based on .env.example\n`);
    process.exit(1);
  }
  return val;
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function log(msg: string): void {
  process.stderr.write(msg + '\n');
}

const program = new Command();

program
  .name('lucent-engage')
  .description('Daily X engagement CLI for Lucent UI')
  .version('0.1.0');

program
  .command('run')
  .description('Fetch posts, score them, draft replies, and save a digest')
  .option('--dry', 'Score only — skip drafting replies', false)
  .action(async (options: { dry: boolean }) => {
    const config = loadConfig();
    const bearerToken = requireEnv('X_BEARER_TOKEN');
    const anthropicKey = requireEnv('ANTHROPIC_API_KEY');
    const seen = loadSeenPosts();
    const seenSet = new Set(seen.ids);
    const date = todayDate();

    log(`\n🔍 Fetching posts for ${config.queries.length} queries…`);

    const tweets = await fetchTweets(
      config.queries,
      bearerToken,
      seenSet,
      (query, count) => {
        log(`  ✓ "${query}" → ${count} posts`);
      }
    );

    log(`\nFetched ${tweets.length} new posts (deduped, excluding seen).`);

    if (tweets.length === 0) {
      log('Nothing new to score. Exiting.');
      process.exit(0);
    }

    log(`\n📊 Scoring ${tweets.length} posts with Claude…`);

    const scored = await scoreTweets(tweets, config, anthropicKey, (i, total, score) => {
      log(`  [${i}/${total}] score ${score}`);
    });

    const actionable = scored.filter((t) => t.score >= 3);
    const skipped = scored.filter((t) => t.score <= 2);

    log(`\nScoring complete: ${actionable.length} actionable, ${skipped.length} skipped.`);

    let finalTweets = scored;

    if (!options.dry && actionable.length > 0) {
      log(`\n✍️  Drafting replies for ${actionable.length} posts…`);
      finalTweets = await draftReplies(scored, config, anthropicKey, (i, total) => {
        log(`  [${i}/${total}] drafted`);
      });
    }

    const digestStats = {
      queriesRun: config.queries.length,
      postsFetched: tweets.length,
      postsScored: actionable.length,
      postsSkipped: skipped.length,
      isDry: options.dry,
    };

    const digest = buildDigest(finalTweets, date, digestStats);
    const digestData: DigestData = { date, tweets: finalTweets, stats: digestStats };

    const filePath = saveDigest(digest, digestData, OUTPUT_DIR, date);
    log(`\n✅ Digest saved: ${filePath}`);

    // Update seen posts
    const newIds = tweets.map((t) => t.id);
    seen.ids = Array.from(new Set([...seen.ids, ...newIds]));
    saveSeenPosts(seen);
    log(`   Seen posts updated (${seen.ids.length} total).`);

    log('');
  });

program
  .command('show')
  .description("Print today's digest (or a specific date) to stdout")
  .option('--date <YYYY-MM-DD>', 'Date to show')
  .action((options: { date?: string }) => {
    const date = options.date ?? todayDate();
    const filePath = join(OUTPUT_DIR, `${date}.md`);

    if (!existsSync(filePath)) {
      process.stderr.write(`No digest found for ${date} at ${filePath}\n`);
      process.stderr.write(`Run: lucent-engage run\n`);
      process.exit(1);
    }

    const content = readFileSync(filePath, 'utf-8');
    process.stdout.write(content);
  });

program
  .command('serve')
  .description('Open the digest review UI in your browser')
  .action(() => {
    startServer(OUTPUT_DIR);
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  process.stderr.write(
    `Fatal: ${err instanceof Error ? err.message : String(err)}\n`
  );
  process.exit(1);
});
