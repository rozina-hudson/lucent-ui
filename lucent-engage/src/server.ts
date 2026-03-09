import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { DigestData } from './digest.js';

const PORT = 4242;

type PostStatus = Record<string, 'done' | 'skipped'>;

function loadStatus(outputDir: string, date: string): PostStatus {
  const p = join(outputDir, `${date}-status.json`);
  if (!existsSync(p)) return {};
  return JSON.parse(readFileSync(p, 'utf-8')) as PostStatus;
}

function saveStatus(outputDir: string, date: string, status: PostStatus): void {
  writeFileSync(join(outputDir, `${date}-status.json`), JSON.stringify(status, null, 2));
}

function listDates(outputDir: string): string[] {
  if (!existsSync(outputDir)) return [];
  return readdirSync(outputDir)
    .filter((f) => f.endsWith('.json') && !f.endsWith('-status.json'))
    .map((f) => f.replace('.json', ''))
    .sort()
    .reverse();
}

function loadDigest(outputDir: string, date: string): DigestData | null {
  const p = join(outputDir, `${date}.json`);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf-8')) as DigestData;
}

function sendJson(res: ServerResponse, data: unknown, status = 200): void {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(body);
}

function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lucent Engage</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f1117;
    --surface: #1a1d27;
    --surface2: #222636;
    --border: #2a2d3e;
    --text: #e2e8f0;
    --text2: #94a3b8;
    --text3: #64748b;
    --accent: #6366f1;
    --accent-dim: #4f46e5;
    --green: #22c55e;
    --yellow: #eab308;
    --orange: #f97316;
    --red: #ef4444;
    --radius: 10px;
  }
  body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.6; min-height: 100vh; }
  header { position: sticky; top: 0; z-index: 10; background: rgba(15,17,23,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); padding: 12px 24px; display: flex; align-items: center; gap: 16px; }
  header h1 { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
  header .tag { font-size: 11px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; color: var(--text2); }
  select { background: var(--surface); border: 1px solid var(--border); border-radius: 7px; color: var(--text); font-size: 13px; padding: 5px 10px; outline: none; cursor: pointer; }
  select:focus { border-color: var(--accent); }
  .stats { margin-left: auto; display: flex; gap: 16px; }
  .stat { font-size: 12px; color: var(--text2); }
  .stat strong { color: var(--text); }
  main { max-width: 760px; margin: 0 auto; padding: 32px 24px 80px; }
  .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); margin: 32px 0 12px; display: flex; align-items: center; gap: 8px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .score-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; margin-bottom: 12px; transition: opacity 0.2s; }
  .card.done { opacity: 0.4; }
  .card.skipped { opacity: 0.25; }
  .card-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
  .author { font-weight: 600; font-size: 13px; }
  .author a { color: var(--text); text-decoration: none; }
  .author a:hover { color: var(--accent); }
  .badge { font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 4px; padding: 2px 7px; border: 1px solid; flex-shrink: 0; margin-top: 2px; }
  .badge.additive { color: #67e8f9; border-color: #0e7490; background: #0c4a6e22; }
  .badge.forward { color: #fbbf24; border-color: #92400e; background: #451a0322; }
  .badge.direct { color: #a78bfa; border-color: #4c1d95; background: #2e1065aa; }
  .badge.skip { color: var(--text3); border-color: var(--border); }
  .tweet-text { font-size: 13px; color: var(--text2); line-height: 1.65; white-space: pre-wrap; word-break: break-word; margin-bottom: 14px; }
  .draft-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text3); margin-bottom: 6px; }
  .draft-box { background: var(--surface2); border: 1px solid var(--border); border-radius: 7px; padding: 12px; font-size: 13px; line-height: 1.65; color: var(--text); white-space: pre-wrap; word-break: break-word; }
  .reasoning { font-size: 12px; color: var(--text3); font-style: italic; margin-top: 8px; }
  .card-actions { display: flex; gap: 8px; margin-top: 14px; align-items: center; }
  button { cursor: pointer; border: none; border-radius: 7px; font-size: 12px; font-weight: 500; padding: 6px 12px; transition: all 0.15s; }
  .btn-copy { background: var(--accent); color: #fff; }
  .btn-copy:hover { background: var(--accent-dim); }
  .btn-copy.copied { background: var(--green); }
  .btn-open { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
  .btn-open:hover { color: var(--text); border-color: var(--text3); }
  .btn-done { background: var(--surface2); color: var(--green); border: 1px solid #166534; }
  .btn-done:hover { background: #14532d33; }
  .btn-done.active { background: #14532d; }
  .btn-skip { background: var(--surface2); color: var(--text3); border: 1px solid var(--border); }
  .btn-skip:hover { color: var(--text2); }
  .btn-skip.active { background: var(--surface2); color: var(--text3); opacity: 0.6; }
  .char-count { margin-left: auto; font-size: 11px; color: var(--text3); }
  .char-count.over { color: var(--red); }
  .empty { text-align: center; color: var(--text3); padding: 60px 0; }
  .empty strong { display: block; font-size: 16px; color: var(--text2); margin-bottom: 8px; }
  .progress { display: flex; align-items: center; gap: 8px; color: var(--text3); font-size: 12px; margin-left: auto; }
</style>
</head>
<body>
<header>
  <h1>Lucent Engage</h1>
  <span class="tag" id="dry-tag" style="display:none">dry run</span>
  <select id="date-select" onchange="loadDate(this.value)"></select>
  <div class="stats" id="stats"></div>
  <div class="progress" id="progress"></div>
</header>
<main id="main">
  <div class="empty"><strong>Loading…</strong></div>
</main>
<script>
const SCORE_CONFIG = {
  5: { label: 'Score 5 — Post immediately', color: '#22c55e' },
  4: { label: 'Score 4 — Good engagement', color: '#eab308' },
  3: { label: 'Score 3 — Worth a comment', color: '#f97316' },
};

let currentDate = '';
let allTweets = [];
let statuses = {};

async function init() {
  const res = await fetch('/api/dates');
  const dates = await res.json();
  const sel = document.getElementById('date-select');
  dates.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d; opt.textContent = d;
    sel.appendChild(opt);
  });
  if (dates.length > 0) loadDate(dates[0]);
  else document.getElementById('main').innerHTML = '<div class="empty"><strong>No digests yet</strong>Run lucent-engage run to generate one.</div>';
}

async function loadDate(date) {
  currentDate = date;
  document.getElementById('date-select').value = date;
  const [digestRes, statusRes] = await Promise.all([
    fetch('/api/digest?date=' + date),
    fetch('/api/status?date=' + date),
  ]);
  const data = await digestRes.json();
  statuses = await statusRes.json();
  allTweets = data.tweets || [];

  const stats = data.stats || {};
  document.getElementById('dry-tag').style.display = stats.isDry ? '' : 'none';
  document.getElementById('stats').innerHTML =
    '<span class="stat"><strong>' + (allTweets.filter(t => t.score >= 3).length) + '</strong> actionable</span>' +
    '<span class="stat"><strong>' + allTweets.filter(t => t.score <= 2).length + '</strong> skipped</span>';

  renderAll();
}

function renderAll() {
  const main = document.getElementById('main');
  const done = Object.values(statuses).filter(v => v === 'done').length;
  const total = allTweets.filter(t => t.score >= 3).length;
  document.getElementById('progress').textContent = total > 0 ? done + ' / ' + total + ' done' : '';

  let html = '';
  [5, 4, 3].forEach(score => {
    const group = allTweets.filter(t => t.score === score);
    if (!group.length) return;
    const cfg = SCORE_CONFIG[score];
    html += '<div class="section-label"><span class="score-dot" style="background:' + cfg.color + '"></span>' + cfg.label + '</div>';
    group.forEach(t => { html += renderCard(t); });
  });
  main.innerHTML = html || '<div class="empty"><strong>Nothing actionable</strong>All posts were scored 1–2.</div>';
}

function renderCard(t) {
  const st = statuses[t.id] || '';
  const charCount = t.draft ? t.draft.length : 0;
  const overLimit = charCount > 280;
  return \`<div class="card \${st}" id="card-\${t.id}">
    <div class="card-header">
      <div style="flex:1">
        <div class="author"><a href="\${t.url}" target="_blank">@\${t.username}</a> <span style="color:var(--text3);font-weight:400">\${t.name}</span></div>
      </div>
      <span class="badge \${t.engagementLevel}">\${t.engagementLevel}</span>
    </div>
    <div class="tweet-text">\${esc(t.text)}</div>
    \${t.draft ? \`
    <div class="draft-label">Suggested reply</div>
    <div class="draft-box" id="draft-\${t.id}">\${esc(t.draft)}</div>
    \` : \`<div class="reasoning">\${esc(t.reasoning)}</div>\`}
    <div class="card-actions">
      \${t.draft ? \`<button class="btn-copy" onclick="copyDraft('\${t.id}')" id="copy-\${t.id}">Copy reply</button>\` : ''}
      <button class="btn-open" onclick="window.open('\${t.url}','_blank')">Open post ↗</button>
      <button class="btn-done \${st === 'done' ? 'active' : ''}" onclick="mark('\${t.id}','done')">✓ Done</button>
      <button class="btn-skip \${st === 'skipped' ? 'active' : ''}" onclick="mark('\${t.id}','skipped')">Skip</button>
      \${t.draft ? \`<span class="char-count \${overLimit ? 'over' : ''}">\${charCount}/280</span>\` : ''}
    </div>
  </div>\`;
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function copyDraft(id) {
  const tweet = allTweets.find(t => t.id === id);
  if (!tweet?.draft) return;
  await navigator.clipboard.writeText(tweet.draft);
  const btn = document.getElementById('copy-' + id);
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copy reply'; btn.classList.remove('copied'); }, 2000);
}

async function mark(id, status) {
  const current = statuses[id];
  const newStatus = current === status ? null : status;
  if (newStatus) statuses[id] = newStatus;
  else delete statuses[id];
  await fetch('/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: currentDate, id, status: newStatus }),
  });
  renderAll();
}

init();
</script>
</body>
</html>`;

export function startServer(outputDir: string): void {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

    if (url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(HTML);
      return;
    }

    if (url.pathname === '/api/dates') {
      sendJson(res, listDates(outputDir));
      return;
    }

    if (url.pathname === '/api/digest') {
      const date = url.searchParams.get('date') ?? '';
      const data = loadDigest(outputDir, date);
      if (!data) { sendJson(res, { error: 'Not found' }, 404); return; }
      sendJson(res, data);
      return;
    }

    if (url.pathname === '/api/status' && req.method === 'GET') {
      const date = url.searchParams.get('date') ?? '';
      sendJson(res, loadStatus(outputDir, date));
      return;
    }

    if (url.pathname === '/api/status' && req.method === 'POST') {
      const body = await parseBody(req) as { date: string; id: string; status: string | null };
      const status = loadStatus(outputDir, body.date);
      if (body.status) {
        status[body.id] = body.status as 'done' | 'skipped';
      } else {
        delete status[body.id];
      }
      saveStatus(outputDir, body.date, status);
      sendJson(res, { ok: true });
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });

  server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    process.stderr.write(`\n  Lucent Engage UI → ${url}\n\n`);
    // Auto-open browser
    import('node:child_process').then(({ exec }) => {
      exec(`open "${url}"`);
    }).catch(() => {});
  });
}
