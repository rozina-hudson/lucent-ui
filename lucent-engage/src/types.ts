export interface Tweet {
  id: string;
  text: string;
  authorId: string;
  username: string;
  name: string;
  url: string;
  createdAt: string;
  publicMetrics: {
    likeCount: number;
    replyCount: number;
    retweetCount: number;
  };
  matchedQueries: string[];
}

export interface ScoredTweet extends Tweet {
  score: 1 | 2 | 3 | 4 | 5;
  reasoning: string;
  engagementLevel: 'additive' | 'forward' | 'direct' | 'skip';
  draft?: string;
}

export interface Config {
  queries: string[];
  product: {
    name: string;
    tagline: string;
    differentiator: string;
    url: string;
    key_concept: string;
    current_version?: string;
    features?: string[];
  };
  voice: {
    tone: string;
    rules: string[];
  };
  engagement_levels: {
    additive: string;
    forward: string;
    direct: string;
  };
  competitors: Array<{ name: string; note: string }>;
  skip_rules: string[];
}

export interface SeenPosts {
  ids: string[];
}

export interface ScoreResult {
  score: 1 | 2 | 3 | 4 | 5;
  reasoning: string;
  engagementLevel: 'additive' | 'forward' | 'direct' | 'skip';
}
