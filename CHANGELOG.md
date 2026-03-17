# lucent-ui

## 0.11.0

### Component Consistency

- **Select**: refactored to wrapper-div architecture matching Input — fixes height mismatch from browser UA padding
- **Select/Textarea**: proper disabled state (transparent border, muted bg, disabled text, not-allowed cursor)
- **Textarea**: border radius aligned to `radius-lg`, hover border added, focus ring transitions smoothed
- **SearchInput**: added `size` prop (`sm`/`md`/`lg`) passthrough to Input
- **Button heights** aligned to match Input/Select at every size

### Button Overhaul

- **New `outline` variant** — bordered button (previously `secondary`); `secondary` is now a filled surface button
- **Hover animation** on all variants: `translateY(-1px)` lift + accent-derived glow via `color-mix`
- **Press state**: `translateY(1px)` + accent ring with 2px gap offset
- **Disabled state**: theme-aware neutral gray via `color-mix` (no accent tinting in any preset)
- **Focus ring**: variant-aware (danger uses `danger-subtle`)
- **Primary border removed** for cleaner look

### APCA Contrast Algorithm

- Replaced WCAG 2.1 luminance threshold with **APCA** (Accessible Perceptual Contrast Algorithm) for `getContrastText` — correctly handles saturated blues/purples where WCAG 2.1 picks the wrong text color
- `ensureContrast()` nudges accent lightness until APCA Lc ≥ 60 (fluent body text readability)
- `LucentProvider` auto-adjusts `accentDefault` — no accent color ever produces unreadable button text
- New exports: `apcaContrast`, `ensureContrast`, `getContrastRatio`

### 6 New Palette Presets

- **Trendy**: `violet` (#8b5cf6), `coral` (#e8624a), `teal` (#0d9488), `amber` (#d97706)
- **Muted**: `slate` (#475569), `sage` (#5f8c6e)
- Total palette count: 12

### Dev Tooling

- **Component Playground**: pick any two components, configure props, compare side-by-side

## 0.10.0

### New: Design Presets

Pick a curated preset and get an instantly polished UI — colors, spacing, borders, and shadows — with zero manual configuration.

- **3 combined presets**: `modern`, `enterprise`, `playful`
- **4 mixable dimensions**: palette (6 options), shape (3), density (3), shadow (3)
- **Full-atmosphere palettes**: bg, surface, and border colors are tinted toward the accent hue — not just a recolored accent on neutral grays
- Works with both light and dark themes automatically

```tsx
<LucentProvider preset="modern">
<LucentProvider preset={{ palette: 'ocean', shape: 'pill', density: 'compact', shadow: 'elevated' }}>
```

### New: `npx lucent-ui init`

Interactive CLI that walks you through preset selection and writes a `lucent.config.ts` + provider snippet.

### New: MCP preset tools

- `list_presets` — discover all available presets and dimensions
- `get_preset_config` — generate ready-to-use provider config from a selection

## 0.9.1

### Patch Changes

- Fix ColorPicker popover opening off-viewport when trigger is near the right edge; increase Card default padding sizes by ~1.5×

## 0.9.0

### Minor Changes

- 2c2342f: Add ColorSwatch, SegmentedControl, ColorPicker atoms; enhance Input and Select

  **New atoms**

  - `ColorSwatch` — circular or square swatch with sizes (xs–2xl), selected state, checkerboard alpha support, and full button attribute forwarding
  - `SegmentedControl` — sliding active indicator, fullWidth default, sm/md/lg sizes
  - `ColorPicker` — spectrum panel, hue/alpha sliders, Hex/RGB/HSL/HSB format tabs, multi-group preset palettes, eyedropper support

  **Breaking changes**

  - `ColorPicker`: `presets`/`presetsLabel` props replaced by `presetGroups: ColorPresetGroup[]`

  **Enhancements**

  - `Input`: new `size` prop (sm/md/lg), `prefix`/`suffix` addons, `leftElement`/`rightElement` icon slots
  - `Select`: `style` prop now applies to the outer wrapper div (consistent with `Input`)

## 0.6.0

### Minor Changes

- feat(DataTable): add per-column searchable multi-select filtering

  Each column can opt in via `filterable: true`, which renders a dropdown filter button above the table. Dropdowns are searchable and multi-select — a search input narrows the option list and checkboxes toggle set membership. A "Clear selection" link clears a single column; "Clear all" clears all active filters. An `onFilterChange` callback receives the current filter map as `Record<string, string[]>`. Filter → sort → paginate is the fixed pipeline order; any filter change resets the page to 0. Fixes stacking context bug where the dropdown panel was obscured by the table wrapper's `overflow: auto` stacking context.

## 0.5.0

### Minor Changes

- 3acd078: Add border color picker with theme-aware derivation to customizer. Export new color utility functions for theme-specific color transformation: `getThemeComplementBorderColor` and `deriveBorderVariants`.

## 0.4.2

### Patch Changes

- Add missing component manifests for NavLink, Breadcrumb, Tabs, and Collapsible.

## 0.4.1

### Patch Changes

- Extend `PageLayout` with right panel and footer slot.

  - Add `rightSidebar` / `rightSidebarWidth` / `rightSidebarCollapsed` props — renders an `<aside>` as a structural sibling of `<main>` in the body row
  - Add `footer` / `footerHeight` props — renders a narrow status-bar below the body row (default 28px), suited for connection indicators, branch names, or keyboard shortcut hints
  - `<main>` right margin automatically drops to zero when `rightSidebar` is present
  - Add `PageLayout.manifest.ts` documenting all props, design intent, and accessibility notes

## 0.4.0

### Minor Changes

- 8d5b4b9: Add Molecules Wave 2: DataTable, CommandPalette, MultiSelect, DatePicker, DateRangePicker, FileUpload, Timeline.

  Higher-complexity AI-first molecules with rich `ComponentManifest` entries (specVersion 1.0). All components are zero-dependency beyond React and use CSS custom properties only.

## 0.3.0

### Minor Changes

- 439f24c: Add `lucent-manifest init` CLI for bring-your-own-tokens onboarding.

  Run `npx lucent-manifest init --figma-token <token> --file-key <key>` to fetch your Figma Variables and generate a `lucent.manifest.json` token override file. Run `npx lucent-manifest init --template` to get a pre-filled JSON template for manual editing. See `docs/bring-your-own-tokens.md` for full usage.

## 0.2.0

### Minor Changes

- 7ab4a98: Add Breadcrumb, Tabs, Collapsible, NavLink, and PageLayout components

## 0.1.1

### Patch Changes

- e7b3f6d: **Button**: add `spread` prop (`justifyContent: space-between`) for full-width buttons with edge-aligned icons (e.g. sidebar toggles with a chevron on the right). Add `disableHoverStyles` prop to prevent built-in hover overrides from clobbering custom `style` colours.

  **Badge**: expose `style` prop, merged after variant styles. Enables custom colour combinations (e.g. brand/gold badges) without requiring a new variant.

  **Divider**: expose `style` prop on all three render variants (plain, vertical, labelled). Enables `flex: 1` stretch in flex-row layouts.
