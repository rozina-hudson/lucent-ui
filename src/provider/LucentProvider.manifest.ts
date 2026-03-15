import type { ComponentManifest } from '../manifest/types.js';
import type { ThemeAnchors } from '../tokens/types.js';

/**
 * Semantic guidance for each ThemeAnchors key.
 *
 * An LLM reading this can translate a brand brief or hex palette directly
 * into a valid ThemeAnchors object without needing to know internal token
 * names or the derivation system. Each entry describes:
 *   - what the token controls visually
 *   - what range of colors is appropriate
 *   - which variant tokens are automatically derived from it
 */
export const ThemeAnchorsSpec: Record<keyof ThemeAnchors, {
  description: string;
  lightGuidance: string;
  darkGuidance: string;
  derives: string[];
}> = {
  bgBase: {
    description: 'Main page/canvas background. The lowest elevation layer — everything sits on top of this.',
    lightGuidance: 'Near-white. Typically #ffffff or a very faint tint (L > 0.96).',
    darkGuidance: 'Near-black with a subtle cool or warm tint. Typically L 0.07–0.10 (e.g. #0f0f11, #111318).',
    derives: ['bgSubtle'],
  },
  surface: {
    description: 'Component surface color. Used for cards, input backgrounds, table rows, list items — any component that "floats" above the page canvas.',
    lightGuidance: 'Very slightly off-white — just enough to read as distinct from bgBase. Typically L 0.96–0.98 (e.g. #f9fafb, #f8f8f8).',
    darkGuidance: 'Slightly lighter than bgBase. Typically L 0.11–0.15 (e.g. #1a1a1e, #18181b).',
    derives: ['surfaceSecondary', 'surfaceRaised', 'surfaceOverlay'],
  },
  borderDefault: {
    description: 'Default border and divider color. Used on input outlines, card borders, table cell borders, section dividers.',
    lightGuidance: 'A mid-light gray. Enough contrast to be legible on bgBase, not so dark it draws attention. Typically L 0.85–0.92 (e.g. #e5e7eb, #d1d5db).',
    darkGuidance: 'A dim gray that reads against dark surfaces. Typically L 0.18–0.26 (e.g. #2d2d35, #374151).',
    derives: ['borderSubtle', 'borderStrong'],
  },
  textPrimary: {
    description: 'Primary body text. High contrast against bgBase — the default color for headings, labels, and body copy.',
    lightGuidance: 'Very dark — near-black. Typically L 0.04–0.15 (e.g. #111827, #0f172a). Must pass WCAG AA against bgBase.',
    darkGuidance: 'Very light — near-white. Typically L 0.88–0.96 (e.g. #f9fafb, #e2e8f0). Must pass WCAG AA against bgBase.',
    derives: ['textSecondary', 'textDisabled'],
  },
  accentDefault: {
    description: 'Primary brand/action color. Drives the visual identity — used on primary buttons, active nav links, focus rings, badges, and progress indicators.',
    lightGuidance: 'Pick a color with enough contrast against both bgBase (white) and textOnAccent (computed automatically). Saturated mid-tones work well. E.g. indigo #6366f1, violet #8b5cf6, emerald #10b981. Monochrome default is #111827 (near-black).',
    darkGuidance: 'In dark mode the accent typically lightens so it stays visible. This is handled automatically via deriveDarkFromLight() — you can supply the same light-mode accent and the dark variant is computed.',
    derives: ['accentHover', 'accentActive', 'accentSubtle', 'accentBorder', 'textOnAccent'],
  },
  successDefault: {
    description: 'Positive/success state color. Used on success alerts, completed step indicators, "online" status badges, and confirmation toasts.',
    lightGuidance: 'A readable green in the mid-to-dark range. E.g. #22c55e (Tailwind green-500), #16a34a (green-600). Avoid very pale greens — they fail WCAG against white.',
    darkGuidance: 'Slightly lighter than the light-mode value so it reads against dark surfaces. createTheme() handles this automatically.',
    derives: ['successSubtle', 'successText'],
  },
  warningDefault: {
    description: 'Cautionary/warning state color. Used on warning banners, pending/in-review badges, and "needs attention" indicators.',
    lightGuidance: 'An amber or orange-yellow. E.g. #f59e0b (Tailwind amber-500), #d97706 (amber-600). Avoid pure yellow — insufficient contrast on white.',
    darkGuidance: 'Slightly lighter than light-mode. createTheme() handles this automatically.',
    derives: ['warningSubtle', 'warningText'],
  },
  dangerDefault: {
    description: 'Error/destructive state color. Used on error messages, delete-confirmation buttons, form field errors, and "offline" or "failed" status.',
    lightGuidance: 'A mid-to-dark red. E.g. #ef4444 (Tailwind red-500), #dc2626 (red-600).',
    darkGuidance: 'Slightly lighter than light-mode. createTheme() handles this automatically.',
    derives: ['dangerHover', 'dangerSubtle', 'dangerText'],
  },
  infoDefault: {
    description: 'Neutral informational state color. Used on info banners, help tooltips, "new feature" callouts, and link colors in some contexts.',
    lightGuidance: 'A mid blue. E.g. #3b82f6 (Tailwind blue-500), #2563eb (blue-600).',
    darkGuidance: 'Slightly lighter than light-mode. createTheme() handles this automatically.',
    derives: ['infoSubtle', 'infoText'],
  },
};

export const LucentProviderManifest: ComponentManifest = {
  id: 'lucent-provider',
  name: 'LucentProvider',
  tier: 'provider',
  domain: 'neutral',
  specVersion: '1.0',

  description:
    'Root configuration wrapper that injects Lucent design tokens as CSS custom properties. ' +
    'Accepts a design preset for instant theming, 9 anchor colors (via `anchors`) for zero-config theming, ' +
    'or granular token overrides (via `tokens`) for full control.',

  designIntent:
    'LucentProvider is the single source of truth for the visual identity of any Lucent-powered UI. ' +
    'Its primary design goal is to make custom theming accessible to both humans and LLMs with minimal effort.\n\n' +

    'PRESET MODE (fastest path): Pass `preset` with a named preset ("modern", "enterprise", "playful") ' +
    'or an object mixing dimensions: `{ palette: "indigo", shape: "pill", density: "compact", shadow: "elevated" }`. ' +
    'Presets bundle palette colors, border radius, spacing, and shadows into one cohesive design. ' +
    'Available palettes: default, brand, indigo, emerald, rose, ocean. ' +
    'Shapes: sharp, rounded, pill. Densities: compact, default, spacious. Shadows: flat, subtle, elevated. ' +
    'Presets work with both light and dark themes automatically.\n\n' +

    'ANCHOR MODE (recommended for LLMs building custom themes): Pass `anchors` with 9 semantic colors and the provider ' +
    'automatically derives all 30+ variant tokens — hover/active/subtle states, WCAG-compliant ' +
    'contrast text, status subtle tints, surface elevation steps, and more. An LLM generating a ' +
    'themed UI only needs to reason about 9 colors, not the full token surface.\n\n' +

    'TOKEN MODE (for granular control): Pass `tokens` as a partial override object. Any token not ' +
    'supplied falls back to the base light or dark theme. Derivation still runs — e.g. if you ' +
    'supply only `accentDefault`, the provider auto-derives `accentHover`, `accentActive`, ' +
    '`accentSubtle`, `accentBorder`, and `textOnAccent`.\n\n' +

    'PRECEDENCE (later wins): base theme → preset → anchors → tokens. ' +
    'You can combine preset with tokens to start from a preset and tweak individual values.\n\n' +

    'WCAG auto-computation: `textOnAccent` is always computed from the resolved accent color via ' +
    'relative luminance — it will be #000000 or #ffffff, whichever passes AA contrast. ' +
    'Consumers can override it if they have brand-specific requirements.\n\n' +

    'DARK MODE: Pass `theme="dark"` alongside any prop. Presets include both light and dark palettes. ' +
    'Anchor colors are applied to the dark base palette; derivation runs with dark-calibrated lightness deltas.\n\n' +

    'DO NOT nest multiple LucentProviders unless intentionally theming a sub-tree differently ' +
    '(e.g. an inverted sidebar). The outermost provider wins for `:root` CSS vars.',

  props: [
    {
      name: 'preset',
      type: 'PresetProp',
      required: false,
      description:
        'Design preset for instant theming. Pass a combined name ("modern", "enterprise", "playful") ' +
        'or an object to mix dimensions: { palette?: "default"|"brand"|"indigo"|"emerald"|"rose"|"ocean", ' +
        'shape?: "sharp"|"rounded"|"pill", density?: "compact"|"default"|"spacious", ' +
        'shadow?: "flat"|"subtle"|"elevated" }. You can also pass imported preset objects directly ' +
        'for tree-shaking. Precedence: base theme → preset → anchors → tokens.',
    },
    {
      name: 'anchors',
      type: 'ThemeAnchors',
      required: false,
      description:
        'Minimal theming API: supply 9 semantic anchor colors and all variant tokens are derived ' +
        'automatically. See ThemeAnchorsSpec for guidance on each key. ' +
        'When provided alongside a preset, anchors override the preset\'s palette colors ' +
        'but preset shape/density/shadow tokens are preserved. When provided without a preset, ' +
        'the `tokens` prop is ignored. ' +
        'Keys: bgBase, surface, borderDefault, textPrimary, accentDefault, ' +
        'successDefault, warningDefault, dangerDefault, infoDefault.',
    },
    {
      name: 'theme',
      type: 'enum',
      required: false,
      default: '"light"',
      enumValues: ['light', 'dark'],
      description:
        'Selects the base token palette. "light" uses lightTokens as the starting point; ' +
        '"dark" uses darkTokens. Applies to both anchor-mode and token-mode.',
    },
    {
      name: 'tokens',
      type: 'Partial<LucentTokens>',
      required: false,
      description:
        'Granular token overrides. Any token not supplied falls back to the base theme. ' +
        'Variant derivation still runs for anchor tokens found in this object ' +
        '(e.g. supplying `accentDefault` auto-derives hover/active/subtle variants). ' +
        'Ignored when `anchors` is provided.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The subtree to theme. Typically your entire app, or a section that needs independent theming.',
    },
  ],

  usageExamples: [
    {
      title: 'Preset mode — combined preset (simplest)',
      description: 'Pick a curated preset that bundles palette, shape, density, and shadow tokens. Works with both light and dark themes.',
      code: `import { LucentProvider } from 'lucent-ui';

<LucentProvider preset="modern">
  <App />
</LucentProvider>

{/* Dark mode with the same preset */}
<LucentProvider theme="dark" preset="modern">
  <App />
</LucentProvider>`,
    },
    {
      title: 'Preset mode — mix and match dimensions',
      description: 'Pick each dimension independently for a custom combination.',
      code: `import { LucentProvider } from 'lucent-ui';

<LucentProvider
  preset={{
    palette: 'ocean',
    shape: 'pill',
    density: 'compact',
    shadow: 'elevated',
  }}
>
  <App />
</LucentProvider>`,
    },
    {
      title: 'Preset mode — with token overrides',
      description: 'Start from a preset and tweak individual tokens. The tokens prop wins over the preset.',
      code: `import { LucentProvider } from 'lucent-ui';

<LucentProvider
  preset="modern"
  tokens={{ accentDefault: '#8b5cf6', radiusLg: '1rem' }}
>
  <App />
</LucentProvider>`,
    },
    {
      title: 'Preset mode — tree-shakeable direct imports',
      description: 'Import preset objects directly for maximum bundle control.',
      code: `import { LucentProvider, indigoPalette, pillShape } from 'lucent-ui';

<LucentProvider preset={{ palette: indigoPalette, shape: pillShape }}>
  <App />
</LucentProvider>`,
    },
    {
      title: 'Anchor mode — indigo brand (light)',
      description: 'The recommended pattern for LLMs. 9 colors produce a complete WCAG-compliant theme.',
      code: `import { LucentProvider } from 'lucent-ui';

<LucentProvider
  anchors={{
    bgBase:         '#ffffff',
    surface:        '#f9fafb',
    borderDefault:  '#e5e7eb',
    textPrimary:    '#111827',
    accentDefault:  '#6366f1',
    successDefault: '#22c55e',
    warningDefault: '#f59e0b',
    dangerDefault:  '#ef4444',
    infoDefault:    '#3b82f6',
  }}
>
  <App />
</LucentProvider>`,
    },
    {
      title: 'Anchor mode — dark theme',
      description: 'Same anchors, dark mode. The provider applies dark-calibrated derivation automatically.',
      code: `import { LucentProvider } from 'lucent-ui';

<LucentProvider
  theme="dark"
  anchors={{
    bgBase:         '#0f0f11',
    surface:        '#18181b',
    borderDefault:  '#27272a',
    textPrimary:    '#f4f4f5',
    accentDefault:  '#818cf8',
    successDefault: '#4ade80',
    warningDefault: '#fbbf24',
    dangerDefault:  '#f87171',
    infoDefault:    '#60a5fa',
  }}
>
  <App />
</LucentProvider>`,
    },
    {
      title: 'Single accent override via tokens',
      description: 'When you only need to change the accent color. All variants are auto-derived.',
      code: `import { LucentProvider } from 'lucent-ui';

<LucentProvider tokens={{ accentDefault: '#8b5cf6' }}>
  <App />
</LucentProvider>`,
    },
    {
      title: 'createTheme() then pass as tokens',
      description: 'Use the pure createTheme() helper when you need the resolved token object for other purposes (e.g. passing to a charting library or Storybook decorator).',
      code: `import { LucentProvider, createTheme } from 'lucent-ui';

const myTheme = createTheme({
  bgBase:         '#ffffff',
  surface:        '#f5f5f4',
  borderDefault:  '#e7e5e4',
  textPrimary:    '#1c1917',
  accentDefault:  '#f97316',
  successDefault: '#22c55e',
  warningDefault: '#f59e0b',
  dangerDefault:  '#ef4444',
  infoDefault:    '#3b82f6',
});

// myTheme is a complete LucentTokens — no undefined values
<LucentProvider tokens={myTheme}>
  <App />
</LucentProvider>`,
    },
    {
      title: 'Sub-tree theming (inverted sidebar)',
      description: 'Nest a second LucentProvider to theme only a portion of the UI differently.',
      code: `import { LucentProvider } from 'lucent-ui';

<LucentProvider anchors={{ ...lightAnchors }}>
  <div style={{ display: 'flex' }}>
    <LucentProvider theme="dark" anchors={{ ...darkAnchors }}>
      <Sidebar />
    </LucentProvider>
    <main>
      <App />
    </main>
  </div>
</LucentProvider>`,
    },
  ],

  compositionGraph: [],
};
