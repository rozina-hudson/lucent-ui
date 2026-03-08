import { useState, useCallback } from 'react';
import { LucentProvider, createTheme, Button, Badge, Alert, Input } from 'lucent-ui';
import type { ThemeAnchors } from 'lucent-ui';

const DEFAULT_ANCHORS: ThemeAnchors = {
  bgBase:         '#0f1117',
  surface:        '#161a23',
  borderDefault:  '#1e2130',
  textPrimary:    '#f0ede6',
  accentDefault:  '#7c6af4',
  successDefault: '#22c55e',
  warningDefault: '#f59e0b',
  dangerDefault:  '#ef4444',
  infoDefault:    '#3b82f6',
};

const PRESETS: { label: string; anchors: ThemeAnchors }[] = [
  {
    label: 'Violet',
    anchors: DEFAULT_ANCHORS,
  },
  {
    label: 'Emerald',
    anchors: { ...DEFAULT_ANCHORS, accentDefault: '#10b981' },
  },
  {
    label: 'Rose',
    anchors: { ...DEFAULT_ANCHORS, accentDefault: '#f43f5e' },
  },
  {
    label: 'Amber',
    anchors: {
      ...DEFAULT_ANCHORS,
      bgBase: '#0f0e09',
      surface: '#1a1912',
      borderDefault: '#2a2815',
      accentDefault: '#f59e0b',
    },
  },
  {
    label: 'Light',
    anchors: {
      bgBase:         '#f8f7f4',
      surface:        '#ffffff',
      borderDefault:  '#e2e0da',
      textPrimary:    '#111318',
      accentDefault:  '#7c6af4',
      successDefault: '#16a34a',
      warningDefault: '#d97706',
      dangerDefault:  '#dc2626',
      infoDefault:    '#2563eb',
    },
  },
];

const PICKERS: { key: keyof ThemeAnchors; label: string }[] = [
  { key: 'bgBase',        label: 'Background' },
  { key: 'surface',       label: 'Surface' },
  { key: 'accentDefault', label: 'Accent' },
  { key: 'textPrimary',   label: 'Text' },
  { key: 'dangerDefault', label: 'Danger' },
];

function jsxSnippet(anchors: ThemeAnchors): string {
  const lines = Object.entries(anchors).map(([k, v]) => `    ${k}: "${v}",`);
  return `<LucentProvider\n  anchors={{\n${lines.join('\n')}\n  }}\n>\n  {/* your app */}\n</LucentProvider>`;
}

export default function ThemeDemo() {
  const [anchors, setAnchors] = useState<ThemeAnchors>(DEFAULT_ANCHORS);
  const [activePreset, setActivePreset] = useState(0);
  const [copied, setCopied] = useState(false);

  const handlePicker = useCallback((key: keyof ThemeAnchors, value: string) => {
    setAnchors(prev => ({ ...prev, [key]: value }));
    setActivePreset(-1);
  }, []);

  const handlePreset = useCallback((idx: number) => {
    setAnchors(PRESETS[idx].anchors);
    setActivePreset(idx);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsxSnippet(anchors)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [anchors]);

  const isLight = createTheme(anchors, 'light').bgBase === anchors.bgBase
    ? false
    : anchors.bgBase > '#888888';

  const theme = isLight ? 'light' : 'dark';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Presets */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => handlePreset(i)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '5px 14px',
                borderRadius: 2,
                cursor: 'pointer',
                border: activePreset === i ? '1px solid #e9c96b' : '1px solid #1c1f2a',
                background: activePreset === i ? '#e9c96b15' : '#111318',
                color: activePreset === i ? '#e9c96b' : '#4a4d57',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Color pickers */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {PICKERS.map(({ key, label }) => (
            <label
              key={key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 8,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#4a4d57',
              }}>
                {label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 2,
                  border: '1px solid #1c1f2a',
                  background: anchors[key],
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <input
                    type="color"
                    value={anchors[key]}
                    onChange={e => handlePicker(key, e.target.value)}
                    style={{
                      position: 'absolute',
                      inset: -4,
                      width: 'calc(100% + 8px)',
                      height: 'calc(100% + 8px)',
                      cursor: 'pointer',
                      opacity: 0,
                    }}
                  />
                </div>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: '#4a4d57',
                  letterSpacing: '0.06em',
                }}>
                  {anchors[key]}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div style={{ position: 'relative' }}>
        <LucentProvider anchors={anchors} theme={theme}>
          <div style={{
            padding: 32,
            borderRadius: 4,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-base)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
            {/* Buttons row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="primary">Save changes</Button>
              <Button variant="secondary">Cancel</Button>
              <Button variant="ghost">Learn more</Button>
              <Button variant="danger">Delete</Button>
            </div>

            {/* Badges row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant="accent">accent</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="danger">danger</Badge>
              <Badge variant="info">info</Badge>
              <Badge variant="neutral">neutral</Badge>
            </div>

            {/* Alert */}
            <Alert
              variant="info"
              title="Theme preview"
              description="All 40+ tokens were derived from 9 anchor colors using createTheme()."
            />

            {/* Input */}
            <Input placeholder="Search components…" style={{ maxWidth: 280 }} />
          </div>
        </LucentProvider>
      </div>

      {/* Copy snippet */}
      <div style={{ position: 'relative' }}>
        <div style={{
          background: '#0b0d12',
          border: '1px solid #1c1f2a',
          borderRadius: 4,
          padding: 20,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          lineHeight: 1.8,
          color: '#f0ede6',
          whiteSpace: 'pre',
          overflowX: 'auto',
        }}>
          {jsxSnippet(anchors)}
        </div>
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontFamily: "'DM Mono', monospace",
            fontSize: 8,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: 2,
            cursor: 'pointer',
            border: copied ? '1px solid #e9c96b' : '1px solid #1c1f2a',
            background: copied ? '#e9c96b15' : '#111318',
            color: copied ? '#e9c96b' : '#4a4d57',
            transition: 'all 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

    </div>
  );
}
