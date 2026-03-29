import { useState, useCallback, useEffect } from 'react';
import type { Theme, LucentTokens } from '../tokens/types.js';
import type { TokenOverrideState } from './useTokenOverrides.js';
import { computeTypeScale, TYPE_SCALE_PRESETS } from './designKnobs.js';
import { Text } from '../components/atoms/Text/index.js';
import { Input } from '../components/atoms/Input/index.js';
import { Button } from '../components/atoms/Button/index.js';
import { Select } from '../components/atoms/Select/index.js';
import { Slider } from '../components/atoms/Slider/index.js';
import { SegmentedControl } from '../components/atoms/SegmentedControl/index.js';
import { ColorPicker } from '../components/atoms/ColorPicker/index.js';
import { loadFont } from './loadFont.js';

// ── Font family presets ─────────────────────────────────────────────────────

interface FontPreset {
  label: string;
  family: string;
  category: 'sans' | 'serif' | 'mono' | 'display';
}

const FONT_PRESETS: FontPreset[] = [
  { label: 'DM Sans', family: '"DM Sans", sans-serif', category: 'sans' },
  { label: 'Inter', family: '"Inter", sans-serif', category: 'sans' },
  { label: 'System UI', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', category: 'sans' },
  { label: 'Geist', family: '"Geist", sans-serif', category: 'sans' },
  { label: 'Plus Jakarta', family: '"Plus Jakarta Sans", sans-serif', category: 'sans' },
  { label: 'Outfit', family: '"Outfit", sans-serif', category: 'sans' },
  { label: 'Lora', family: '"Lora", serif', category: 'serif' },
  { label: 'Merriweather', family: '"Merriweather", serif', category: 'serif' },
  { label: 'Playfair', family: '"Playfair Display", serif', category: 'serif' },
  { label: 'JetBrains Mono', family: '"JetBrains Mono", monospace', category: 'mono' },
  { label: 'Fira Code', family: '"Fira Code", monospace', category: 'mono' },
  { label: 'Space Grotesk', family: '"Space Grotesk", sans-serif', category: 'display' },
  { label: 'Sora', family: '"Sora", sans-serif', category: 'display' },
  { label: 'Georama', family: '"Georama", sans-serif', category: 'display' },
];

// ── Component ───────────────────────────────────────────────────────────────

interface TypographyViewProps {
  state: TokenOverrideState;
  theme: Theme;
}

export function TypographyView({ state, theme }: TypographyViewProps) {
  // Read the current fontSizeMd to derive the effective base size
  const currentMd = (state.overrides.fontSizeMd ?? state.tokens.fontSizeMd) as string;
  const initialBase = parseFloat(currentMd) || 1;

  const [baseSize, setBaseSize] = useState(initialBase);
  const [typeRatio, setTypeRatio] = useState(() => {
    const currentLg = (state.overrides.fontSizeLg ?? state.tokens.fontSizeLg) as string;
    const lg = parseFloat(currentLg) || 1.125;
    const md = parseFloat(currentMd) || 1;
    return md > 0 ? Math.round((lg / md) * 1000) / 1000 : 1.125;
  });

  // Sync from external changes (e.g. Design tab preset applied)
  useEffect(() => {
    const md = parseFloat((state.overrides.fontSizeMd ?? state.tokens.fontSizeMd) as string) || 1;
    const lg = parseFloat((state.overrides.fontSizeLg ?? state.tokens.fontSizeLg) as string) || 1.125;
    setBaseSize(md);
    if (md > 0) setTypeRatio(Math.round((lg / md) * 1000) / 1000);
  }, [state.overrides.fontSizeMd, state.overrides.fontSizeLg, state.tokens.fontSizeMd, state.tokens.fontSizeLg]);
  const [fontCategory, setFontCategory] = useState<'all' | FontPreset['category']>('all');

  const currentFamilyBase = (state.overrides.fontFamilyBase ?? state.tokens.fontFamilyBase) as string;
  const currentFamilyMono = (state.overrides.fontFamilyMono ?? state.tokens.fontFamilyMono) as string;
  const currentFamilyDisplay = (state.overrides.fontFamilyDisplay ?? state.tokens.fontFamilyDisplay) as string;

  const applyOverrides = useCallback((overrides: Record<string, string>) => {
    for (const [key, value] of Object.entries(overrides)) {
      state.setOverride(key as keyof typeof state.tokens, value);
    }
  }, [state]);

  const handleBaseSize = (value: number) => {
    setBaseSize(value);
    applyOverrides(computeTypeScale(value, typeRatio) as Record<string, string>);
  };

  const handleTypeRatio = (value: number) => {
    setTypeRatio(value);
    applyOverrides(computeTypeScale(baseSize, value) as Record<string, string>);
  };

  const filteredFonts = fontCategory === 'all'
    ? FONT_PRESETS
    : FONT_PRESETS.filter(f => f.category === fontCategory);

  return (
    <div style={{ padding: '4px 12px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Font Family ── */}
      <Knob label="Font Family">
        {/* Category filter */}
        <div style={{ marginBottom: 8 }}>
          <SegmentedControl
            value={fontCategory}
            onChange={v => setFontCategory(v as typeof fontCategory)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'sans', label: 'Sans' },
              { value: 'serif', label: 'Serif' },
              { value: 'mono', label: 'Mono' },
              { value: 'display', label: 'Display' },
            ]}
            size="sm"
            fullWidth
          />
        </div>

        {/* Font grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredFonts.map(font => {
            const isActive = currentFamilyBase.includes(font.label) ||
              (font.family === currentFamilyBase);
            return (
              <Button
                key={font.label}
                variant={isActive ? 'secondary' : 'ghost'}
                onClick={() => { loadFont(font.family); state.setOverride('fontFamilyBase', font.family); }}
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  height: 'auto',
                  padding: '8px 10px',
                }}
              >
                <span style={{ fontFamily: font.family, fontSize: 14 }}>
                  {font.label}
                </span>
                <Text as="span" size="xs" color="secondary" style={{ textTransform: 'capitalize' }}>
                  {font.category}
                </Text>
              </Button>
            );
          })}
        </div>

        {/* Custom input */}
        <div style={{ marginTop: 8 }}>
          <Text size="xs" color="secondary" style={{ marginBottom: 4, display: 'block' }}>Custom</Text>
          <Input
            size="sm"
            value={currentFamilyBase}
            onChange={e => state.setOverride('fontFamilyBase', e.target.value)}
            style={{ width: '100%', fontFamily: 'var(--lucent-font-family-mono)' }}
            spellCheck={false}
          />
        </div>
      </Knob>

      {/* ── Mono & Display families ── */}
      <Knob label="Code & Display Fonts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <Text size="xs" color="secondary" style={{ marginBottom: 4, display: 'block' }}>Monospace</Text>
            <Select
              size="sm"
              value={currentFamilyMono}
              onChange={e => { loadFont(e.target.value); state.setOverride('fontFamilyMono', e.target.value); }}
              options={[
                ...FONT_PRESETS.filter(f => f.category === 'mono').map(f => ({ value: f.family, label: f.label })),
                ...(!FONT_PRESETS.some(f => f.family === currentFamilyMono) ? [{ value: currentFamilyMono, label: 'Custom' }] : []),
              ]}
            />
          </div>
          <div>
            <Text size="xs" color="secondary" style={{ marginBottom: 4, display: 'block' }}>Display</Text>
            <Select
              size="sm"
              value={currentFamilyDisplay}
              onChange={e => { loadFont(e.target.value); state.setOverride('fontFamilyDisplay', e.target.value); }}
              options={[
                ...FONT_PRESETS.filter(f => f.category === 'display' || f.category === 'sans').map(f => ({ value: f.family, label: f.label })),
                ...(!FONT_PRESETS.some(f => f.family === currentFamilyDisplay) ? [{ value: currentFamilyDisplay, label: 'Custom' }] : []),
              ]}
            />
          </div>
        </div>
      </Knob>

      {/* ── Type Scale ── */}
      <Knob label="Type Scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <Text size="xs" color="secondary" style={{ marginBottom: 4, display: 'block' }}>Base Size</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Slider min={0.75} max={1.5} step={0.0625} value={baseSize} onChange={e => handleBaseSize(parseFloat(e.target.value))} size="sm" style={{ flex: 1 }} />
              <Text as="code" size="xs" family="mono" style={{ width: 56, textAlign: 'right', flexShrink: 0, color: 'var(--lucent-accent-default)' }}>{baseSize}rem</Text>
            </div>
          </div>
          <div>
            <Text size="xs" color="secondary" style={{ marginBottom: 4, display: 'block' }}>Scale Ratio</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Slider min={1} max={1.618} step={0.001} value={typeRatio} onChange={e => handleTypeRatio(parseFloat(e.target.value))} size="sm" style={{ flex: 1 }} />
              <Text as="code" size="xs" family="mono" style={{ width: 56, textAlign: 'right', flexShrink: 0, color: 'var(--lucent-accent-default)' }}>{typeRatio.toFixed(3)}</Text>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {TYPE_SCALE_PRESETS.map(p => (
                <Button
                  key={p.label}
                  variant={Math.abs(typeRatio - p.ratio) < 0.005 ? 'secondary' : 'ghost'}
                  size="2xs"
                  onClick={() => handleTypeRatio(p.ratio)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Knob>

      {/* ── Text Colors ── */}
      <Knob label="Text Colors">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TEXT_COLOR_TOKENS.map(({ key, label }) => {
            const value = (state.overrides[key] ?? state.tokens[key]) as string;
            return (
              <ColorPicker
                key={key}
                label={label}
                value={value}
                onChange={hex => state.setOverride(key, hex)}
                size="sm"
                inline
              />
            );
          })}
        </div>
      </Knob>

      {/* ── Live Preview ── */}
      <Knob label="Preview">
        <TypographyPreview
          family={currentFamilyBase}
          baseSize={baseSize}
          ratio={typeRatio}
          textPrimary={(state.overrides.textPrimary ?? state.tokens.textPrimary) as string}
          textSecondary={(state.overrides.textSecondary ?? state.tokens.textSecondary) as string}
          bgBase={(state.overrides.bgBase ?? state.tokens.bgBase) as string}
        />
      </Knob>
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────

const TEXT_COLOR_TOKENS: { key: keyof LucentTokens; label: string }[] = [
  { key: 'textPrimary', label: 'Primary' },
  { key: 'textSecondary', label: 'Secondary' },
  { key: 'textDisabled', label: 'Disabled' },
  { key: 'textInverse', label: 'Inverse' },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function Knob({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--lucent-surface)',
      borderRadius: 'var(--lucent-radius-lg)',
      padding: '10px 12px',
      border: '1px solid var(--lucent-border-default)',
    }}>
      <Text size="xs" weight="semibold" style={{ marginBottom: 10, display: 'block' }}>
        {label}
      </Text>
      {children}
    </div>
  );
}

interface TypographyPreviewProps {
  family: string;
  baseSize: number;
  ratio: number;
  textPrimary: string;
  textSecondary: string;
  bgBase: string;
}

function TypographyPreview({ family, baseSize, ratio, textPrimary, textSecondary, bgBase }: TypographyPreviewProps) {
  const h1Size = baseSize * Math.pow(ratio, 4);
  const h2Size = baseSize * Math.pow(ratio, 2);
  const bodySize = baseSize;
  const smallSize = baseSize * Math.pow(ratio, -1);

  return (
    <div style={{
      background: bgBase,
      borderRadius: 6,
      padding: '14px 12px',
      fontFamily: family,
      border: '1px solid var(--lucent-border-default)',
    }}>
      <div style={{
        fontSize: `${h1Size}rem`,
        fontWeight: 700,
        color: textPrimary,
        lineHeight: 1.2,
        marginBottom: 6,
      }}>
        Heading
      </div>
      <div style={{
        fontSize: `${h2Size}rem`,
        fontWeight: 600,
        color: textPrimary,
        lineHeight: 1.3,
        marginBottom: 8,
      }}>
        Subheading text
      </div>
      <div style={{
        fontSize: `${bodySize}rem`,
        color: textPrimary,
        lineHeight: 1.5,
        marginBottom: 6,
      }}>
        Body text looks like this. It should be comfortable to read at any size with good line height and spacing.
      </div>
      <div style={{
        fontSize: `${smallSize}rem`,
        color: textSecondary,
        lineHeight: 1.5,
      }}>
        Secondary caption — smaller, muted for supplemental information.
      </div>
    </div>
  );
}

