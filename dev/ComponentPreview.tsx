import { useState } from 'react';
import { LucentProvider, useLucent, brandTokens } from '../src/index.js';
import { Button } from '../src/components/atoms/Button/index.js';
import { Input } from '../src/components/atoms/Input/index.js';
import { Textarea } from '../src/components/atoms/Textarea/index.js';
import { Badge } from '../src/components/atoms/Badge/index.js';
import { Avatar } from '../src/components/atoms/Avatar/index.js';
import { Spinner } from '../src/components/atoms/Spinner/index.js';
import { Divider } from '../src/components/atoms/Divider/index.js';
import type { LucentTokens, Theme } from '../src/index.js';

type AccentPreset = 'default' | 'gold' | 'indigo';

const indigoTokens: Partial<LucentTokens> = {
  accentDefault: '#4f46e5',
  accentHover: '#4338ca',
  accentActive: '#3730a3',
  accentSubtle: '#eef2ff',
  focusRing: '#4f46e5',
};

const accentLabel: Record<AccentPreset, string> = {
  default: 'Default (monochrome)',
  gold: 'Gold (brandTokens)',
  indigo: 'Indigo',
};

export function ComponentPreview() {
  const [theme, setTheme] = useState<Theme>('light');
  const [accent, setAccent] = useState<AccentPreset>('default');

  const tokenOverrides =
    accent === 'gold' ? brandTokens :
    accent === 'indigo' ? indigoTokens :
    undefined;

  return (
    <LucentProvider theme={theme} tokens={tokenOverrides}>
      <Inner
        theme={theme}
        accent={accent}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onSetAccent={setAccent}
      />
    </LucentProvider>
  );
}

function Inner({
  theme,
  accent,
  onToggleTheme,
  onSetAccent,
}: {
  theme: Theme;
  accent: AccentPreset;
  onToggleTheme: () => void;
  onSetAccent: (p: AccentPreset) => void;
}) {
  const { tokens } = useLucent();
  const [inputVal, setInputVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('');

  return (
    <div style={{ background: tokens.bgBase, color: tokens.textPrimary, fontFamily: tokens.fontFamilyBase, minHeight: '100vh', padding: tokens.space8 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.space8, flexWrap: 'wrap', gap: tokens.space4 }}>
        <div>
          <h1 style={{ fontSize: tokens.fontSize2xl, fontWeight: tokens.fontWeightBold, margin: 0 }}>Lucent UI — Component Preview</h1>
          <p style={{ color: tokens.textSecondary, margin: `${tokens.space1} 0 0`, fontSize: tokens.fontSizeSm }}>Atoms Wave 1 · {theme} mode · {accentLabel[accent]}</p>
        </div>
        <div style={{ display: 'flex', gap: tokens.space2, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['default', 'gold', 'indigo'] as AccentPreset[]).map(p => (
            <button
              key={p}
              onClick={() => onSetAccent(p)}
              style={{
                padding: `${tokens.space1} ${tokens.space3}`,
                border: `1px solid ${accent === p ? tokens.accentDefault : tokens.borderDefault}`,
                borderRadius: tokens.radiusMd,
                background: accent === p ? tokens.accentDefault : tokens.surfaceDefault,
                color: accent === p ? tokens.textOnAccent : tokens.textPrimary,
                fontFamily: tokens.fontFamilyBase,
                fontSize: tokens.fontSizeSm,
                fontWeight: accent === p ? tokens.fontWeightSemibold : tokens.fontWeightNormal,
                cursor: 'pointer',
              }}
            >
              {accentLabel[p]}
            </button>
          ))}
          <Button variant="secondary" size="sm" onClick={onToggleTheme}>
            {theme === 'light' ? 'Dark' : 'Light'} mode
          </Button>
        </div>
      </div>

      {/* Contrast demo — light vs dark accent side by side */}
      <Section title="Contrast demo" tokens={tokens}>
        <p style={{ margin: `0 0 ${tokens.space4}`, fontSize: tokens.fontSizeSm, color: tokens.textSecondary }}>
          Switch the accent preset above to see contrast-aware text adapt automatically. Gold → black text (8.6:1). Indigo → white text (8.8:1). Monochrome → white (light) / dark (dark).
        </p>
        <Row label="Button primary" tokens={tokens}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </Row>
        <Row label="Badge accent" tokens={tokens}>
          <Badge variant="accent" size="sm">Small</Badge>
          <Badge variant="accent" size="md">Medium</Badge>
        </Row>
      </Section>

      {/* Button */}
      <Section title="Button" tokens={tokens}>
        <Row label="Variants" tokens={tokens}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="States" tokens={tokens}>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="primary" fullWidth>Full width</Button>
        </Row>
      </Section>

      {/* Input */}
      <Section title="Input" tokens={tokens}>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Email" type="email" placeholder="you@example.com" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          </div>
        </Row>
        <Row label="With helper" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Username" helperText="3–20 characters" placeholder="yourname" />
          </div>
        </Row>
        <Row label="Error state" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Password" type="password" errorText="Must be at least 8 characters" value="short" />
          </div>
        </Row>
      </Section>

      {/* Textarea */}
      <Section title="Textarea" tokens={tokens}>
        <Row label="Auto-resize" tokens={tokens}>
          <div style={{ width: 320 }}>
            <Textarea label="Bio" autoResize placeholder="Tell us about yourself…" value={textareaVal} onChange={e => setTextareaVal(e.target.value)} />
          </div>
        </Row>
        <Row label="With count" tokens={tokens}>
          <div style={{ width: 320 }}>
            <Textarea label="Tweet" maxLength={280} showCount value={textareaVal} onChange={e => setTextareaVal(e.target.value)} />
          </div>
        </Row>
      </Section>

      {/* Badge */}
      <Section title="Badge" tokens={tokens}>
        <Row label="Variants" tokens={tokens}>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">12</Badge>
          <Badge variant="info">Beta</Badge>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Badge size="sm" variant="success">Small</Badge>
          <Badge size="md" variant="success">Medium</Badge>
        </Row>
      </Section>

      {/* Avatar */}
      <Section title="Avatar" tokens={tokens}>
        <Row label="With image" tokens={tokens}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Avatar key={s} src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" size={s} />
          ))}
        </Row>
        <Row label="Initials fallback" tokens={tokens}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Avatar key={s} alt="Jane Doe" size={s} />
          ))}
        </Row>
      </Section>

      {/* Spinner */}
      <Section title="Spinner" tokens={tokens}>
        <Row label="Sizes" tokens={tokens}>
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
      </Section>

      {/* Divider */}
      <Section title="Divider" tokens={tokens}>
        <Row label="Horizontal" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <p style={{ margin: `0 0 ${tokens.space2}`, color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Content above</p>
            <Divider />
            <p style={{ margin: `${tokens.space2} 0 0`, color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Content below</p>
          </div>
        </Row>
        <Row label="With label" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Divider label="OR" />
          </div>
        </Row>
        <Row label="Vertical" tokens={tokens}>
          <div style={{ display: 'flex', alignItems: 'center', height: 32 }}>
            <span style={{ color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Home</span>
            <Divider orientation="vertical" />
            <span style={{ color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>About</span>
            <Divider orientation="vertical" />
            <span style={{ color: tokens.textSecondary, fontSize: tokens.fontSizeSm }}>Contact</span>
          </div>
        </Row>
      </Section>
    </div>
  );
}

function Section({ title, tokens, children }: { title: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{ background: tokens.surfaceDefault, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusLg, padding: tokens.space6, marginBottom: tokens.space6 }}>
      <h2 style={{ fontSize: tokens.fontSizeLg, fontWeight: tokens.fontWeightSemibold, marginBottom: tokens.space5, marginTop: 0 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space4 }}>{children}</div>
    </div>
  );
}

function Row({ label, tokens, children }: { label: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
      <span style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, letterSpacing: tokens.letterSpacingWide, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space3, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}
