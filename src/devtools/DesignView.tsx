import { useState, useCallback } from 'react';
import type { Theme } from '../tokens/types.js';
import type { TokenOverrideState } from './useTokenOverrides.js';
import {
  computeTypeScale,
  computeDensity,
  computeRoundness,
  computeShadows,
  deriveAccentTokens,
  deriveBgTokens,
  deriveBorderTokens,
  deriveSurfaceTokens,
  SHADOW_STYLE_OPTIONS,
  type ShadowStyle,
} from './designKnobs.js';
import { Text } from '../components/atoms/Text/index.js';
import { Button } from '../components/atoms/Button/index.js';
import { Slider } from '../components/atoms/Slider/index.js';
import { ColorPicker, type ColorPresetGroup } from '../components/atoms/ColorPicker/index.js';
import { loadFont } from './loadFont.js';

// ── Design Presets ──────────────────────────────────────────────────────────

interface DesignPresetDef {
  name: string;
  accent: string;
  roundness: number;     // 0 = sharp, 0.5 = rounded, 1 = pill
  density: number;       // multiplier (0.8 = compact, 1 = default, 1.25 = spacious)
  shadow: ShadowStyle;
  typeBase: number;      // rem
  typeRatio: number;
  fontFamily: string;
}

const DM_SANS = '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const INTER = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const GEIST = '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const JETBRAINS = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace';
const SPACE_GROTESK = '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif';
const SYSTEM_UI = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const OUTFIT = '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
const SORA = '"Sora", -apple-system, BlinkMacSystemFont, sans-serif';
const PLUS_JAKARTA = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';


const DESIGN_PRESETS: DesignPresetDef[] = [
  // ── Foundations ──
  { name: 'Default',      accent: '#111827', roundness: 0.5,    density: 1,    shadow: 'default',     typeBase: 1,        typeRatio: 1.125, fontFamily: DM_SANS },
  { name: 'Modern',       accent: '#6366f1', roundness: 0.5,    density: 1,    shadow: 'subtle',      typeBase: 1,        typeRatio: 1.2,   fontFamily: INTER },
  // ── Design Personalities ──
  { name: 'Liquid Glass', accent: '#0ea5e9', roundness: 1,      density: 0.9,  shadow: 'liquidGlass', typeBase: 1.0625,   typeRatio: 1.2,   fontFamily: SYSTEM_UI },
  { name: 'Bento',        accent: '#0d9488', roundness: 0.75,   density: 1,    shadow: 'natural',     typeBase: 0.9375,   typeRatio: 1.2,   fontFamily: GEIST },
  { name: 'Brutalist',    accent: '#ef4444', roundness: 0,      density: 0.8,  shadow: 'brutalist',   typeBase: 1.125,    typeRatio: 1.25,  fontFamily: SPACE_GROTESK },
  { name: 'Terminal',     accent: '#10b981', roundness: 0,      density: 0.8,  shadow: 'glow',        typeBase: 0.9375,   typeRatio: 1.125, fontFamily: JETBRAINS },
  { name: 'Soft UI',      accent: '#8b5cf6', roundness: 1,      density: 1.25, shadow: 'neumorphic',  typeBase: 1,        typeRatio: 1.2,   fontFamily: OUTFIT },
  { name: 'Bloom',        accent: '#e879f9', roundness: 0.875,  density: 1.25, shadow: 'glow',        typeBase: 1.0625,   typeRatio: 1.25,  fontFamily: SORA },
  { name: 'Minimal',      accent: '#475569', roundness: 0.25,   density: 1,    shadow: 'flat',        typeBase: 1,        typeRatio: 1.125, fontFamily: PLUS_JAKARTA },
  { name: 'Enterprise',   accent: '#475569', roundness: 0,      density: 0.75, shadow: 'flat',        typeBase: 0.9375,   typeRatio: 1.125, fontFamily: SYSTEM_UI },
];
// ── Color Presets ───────────────────────────────────────────────────────────

const ACCENT_PRESETS: ColorPresetGroup[] = [
  {
    label: 'Brand',
    colors: ['#111827', '#e9c96b', '#6366f1', '#8b5cf6', '#10b981', '#0d9488', '#f43f5e', '#e8624a', '#d97706', '#0ea5e9', '#475569', '#5f8c6e'],
  },
  {
    label: 'Vibrant',
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b'],
  },
];

const BG_PRESETS: ColorPresetGroup[] = [
  {
    label: 'Light',
    colors: ['#ffffff', '#fafafa', '#f9fafb', '#f5f5f4', '#fef7ee', '#faf5ff', '#f0f9ff', '#f0fdf4', '#fefce8', '#fff1f2'],
  },
  {
    label: 'Dark',
    colors: ['#09090b', '#0a0a0a', '#0c0c0e', '#111827', '#18181b', '#1c1917', '#1a1a2e', '#0f172a', '#171717', '#0d1117'],
  },
];

const SURFACE_PRESETS: ColorPresetGroup[] = [
  {
    label: 'Light',
    colors: ['#ffffff', '#fafafa', '#f9fafb', '#f5f5f5', '#f3f4f6', '#f1f5f9', '#fef3c7', '#fce7f3', '#dbeafe', '#dcfce7'],
  },
  {
    label: 'Dark',
    colors: ['#111111', '#141414', '#1a1a1a', '#1e1e2e', '#1f2937', '#1e293b', '#18181b', '#16213e', '#1c1c1c', '#0f172a'],
  },
];

const BORDER_PRESETS: ColorPresetGroup[] = [
  {
    label: 'Light',
    colors: ['#e5e7eb', '#d1d5db', '#e2e8f0', '#f3f4f6', '#d4d4d8', '#cbd5e1', '#e7e5e4', '#fde68a', '#c7d2fe', '#bbf7d0'],
  },
  {
    label: 'Dark',
    colors: ['#27272a', '#374151', '#334155', '#3f3f46', '#1e293b', '#404040', '#44403c', '#1c1f2a', '#2d2d3f', '#1f2937'],
  },
];

// ── DesignView ──────────────────────────────────────────────────────────────

interface DesignViewProps {
  state: TokenOverrideState;
  theme: Theme;
}

export function DesignView({ state, theme }: DesignViewProps) {
  // ── Density state ──
  const [densityFactor, setDensityFactor] = useState(1);

  // ── Roundness state ──
  const [roundness, setRoundness] = useState(0.5); // 0=sharp, 0.5=rounded, 1=pill

  // ── Shadow state ──
  const [shadowDepth, setShadowStyle] = useState<ShadowStyle>('default');

  // ── Active preset tracking ──
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // ── Accent color ──
  const currentAccent = (state.overrides.accentDefault ?? state.tokens.accentDefault) as string;

  // ── Batch apply helper ──
  const applyOverrides = useCallback((overrides: Record<string, string>) => {
    for (const [key, value] of Object.entries(overrides)) {
      state.setOverride(key as keyof typeof state.tokens, value);
    }
  }, [state]);

  // ── Apply a full preset ──
  const applyPreset = useCallback((preset: DesignPresetDef) => {
    state.resetAll();
    setActivePreset(preset.name);

    // Update local knob states
    setDensityFactor(preset.density);
    setRoundness(preset.roundness);
    setShadowStyle(preset.shadow);

    // Batch-apply all token overrides in a single pass
    const allOverrides: Record<string, string> = {
      ...deriveAccentTokens(preset.accent, theme) as Record<string, string>,
      ...computeTypeScale(preset.typeBase, preset.typeRatio) as Record<string, string>,
      ...computeDensity(preset.density) as Record<string, string>,
      ...computeRoundness(preset.roundness) as Record<string, string>,
      ...computeShadows(preset.shadow, theme) as Record<string, string>,
      fontFamilyBase: preset.fontFamily,
    };

    loadFont(preset.fontFamily);

    // Use requestAnimationFrame to apply after reset has cleared vars
    requestAnimationFrame(() => {
      for (const [key, value] of Object.entries(allOverrides)) {
        state.setOverride(key as keyof typeof state.tokens, value);
      }
    });
  }, [state, theme]);

  // ── Handlers (clear active preset on manual tweak) ──
  const handleDensity = (value: number) => {
    clearPreset(); setDensityFactor(value);
    applyOverrides(computeDensity(value) as Record<string, string>);
  };

  const handleRoundness = (value: number) => {
    clearPreset(); setRoundness(value);
    applyOverrides(computeRoundness(value) as Record<string, string>);
  };

  const handleShadow = (depth: ShadowStyle) => {
    clearPreset(); setShadowStyle(depth);
    applyOverrides(computeShadows(depth, theme) as Record<string, string>);
  };

  const handleAccent = (color: string) => {
    clearPreset();
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      applyOverrides(deriveAccentTokens(color, theme) as Record<string, string>);
    } else {
      state.setOverride('accentDefault', color);
    }
  };

  const handleBg = (color: string) => {
    clearPreset();
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      applyOverrides(deriveBgTokens(color, theme) as Record<string, string>);
    } else {
      state.setOverride('bgBase', color);
    }
  };

  const handleSurface = (color: string) => {
    clearPreset();
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      applyOverrides(deriveSurfaceTokens(color, theme) as Record<string, string>);
    } else {
      state.setOverride('surface', color);
    }
  };

  const handleBorder = (color: string) => {
    clearPreset();
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      applyOverrides(deriveBorderTokens(color, theme) as Record<string, string>);
    } else {
      state.setOverride('borderDefault', color);
    }
  };

  // ── Current values ──
  const currentBg = (state.overrides.bgBase ?? state.tokens.bgBase) as string;
  const currentSurface = (state.overrides.surface ?? state.tokens.surface) as string;
  const currentBorder = (state.overrides.borderDefault ?? state.tokens.borderDefault) as string;

  // ── Roundness label ──
  const roundnessLabel = roundness < 0.2
    ? 'Sharp' : roundness < 0.4
    ? 'Subtle' : roundness < 0.6
    ? 'Rounded' : roundness < 0.8
    ? 'Soft' : 'Pill';

  // ── Density label ──
  const densityLabel = densityFactor < 0.85
    ? 'Compact' : densityFactor < 0.95
    ? 'Snug' : densityFactor < 1.05
    ? 'Default' : densityFactor < 1.15
    ? 'Relaxed' : 'Spacious';

  // Clear active preset when any individual knob is tweaked
  const clearPreset = () => setActivePreset(null);

  return (
    <div style={{ padding: '4px 12px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Presets ── */}
      <Knob label="Presets">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
        }}>
          {DESIGN_PRESETS.map(preset => (
            <Button
              key={preset.name}
              variant={activePreset === preset.name ? 'secondary' : 'ghost'}
              onClick={() => applyPreset(preset)}
              style={{
                padding: '8px 4px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                height: 'auto',
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: preset.roundness < 0.3 ? 3 : preset.roundness < 0.7 ? 6 : 12,
                background: preset.accent,
                border: '1px solid rgba(255,255,255,0.1)',
              }} />
              <Text size="xs" {...(activePreset !== preset.name && { color: 'secondary' })} weight={activePreset === preset.name ? 'semibold' : 'regular'} style={{ fontSize: 9, whiteSpace: 'nowrap' }}>
                {preset.name}
              </Text>
            </Button>
          ))}
        </div>
      </Knob>

      {/* ── Colors ── */}
      <Knob label="Colors">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ColorPicker value={currentAccent} onChange={handleAccent} size="sm" presetGroups={ACCENT_PRESETS} />
            <Text size="xs" color="secondary" style={{ flex: 1 }}>Accent</Text>
            <Text as="code" size="xs" family="mono" style={{ color: 'var(--lucent-accent-default)' }}>{currentAccent}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ColorPicker value={currentBg} onChange={handleBg} size="sm" presetGroups={BG_PRESETS} />
            <Text size="xs" color="secondary" style={{ flex: 1 }}>Background</Text>
            <Text as="code" size="xs" family="mono" style={{ color: 'var(--lucent-accent-default)' }}>{currentBg}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ColorPicker value={currentSurface} onChange={handleSurface} size="sm" presetGroups={SURFACE_PRESETS} />
            <Text size="xs" color="secondary" style={{ flex: 1 }}>Surface</Text>
            <Text as="code" size="xs" family="mono" style={{ color: 'var(--lucent-accent-default)' }}>{currentSurface}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ColorPicker value={currentBorder} onChange={handleBorder} size="sm" presetGroups={BORDER_PRESETS} />
            <Text size="xs" color="secondary" style={{ flex: 1 }}>Border</Text>
            <Text as="code" size="xs" family="mono" style={{ color: 'var(--lucent-accent-default)' }}>{currentBorder}</Text>
          </div>
        </div>
      </Knob>

      {/* ── Density ── */}
      <Knob label="Density">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text size="xs" family="mono" color="secondary" style={{ width: 54, flexShrink: 0 }}>Compact</Text>
          <Slider min={0.7} max={1.35} step={0.01} value={densityFactor} onChange={e => handleDensity(parseFloat(e.target.value))} size="sm" style={{ flex: 1 }} />
          <Text size="xs" family="mono" color="secondary" style={{ width: 54, textAlign: 'right', flexShrink: 0 }}>Spacious</Text>
        </div>
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <Text size="xs" style={{ color: 'var(--lucent-accent-default)' }}>{densityLabel} ({densityFactor.toFixed(2)}x)</Text>
        </div>
      </Knob>

      {/* ── Roundness ── */}
      <Knob label="Roundness">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text size="xs" family="mono" color="secondary" style={{ width: 36, flexShrink: 0 }}>Sharp</Text>
          <Slider min={0} max={1} step={0.01} value={roundness} onChange={e => handleRoundness(parseFloat(e.target.value))} size="sm" style={{ flex: 1 }} />
          <Text size="xs" family="mono" color="secondary" style={{ width: 24, textAlign: 'right', flexShrink: 0 }}>Pill</Text>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'center' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(r => (
            <div key={r} style={{
              width: 32, height: 32,
              background: 'var(--lucent-surface-secondary)',
              border: `1.5px solid ${Math.abs(roundness - r) < 0.05 ? 'var(--lucent-accent-default)' : 'var(--lucent-border-default)'}`,
              borderRadius: r === 0 ? 2 : r < 0.5 ? 4 : r < 0.8 ? 8 : 16,
              cursor: 'pointer',
              transition: 'border-color 150ms',
            }} onClick={() => handleRoundness(r)} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <Text size="xs" style={{ color: 'var(--lucent-accent-default)' }}>{roundnessLabel}</Text>
        </div>
      </Knob>

      {/* ── Shadows ── */}
      <Knob label="Shadow Style">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 4,
        }}>
          {SHADOW_STYLE_OPTIONS.map(({ value, label }) => (
            <Button
              key={value}
              variant={shadowDepth === value ? 'secondary' : 'ghost'}
              size="2xs"
              onClick={() => handleShadow(value)}
              style={{ justifyContent: 'center' }}
            >
              {label}
            </Button>
          ))}
        </div>
      </Knob>

    </div>
  );
}

// ── Shared components ───────────────────────────────────────────────────────

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



