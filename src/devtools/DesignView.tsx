import { useState, useCallback, useEffect, useRef } from 'react';
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

interface PresetColors {
  accent: string;
  navigation: string;
  bg: string;
  surface: string;
  border: string;
}

interface DesignPresetDef {
  name: string;
  roundness: number;     // 0 = sharp, 0.5 = rounded, 1 = pill
  density: number;       // multiplier (0.8 = compact, 1 = default, 1.25 = spacious)
  shadow: ShadowStyle;
  typeBase: number;      // rem
  typeRatio: number;
  fontFamily: string;
  colors: { light: PresetColors; dark: PresetColors };
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
  { name: 'Default',      roundness: 0.5,    density: 1,    shadow: 'default',     typeBase: 1,        typeRatio: 1.125, fontFamily: DM_SANS,
    colors: { light: { accent: '#111827', navigation: '#f4f6f8', bg: '#ffffff', surface: '#ffffff', border: '#e5e7eb' }, dark: { accent: '#f9fafb', navigation: '#0e1015', bg: '#111318', surface: '#191c22', border: '#252830' } } },
  { name: 'Modern',       roundness: 0.75,   density: 0.99, shadow: 'liquidGlass', typeBase: 1,        typeRatio: 1.25,  fontFamily: INTER,
    colors: { light: { accent: '#978AE7', navigation: '#dbd8e9', bg: '#FFFFFF', surface: '#f7f7f7', border: '#e0e0e0' }, dark: { accent: '#b8aef0', navigation: '#110f1c', bg: '#131118', surface: '#1c1a24', border: '#2a2834' } } },
  // ── Design Personalities ──
  { name: 'Liquid Glass', roundness: 1,      density: 0.9,  shadow: 'liquidGlass', typeBase: 1.0625,   typeRatio: 1.2,   fontFamily: SYSTEM_UI,
    colors: { light: { accent: '#0c8fca', navigation: '#ebf1ff', bg: '#f1f4ff', surface: '#ffffff', border: '#d9e4ec' }, dark: { accent: '#38bdf8', navigation: '#0a0e16', bg: '#0e1420', surface: '#16202c', border: '#1e2c38' } } },
  { name: 'Bento',        roundness: 0.75,   density: 1,    shadow: 'natural',     typeBase: 0.9375,   typeRatio: 1.2,   fontFamily: GEIST,
    colors: { light: { accent: '#0d9488', navigation: '#f9fbfc', bg: '#eef2f5', surface: '#ffffff', border: '#d4e5e0' }, dark: { accent: '#2dd4bf', navigation: '#0c1210', bg: '#101a16', surface: '#182822', border: '#263e36' } } },
  { name: 'Brutalist',    roundness: 0,      density: 0.8,  shadow: 'brutalist',   typeBase: 1.125,    typeRatio: 1.25,  fontFamily: SPACE_GROTESK,
    colors: { light: { accent: '#ef4444', navigation: '#fff9f7', bg: '#f0ebe8', surface: '#ffffff', border: '#e9ddd8' }, dark: { accent: '#f87171', navigation: '#14100e', bg: '#1a1512', surface: '#26201c', border: '#3a302a' } } },
  { name: 'Terminal',     roundness: 0,      density: 0.8,  shadow: 'flat',        typeBase: 0.875,   typeRatio: 1.125, fontFamily: JETBRAINS,
    colors: { light: { accent: '#12d091', navigation: '#f8f8fa', bg: '#ffffff', surface: '#ffffff', border: '#dbe8df' }, dark: { accent: '#34d399', navigation: '#0e1012', bg: '#111318', surface: '#191c22', border: '#1e2e24' } } },
  { name: 'Soft UI',      roundness: 1,      density: 1.25, shadow: 'neumorphic',  typeBase: 1,        typeRatio: 1.2,   fontFamily: OUTFIT,
    colors: { light: { accent: '#8b5cf6', navigation: '#eee8fa', bg: '#f8f4ff', surface: '#ffffff', border: '#e2dce9' }, dark: { accent: '#a78bfa', navigation: '#120e1a', bg: '#141020', surface: '#1e1a2c', border: '#302a3e' } } },
  { name: 'Bloom',        roundness: 0.875,  density: 1.25, shadow: 'glow',        typeBase: 1.0625,   typeRatio: 1.25,  fontFamily: SORA,
    colors: { light: { accent: '#e879f9', navigation: '#f5e8f0', bg: '#fff4f9', surface: '#ffffff', border: '#ecdde1' }, dark: { accent: '#f0abfc', navigation: '#160e14', bg: '#1a1018', surface: '#261c24', border: '#3a2c34' } } },
  { name: 'Minimal',      roundness: 0.25,   density: 1,    shadow: 'flat',        typeBase: 1,        typeRatio: 1.125, fontFamily: PLUS_JAKARTA,
    colors: { light: { accent: '#475569', navigation: '#eceef2', bg: '#f7f8fa', surface: '#ffffff', border: '#dde1e6' }, dark: { accent: '#94a3b8', navigation: '#0e1016', bg: '#11141a', surface: '#191e26', border: '#262c36' } } },
  { name: 'Enterprise',   roundness: 0,      density: 0.75, shadow: 'flat',        typeBase: 0.9375,   typeRatio: 1.125, fontFamily: SYSTEM_UI,
    colors: { light: { accent: '#4182eb', navigation: '#ffffff', bg: '#f6f8fa', surface: '#ffffff', border: '#dde1e6' }, dark: { accent: '#6da6f0', navigation: '#0e1015', bg: '#111418', surface: '#181e26', border: '#262c36' } } },
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

const NAV_PRESETS: ColorPresetGroup[] = [
  {
    label: 'Light',
    colors: ['#ffffff', '#fdfcff', '#fbfdff', '#fbfefc', '#fffcfb', '#fafbfd', '#fffbfd', '#fdfbff', '#fafafa', '#f9fafb'],
  },
  {
    label: 'Dark',
    colors: ['#08090e', '#090814', '#060a12', '#060d0b', '#100806', '#060e08', '#0c0816', '#10060c', '#080a0e', '#0a0a0a'],
  },
];

const BG_PRESETS: ColorPresetGroup[] = [
  {
    label: 'Light',
    colors: ['#f7f8f9', '#f9fafb', '#f8f7fc', '#f5f9fc', '#f5faf8', '#faf6f5', '#f5faf7', '#f8f6fc', '#f4f5f7', '#fafafa'],
  },
  {
    label: 'Dark',
    colors: ['#0c0d12', '#0d0c18', '#0a0e16', '#0a110f', '#140c0a', '#0a120c', '#100c1a', '#140a10', '#0c0e12', '#0d1117'],
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
    const themeColors = preset.colors[theme];
    const allOverrides: Record<string, string> = {
      navigation: themeColors.navigation,
      ...deriveAccentTokens(themeColors.accent, theme) as Record<string, string>,
      ...deriveBgTokens(themeColors.bg, theme) as Record<string, string>,
      ...deriveSurfaceTokens(themeColors.surface, theme) as Record<string, string>,
      ...deriveBorderTokens(themeColors.border, theme) as Record<string, string>,
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

  // ── Re-apply theme-sensitive tokens when theme toggles ──
  const prevThemeRef = useRef(theme);
  useEffect(() => {
    if (prevThemeRef.current === theme) return;
    prevThemeRef.current = theme;

    // Clear stale overrides so the new theme's base colors take effect
    state.resetAll();

    if (!activePreset) return;

    const preset = DESIGN_PRESETS.find(p => p.name === activePreset);
    if (!preset) return;

    const themeColors = preset.colors[theme];
    const themeOverrides: Record<string, string> = {
      navigation: themeColors.navigation,
      ...deriveAccentTokens(themeColors.accent, theme) as Record<string, string>,
      ...deriveBgTokens(themeColors.bg, theme) as Record<string, string>,
      ...deriveSurfaceTokens(themeColors.surface, theme) as Record<string, string>,
      ...deriveBorderTokens(themeColors.border, theme) as Record<string, string>,
      ...computeShadows(shadowDepth, theme) as Record<string, string>,
    };

    for (const [key, value] of Object.entries(themeOverrides)) {
      state.setOverride(key as keyof typeof state.tokens, value);
    }
  }, [theme, activePreset, shadowDepth, state]);

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

  const handleNavigation = (color: string) => {
    clearPreset();
    state.setOverride('navigation', color);
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
  const currentNavigation = (state.overrides.navigation ?? state.tokens.navigation) as string;
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
                background: preset.colors[theme].accent,
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
            <ColorPicker value={currentNavigation} onChange={handleNavigation} size="sm" presetGroups={NAV_PRESETS} />
            <Text size="xs" color="secondary" style={{ flex: 1 }}>Navigation</Text>
            <Text as="code" size="xs" family="mono" style={{ color: 'var(--lucent-accent-default)' }}>{currentNavigation}</Text>
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



