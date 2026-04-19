import { useEffect, useRef, useState, type ReactNode } from 'react';

const INK = '#0b0d12';
const INK_PANEL = 'rgba(17,19,24,0.7)';
const INK_OVERLAY = 'rgba(11,13,18,0.72)';
const BORDER = '#1c1f2a';
const BORDER_STRONG = '#3a3320';
const GOLD = '#e9c96b';
const GOLD_BRIGHT = '#fde99a';
const TEXT = '#f0ede6';
const MUTED = '#a8adbd';
const DIM = '#4a4d57';

const KEYFRAMES = `
@keyframes lucent-login-glow-drift {
  0%,100% { transform: translateY(0) scale(1); }
  50%     { transform: translateY(-20px) scale(1.06); }
}
@keyframes lucent-login-fade-up {
  from { opacity:0; transform: translateY(16px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes lucent-login-blink {
  0%,100% { opacity:1; } 50% { opacity:0.3; }
}
@keyframes lucent-login-spin { to { transform: rotate(360deg); } }
`;

function SignalBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Col = { x: number; speed: number; offset: number; len: number; chars: string[] };
    const glyphs = '01{}<>/_=+·*-·ABCDEF';
    let cols: Col[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let t0 = performance.now();

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spacing = 28;
      cols = [];
      for (let x = spacing / 2; x < w; x += spacing) {
        cols.push({
          x,
          speed: 18 + Math.random() * 30,
          offset: Math.random() * h,
          len: 8 + Math.floor(Math.random() * 14),
          chars: Array.from({ length: 30 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]!),
        });
      }
    };

    const tick = (now: number) => {
      const dt = (now - t0) / 1000;
      t0 = now;
      ctx.clearRect(0, 0, w, h);
      ctx.font = '11px "DM Mono", monospace';
      ctx.textBaseline = 'middle';
      for (const c of cols) {
        c.offset = (c.offset + c.speed * dt) % (h + 400);
        for (let i = 0; i < c.len; i++) {
          const y = c.offset - i * 16;
          if (y < -20 || y > h + 20) continue;
          const ch = c.chars[(i + Math.floor(c.offset / 48)) % c.chars.length]!;
          const head = i === 0;
          const alpha = head ? 0.9 : Math.max(0, 0.45 - i * 0.04);
          ctx.fillStyle = head ? `rgba(253,233,154,${alpha})` : `rgba(233,201,107,${alpha})`;
          ctx.fillText(ch, c.x, y);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    size();
    raf = requestAnimationFrame(tick);
    const onResize = () => size();
    window.addEventListener('resize', onResize);

    const ro = 'ResizeObserver' in window ? new ResizeObserver(size) : null;
    if (ro && canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(240,237,230,0.055) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(240,237,230,0.055) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 720,
          height: 720,
          marginLeft: -360,
          marginTop: -360,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(circle, rgba(233,201,107,0.16) 0%, transparent 70%)',
          filter: 'blur(24px)',
          animation: 'lucent-login-glow-drift 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 85%)',
          opacity: 0.55,
        }}
      >
        <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(240,237,230,0.025) 0 2px, transparent 2px 4px)',
        }}
      />
    </>
  );
}

function GlyphMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ flexShrink: 0 }}>
      <rect x="6" y="38" width="46" height="16" rx="3" fill={GOLD_BRIGHT} />
      <rect x="8" y="8" width="18" height="22" rx="2" fill={GOLD} opacity="0.92" />
      <rect x="8" y="40" width="44" height="12" rx="2" fill={GOLD} opacity="0.92" />
      <rect x="36" y="8" width="16" height="28" rx="2" fill={GOLD} opacity="0.08" />
    </svg>
  );
}

function Pill({ children, dot, accent }: { children: ReactNode; dot?: boolean; accent?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        border: `1px solid ${accent ? GOLD : BORDER}`,
        borderRadius: 2,
        fontFamily: '"DM Mono", monospace',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: accent ? GOLD : MUTED,
        background: 'rgba(17,19,24,0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 9999,
            background: accent ? GOLD : '#16a34a',
            animation: 'lucent-login-blink 2s ease-in-out infinite',
          }}
        />
      )}
      {children}
    </span>
  );
}

type IconName = 'mail' | 'lock' | 'eye' | 'eyeOff';

function FieldIcon({ name }: { name: IconName }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {name === 'mail' && (<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7 12 13 2 7" /></>)}
      {name === 'lock' && (<><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>)}
      {name === 'eye' && (<><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></>)}
      {name === 'eyeOff' && (<><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.17-6.17" /><path d="M22.54 6.42A21.77 21.77 0 0 1 23 12s-4 8-11 8a11 11 0 0 1-2.17-.22" /><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8" /><line x1="1" y1="1" x2="23" y2="23" /></>)}
    </svg>
  );
}

type LoginFieldProps = {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: 'mail' | 'lock';
  autoComplete?: string;
  onToggleReveal?: () => void;
  revealed?: boolean;
};

function LoginField({ type, value, onChange, placeholder, icon, autoComplete, onToggleReveal, revealed }: LoginFieldProps) {
  const [focus, setFocus] = useState(false);
  const hasReveal = typeof onToggleReveal === 'function';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 46,
        background: INK_PANEL,
        border: `1px solid ${focus ? GOLD : BORDER}`,
        borderRadius: 2,
        transition: 'border-color 150ms, box-shadow 150ms',
        boxShadow: focus ? '0 0 0 3px rgba(233,201,107,0.14)' : 'none',
      }}
    >
      <span style={{ paddingLeft: 14, color: focus ? GOLD : DIM, display: 'flex' }}>
        <FieldIcon name={icon} />
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        spellCheck={false}
        {...(autoComplete !== undefined && { autoComplete })}
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          padding: '0 14px',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: TEXT,
          fontFamily: '"DM Mono", monospace',
          fontSize: 13,
          letterSpacing: '0.02em',
        }}
      />
      {hasReveal && (
        <button
          type="button"
          onClick={onToggleReveal}
          aria-label={revealed ? 'Hide password' : 'Show password'}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0 14px',
            height: '100%',
            color: DIM,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FieldIcon name={revealed ? 'eyeOff' : 'eye'} />
        </button>
      )}
    </div>
  );
}

function RememberCheckbox({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        fontFamily: '"DM Mono", monospace',
        fontSize: 11,
        letterSpacing: '0.08em',
        color: MUTED,
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          border: `1px solid ${on ? GOLD : BORDER}`,
          background: on ? GOLD : 'transparent',
          borderRadius: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 150ms',
        }}
      >
        {on && (
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {label}
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} style={{ display: 'none' }} />
    </label>
  );
}

function SsoButton({ icon, label }: { icon: ReactNode; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        background: hover ? 'rgba(233,201,107,0.06)' : INK_PANEL,
        border: `1px solid ${hover ? BORDER_STRONG : BORDER}`,
        borderRadius: 2,
        color: TEXT,
        fontFamily: '"DM Mono", monospace',
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

function LoginCard() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [state, setState] = useState<SubmitState>('idle');
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');
    if (!email.includes('@')) { setErr('Enter a valid email address.'); return; }
    if (pw.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setState('loading');
    setTimeout(() => setState('success'), 1100);
  };

  const btnDisabled = state === 'loading' || state === 'success';

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 420,
        background: INK_OVERLAY,
        border: `1px solid ${BORDER}`,
        borderRadius: 2,
        padding: '36px 32px 28px',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(233,201,107,0.04)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: 'lucent-login-fade-up 0.7s ease both',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GlyphMark size={28} />
          <span
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 13,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: TEXT,
            }}
          >
            Lucent UI
          </span>
        </div>
        <Pill dot accent>Secure Session</Pill>
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: '"DM Mono", monospace',
              fontWeight: 400,
              fontSize: 24,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: TEXT,
            }}
          >
            Sign in to <em style={{ fontStyle: 'normal', color: GOLD }}>your console</em>
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              lineHeight: 1.5,
              color: MUTED,
            }}
          >
            Continue to the component playground and MCP dashboard.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <SsoButton
          label="GitHub"
          icon={
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.9c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.67 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.57.23 2.73.11 3.02.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.37-5.26 5.66.41.36.78 1.05.78 2.12v3.14c0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
            </svg>
          }
        />
        <SsoButton
          label="Google"
          icon={
            <svg width={16} height={16} viewBox="0 0 24 24">
              <path fill={GOLD} d="M21.35 11.1h-9.17v2.91h5.26c-.23 1.43-1.66 4.19-5.26 4.19a5.7 5.7 0 1 1 0-11.4 5.1 5.1 0 0 1 3.6 1.4l2.07-2A8.38 8.38 0 0 0 12.18 4a8.7 8.7 0 1 0 0 17.4c5.03 0 8.35-3.54 8.35-8.52 0-.58-.07-1.17-.18-1.78z" />
            </svg>
          }
        />
        <SsoButton
          label="SSO"
          icon={
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 18px' }}>
        <span style={{ flex: 1, height: 1, background: BORDER }} />
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.2em', color: DIM }}>
          OR WITH EMAIL
        </span>
        <span style={{ flex: 1, height: 1, background: BORDER }} />
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LoginField
          type="email"
          icon="mail"
          value={email}
          placeholder="you@company.com"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoginField
          type={show ? 'text' : 'password'}
          icon="lock"
          value={pw}
          placeholder="••••••••••"
          autoComplete="current-password"
          onChange={(e) => setPw(e.target.value)}
          onToggleReveal={() => setShow((s) => !s)}
          revealed={show}
        />

        {err && (
          <div
            style={{
              padding: '10px 12px',
              border: '1px solid #5a1f1f',
              background: 'rgba(220,38,38,0.08)',
              color: '#fca5a5',
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
              letterSpacing: '0.08em',
              borderRadius: 2,
              animation: 'lucent-login-fade-up 0.25s ease both',
            }}
          >
            {err}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <RememberCheckbox on={remember} onChange={setRemember} label="Remember me" />
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: GOLD,
              textDecoration: 'none',
            }}
          >
            Forgot?
          </a>
        </div>

        <button
          type="submit"
          disabled={btnDisabled}
          onMouseEnter={(e) => { if (state === 'idle') e.currentTarget.style.background = GOLD_BRIGHT; }}
          onMouseLeave={(e) => { if (state === 'idle') e.currentTarget.style.background = GOLD; }}
          style={{
            marginTop: 8,
            height: 46,
            background: state === 'success' ? 'transparent' : GOLD,
            color: state === 'success' ? GOLD : INK,
            border: `1px solid ${GOLD}`,
            borderRadius: 2,
            fontFamily: '"DM Mono", monospace',
            fontSize: 12,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
            cursor: state === 'idle' ? 'pointer' : 'default',
            transition: 'all 150ms',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {state === 'loading' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                  border: `2px solid ${INK}`,
                  borderTopColor: 'transparent',
                  animation: 'lucent-login-spin 0.7s linear infinite',
                }}
              />
              Authenticating…
            </span>
          )}
          {state === 'success' && <span>✦ Welcome back</span>}
          {state === 'idle' && <span>Sign in →</span>}
          {state === 'error' && <span>Try again</span>}
        </button>
      </form>

      <p
        style={{
          margin: '20px 0 0',
          textAlign: 'center',
          fontFamily: '"DM Mono", monospace',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: DIM,
          textTransform: 'uppercase',
        }}
      >
        No account?{' '}
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: MUTED, textDecoration: 'none' }}>
          Request access →
        </a>
      </p>
    </div>
  );
}

export function LoginScreen() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 720,
        overflow: 'hidden',
        background: INK,
        color: TEXT,
        fontFamily: '"DM Sans", -apple-system, sans-serif',
        borderRadius: 4,
        border: `1px solid ${BORDER}`,
      }}
    >
      <style>{KEYFRAMES}</style>

      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <SignalBackground />
      </div>

      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          fontFamily: '"DM Mono", monospace',
          animation: 'lucent-login-fade-up 0.8s ease both',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="14" height="2.5" rx="1" fill={GOLD} />
            <rect x="5" y="8" width="16" height="2.5" rx="1" fill={GOLD} opacity="0.85" />
            <rect x="3" y="12" width="12" height="2.5" rx="1" fill={GOLD} opacity="0.7" />
            <rect x="5" y="16" width="15" height="2.5" rx="1" fill={GOLD} opacity="0.55" />
          </svg>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEXT }}>
            Lucent UI
          </span>
        </div>
        <Pill dot>All systems operational</Pill>
      </header>

      <main
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 72px',
        }}
      >
        <LoginCard />
      </main>

      <footer
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          padding: '18px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: '"DM Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: DIM,
          pointerEvents: 'none',
        }}
      >
        <span>© 2026 Lucent UI</span>
        <span style={{ display: 'flex', gap: 20, pointerEvents: 'auto' }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: DIM, textDecoration: 'none' }}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: DIM, textDecoration: 'none' }}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: DIM, textDecoration: 'none' }}>Status</a>
        </span>
      </footer>
    </div>
  );
}
