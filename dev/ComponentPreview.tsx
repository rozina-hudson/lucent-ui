import { useState, useEffect, useRef, useMemo } from 'react';
import { LucentProvider, useLucent, createTheme } from '../src/index.js';
import { hexToHsl, hslToHex } from '../src/tokens/color.js';
import type { PaletteName, ShapeName, ShadowName } from '../src/tokens/presets/types.js';
import type { ColorPalette } from '../src/tokens/presets/types.js';
import {
  defaultPalette, brandPalette, indigoPalette, violetPalette, emeraldPalette, tealPalette,
  rosePalette, coralPalette, amberPalette, oceanPalette, slatePalette, sagePalette,
  sharpShape, roundedShape, pillShape,
  flatShadow, subtleShadow, elevatedShadow,
} from '../src/tokens/presets/index.js';
import { Button } from '../src/components/atoms/Button/index.js';
import { Input } from '../src/components/atoms/Input/index.js';
import { Textarea } from '../src/components/atoms/Textarea/index.js';
import { Badge } from '../src/components/atoms/Badge/index.js';
import { Chip } from '../src/components/atoms/Chip/index.js';
import { Avatar } from '../src/components/atoms/Avatar/index.js';
import { Spinner } from '../src/components/atoms/Spinner/index.js';
import { Divider } from '../src/components/atoms/Divider/index.js';
import { Checkbox } from '../src/components/atoms/Checkbox/index.js';
import { Radio, RadioGroup } from '../src/components/atoms/Radio/index.js';
import { Toggle } from '../src/components/atoms/Toggle/index.js';
import { Select } from '../src/components/atoms/Select/index.js';
import { Tag } from '../src/components/atoms/Tag/index.js';
import { Tooltip } from '../src/components/atoms/Tooltip/index.js';
import { Icon } from '../src/components/atoms/Icon/index.js';
import { Text } from '../src/components/atoms/Text/index.js';
import { FormField } from '../src/components/molecules/FormField/index.js';
import { SearchInput } from '../src/components/molecules/SearchInput/index.js';
import { Card, CardBleed } from '../src/components/molecules/Card/index.js';
import { Alert } from '../src/components/molecules/Alert/index.js';
import { EmptyState } from '../src/components/molecules/EmptyState/index.js';
import { Skeleton } from '../src/components/molecules/Skeleton/index.js';
import { Breadcrumb } from '../src/components/molecules/Breadcrumb/index.js';
import { Tabs } from '../src/components/molecules/Tabs/index.js';
import { Collapsible } from '../src/components/molecules/Collapsible/index.js';
import { NavLink } from '../src/components/atoms/NavLink/index.js';
import { Slider } from '../src/components/atoms/Slider/index.js';
import { CodeBlock } from '../src/components/atoms/CodeBlock/index.js';
import { Table } from '../src/components/atoms/Table/index.js';
import { PageLayout } from '../src/components/molecules/PageLayout/index.js';
import { TokenPreview } from './TokenPreview.js';
import { SelectPlayground } from './SelectPlayground.js';
import { DataTable } from '../src/components/molecules/DataTable/index.js';
import { CommandPalette } from '../src/components/molecules/CommandPalette/index.js';
import { MultiSelect } from '../src/components/molecules/MultiSelect/index.js';
import { DatePicker } from '../src/components/molecules/DatePicker/index.js';
import { DateRangePicker } from '../src/components/molecules/DateRangePicker/index.js';
import { FileUpload } from '../src/components/molecules/FileUpload/index.js';
import { Timeline } from '../src/components/molecules/Timeline/index.js';
import { ColorPicker, type ColorPresetGroup } from '../src/components/atoms/ColorPicker/index.js';
import { ColorSwatch } from '../src/components/atoms/ColorSwatch/index.js';
import { SegmentedControl } from '../src/components/atoms/SegmentedControl/index.js';
import type { LucentTokens, Theme, ThemeAnchors, UploadFile } from '../src/index.js';

// ─── Palette map ────────────────────────────────────────────────────────────

const PALETTE_MAP: Record<PaletteName, ColorPalette> = {
  default: defaultPalette, brand: brandPalette, indigo: indigoPalette,
  violet: violetPalette, emerald: emeraldPalette, teal: tealPalette,
  rose: rosePalette, coral: coralPalette, amber: amberPalette,
  ocean: oceanPalette, slate: slatePalette, sage: sagePalette,
};

import type { ShapePreset, ShadowPreset } from '../src/tokens/presets/types.js';
const SHAPE_MAP: Record<ShapeName, ShapePreset> = { sharp: sharpShape, rounded: roundedShape, pill: pillShape };
const SHADOW_MAP: Record<ShadowName, ShadowPreset> = { flat: flatShadow, subtle: subtleShadow, elevated: elevatedShadow };

function ColorPickerDemo({ presetGroups }: { presetGroups?: ColorPresetGroup[] }) {
  const [color, setColor] = useState('#3b82f6');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-4)' }}>
      <ColorPicker value={color} onChange={setColor} label="Color" {...(presetGroups !== undefined && { presetGroups })} />
      <span style={{ fontSize: 'var(--lucent-font-size-sm)', fontFamily: 'var(--lucent-font-family-mono)', color: 'var(--lucent-text-secondary)' }}>
        {color}
      </span>
    </div>
  );
}

function NavIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function SmallIcon({ d }: { d: string }) {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const PALETTE_OPTIONS: { value: PaletteName; label: string; swatch: string }[] = [
  { value: 'default', label: 'Default', swatch: '#111827' },
  { value: 'brand', label: 'Brand', swatch: '#e9c96b' },
  { value: 'indigo', label: 'Indigo', swatch: '#6366f1' },
  { value: 'violet', label: 'Violet', swatch: '#8b5cf6' },
  { value: 'emerald', label: 'Emerald', swatch: '#10b981' },
  { value: 'teal', label: 'Teal', swatch: '#0d9488' },
  { value: 'rose', label: 'Rose', swatch: '#f43f5e' },
  { value: 'coral', label: 'Coral', swatch: '#e8624a' },
  { value: 'amber', label: 'Amber', swatch: '#d97706' },
  { value: 'ocean', label: 'Ocean', swatch: '#0ea5e9' },
  { value: 'slate', label: 'Slate', swatch: '#475569' },
  { value: 'sage', label: 'Sage', swatch: '#5f8c6e' },
];

const SHAPE_OPTIONS: ShapeName[] = ['sharp', 'rounded', 'pill'];
const SHADOW_OPTIONS: ShadowName[] = ['flat', 'subtle', 'elevated'];

type DensityPreset = 'compact' | 'default' | 'comfortable';
type FontScalePreset = 'small' | 'default' | 'large';
const DENSITY_PERCENT: Record<DensityPreset, number> = { compact: 85, default: 100, comfortable: 115 };
const FONT_SCALE_PERCENT: Record<FontScalePreset, number> = { small: 90, default: 100, large: 110 };
const DENSITY_OPTIONS: { value: DensityPreset; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
];
const FONT_SCALE_OPTIONS: { value: FontScalePreset; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
];

const QUICK_PRESETS: { name: string; palette: PaletteName; shape: ShapeName; shadow: ShadowName; density: DensityPreset; fontScale: FontScalePreset }[] = [
  { name: 'Modern', palette: 'indigo', shape: 'rounded', shadow: 'subtle', density: 'default', fontScale: 'default' },
  { name: 'Enterprise', palette: 'default', shape: 'sharp', shadow: 'flat', density: 'compact', fontScale: 'small' },
  { name: 'Playful', palette: 'rose', shape: 'pill', shadow: 'elevated', density: 'comfortable', fontScale: 'large' },
];

// Anchor derivation chain — which live tokens derive from each anchor
const ANCHOR_DERIVATIONS: { anchor: keyof ThemeAnchors; label: string; derived: { key: keyof LucentTokens; label: string }[] }[] = [
  { anchor: 'bgBase', label: 'Background', derived: [
    { key: 'bgSubtle', label: 'subtle' }, { key: 'surface', label: 'surface' }, { key: 'surfaceTint', label: 'tint' },
  ]},
  { anchor: 'borderDefault', label: 'Border', derived: [
    { key: 'borderSubtle', label: 'subtle' }, { key: 'borderStrong', label: 'strong' },
  ]},
  { anchor: 'textPrimary', label: 'Text', derived: [
    { key: 'textSecondary', label: 'secondary' }, { key: 'textDisabled', label: 'disabled' },
  ]},
  { anchor: 'accentDefault', label: 'Accent', derived: [
    { key: 'accentHover', label: 'hover' }, { key: 'accentActive', label: 'active' },
    { key: 'accentSubtle', label: 'subtle' }, { key: 'accentBorder', label: 'border' },
    { key: 'textOnAccent', label: 'text' },
  ]},
];

const STATUS_ANCHORS: { anchor: keyof ThemeAnchors; label: string; derived: { key: keyof LucentTokens; label: string }[] }[] = [
  { anchor: 'successDefault', label: 'Success', derived: [{ key: 'successSubtle', label: 'subtle' }, { key: 'successText', label: 'text' }] },
  { anchor: 'warningDefault', label: 'Warning', derived: [{ key: 'warningSubtle', label: 'subtle' }, { key: 'warningText', label: 'text' }] },
  { anchor: 'dangerDefault', label: 'Danger', derived: [{ key: 'dangerSubtle', label: 'subtle' }, { key: 'dangerText', label: 'text' }] },
  { anchor: 'infoDefault', label: 'Info', derived: [{ key: 'infoSubtle', label: 'subtle' }, { key: 'infoText', label: 'text' }] },
];

export type DevTab = 'components' | 'tokens' | 'playground';

export function ComponentPreview({ tab, setTab }: { tab: DevTab; setTab: (t: DevTab) => void }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [palette, setPalette] = useState<PaletteName | null>('default');
  const [anchors, setAnchors] = useState<ThemeAnchors>(() => ({ ...PALETTE_MAP.default.light, textPrimary: '#111111' }));
  const [shape, setShape] = useState<ShapeName>('rounded');
  const [shadow, setShadow] = useState<ShadowName>('subtle');
  const [scaleOverrides, setScaleOverrides] = useState<Partial<LucentTokens>>({});

  // Derive tinted bgBase and borderDefault from an accent color
  const deriveFromAccent = (accent: string, t: Theme): { bgBase: string; borderDefault: string } => {
    const [h, s] = hexToHsl(accent);
    if (t === 'light') {
      return {
        bgBase: hslToHex(h, Math.min(s, 0.3), 0.99),
        borderDefault: hslToHex(h, Math.min(s, 0.15), 0.88),
      };
    }
    return {
      bgBase: hslToHex(h, Math.min(s, 0.2), 0.07),
      borderDefault: hslToHex(h, Math.min(s, 0.12), 0.18),
    };
  };

  const handleAnchorChange = (key: keyof ThemeAnchors, value: string) => {
    setPalette(null); // clear palette — colors are now custom
    if (key === 'accentDefault') {
      // Cascade: accent drives bgBase + borderDefault; keep text neutral; drop surface to re-derive
      const derived = deriveFromAccent(value, theme);
      setAnchors(prev => {
        const next = {
          ...prev,
          accentDefault: value,
          bgBase: derived.bgBase,
          borderDefault: derived.borderDefault,
          textPrimary: theme === 'light' ? '#111111' : '#eeeeee',
        };
        delete next.surface;
        return next;
      });
    } else if (key === 'bgBase') {
      // When bgBase changes manually, drop explicit surface so it re-derives
      setAnchors(prev => {
        const next = { ...prev, bgBase: value };
        delete next.surface;
        return next;
      });
    } else {
      setAnchors(prev => ({ ...prev, [key]: value }));
    }
  };

  const applyPalette = (p: PaletteName) => {
    setPalette(p);
    const paletteAnchors = PALETTE_MAP[p][theme];
    setAnchors({
      ...paletteAnchors,
      // textPrimary is optional in ThemeAnchors; ensure it's always set
      textPrimary: paletteAnchors.textPrimary ?? (theme === 'light' ? '#111111' : '#eeeeee'),
    });
  };

  const applyShape = (s: ShapeName) => {
    setShape(s);
    // Clear any radius scale overrides so the preset takes effect
    setScaleOverrides(prev => {
      const next = { ...prev };
      delete next.radiusSm; delete next.radiusMd; delete next.radiusLg;
      delete next.radiusXl; delete next.radiusFull;
      return next;
    });
  };

  // Target scale presets — set by quick presets, applied by Inner
  const [targetDensity, setTargetDensity] = useState<DensityPreset>('default');
  const [targetFontScale, setTargetFontScale] = useState<FontScalePreset>('default');

  const applyQuickPreset = (qp: typeof QUICK_PRESETS[number]) => {
    applyPalette(qp.palette);
    applyShape(qp.shape);
    setShadow(qp.shadow);
    setTargetDensity(qp.density);
    setTargetFontScale(qp.fontScale);
    setScaleOverrides({});
  };

  const handleScaleOverride = (key: keyof LucentTokens, value: string) => {
    setScaleOverrides(prev => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setPalette('default');
    const pa = PALETTE_MAP.default[theme];
    setAnchors({ ...pa, textPrimary: pa.textPrimary ?? (theme === 'light' ? '#111111' : '#eeeeee') });
    setShape('rounded');
    setShadow('subtle');
    setTargetDensity('default');
    setTargetFontScale('default');
    setScaleOverrides({});
  };

  // Compute final tokens: anchor-derived colors + shape/shadow presets + scale overrides
  const finalTokens = useMemo(() => {
    const colorTokens = createTheme(anchors, theme);
    const shapeTokens = SHAPE_MAP[shape].tokens;
    const shadowTokens = SHADOW_MAP[shadow][theme];
    return { ...colorTokens, ...shapeTokens, ...shadowTokens, ...scaleOverrides };
  }, [anchors, theme, shape, shadow, scaleOverrides]);

  // Sync anchors when theme toggles (use the palette's light/dark anchors, or re-derive custom)
  const prevThemeRef = useRef(theme);
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      if (palette) {
        const pa = PALETTE_MAP[palette][theme];
        setAnchors({ ...pa, textPrimary: pa.textPrimary ?? (theme === 'light' ? '#111111' : '#eeeeee') });
      } else {
        // Custom colors — re-derive bg/border from current accent for new theme
        setAnchors(prev => {
          const derived = deriveFromAccent(prev.accentDefault, theme);
          return { ...prev, ...derived, textPrimary: theme === 'light' ? '#111111' : '#eeeeee' };
        });
      }
    }
  }, [theme, palette]);

  return (
    <LucentProvider theme={theme} tokens={finalTokens}>
      <Inner
        tab={tab}
        setTab={setTab}
        theme={theme}
        palette={palette}
        anchors={anchors}
        shape={shape}
        shadow={shadow}
        scaleOverrides={scaleOverrides}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onChangePalette={applyPalette}
        onChangeAnchor={handleAnchorChange}
        onChangeShape={applyShape}
        onChangeShadow={setShadow}
        onScaleOverride={handleScaleOverride}
        onQuickPreset={applyQuickPreset}
        onReset={resetAll}
        targetDensity={targetDensity}
        targetFontScale={targetFontScale}
      />
    </LucentProvider>
  );
}

function Inner({
  tab, setTab, theme, palette, anchors, shape, shadow, scaleOverrides,
  onToggleTheme, onChangePalette, onChangeAnchor, onChangeShape, onChangeShadow,
  onScaleOverride, onQuickPreset, onReset, targetDensity, targetFontScale,
}: {
  tab: DevTab;
  setTab: (t: DevTab) => void;
  theme: Theme;
  palette: PaletteName | null;
  anchors: ThemeAnchors;
  shape: ShapeName;
  shadow: ShadowName;
  scaleOverrides: Partial<LucentTokens>;
  onToggleTheme: () => void;
  onChangePalette: (p: PaletteName) => void;
  onChangeAnchor: (key: keyof ThemeAnchors, value: string) => void;
  onChangeShape: (s: ShapeName) => void;
  onChangeShadow: (s: ShadowName) => void;
  onScaleOverride: (key: keyof LucentTokens, value: string) => void;
  onQuickPreset: (qp: typeof QUICK_PRESETS[number]) => void;
  onReset: () => void;
  targetDensity: DensityPreset;
  targetFontScale: FontScalePreset;
}) {
  const { tokens } = useLucent();
  const [componentFilter, setComponentFilter] = useState('');

  const allSections = [
    'Text', 'Input', 'Textarea', 'FormField', 'SearchInput', 'Card', 'Alert',
    'EmptyState', 'Skeleton', 'Checkbox', 'Radio', 'Toggle', 'Slider', 'CodeBlock',
    'Table', 'ColorSwatch', 'ColorPicker', 'SegmentedControl', 'Select', 'Chip',
    'Tooltip', 'Icon', 'Button', 'Avatar', 'Spinner', 'Divider',
    'Breadcrumb', 'Tabs', 'Collapsible', 'NavLink', 'PageLayout', 'DataTable',
    'CommandPalette', 'MultiSelect', 'DatePicker', 'DateRangePicker', 'FileUpload', 'Timeline',
  ];

  const filterLower = componentFilter.toLowerCase();
  const showSection = (name: string) => !filterLower || name.toLowerCase().includes(filterLower);

  const [inputVal, setInputVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState('option1');
  const [radioSize, setRadioSize] = useState('m');
  const [toggled, setToggled] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);
  const [selectVal, setSelectVal] = useState('');
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Scale preset state
  const [density, setDensity] = useState<DensityPreset>('default');
  const [fontScale, setFontScale] = useState<FontScalePreset>('default');
  // Derive radius slider value from live token
  const radiusPx = (() => {
    const raw = tokens.radiusLg;
    if (raw.endsWith('px')) return parseInt(raw);
    if (raw.endsWith('rem')) return Math.round(parseFloat(raw) * 14); // 14px base
    return 8;
  })();
  const baseFontSizesRef = useRef<Record<string, string>>({});
  const baseSpaceRef = useRef<Record<string, string>>({});

  // Capture base font/space values once for scaling
  useEffect(() => {
    if (Object.keys(baseFontSizesRef.current).length === 0) {
      ['fontSizeXs','fontSizeSm','fontSizeMd','fontSizeLg','fontSizeXl','fontSize2xl','fontSize3xl'].forEach(k => {
        baseFontSizesRef.current[k] = tokens[k as keyof typeof tokens] as string;
      });
    }
    if (Object.keys(baseSpaceRef.current).length === 0) {
      Object.keys(tokens).filter(k => k.startsWith('space')).forEach(k => {
        baseSpaceRef.current[k] = tokens[k as keyof typeof tokens] as string;
      });
    }
  }, [tokens]);

  // Sync controls when quick preset sets target values
  useEffect(() => {
    if (targetFontScale !== fontScale) {
      setFontScale(targetFontScale);
      const scale = FONT_SCALE_PERCENT[targetFontScale] / 100;
      Object.entries(baseFontSizesRef.current).forEach(([k, v]) => {
        const num = parseFloat(v); const unit = v.replace(/[\d.]/g, '');
        onScaleOverride(k as keyof LucentTokens, `${num * scale}${unit}`);
      });
    }
    if (targetDensity !== density) {
      setDensity(targetDensity);
      const scale = DENSITY_PERCENT[targetDensity] / 100;
      Object.entries(baseSpaceRef.current).forEach(([k, v]) => {
        const num = parseFloat(v); const unit = v.replace(/[\d.]/g, '');
        onScaleOverride(k as keyof LucentTokens, `${num * scale}${unit}`);
      });
    }
  }, [targetFontScale, targetDensity]);

  // Handlers for density and font scale controls
  const handleDensityChange = (v: string) => {
    const d = v as DensityPreset;
    setDensity(d);
    const scale = DENSITY_PERCENT[d] / 100;
    Object.entries(baseSpaceRef.current).forEach(([k, val]) => {
      const num = parseFloat(val); const unit = val.replace(/[\d.]/g, '');
      onScaleOverride(k as keyof LucentTokens, `${num * scale}${unit}`);
    });
  };
  const handleFontScaleChange = (v: string) => {
    const f = v as FontScalePreset;
    setFontScale(f);
    const scale = FONT_SCALE_PERCENT[f] / 100;
    Object.entries(baseFontSizesRef.current).forEach(([k, val]) => {
      const num = parseFloat(val); const unit = val.replace(/[\d.]/g, '');
      onScaleOverride(k as keyof LucentTokens, `${num * scale}${unit}`);
    });
  };

  // CSS variable overrides for self-demonstrating controls
  const tokenToCssVar = (key: string) =>
    '--lucent-' + key.replace(/([A-Z])/g, m => `-${m.toLowerCase()}`).replace(/([a-z])(\d)/g, (_, a, b) => `${a}-${b}`);

  const densityWrapperStyle = useMemo((): React.CSSProperties => {
    const pct = DENSITY_PERCENT[density];
    if (pct === 100 || Object.keys(baseSpaceRef.current).length === 0) return {};
    const scale = pct / 100;
    const vars: Record<string, string> = {};
    Object.entries(baseSpaceRef.current).forEach(([k, v]) => {
      const num = parseFloat(v); const unit = v.replace(/[\d.]/g, '');
      vars[tokenToCssVar(k)] = `${num * scale}${unit}`;
    });
    return vars as React.CSSProperties;
  }, [density, tokens]);

  const fontScaleWrapperStyle = useMemo((): React.CSSProperties => {
    const pct = FONT_SCALE_PERCENT[fontScale];
    if (pct === 100 || Object.keys(baseFontSizesRef.current).length === 0) return {};
    const scale = pct / 100;
    const vars: Record<string, string> = {};
    Object.entries(baseFontSizesRef.current).forEach(([k, v]) => {
      const num = parseFloat(v); const unit = v.replace(/[\d.]/g, '');
      vars[tokenToCssVar(k)] = `${num * scale}${unit}`;
    });
    return vars as React.CSSProperties;
  }, [fontScale, tokens]);

  const allFruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Strawberry'];
  const searchResults = searchQuery.length > 0
    ? allFruits
        .filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((f, i) => ({ id: i, label: f }))
    : [];

  const navSidebar = (
    <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
      <div style={{ marginBottom: tokens.space2 }}>
        <input
          type="text"
          value={componentFilter}
          onChange={(e) => setComponentFilter(e.target.value)}
          placeholder="Filter…"
          style={{
            width: '100%',
            height: 30,
            padding: '0 8px',
            boxSizing: 'border-box',
            border: `1px solid ${tokens.borderDefault}`,
            borderRadius: tokens.radiusMd,
            background: tokens.surface,
            color: tokens.textPrimary,
            fontFamily: tokens.fontFamilyBase,
            fontSize: tokens.fontSizeXs,
            outline: 'none',
          }}
        />
      </div>
      {allSections.filter(s => showSection(s)).map(name => (
        <NavLink
          key={name}
          href={`#section-${name}`}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setComponentFilter(name);
          }}
          isActive={componentFilter === name}
          inverse
        >
          {name}
        </NavLink>
      ))}
      {componentFilter && (
        <button
          onClick={() => setComponentFilter('')}
          style={{
            border: 'none',
            background: 'none',
            color: tokens.textSecondary,
            cursor: 'pointer',
            fontSize: tokens.fontSizeXs,
            padding: `${tokens.space1} ${tokens.space2}`,
            textAlign: 'left',
          }}
        >
          Clear filter
        </button>
      )}
    </div>
  );

  // ─── Derived-variant dot ────────────────────────────────────────────────────
  const dot = (color: string, label: string) => (
    <Tooltip content={label}>
      <ColorSwatch color={color} size="xs" shape="circle" />
    </Tooltip>
  );

  // Match current state to a quick preset (or null if custom)
  const activeQuickPreset = QUICK_PRESETS.find(
    qp => palette === qp.palette && shape === qp.shape && shadow === qp.shadow
  )?.name ?? undefined;

  const customizerSidebar = (
    <div style={{ padding: tokens.space3, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
      {/* ── Quick Presets ── */}
      <Collapsible trigger="Quick start" defaultOpen>
        <div style={{ paddingTop: tokens.space2 }}>
          <SegmentedControl
            size="sm"
            options={QUICK_PRESETS.map(qp => ({ value: qp.name, label: qp.name }))}
            value={activeQuickPreset}
            onChange={v => {
              const qp = QUICK_PRESETS.find(p => p.name === v);
              if (qp) onQuickPreset(qp);
            }}
          />
        </div>
      </Collapsible>

      {/* ── Palette ── */}
      <Collapsible trigger="Palette" defaultOpen>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.space1, paddingTop: tokens.space2 }}>
          {PALETTE_OPTIONS.map(p => (
            <Button key={p.value} size="xs" variant={palette === p.value ? 'primary' : 'outline'}
              onClick={() => onChangePalette(p.value)}
              leftIcon={<ColorSwatch color={p.swatch} size="xs" />}>
              {p.label}
            </Button>
          ))}
        </div>
      </Collapsible>

      {/* ── Anchor Colors + Derivations ── */}
      <Collapsible trigger="Colors" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2, paddingTop: tokens.space2 }}>
          {ANCHOR_DERIVATIONS.map(({ anchor, label, derived }) => (
            <div key={anchor} style={{ display: 'flex', alignItems: 'center', gap: tokens.space2 }}>
              <ColorPicker value={anchors[anchor]} onChange={v => onChangeAnchor(anchor, v)} label={label} size="sm" inline presetGroups={[]} />
              <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
                {derived.map(d => dot(tokens[d.key] as string, d.label))}
              </div>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* ── Status Colors ── */}
      <Collapsible trigger="Status" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2, paddingTop: tokens.space2 }}>
          {STATUS_ANCHORS.map(({ anchor, label, derived }) => (
            <div key={anchor} style={{ display: 'flex', alignItems: 'center', gap: tokens.space2 }}>
              <ColorPicker value={anchors[anchor]} onChange={v => onChangeAnchor(anchor, v)} label={label} size="sm" inline presetGroups={[]} />
              <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
                {derived.map(d => dot(tokens[d.key] as string, d.label))}
              </div>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* ── Layout ── */}
      <Collapsible trigger="Layout" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space3, paddingTop: tokens.space2 }}>
          <div>
            <Slider label={`Radius (${radiusPx}px)`} size="sm" min={0} max={32} value={radiusPx} onChange={e => {
              const v = parseInt(e.target.value);
              ['radiusSm','radiusMd','radiusLg','radiusXl','radiusFull'].forEach(k =>
                onScaleOverride(k as keyof LucentTokens, `${v}px`)
              );
            }} />
            <SegmentedControl
              size="sm"
              options={SHAPE_OPTIONS.map(s => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))}
              value={shape}
              onChange={v => onChangeShape(v as ShapeName)}
              style={{ marginTop: tokens.space2 }}
            />
          </div>
          <div>
            <Slider label="Elevation" size="sm" min={0} max={2} step={1} value={SHADOW_OPTIONS.indexOf(shadow)} onChange={e => {
              onChangeShadow(SHADOW_OPTIONS[parseInt(e.target.value)]);
            }} />
            <SegmentedControl
              size="sm"
              options={SHADOW_OPTIONS.map(s => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))}
              value={shadow}
              onChange={v => onChangeShadow(v as ShadowName)}
              style={{ marginTop: tokens.space2 }}
            />
          </div>
          <div>
            <Text as="span" size="xs" color="secondary" style={{ display: 'block', marginBottom: tokens.space1 }}>Density</Text>
            <div style={densityWrapperStyle}>
              <SegmentedControl
                size="sm"
                options={DENSITY_OPTIONS}
                value={density}
                onChange={handleDensityChange}
              />
            </div>
          </div>
          <div>
            <Text as="span" size="xs" color="secondary" style={{ display: 'block', marginBottom: tokens.space1 }}>Font scale</Text>
            <div style={fontScaleWrapperStyle}>
              <SegmentedControl
                size="sm"
                options={FONT_SCALE_OPTIONS}
                value={fontScale}
                onChange={handleFontScaleChange}
              />
            </div>
          </div>
        </div>
      </Collapsible>

      <Divider spacing={tokens.space2} />
      <Button size="sm" variant="outline" onClick={onReset}>Reset</Button>
    </div>
  );

  const tabItems: { key: DevTab; label: string }[] = [
    { key: 'components', label: 'Components' },
    { key: 'tokens', label: 'Tokens' },
    { key: 'playground', label: 'Playground' },
  ];

  return (
    <PageLayout
      header={
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${tokens.space5}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space5 }}>
            <Text as="span" size="lg" weight="bold">Lucent UI</Text>
            <nav style={{ display: 'flex', gap: 0, height: '100%' }}>
              {tabItems.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: `0 ${tokens.space4}`,
                    height: '100%',
                    border: 'none',
                    borderBottom: tab === t.key ? `2px solid ${tokens.accentDefault}` : '2px solid transparent',
                    background: 'transparent',
                    fontFamily: tokens.fontFamilyBase,
                    fontSize: tokens.fontSizeSm,
                    fontWeight: tab === t.key ? tokens.fontWeightSemibold : tokens.fontWeightRegular,
                    color: tab === t.key ? tokens.textPrimary : tokens.textSecondary,
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </nav>
            <Text as="span" size="xs" color="secondary">
              {theme} · {palette ?? 'custom'} / {shape} / {shadow}
            </Text>
          </div>
          <Toggle label="Dark" checked={theme === 'dark'} onChange={onToggleTheme} />
        </div>
      }
      headerHeight={48}
      chromeBackground="bgSubtle"
      mainStyle={{ background: tokens.bgBase }}
      {...(tab === 'components' && { sidebar: navSidebar, sidebarWidth: 180 })}
      {...(tab === 'components' && { rightSidebar: customizerSidebar, rightSidebarWidth: 260 })}
    >
      {tab === 'components' ? (
      <div style={{ padding: tokens.space6 }}>

      {/* Text */}
      <Section title="Text" tokens={tokens} hidden={!showSection('Text')}>
        <Row label="Sizes" tokens={tokens}>
          <Text as="span" size="xs">xs — Extra small</Text>
          <Text as="span" size="sm">sm — Small</Text>
          <Text as="span" size="md">md — Medium (base)</Text>
          <Text as="span" size="lg">lg — Large</Text>
          <Text as="span" size="xl">xl — X-Large</Text>
          <Text as="span" size="2xl">2xl — 2X-Large</Text>
          <Text as="span" size="3xl">3xl — 3X-Large</Text>
        </Row>
        <Row label="Weights" tokens={tokens}>
          <Text as="span" weight="regular">Regular</Text>
          <Text as="span" weight="medium">Medium</Text>
          <Text as="span" weight="semibold">Semibold</Text>
          <Text as="span" weight="bold">Bold</Text>
        </Row>
        <Row label="Colors" tokens={tokens}>
          <Text as="span" color="primary">Primary</Text>
          <Text as="span" color="secondary">Secondary</Text>
          <Text as="span" color="disabled">Disabled</Text>
          <Text as="span" color="success">Success</Text>
          <Text as="span" color="warning">Warning</Text>
          <Text as="span" color="danger">Danger</Text>
          <Text as="span" color="info">Info</Text>
        </Row>
        <Row label="Family" tokens={tokens}>
          <Text as="span" size="sm">base — DM Sans body text</Text>
          <Text as="code" family="mono" size="sm">mono — const hello = 'world';</Text>
          <Text as="span" family="display" size="lg" weight="semibold">display — Unbounded heading</Text>
        </Row>
        <Row label="Truncate" tokens={tokens}>
          <Text as="span" truncate style={{ maxWidth: 180 }}>This text is truncated because it exceeds the max-width container</Text>
        </Row>
      </Section>

      {/* Input */}
      <Section title="Input" tokens={tokens} hidden={!showSection('Input')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
            <Input size="sm" placeholder="Small" />
            <Input size="md" placeholder="Medium (default)" />
            <Input size="lg" placeholder="Large" />
          </div>
        </Row>
        <Row label="Label + helper" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Email" type="email" placeholder="you@example.com" helperText="We'll never share your email." value={inputVal} onChange={e => setInputVal(e.target.value)} />
          </div>
        </Row>
        <Row label="Icons" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
            <Input leftElement={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>} placeholder="Search…" />
            <Input rightElement={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} type="password" placeholder="Password" />
          </div>
        </Row>
        <Row label="Prefix / suffix" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
            <Input prefix="$" suffix="USD" placeholder="0.00" />
            <Input prefix="https://" suffix=".com" placeholder="yourdomain" />
            <Input suffix="kg" placeholder="Weight" />
          </div>
        </Row>
        <Row label="Error state" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Password" type="password" errorText="Must be at least 8 characters" defaultValue="short" />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Input label="Username" disabled defaultValue="locked_user" />
          </div>
        </Row>
      </Section>

      {/* Textarea */}
      <Section title="Textarea" tokens={tokens} hidden={!showSection('Textarea')}>
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
        <Row label="Error + disabled" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
            <Textarea label="Notes" errorText="This field is required" />
            <Textarea label="Archived" disabled defaultValue="Read-only content here." />
          </div>
        </Row>
      </Section>

      {/* FormField */}
      <Section title="FormField" tokens={tokens} hidden={!showSection('FormField')}>
        <Row label="Basic" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Email address" htmlFor="ff-email">
              <Input id="ff-email" type="email" placeholder="you@example.com" />
            </FormField>
          </div>
        </Row>
        <Row label="Required + helper" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Username" htmlFor="ff-user" required helperText="Letters and numbers only, 3–20 chars">
              <Input id="ff-user" placeholder="yourname" />
            </FormField>
          </div>
        </Row>
        <Row label="Error state" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Password" htmlFor="ff-pw" required errorMessage="Must be at least 8 characters">
              <Input id="ff-pw" type="password" defaultValue="short" />
            </FormField>
          </div>
        </Row>
        <Row label="Wrapping Select" tokens={tokens}>
          <div style={{ width: 280 }}>
            <FormField label="Country" htmlFor="ff-country">
              <Select
                id="ff-country"
                placeholder="Choose a country"
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'gb', label: 'United Kingdom' },
                  { value: 'ca', label: 'Canada' },
                ]}
              />
            </FormField>
          </div>
        </Row>
      </Section>

      {/* SearchInput */}
      <Section title="SearchInput" tokens={tokens} hidden={!showSection('SearchInput')}>
        <Row label="With results dropdown" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search fruits…"
              results={searchResults}
              onResultSelect={(r) => { setSearchQuery(r.label); }}
            />
          </div>
        </Row>
        <Row label="Loading state" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput value="pineapple" onChange={() => {}} isLoading />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SearchInput value="" onChange={() => {}} disabled placeholder="Search disabled…" />
          </div>
        </Row>
      </Section>

      {/* Card */}
      <Section title="Card" tokens={tokens} hidden={!showSection('Card')}>
        <Row label="Elevation hierarchy" tokens={tokens}>
          <Card variant="ghost" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">ghost</Text>
            <Text size="xs" color="secondary">Transparent, no border</Text>
          </Card>
          <Card variant="outline" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">outline</Text>
            <Text size="xs" color="secondary">Surface bg, border</Text>
          </Card>
          <Card variant="filled" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">filled</Text>
            <Text size="xs" color="secondary">Secondary surface, no border</Text>
          </Card>
          <Card variant="elevated" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">elevated</Text>
            <Text size="xs" color="secondary">Surface bg, shadow</Text>
          </Card>
        </Row>
        <Row label="Combo variant" tokens={tokens}>
          <Card
            variant="combo"
            style={{ width: 320 }}
            header={<Text weight="semibold" size="sm">Profile</Text>}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.space2 }}>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Update</Button>
              </div>
            }
          >
            <Text size="sm" color="secondary">
              Body uses primary surface. Header and footer recede into secondary surface.
            </Text>
          </Card>
        </Row>
        <Row label="Outline with header + footer" tokens={tokens}>
          <Card
            style={{ width: 280 }}
            header={<Text family="display" weight="semibold">Card title</Text>}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.space2 }}>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Save</Button>
              </div>
            }
          >
            <Text size="sm" color="secondary">Edit your profile information below.</Text>
          </Card>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Card variant="outline" padding="sm" radius="sm" style={{ width: 160 }}>
            <Text size="xs">sm / outline</Text>
          </Card>
          <Card variant="filled" padding="md" radius="md" style={{ width: 160 }}>
            <Text size="xs">md / filled</Text>
          </Card>
          <Card variant="elevated" padding="lg" radius="lg" style={{ width: 160 }}>
            <Text size="xs">lg / elevated</Text>
          </Card>
        </Row>
        <Row label="Interactive" tokens={tokens}>
          <Card variant="elevated" onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Clickable card</Text>
            <Text size="xs" color="secondary">Hover, focus, press</Text>
          </Card>
          <Card variant="elevated" href="#" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Link card</Text>
            <Text size="xs" color="secondary">Renders as {'<a>'}</Text>
          </Card>
          <Card variant="elevated" onClick={() => {}} disabled style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Disabled</Text>
            <Text size="xs" color="secondary">No interaction</Text>
          </Card>
        </Row>
        <Row label="Status accent" tokens={tokens}>
          <Card status="success" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Success</Text>
          </Card>
          <Card status="warning" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Warning</Text>
          </Card>
          <Card status="danger" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Danger</Text>
          </Card>
          <Card status="info" style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Info</Text>
          </Card>
        </Row>
        <Row label="Selectable" tokens={tokens}>
          <Card variant="elevated" selected={false} onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Unselected</Text>
          </Card>
          <Card variant="elevated" selected onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Selected</Text>
          </Card>
          <Card variant="outline" selected onClick={() => {}} style={{ width: 200 }}>
            <Text size="xs" weight="semibold">Selected outline</Text>
          </Card>
        </Row>
        <Row label="Media slot" tokens={tokens}>
          <Card
            variant="elevated"
            style={{ width: 240 }}
            media={
              <div style={{ height: 120, background: `linear-gradient(135deg, ${tokens.accentDefault}, ${tokens.accentSubtle})` }} />
            }
          >
            <Text size="xs" weight="semibold">Hero card</Text>
            <Text size="xs" color="secondary">Full-bleed media at the top.</Text>
          </Card>
        </Row>
        <Row label="CardBleed" tokens={tokens}>
          <Card style={{ width: 320 }}>
            <Text weight="semibold" size="sm">Settings</Text>
            <CardBleed
              style={{
                borderTop: `1px solid ${tokens.borderDefault}`,
                borderBottom: `1px solid ${tokens.borderDefault}`,
                marginTop: tokens.space3,
                paddingTop: tokens.space3,
                paddingBottom: tokens.space3,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text size="sm">Email alerts</Text>
                <Toggle checked onChange={() => {}} />
              </div>
            </CardBleed>
            <CardBleed
              style={{
                borderBottom: `1px solid ${tokens.borderDefault}`,
                paddingTop: tokens.space3,
                paddingBottom: tokens.space3,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text size="sm">Push notifications</Text>
                <Toggle onChange={() => {}} />
              </div>
            </CardBleed>
            <div style={{ paddingTop: tokens.space3 }}>
              <Text size="xs" color="secondary">Bleed rows stretch edge-to-edge.</Text>
            </div>
          </Card>
        </Row>
      </Section>

      {/* Alert */}
      <Section title="Alert" tokens={tokens} hidden={!showSection('Alert')}>
        <Row label="All variants" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space3, width: '100%' }}>
            <Alert variant="info" title="Did you know?">You can customize the accent color using token overrides.</Alert>
            <Alert variant="success" title="Changes saved">Your profile has been updated successfully.</Alert>
            <Alert variant="warning" title="Approaching limit">You've used 80% of your monthly quota.</Alert>
            <Alert variant="danger" title="Payment failed" onDismiss={alertDismissed ? undefined : () => setAlertDismissed(true)}>
              {alertDismissed ? 'Dismissed! (re-renders on theme toggle)' : 'Check your card details and try again.'}
            </Alert>
          </div>
        </Row>
        <Row label="Body only (no title)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Alert variant="info">Your session expires in 5 minutes.</Alert>
          </div>
        </Row>
      </Section>

      {/* EmptyState */}
      <Section title="EmptyState" tokens={tokens} hidden={!showSection('EmptyState')}>
        <Row label="With illustration + CTA" tokens={tokens}>
          <Card style={{ width: 360 }}>
            <EmptyState
              illustration={
                <Icon size="xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={11} cy={11} r={8} />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </Icon>
              }
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={<Button variant="secondary" size="sm">Clear filters</Button>}
            />
          </Card>
        </Row>
        <Row label="Minimal (title only)" tokens={tokens}>
          <Card style={{ width: 280 }}>
            <EmptyState title="Nothing here yet" />
          </Card>
        </Row>
      </Section>

      {/* Skeleton */}
      <Section title="Skeleton" tokens={tokens} hidden={!showSection('Skeleton')}>
        <Row label="Text lines" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Skeleton variant="text" lines={3} />
          </div>
        </Row>
        <Row label="Shapes" tokens={tokens}>
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="rectangle" width={120} height={40} />
          <Skeleton variant="text" width={160} />
        </Row>
        <Row label="Card placeholder" tokens={tokens}>
          <Card style={{ width: 280 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space3 }}>
              <Skeleton variant="rectangle" height={120} />
              <div style={{ display: 'flex', gap: tokens.space2, alignItems: 'center' }}>
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton variant="text" width="60%" />
              </div>
              <Skeleton variant="text" lines={2} />
            </div>
          </Card>
        </Row>
        <Row label="No animation" tokens={tokens}>
          <Skeleton variant="rectangle" width={200} height={32} animate={false} />
        </Row>
      </Section>

      <Divider style={{ marginBottom: tokens.space6 }} />

      {/* ── Wave 2 ── */}

      {/* Checkbox */}
      <Section title="Checkbox" tokens={tokens} hidden={!showSection('Checkbox')}>
        <Row label="States" tokens={tokens}>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
        </Row>
        <Row label="Controlled" tokens={tokens}>
          <Checkbox label="Accept terms" checked={checked} onChange={e => setChecked(e.target.checked)} />
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Checkbox size="sm" label="Small" defaultChecked />
          <Checkbox size="md" label="Medium" defaultChecked />
          <Checkbox size="lg" label="Large" defaultChecked />
        </Row>
        <Row label="With helper text" tokens={tokens}>
          <Checkbox label="Marketing emails" helperText="Receive occasional updates about new features" defaultChecked />
          <Checkbox label="Analytics" helperText="Help us improve by sharing anonymous usage data" />
        </Row>
        <Row label="Contained" tokens={tokens}>
          <Checkbox label="Free plan" helperText="Up to 3 projects, 1 GB storage" contained />
          <Checkbox label="Pro plan" helperText="Unlimited projects, 100 GB storage" contained defaultChecked />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <Checkbox label="Disabled off" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
          <Checkbox label="Disabled indeterminate" disabled indeterminate />
        </Row>
      </Section>

      {/* Radio */}
      <Section title="Radio" tokens={tokens} hidden={!showSection('Radio')}>
        <Row label="Vertical group (default)" tokens={tokens}>
          <RadioGroup name="plan" value={radio} onChange={setRadio}>
            <Radio value="option1" label="Free — up to 3 projects" />
            <Radio value="option2" label="Pro — unlimited projects" />
            <Radio value="option3" label="Enterprise — custom limits" />
          </RadioGroup>
        </Row>
        <Row label="Horizontal group" tokens={tokens}>
          <RadioGroup name="size-demo" value={radioSize} onChange={setRadioSize} orientation="horizontal">
            <Radio value="s" label="S" />
            <Radio value="m" label="M" />
            <Radio value="l" label="L" />
            <Radio value="xl" label="XL" />
          </RadioGroup>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <RadioGroup name="size-preview" value="a" onChange={() => {}} orientation="horizontal">
            <Radio size="sm" value="a" label="Small" />
          </RadioGroup>
          <RadioGroup name="size-preview-md" value="a" onChange={() => {}} orientation="horizontal">
            <Radio size="md" value="a" label="Medium" />
          </RadioGroup>
          <RadioGroup name="size-preview-lg" value="a" onChange={() => {}} orientation="horizontal">
            <Radio size="lg" value="a" label="Large" />
          </RadioGroup>
        </Row>
        <Row label="Contained" tokens={tokens}>
          <RadioGroup name="contained-demo" value="pro" onChange={() => {}}>
            <Radio value="free" label="Free plan" helperText="Up to 3 projects, 1 GB storage" contained />
            <Radio value="pro" label="Pro plan" helperText="Unlimited projects, 100 GB storage" contained />
          </RadioGroup>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <RadioGroup name="disabled-off" value="" onChange={() => {}} disabled>
            <Radio value="a" label="Disabled unselected" />
          </RadioGroup>
          <RadioGroup name="disabled-on" value="a" onChange={() => {}} disabled>
            <Radio value="a" label="Disabled selected" />
          </RadioGroup>
        </Row>
      </Section>

      {/* Toggle */}
      <Section title="Toggle" tokens={tokens} hidden={!showSection('Toggle')}>
        <Row label="States" tokens={tokens}>
          <Toggle label="Off" />
          <Toggle label="On" defaultChecked />
        </Row>
        <Row label="Controlled" tokens={tokens}>
          <Toggle label="Dark mode" checked={toggled} onChange={e => setToggled(e.target.checked)} />
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Toggle size="sm" label="Small" defaultChecked />
          <Toggle size="md" label="Medium" defaultChecked />
          <Toggle size="lg" label="Large" defaultChecked />
        </Row>
        <Row label="With helper text" tokens={tokens}>
          <Toggle label="Notifications" helperText="Receive email alerts for new activity" defaultChecked />
          <Toggle label="Auto-save" helperText="Save changes automatically every 30 seconds" />
        </Row>
        <Row label="Contained" tokens={tokens}>
          <Toggle label="Dark mode" helperText="Use dark colour scheme across the app" contained defaultChecked />
          <Toggle label="Compact view" helperText="Reduce spacing for denser layouts" contained />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <Toggle disabled label="Disabled off" />
          <Toggle disabled defaultChecked label="Disabled on" />
        </Row>
      </Section>

      {/* Slider */}
      <Section title="Slider" tokens={tokens} hidden={!showSection('Slider')}>
        <Row label="Controlled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Slider label="Volume" showValue value={sliderValue} onChange={e => setSliderValue(Number(e.target.value))} />
          </div>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-4)' }}>
            <Slider size="sm" label="Small" showValue defaultValue={30} />
            <Slider size="md" label="Medium" showValue defaultValue={50} />
            <Slider size="lg" label="Large" showValue defaultValue={70} />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Slider label="Locked" disabled defaultValue={40} showValue />
          </div>
        </Row>
      </Section>

      {/* CodeBlock */}
      <Section title="CodeBlock" tokens={tokens} hidden={!showSection('CodeBlock')}>
        <Row label="Single snippet" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              language="tsx"
              code={`import { Button } from 'lucent-ui';\n\nexport function App() {\n  return <Button variant="primary">Save changes</Button>;\n}`}
            />
          </div>
        </Row>
        <Row label="Tabbed (package manager)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              tabs={[
                { label: 'pnpm', code: 'pnpm add lucent-ui', language: 'bash' },
                { label: 'npm',  code: 'npm install lucent-ui', language: 'bash' },
                { label: 'yarn', code: 'yarn add lucent-ui', language: 'bash' },
                { label: 'bun',  code: 'bun add lucent-ui', language: 'bash' },
              ]}
            />
          </div>
        </Row>
        <Row label="AI prompt (variant=prompt)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock
              variant="prompt"
              helperText="Paste this into a Claude conversation or claude.ai:"
              tabs={[
                {
                  label: 'Claude',
                  icon: '♦',
                  code: '"Add a Button from lucent-ui with variant=\\"primary\\". It should trigger form submission and show a loading state while the request is in flight."',
                },
                {
                  label: 'Cursor',
                  icon: '↖',
                  code: '@lucent-ui Add a primary Button with an onClick handler that triggers form submission and shows a loading spinner.',
                },
                {
                  label: 'VS Code',
                  icon: '↺',
                  code: 'Use lucent-ui Button component: variant="primary", loading state tied to form submit handler.',
                },
              ]}
            />
          </div>
        </Row>
        <Row label="No copy button" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <CodeBlock showCopyButton={false} language="bash" code="npm install lucent-ui" />
          </div>
        </Row>
      </Section>

      {/* Table */}
      <Section title="Table" tokens={tokens} hidden={!showSection('Table')}>
        <Row label="Basic" tokens={tokens}>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell as="th">Prop</Table.Cell>
                <Table.Cell as="th">Type</Table.Cell>
                <Table.Cell as="th">Default</Table.Cell>
                <Table.Cell as="th">Description</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                ['variant', '"primary" | "secondary" | "outline" | "ghost" | "danger"', '"primary"', 'Visual style of the button'],
                ['size', '"sm" | "md" | "lg"', '"md"', 'Controls height and padding'],
                ['disabled', 'boolean', 'false', 'Prevents interaction'],
                ['loading', 'boolean', 'false', 'Shows a spinner, disables click'],
              ].map(([prop, type, def, desc]) => (
                <Table.Row key={prop}>
                  <Table.Cell style={{ fontFamily: 'var(--lucent-font-family-mono)', fontSize: 'var(--lucent-font-size-xs)' }}>{prop}</Table.Cell>
                  <Table.Cell style={{ fontFamily: 'var(--lucent-font-family-mono)', fontSize: 'var(--lucent-font-size-xs)', color: 'var(--lucent-text-secondary)' }}>{type}</Table.Cell>
                  <Table.Cell style={{ fontFamily: 'var(--lucent-font-family-mono)', fontSize: 'var(--lucent-font-size-xs)' }}>{def}</Table.Cell>
                  <Table.Cell>{desc}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Row>
        <Row label="Striped" tokens={tokens}>
          <Table striped>
            <Table.Head>
              <Table.Row>
                <Table.Cell as="th">Name</Table.Cell>
                <Table.Cell as="th">Role</Table.Cell>
                <Table.Cell as="th">Status</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                ['Alice', 'Engineer', 'Active'],
                ['Bob', 'Designer', 'Away'],
                ['Carol', 'Product', 'Active'],
                ['Dan', 'Engineer', 'Active'],
              ].map(([name, role, status]) => (
                <Table.Row key={name}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={status === 'Active' ? 'success' : 'neutral'}>{status}</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Row>
      </Section>

      {/* ColorSwatch */}
      <Section title="ColorSwatch" tokens={tokens} hidden={!showSection('ColorSwatch')}>
        <Row label="Circle sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(s => (
              <ColorSwatch key={s} color="#3b82f6" size={s} shape="circle" />
            ))}
          </div>
        </Row>
        <Row label="Square sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(s => (
              <ColorSwatch key={s} color="#8b5cf6" size={s} shape="square" />
            ))}
          </div>
        </Row>
        <Row label="Selected" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => (
              <ColorSwatch key={c} color={c} selected={i === 3} onClick={() => {}} />
            ))}
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ display: 'flex', gap: 8 }}>
            <ColorSwatch color="#3b82f6" disabled />
            <ColorSwatch color="#22c55e" disabled selected />
          </div>
        </Row>
      </Section>

      {/* ColorPicker */}
      <Section title="ColorPicker" tokens={tokens} hidden={!showSection('ColorPicker')}>
        <Row label="Default" tokens={tokens}>
          <ColorPickerDemo />
        </Row>
        <Row label="Multiple groups" tokens={tokens}>
          <ColorPickerDemo presetGroups={[
            { label: 'Brand', colors: ['#111827', '#3b82f6', '#8b5cf6', '#ec4899'] },
            { label: 'Semantic', colors: ['#22c55e', '#f59e0b', '#ef4444', '#0ea5e9'] },
          ]} />
        </Row>
        <Row label="No presets" tokens={tokens}>
          <ColorPickerDemo presetGroups={[]} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <ColorPicker value="#6b7280" disabled label="Theme color" />
        </Row>
      </Section>

      {/* SegmentedControl */}
      <Section title="SegmentedControl" tokens={tokens} hidden={!showSection('SegmentedControl')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
            <SegmentedControl size="sm" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'table', label: 'Table' }]} />
            <SegmentedControl size="md" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'table', label: 'Table' }]} />
            <SegmentedControl size="lg" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'table', label: 'Table' }]} />
          </div>
        </Row>
        <Row label="4 options" tokens={tokens}>
          <div style={{ width: 320 }}>
            <SegmentedControl defaultValue="day" options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }]} />
          </div>
        </Row>
        <Row label="Inline (fit-content)" tokens={tokens}>
          <SegmentedControl fullWidth={false} defaultValue="a" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Gamma' }]} />
        </Row>
        <Row label="Disabled option" tokens={tokens}>
          <div style={{ width: 280 }}>
            <SegmentedControl defaultValue="a" options={[{ value: 'a', label: 'Active' }, { value: 'b', label: 'Disabled', disabled: true }, { value: 'c', label: 'Normal' }]} />
          </div>
        </Row>
        <Row label="All disabled" tokens={tokens}>
          <div style={{ width: 280 }}>
            <SegmentedControl disabled defaultValue="hex" options={[{ value: 'hex', label: 'Hex' }, { value: 'rgb', label: 'RGB' }, { value: 'hsl', label: 'HSL' }]} />
          </div>
        </Row>
      </Section>

      {/* Select */}
      <Section title="Select" tokens={tokens} hidden={!showSection('Select')}>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Select
              label="Country"
              placeholder="Choose a country"
              options={[
                { value: 'us', label: 'United States' },
                { value: 'gb', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
                { value: 'au', label: 'Australia' },
              ]}
              value={selectVal}
              onChange={e => setSelectVal(e.target.value)}
            />
          </div>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          {(['sm', 'md', 'lg'] as const).map(s => (
            <div key={s} style={{ width: 180 }}>
              <Select
                size={s}
                options={[{ value: 'a', label: `Size ${s}` }, { value: 'b', label: 'Option B' }]}
                defaultValue="a"
              />
            </div>
          ))}
        </Row>
        <Row label="With error" tokens={tokens}>
          <div style={{ width: 280 }}>
            <Select
              label="Role"
              placeholder="Select a role"
              options={[{ value: 'admin', label: 'Admin' }, { value: 'member', label: 'Member' }]}
              errorText="Please select a role to continue"
            />
          </div>
        </Row>
      </Section>

      {/* Chip */}
      <Section title="Chip" tokens={tokens} hidden={!showSection('Chip')}>
        <Row label="Dismissible" tokens={tokens}>
          {tags.map(t => (
            <Chip key={t} onDismiss={() => setTags(prev => prev.filter(x => x !== t))}>{t}</Chip>
          ))}
          {tags.length === 0 && <span style={{ fontSize: tokens.fontSizeSm, color: tokens.textSecondary }}>All chips dismissed — refresh to reset</span>}
        </Row>
        <Row label="Variants" tokens={tokens}>
          <Chip variant="neutral">Neutral</Chip>
          <Chip variant="accent">Accent</Chip>
          <Chip variant="success">Success</Chip>
          <Chip variant="warning">Warning</Chip>
          <Chip variant="danger">Danger</Chip>
          <Chip variant="info">Info</Chip>
        </Row>
        <Row label="With dot" tokens={tokens}>
          <Chip variant="success" dot>Online</Chip>
          <Chip variant="danger" dot>Offline</Chip>
          <Chip variant="neutral" dot>Suspended</Chip>
        </Row>
        <Row label="With swatch" tokens={tokens}>
          <Chip swatch="#6366f1" onDismiss={() => {}}>Indigo</Chip>
          <Chip swatch="#10b981" onDismiss={() => {}}>Emerald</Chip>
          <Chip swatch="#f43f5e" onDismiss={() => {}}>Rose</Chip>
        </Row>
        <Row label="With icon" tokens={tokens}>
          <Chip leftIcon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4l5-3 5 3v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" /></svg>} onDismiss={() => {}}>Folders</Chip>
          <Chip leftIcon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="1" width="8" height="10" rx="1" /><path d="M4 4h4M4 6h4M4 8h2" /></svg>} onDismiss={() => {}}>Files</Chip>
        </Row>
        <Row label="Borderless" tokens={tokens}>
          <Chip variant="success" borderless>New</Chip>
          <Chip variant="warning" borderless>Pending</Chip>
          <Chip variant="neutral" borderless>Active</Chip>
          <Chip variant="danger" borderless>Closed</Chip>
        </Row>
        <Row label="Clickable" tokens={tokens}>
          <Chip variant="accent" onClick={() => {}}>UX</Chip>
          <Chip variant="accent" onClick={() => {}}>UI</Chip>
          <Chip variant="accent" onClick={() => {}}>Motion</Chip>
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Chip size="sm" onDismiss={() => {}}>Small</Chip>
          <Chip size="md" onDismiss={() => {}}>Medium</Chip>
          <Chip size="lg" onDismiss={() => {}}>Large</Chip>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <Chip disabled onDismiss={() => {}}>Disabled</Chip>
          <Chip disabled variant="accent">Disabled accent</Chip>
        </Row>
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip" tokens={tokens} hidden={!showSection('Tooltip')}>
        <Row label="Placements" tokens={tokens}>
          <Tooltip content="Tooltip on top" placement="top">
            <Button variant="secondary" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Tooltip on bottom" placement="bottom">
            <Button variant="secondary" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Tooltip on left" placement="left">
            <Button variant="secondary" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Tooltip on right" placement="right">
            <Button variant="secondary" size="sm">Right</Button>
          </Tooltip>
        </Row>
        <Row label="No delay" tokens={tokens}>
          <Tooltip content="Instant tooltip" delay={0}>
            <Button variant="ghost" size="sm">Hover me (instant)</Button>
          </Tooltip>
        </Row>
      </Section>

      {/* Icon */}
      <Section title="Icon" tokens={tokens} hidden={!showSection('Icon')}>
        <Row label="Sizes" tokens={tokens}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Tooltip key={s} content={s} delay={0}>
              <Icon size={s} label={`${s} icon`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={10} />
                  <path d="M12 8v4l3 3" />
                </svg>
              </Icon>
            </Tooltip>
          ))}
        </Row>
        <Row label="Coloured" tokens={tokens}>
          <Icon size="lg" color="var(--lucent-success-default)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </Icon>
          <Icon size="lg" color="var(--lucent-danger-default)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><path d="M15 9l-6 6M9 9l6 6" /></svg>
          </Icon>
          <Icon size="lg" color="var(--lucent-warning-default)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2="12.01" y2={17} /></svg>
          </Icon>
        </Row>
      </Section>

      <Divider style={{ marginBottom: tokens.space6 }} />

      {/* ── Wave 1 ── */}

      {/* Button */}
      <Section title="Button" tokens={tokens} hidden={!showSection('Button')}>
        <Row label="Variants" tokens={tokens}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="danger-outline">Danger outline</Button>
          <Button variant="danger-ghost">Danger ghost</Button>
        </Row>
        <Row label="Pressed" tokens={tokens}>
          {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
            <Button key={v} variant={v} disableHoverStyles style={{ transform: 'translateY(1px)', boxShadow: `0 0 0 2px var(--lucent-surface), 0 0 0 4px ${v === 'danger' ? 'var(--lucent-danger-default)' : 'var(--lucent-accent-default)'}` }}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
          ))}
        </Row>
        <Row label="Disabled" tokens={tokens}>
          {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
            <Button key={v} variant={v} disabled>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
          ))}
        </Row>
        <Row label="Sizes" tokens={tokens}>
          <Button size="2xs">Tiny</Button>
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="2xs icon-only" tokens={tokens}>
          <Button size="2xs" variant="ghost" leftIcon={<SmallIcon d="M6 9l6 6 6-6" />} aria-label="Expand" />
          <Button size="2xs" variant="ghost" leftIcon={<SmallIcon d="M4 12h16M12 4v16" />} aria-label="Add" />
          <Button size="2xs" variant="ghost" leftIcon={<SmallIcon d="M23 4l-6.5 17L13 12 2 8.5z" />} aria-label="Send" />
          <Button size="2xs" variant="outline" leftIcon={<SmallIcon d="M1 4v6h6M23 20v-6h-6" />} aria-label="Refresh" />
          <Button size="2xs" variant="outline" leftIcon={<SmallIcon d="M18 6L6 18M6 6l12 12" />} aria-label="Close" />
          <Button size="2xs" variant="secondary" leftIcon={<SmallIcon d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />} aria-label="Edit" />
          <Button size="2xs" variant="danger" leftIcon={<SmallIcon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />} aria-label="Delete" />
          <Button size="2xs" variant="danger-outline" leftIcon={<SmallIcon d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />} aria-label="Warn" />
          <Button size="2xs" variant="danger-ghost" leftIcon={<SmallIcon d="M18 6L6 18M6 6l12 12" />} aria-label="Remove" />
        </Row>
        <Row label="Icons" tokens={tokens}>
          <Button leftIcon={<StarIcon />}>With prefix</Button>
          <Button variant="outline" rightIcon={<StarIcon />}>With suffix</Button>
          <Button variant="outline" chevron>Dropdown</Button>
          <Button leftIcon={<StarIcon />} chevron>Both</Button>
        </Row>
        <Row label="With swatches" tokens={tokens}>
          <Button size="xs" variant="outline" leftIcon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', border: '1px solid rgba(0,0,0,0.1)' }} />}>Indigo</Button>
          <Button size="xs" variant="outline" leftIcon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', border: '1px solid rgba(0,0,0,0.1)' }} />}>Emerald</Button>
          <Button size="xs" variant="outline" leftIcon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', border: '1px solid rgba(0,0,0,0.1)' }} />}>Rose</Button>
          <Button size="sm" variant="outline" leftIcon={<span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0ea5e9', border: '1px solid rgba(0,0,0,0.1)' }} />}>Ocean</Button>
          <Button size="sm" variant="primary" leftIcon={<span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e9c96b', border: '1px solid rgba(0,0,0,0.1)' }} />}>Brand</Button>
        </Row>
        <Row label="States" tokens={tokens}>
          <Button loading>Loading</Button>
          <Button variant="primary" fullWidth>Full width</Button>
        </Row>
      </Section>

      {/* Input */}
      {/* Badge */}
      {/* Badge — replaced by Chip, kept for backward compat */}

      {/* Avatar */}
      <Section title="Avatar" tokens={tokens} hidden={!showSection('Avatar')}>
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
      <Section title="Spinner" tokens={tokens} hidden={!showSection('Spinner')}>
        <Row label="Sizes" tokens={tokens}>
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
      </Section>

      {/* Divider */}
      <Section title="Divider" tokens={tokens} hidden={!showSection('Divider')}>
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

      <Section title="Breadcrumb" tokens={tokens} hidden={!showSection('Breadcrumb')}>
        <Row label="Default" tokens={tokens}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Settings', href: '#' },
              { label: 'Profile' },
            ]}
          />
        </Row>
        <Row label="Custom separator" tokens={tokens}>
          <Breadcrumb
            separator="›"
            items={[
              { label: 'Dashboard', href: '#' },
              { label: 'Projects', href: '#' },
              { label: 'lucent-ui' },
            ]}
          />
        </Row>
      </Section>

      <Section title="Tabs" tokens={tokens} hidden={!showSection('Tabs')}>
        <Row label="Underline (default)" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Tabs
              tabs={[
                { value: 'overview', label: 'Overview', content: <Text size="sm" color="secondary">Overview content goes here.</Text> },
                { value: 'api', label: 'API', content: <Text size="sm" color="secondary">API reference content.</Text> },
                { value: 'examples', label: 'Examples', content: <Text size="sm" color="secondary">Usage examples.</Text> },
                { value: 'disabled', label: 'Disabled', content: null, disabled: true },
              ]}
            />
          </div>
        </Row>
        <Row label="Pills" tokens={tokens}>
          <div style={{ width: '100%' }}>
            <Tabs
              variant="pills"
              tabs={[
                { value: 'overview', label: 'Overview', content: <Text size="sm" color="secondary">Overview content goes here.</Text> },
                { value: 'api', label: 'API', content: <Text size="sm" color="secondary">API reference content.</Text> },
                { value: 'examples', label: 'Examples', content: <Text size="sm" color="secondary">Usage examples.</Text> },
                { value: 'disabled', label: 'Disabled', content: null, disabled: true },
              ]}
            />
          </div>
        </Row>
        <Row label="Overflow (constrained width)" tokens={tokens}>
          <div style={{ width: 360 }}>
            <Tabs
              tabs={[
                { value: 'overview', label: 'Overview', content: <Text size="sm" color="secondary">Overview content.</Text> },
                { value: 'api', label: 'API', content: <Text size="sm" color="secondary">API reference.</Text> },
                { value: 'examples', label: 'Examples', content: <Text size="sm" color="secondary">Usage examples.</Text> },
                { value: 'changelog', label: 'Changelog', content: <Text size="sm" color="secondary">Changelog content.</Text> },
                { value: 'settings', label: 'Settings', content: <Text size="sm" color="secondary">Settings content.</Text> },
                { value: 'advanced', label: 'Advanced', content: <Text size="sm" color="secondary">Advanced options.</Text> },
              ]}
            />
          </div>
        </Row>
      </Section>

      <Section title="Collapsible" tokens={tokens} hidden={!showSection('Collapsible')}>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 400, borderBottom: `1px solid ${tokens.borderDefault}` }}>
            <Collapsible trigger={<Text weight="medium">Advanced options</Text>}>
              <Text color="secondary">Hidden content that expands when you click the trigger above. Can contain any ReactNode.</Text>
            </Collapsible>
          </div>
        </Row>
        <Row label="Default open" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 400, borderBottom: `1px solid ${tokens.borderDefault}` }}>
            <Collapsible defaultOpen trigger={<Text weight="medium">Expanded by default</Text>}>
              <Text color="secondary">This section starts expanded.</Text>
            </Collapsible>
          </div>
        </Row>
      </Section>

      <Section title="NavLink" tokens={tokens} hidden={!showSection('NavLink')}>
        <Row label="States" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1, width: 220 }}>
            <NavLink href="#" icon={<NavIcon />}>Dashboard</NavLink>
            <NavLink href="#" icon={<NavIcon />} isActive>Components</NavLink>
            <NavLink href="#" icon={<NavIcon />}>Settings</NavLink>
            <NavLink href="#" icon={<NavIcon />} disabled>Disabled</NavLink>
          </div>
        </Row>
        <Row label="Without icons" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1, width: 220 }}>
            <NavLink href="#">Overview</NavLink>
            <NavLink href="#" isActive>API Reference</NavLink>
            <NavLink href="#">Examples</NavLink>
          </div>
        </Row>
        <Row label="Inverse (surface highlight)" tokens={tokens}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space1, width: 220, background: tokens.bgSubtle, borderRadius: tokens.radiusMd, padding: tokens.space3 }}>
            <NavLink href="#" icon={<NavIcon />} inverse>Dashboard</NavLink>
            <NavLink href="#" icon={<NavIcon />} isActive inverse>Components</NavLink>
            <NavLink href="#" icon={<NavIcon />} inverse>Settings</NavLink>
            <NavLink href="#" icon={<NavIcon />} disabled inverse>Disabled</NavLink>
          </div>
        </Row>
      </Section>

      <Section title="PageLayout" tokens={tokens} hidden={!showSection('PageLayout')}>
        <Row label="With header + sidebar" tokens={tokens}>
          <div style={{ width: '100%', height: 320, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
            <PageLayout
              headerHeight={44}
              sidebarWidth={180}
              chromeBackground="bgSubtle"
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space6}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive inverse>Dashboard</NavLink>
                  <NavLink href="#" inverse>Components</NavLink>
                  <NavLink href="#" inverse>Settings</NavLink>
                </div>
              }
            >
              <div style={{ padding: tokens.space5 }}>
                <Text color="secondary">Main scrollable content area.</Text>
              </div>
            </PageLayout>
          </div>
        </Row>
        <Row label="With status bar footer" tokens={tokens}>
          <div style={{ width: '100%', height: 320, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
            <PageLayout
              headerHeight={44}
              sidebarWidth={180}
              chromeBackground="bgSubtle"
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space6}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive inverse>Dashboard</NavLink>
                  <NavLink href="#" inverse>Components</NavLink>
                  <NavLink href="#" inverse>Settings</NavLink>
                </div>
              }
              footer={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${tokens.space3}`, borderTop: `1px solid ${tokens.borderDefault}` }}>
                  <Text size="xs" color="secondary">main</Text>
                  <div style={{ display: 'flex', gap: tokens.space4 }}>
                    <Text size="xs" color="secondary">Ln 42, Col 7</Text>
                    <Text size="xs" color="secondary">UTF-8</Text>
                    <Text size="xs" color="info">Ready</Text>
                  </div>
                </div>
              }
            >
              <div style={{ padding: tokens.space5 }}>
                <Text color="secondary">Main scrollable content area.</Text>
              </div>
            </PageLayout>
          </div>
        </Row>
        <Row label="With header + sidebar + right panel" tokens={tokens}>
          <div style={{ width: '100%', height: 320, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.radiusMd, overflow: 'hidden' }}>
            <PageLayout
              headerHeight={44}
              sidebarWidth={160}
              rightSidebarWidth={160}
              chromeBackground="bgSubtle"
              header={
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: `0 ${tokens.space6}` }}>
                  <Text weight="semibold">My App</Text>
                </div>
              }
              sidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space1 }}>
                  <NavLink href="#" isActive inverse>Dashboard</NavLink>
                  <NavLink href="#" inverse>Components</NavLink>
                  <NavLink href="#" inverse>Settings</NavLink>
                </div>
              }
              rightSidebar={
                <div style={{ padding: tokens.space4, display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
                  <Text size="xs" weight="semibold" color="secondary">Details</Text>
                  <Text size="xs" color="secondary">Status: Active</Text>
                  <Text size="xs" color="secondary">Owner: You</Text>
                  <Text size="xs" color="secondary">Updated: today</Text>
                </div>
              }
            >
              <div style={{ padding: tokens.space5 }}>
                <Text color="secondary">Main scrollable content area.</Text>
              </div>
            </PageLayout>
          </div>
        </Row>
      </Section>

      {/* ── Molecules Wave 2 ── */}

      <Section title="DataTable" tokens={tokens} hidden={!showSection('DataTable')}>
        <Row label="Sortable + paginated" tokens={tokens}>
          <DataTable
            style={{ width: '100%' }}
            pageSize={5}
            columns={[
              { key: 'name', header: 'Name', sortable: true },
              { key: 'role', header: 'Role', sortable: true },
              { key: 'status', header: 'Status', render: (row: { name: string; role: string; status: string }) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge> },
            ]}
            rows={[
              { name: 'Alice', role: 'Engineer', status: 'Active' },
              { name: 'Bob', role: 'Designer', status: 'Active' },
              { name: 'Carol', role: 'Product', status: 'Away' },
              { name: 'Dan', role: 'Engineer', status: 'Active' },
              { name: 'Eve', role: 'Marketing', status: 'Away' },
              { name: 'Frank', role: 'Engineer', status: 'Active' },
              { name: 'Grace', role: 'Designer', status: 'Away' },
            ]}
          />
        </Row>
        <Row label="Sortable + filterable + paginated" tokens={tokens}>
          <DataTable
            style={{ width: '100%' }}
            pageSize={5}
            columns={[
              { key: 'name', header: 'Name', sortable: true, filterable: true },
              { key: 'role', header: 'Role', sortable: true, filterable: true },
              { key: 'status', header: 'Status', render: (row: { name: string; role: string; status: string }) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge> },
            ]}
            rows={[
              { name: 'Alice', role: 'Engineer', status: 'Active' },
              { name: 'Bob', role: 'Designer', status: 'Active' },
              { name: 'Carol', role: 'Product', status: 'Away' },
              { name: 'Dan', role: 'Engineer', status: 'Active' },
              { name: 'Eve', role: 'Marketing', status: 'Away' },
              { name: 'Frank', role: 'Engineer', status: 'Active' },
              { name: 'Grace', role: 'Designer', status: 'Away' },
            ]}
          />
        </Row>
        <Row label="Empty state" tokens={tokens}>
          <DataTable columns={[{ key: 'name', header: 'Name' }]} rows={[]} style={{ width: 320 }} />
        </Row>
      </Section>

      <Section title="CommandPalette" tokens={tokens} hidden={!showSection('CommandPalette')}>
        <Row label="⌘K to open" tokens={tokens}>
          <CommandPalette
            commands={[
              { id: 'new', label: 'New document', description: 'Create a blank document', group: 'Create', onSelect: () => {} },
              { id: 'open', label: 'Open file…', description: 'Browse and open a file', group: 'Create', onSelect: () => {} },
              { id: 'settings', label: 'Settings', description: 'Open app settings', group: 'Navigate', onSelect: () => {} },
              { id: 'logout', label: 'Log out', group: 'Account', onSelect: () => {} },
            ]}
          />
          <Text size="sm" color="secondary">Press <kbd style={{ padding: '1px 5px', borderRadius: tokens.radiusSm, border: `1px solid ${tokens.borderDefault}`, fontFamily: tokens.fontFamilyMono, fontSize: tokens.fontSizeXs }}>⌘K</kbd> to open the palette</Text>
        </Row>
      </Section>

      <Section title="MultiSelect" tokens={tokens} hidden={!showSection('MultiSelect')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <div key={s} style={{ width: 260 }}>
                <MultiSelect
                  size={s}
                  options={['React', 'Vue', 'Svelte', 'Angular', 'Solid', 'Preact', 'Lit'].map(v => ({ value: v.toLowerCase(), label: v }))}
                  placeholder={`Size ${s}`}
                />
              </div>
            ))}
          </div>
        </Row>
        <Row label="Default" tokens={tokens}>
          <div style={{ width: 320 }}>
            <MultiSelect
              options={['React', 'Vue', 'Svelte', 'Angular', 'Solid'].map(v => ({ value: v.toLowerCase(), label: v }))}
              placeholder="Select frameworks…"
            />
          </div>
        </Row>
        <Row label="Max 2 selections" tokens={tokens}>
          <div style={{ width: 320 }}>
            <MultiSelect
              options={['TypeScript', 'Rust', 'Go', 'Python', 'Elixir'].map(v => ({ value: v.toLowerCase(), label: v }))}
              max={2}
              placeholder="Pick up to 2 languages"
            />
          </div>
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <div style={{ width: 320 }}>
            <MultiSelect
              options={[{ value: 'a', label: 'Option A' }]}
              disabled
              placeholder="Disabled"
            />
          </div>
        </Row>
      </Section>

      <Section title="DatePicker" tokens={tokens} hidden={!showSection('DatePicker')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <DatePicker key={s} size={s} placeholder={`Size ${s}`} onChange={() => {}} />
            ))}
          </div>
        </Row>
        <Row label="Single date" tokens={tokens}>
          <DatePicker onChange={() => {}} />
        </Row>
        <Row label="With min (today)" tokens={tokens}>
          <DatePicker min={new Date()} placeholder="Future dates only" onChange={() => {}} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <DatePicker disabled />
        </Row>
      </Section>

      <Section title="DateRangePicker" tokens={tokens} hidden={!showSection('DateRangePicker')}>
        <Row label="Sizes" tokens={tokens}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <DateRangePicker key={s} size={s} placeholder={`Size ${s}`} onChange={() => {}} />
            ))}
          </div>
        </Row>
        <Row label="Default" tokens={tokens}>
          <DateRangePicker onChange={() => {}} />
        </Row>
        <Row label="Disabled" tokens={tokens}>
          <DateRangePicker disabled />
        </Row>
      </Section>

      <Section title="FileUpload" tokens={tokens} hidden={!showSection('FileUpload')}>
        <Row label="Single file" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} onChange={() => {}} />
          </div>
        </Row>
        <Row label="Multiple files" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <FileUpload
              multiple
              value={[
                { id: '1', file: new File([''], 'design.figma'), progress: 100 },
                { id: '2', file: new File([''], 'spec.pdf'), progress: 60 },
                { id: '3', file: new File([''], 'error.png'), error: 'Upload failed — server error' },
              ] as UploadFile[]}
              onChange={() => {}}
            />
          </div>
        </Row>
      </Section>

      <Section title="Timeline" tokens={tokens} hidden={!showSection('Timeline')}>
        <Row label="Event log" tokens={tokens}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Timeline
              items={[
                { id: '1', title: 'Order placed', date: 'Mar 1, 2026', status: 'success' },
                { id: '2', title: 'Payment processed', date: 'Mar 1, 2026', status: 'success' },
                { id: '3', title: 'Shipped', date: 'Mar 2, 2026', description: 'FedEx tracking: 7489201837' },
                { id: '4', title: 'Delivery failed', date: 'Mar 4, 2026', status: 'danger', description: 'No one home — will retry tomorrow.' },
                { id: '5', title: 'Awaiting re-delivery', date: 'Mar 5, 2026', status: 'warning' },
              ]}
            />
          </div>
        </Row>
      </Section>
      </div>
      ) : tab === 'tokens' ? (
        <TokenPreview />
      ) : (
        <SelectPlayground />
      )}
    </PageLayout>
  );
}

function Section({ title, tokens, children, hidden }: { title: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <Card variant="outline" padding="lg" style={{ marginBottom: tokens.space6 }}>
      <Text as="h2" size="lg" weight="semibold" style={{ marginBottom: tokens.space5, marginTop: 0 }}>{title}</Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space4 }}>{children}</div>
    </Card>
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
