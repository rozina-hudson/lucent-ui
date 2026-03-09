import type { Tweet } from './types.js';

const BASE_URL = 'https://api.twitter.com/2/tweets/search/recent';
const DELAY_MS = 1500;

interface XApiTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    reply_count: number;
    retweet_count: number;
    impression_count: number;
  };
}

interface XApiUser {
  id: string;
  username: string;
  name: string;
}

interface XApiResponse {
  data?: XApiTweet[];
  includes?: {
    users?: XApiUser[];
  };
  meta?: {
    result_count: number;
    newest_id?: string;
    oldest_id?: string;
    next_token?: string;
  };
  errors?: Array<{ message: string; type: string }>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchQuery(
  query: string,
  bearerToken: string,
  maxResults = 20
): Promise<{ tweets: XApiTweet[]; users: Map<string, XApiUser> }> {
  const params = new URLSearchParams({
    query,
    max_results: String(maxResults),
    'tweet.fields': 'id,text,author_id,created_at,public_metrics',
    expansions: 'author_id',
    'user.fields': 'id,username,name',
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`X API error ${response.status}: ${body}`);
  }

  const json: XApiResponse = (await response.json()) as XApiResponse;

  if (json.errors && json.errors.length > 0) {
    throw new Error(`X API errors: ${json.errors.map((e) => e.message).join(', ')}`);
  }

  const tweets = json.data ?? [];
  const userMap = new Map<string, XApiUser>();
  for (const user of json.includes?.users ?? []) {
    userMap.set(user.id, user);
  }

  return { tweets, users: userMap };
}

export async function fetchTweets(
  queries: string[],
  bearerToken: string,
  seenIds: Set<string>,
  onProgress?: (query: string, count: number) => void
): Promise<Tweet[]> {
  const tweetMap = new Map<string, Tweet>();

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    if (!query) continue;

    try {
      const { tweets, users } = await searchQuery(query, bearerToken);

      for (const raw of tweets) {
        if (seenIds.has(raw.id)) continue;

        const user = users.get(raw.author_id);
        const username = user?.username ?? 'unknown';
        const name = user?.name ?? 'Unknown';

        if (tweetMap.has(raw.id)) {
          const existing = tweetMap.get(raw.id)!;
          existing.matchedQueries.push(query);
        } else {
          tweetMap.set(raw.id, {
            id: raw.id,
            text: raw.text,
            authorId: raw.author_id,
            username,
            name,
            url: `https://x.com/${username}/status/${raw.id}`,
            createdAt: raw.created_at,
            publicMetrics: {
              likeCount: raw.public_metrics.like_count,
              replyCount: raw.public_metrics.reply_count,
              retweetCount: raw.public_metrics.retweet_count,
            },
            matchedQueries: [query],
          });
        }
      }

      onProgress?.(query, tweets.length);
    } catch (err) {
      process.stderr.write(
        `  Warning: query "${query}" failed — ${err instanceof Error ? err.message : String(err)}\n`
      );
    }

    if (i < queries.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  return Array.from(tweetMap.values());
}
