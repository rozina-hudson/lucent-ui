import { useState, useCallback } from 'react';
import {
  LucentProvider,
  createTheme,
  Button,
  Badge,
  Toggle,
  Input,
  Card,
  Text,
  Progress,
  Chip,
} from 'lucent-ui';
import type { ThemeAnchors, PresetName } from 'lucent-ui';

// ── Site palette (matches landing page CSS vars) ──
const mono = "'DM Mono', monospace";
const sans = "'DM Sans', sans-serif";
const gold = '#e9c96b';
const muted = '#4a4d57';
const borderColor = '#1c1f2a';
const border2 = '#232737';
const paper = '#f0ede6';
const ink = '#0b0d12';
const cardBg = '#111318';
const card2 = '#13161e';

// ── Presets mode data ──
interface PresetOption {
  key: PresetName;
  label: string;
  prompt: string;
}

const PRESETS: PresetOption[] = [
  { key: 'modern',      label: 'Modern',       prompt: 'Clean and modern' },
  { key: 'liquidGlass', label: 'Liquid Glass',  prompt: 'Frosted glass aesthetic' },
  { key: 'brutalist',   label: 'Brutalist',     prompt: 'Make it brutalist' },
  { key: 'terminal',    label: 'Terminal',       prompt: 'Hacker terminal vibe' },
  { key: 'softUI',      label: 'Soft UI',       prompt: 'Soft neumorphic style' },
  { key: 'minimal',     label: 'Minimal',        prompt: 'Keep it minimal' },
  { key: 'bloom',       label: 'Bloom',          prompt: 'Vibrant and expressive' },
  { key: 'bento',       label: 'Bento',          prompt: 'Bento grid layout style' },
];

// ── Custom anchors mode data ──
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

const ANCHOR_PRESETS: { label: string; anchors: ThemeAnchors }[] = [
  { label: 'Violet',  anchors: DEFAULT_ANCHORS },
  { label: 'Emerald', anchors: { ...DEFAULT_ANCHORS, accentDefault: '#10b981' } },
  { label: 'Rose',    anchors: { ...DEFAULT_ANCHORS, accentDefault: '#f43f5e' } },
  { label: 'Amber',   anchors: { ...DEFAULT_ANCHORS, bgBase: '#0f0e09', surface: '#1a1912', borderDefault: '#2a2815', accentDefault: '#f59e0b' } },
  {
    label: 'Light',
    anchors: {
      bgBase: '#f8f7f4', surface: '#ffffff', borderDefault: '#e2e0da', textPrimary: '#111318',
      accentDefault: '#7c6af4', successDefault: '#16a34a', warningDefault: '#d97706',
      dangerDefault: '#dc2626', infoDefault: '#2563eb',
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

function anchorSnippet(a: ThemeAnchors): string {
  const lines = Object.entries(a).map(([k, v]) => `    ${k}: "${v}",`);
  return `<LucentProvider\n  anchors={{\n${lines.join('\n')}\n  }}\n>`;
}

// ── Shared styles ──
const pillStyle = (active: boolean) => ({
  fontFamily: mono,
  fontSize: 9,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  padding: '5px 12px',
  borderRadius: 2,
  cursor: 'pointer' as const,
  border: `1px solid ${active ? gold : borderColor}`,
  background: active ? `${gold}15` : 'transparent',
  color: active ? gold : muted,
  transition: 'all 0.15s',
});

type Mode = 'presets' | 'custom';

export default function ThemeDemo() {
  const [mode, setMode] = useState<Mode>('presets');

  // Presets state
  const [activePreset, setActivePreset] = useState<PresetName>('modern');
  const [toggled, setToggled] = useState(true);

  // Custom anchors state
  const [anchors, setAnchors] = useState<ThemeAnchors>(DEFAULT_ANCHORS);
  const [activeAnchorPreset, setActiveAnchorPreset] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentPreset = PRESETS.find(p => p.key === activePreset)!;

  const handlePicker = useCallback((key: keyof ThemeAnchors, value: string) => {
    setAnchors(prev => ({ ...prev, [key]: value }));
    setActiveAnchorPreset(-1);
  }, []);

  const handleAnchorPreset = useCallback((idx: number) => {
    setAnchors(ANCHOR_PRESETS[idx].anchors);
    setActiveAnchorPreset(idx);
  }, []);

  const handleCopy = useCallback(() => {
    const text = mode === 'presets'
      ? `<LucentProvider preset="${activePreset}">`
      : anchorSnippet(anchors);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [mode, activePreset, anchors]);

  const isLight = mode === 'custom'
    && ANCHOR_PRESETS.some(p => p.label === 'Light' && p.anchors.bgBase === anchors.bgBase);
  const theme = isLight ? 'light' as const : 'dark' as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Mode tabs ── */}
      <div style={{
        display: 'flex',
        gap: 0,
        marginBottom: 24,
      }}>
        {([
          { key: 'presets' as Mode, label: 'Presets', sub: '10 curated styles' },
          { key: 'custom' as Mode,  label: 'Custom Anchors', sub: '9 colors → full system' },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            style={{
              flex: 1,
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '14px 20px',
              cursor: 'pointer',
              border: `1px solid ${borderColor}`,
              borderBottom: mode === tab.key ? `2px solid ${gold}` : `1px solid ${borderColor}`,
              background: mode === tab.key ? `${gold}08` : 'transparent',
              color: mode === tab.key ? gold : muted,
              transition: 'all 0.15s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              fontSize: 8,
              letterSpacing: '0.1em',
              color: mode === tab.key ? `${gold}90` : `${muted}80`,
              fontFamily: sans,
              textTransform: 'none',
            }}>
              {tab.sub}
            </span>
          </button>
        ))}
      </div>

      {/* ── Presets controls ── */}
      {mode === 'presets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {/* Preset pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => setActivePreset(p.key)}
                style={pillStyle(activePreset === p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* AI prompt */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 2,
            padding: '12px 16px',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: `${gold}20`, border: `1px solid ${gold}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill={gold} opacity={0.9} />
              </svg>
            </div>
            <span style={{
              fontFamily: sans, fontSize: 14, fontWeight: 300,
              color: paper, fontStyle: 'italic', opacity: 0.8,
            }}>
              &ldquo;{currentPreset.prompt}&rdquo;
            </span>
          </div>

          {/* Code output */}
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: mono, fontSize: 11, lineHeight: 1.8,
              background: ink, border: `1px solid ${borderColor}`, borderRadius: 4,
              padding: '14px 18px', color: paper, whiteSpace: 'pre', overflowX: 'auto',
            }}>
              <span style={{ color: muted }}>{'// AI writes one line:\n'}</span>
              <span style={{ color: gold }}>&lt;LucentProvider</span>
              <span style={{ color: '#7dd3fc' }}> preset</span>
              <span style={{ color: paper }}>=</span>
              <span style={{ color: '#86efac' }}>"{activePreset}"</span>
              <span style={{ color: gold }}>&gt;</span>
            </div>
            <button onClick={handleCopy} style={{
              position: 'absolute', top: 10, right: 10,
              fontFamily: mono, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 2, cursor: 'pointer',
              border: `1px solid ${copied ? gold : borderColor}`,
              background: copied ? `${gold}15` : cardBg,
              color: copied ? gold : muted, transition: 'all 0.2s',
            }}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* ── Custom anchors controls ── */}
      {mode === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {/* Anchor palette presets */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ANCHOR_PRESETS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => handleAnchorPreset(i)}
                style={pillStyle(activeAnchorPreset === i)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Color pickers */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {PICKERS.map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                <span style={{
                  fontFamily: mono, fontSize: 8, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: muted,
                }}>
                  {label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 2,
                    border: `1px solid ${borderColor}`, background: anchors[key],
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <input
                      type="color"
                      value={anchors[key]}
                      onChange={e => handlePicker(key, e.target.value)}
                      style={{
                        position: 'absolute', inset: -4,
                        width: 'calc(100% + 8px)', height: 'calc(100% + 8px)',
                        cursor: 'pointer', opacity: 0,
                      }}
                    />
                  </div>
                  <span style={{
                    fontFamily: mono, fontSize: 10, color: muted, letterSpacing: '0.06em',
                  }}>
                    {anchors[key]}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {/* Code output */}
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: mono, fontSize: 11, lineHeight: 1.8,
              background: ink, border: `1px solid ${borderColor}`, borderRadius: 4,
              padding: '14px 18px', color: paper, whiteSpace: 'pre', overflowX: 'auto',
            }}>
              {anchorSnippet(anchors)}
            </div>
            <button onClick={handleCopy} style={{
              position: 'absolute', top: 10, right: 10,
              fontFamily: mono, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 2, cursor: 'pointer',
              border: `1px solid ${copied ? gold : borderColor}`,
              background: copied ? `${gold}15` : cardBg,
              color: copied ? gold : muted, transition: 'all 0.2s',
            }}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* ── Shared live preview ── */}
      <div style={{
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 16px', background: card2, borderBottom: `1px solid ${borderColor}`,
        }}>
          <span style={{
            fontFamily: mono, fontSize: 8, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: gold,
          }}>
            Live Preview
          </span>
          <span style={{
            fontFamily: mono, fontSize: 8, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: muted,
          }}>
            {mode === 'presets' ? `preset="${activePreset}"` : `${Object.keys(anchors).length} anchors`}
          </span>
        </div>

        <LucentProvider
          {...(mode === 'presets'
            ? { preset: activePreset, theme: 'dark' as const }
            : { anchors, theme }
          )}
        >
          <div style={{
            padding: 28,
            background: 'var(--lucent-bg-base)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            transition: 'background 0.4s',
          }}>
            {/* Card */}
            <Card variant="outline">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text as="span" size="md" weight="semibold">Project Overview</Text>
                  <Badge variant="accent">Active</Badge>
                </div>
                <Text as="p" size="sm" color="secondary">
                  Dashboard analytics and team metrics for Q1. Real-time data updated every 30 seconds.
                </Text>
                <Progress value={72} size="sm" />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip variant="outline" size="sm">Analytics</Chip>
                  <Chip variant="outline" size="sm">Real-time</Chip>
                  <Chip variant="outline" size="sm">Team</Chip>
                </div>
              </div>
            </Card>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Input placeholder="Search..." size="sm" style={{ flex: 1, minWidth: 140 }} />
              <Toggle checked={toggled} onChange={setToggled} size="sm" />
            </div>

            {/* Buttons + badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button variant="primary" size="sm">Deploy</Button>
                <Button variant="secondary" size="sm">Preview</Button>
                <Button variant="ghost" size="sm">Docs</Button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge variant="success" size="sm">success</Badge>
                <Badge variant="warning" size="sm">warning</Badge>
                <Badge variant="danger" size="sm">danger</Badge>
              </div>
            </div>
          </div>
        </LucentProvider>
      </div>
    </div>
  );
}
