// Vercel serverless function: POST /api/subscribe
//
// Required environment variables (set in Vercel dashboard → Settings → Environment Variables):
//   RESEND_API_KEY       — from https://resend.com (free tier: 3,000 emails/month)
//   TURNSTILE_SECRET_KEY — from https://dash.cloudflare.com → Turnstile → your site → Secret key
//   NOTIFY_EMAIL         — the address YOU want signup notifications sent to
//   FROM_EMAIL           — sender address (must be verified in Resend, or use onboarding@resend.dev for testing)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token } = req.body ?? {};

  // Basic email check
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // ── 1. Verify Cloudflare Turnstile token ──────────────────────────────────
  const turnstileRes = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress,
      }),
    }
  );

  const turnstileData = await turnstileRes.json();

  if (!turnstileData.success) {
    return res.status(400).json({ error: 'Bot check failed. Please try again.' });
  }

  // ── 2. Send notification email via Resend ─────────────────────────────────
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL ?? 'Lucent UI <onboarding@resend.dev>',
      to: [process.env.NOTIFY_EMAIL],
      subject: '✦ New Lucent UI waitlist signup',
      html: `
        <div style="font-family:monospace;max-width:480px;margin:0 auto;padding:32px;background:#0b0d12;color:#f0ede6;border-radius:6px;">
          <p style="color:#e9c96b;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px;">Lucent UI — New Signup</p>
          <p style="font-size:20px;margin-bottom:8px;">${email}</p>
          <p style="color:#4a4d57;font-size:11px;">Submitted at ${new Date().toUTCString()}</p>
        </div>
      `,
    }),
  });

  if (!resendRes.ok) {
    const errorBody = await resendRes.text();
    console.error('Resend error:', errorBody);
    return res.status(500).json({ error: 'Failed to record signup. Please try again.' });
  }

  return res.status(200).json({ success: true });
}
