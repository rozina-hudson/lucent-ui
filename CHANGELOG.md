# lucent-ui

## 0.19.0

### New: Toast Molecule

- **ToastProvider + useToast hook** — imperative API for ephemeral notifications. Wrap your app with `<ToastProvider>`, call `toast({ title, description, variant })` from anywhere via `useToast()`. Returns a dismissible id.
- **Variants** — `default`, `success`, `warning`, `danger`, `info` with matching semantic border colors and built-in 16×16 SVG icons (same icon set as Alert).
- **Multi-line text** — `title` (semibold) + optional `description` (secondary, supports `\n` via `white-space: pre-line`).
- **Action buttons** — inline action with two styles: bordered pill button (default, Sonner-style "Undo") or underlined link. Clicking fires the callback and auto-dismisses.
- **Cascading card stack** — multiple toasts stack as empty card shells behind the front toast with progressive `scaleX` reduction and opacity fade. Shells are height-matched to the front toast for perfectly uniform peek gaps. Up to 3 shells visible.
- **Hover to expand** — hovering the stack smoothly fans out all toasts into a full list with content fading in, card heights animating, and shadows appearing. 150ms debounced collapse prevents flicker between gaps.
- **Stable positioning** — the toast's anchored edge is pinned at a fixed distance from the screen edge (40px top, 120px bottom), so varying toast heights never cause the stack to jump. Six positions supported: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.
- **Enter/exit animations** — new toasts slide in from the screen edge with opacity fade and scale-up (double `requestAnimationFrame` CSS transition trigger). Dismissed toasts slide back and fade out.
- **Auto-dismiss** — configurable per-provider (default 5s) and per-toast. Pass `Infinity` to disable. Programmatic dismiss via `dismiss(id)`.
- **Portal rendering** — renders via `createPortal` to `document.body` (or custom `portalContainer` prop).
- **Accessibility** — `role="status"` + `aria-live="polite"` on each toast, `aria-hidden` on stacked shells, `aria-label="Dismiss"` on close button.

### Preview

- Toast section added to ComponentPreview with interactive position switcher (3×2 grid), variant trigger buttons, action style demos, and persistent toast button.

## 0.18.1

### Portal Container Prop

- **Menu** and **ColorPicker** now accept a `portalContainer` prop (`HTMLElement | null`) to control where the portal renders. Defaults to `document.body` (no breaking change).
- Fixes CSS custom property inheritance for per-section theming — consumers applying `--lucent-*` overrides on a wrapper element can now pass that element as `portalContainer` so portaled popovers inherit the overrides.
- CommandPalette is unaffected (renders inline with `position: fixed`, no portal).

## 0.18.0

### New: Menu Molecule

- **Compound component API** — `Menu`, `MenuItem`, `MenuSeparator`, `MenuGroup` compose naturally as JSX children. Menu items support divergent structures (icons, shortcuts, danger state, selected state, disabled) without data-array boilerplate.
- **Portal rendering** — popover portals to `document.body` via `createPortal`, escaping `overflow: hidden` ancestors.
- **Placement & auto-flip** — 8-direction placement (`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `right`) with automatic viewport-edge flipping. Position computed via `getBoundingClientRect` on mount.
- **Keyboard navigation** — full WAI-ARIA Menu Button pattern: arrow keys (wrapping), Enter/Space to select, Escape to close with focus return, Tab to dismiss, Home/End for first/last item.
- **Outside-click & scroll dismissal** — mousedown handler deferred via `requestAnimationFrame` to avoid catching the opening click. Scroll handler armed after 50ms to skip mount-triggered reflows.
- **Selected state** — `selected` prop on `MenuItem` renders a trailing accent-colored checkmark with `color-mix(in srgb, accent-default 12%, surface-overlay)` background and `shadow-sm` elevation. Visually stronger than hover (`surface-secondary`).
- **Size variants** — `sm` | `md` | `lg` flows from root `Menu` through context. Font sizes aligned with Button: sm → `font-size-sm`, md → `font-size-md`, lg → `font-size-lg`. Padding and checkmark icon scale proportionally.
- **Entrance + exit animations** — scale + fade (`scale(0.97) ↔ 1`, `opacity 0 ↔ 1`) over 120ms. Transform-origin derived from actual placement after auto-flip. Portal stays mounted during exit with `pointerEvents: none`.
- **Danger items** — `danger` prop renders text and icon in danger color.
- **Shortcut hints** — `shortcut` prop renders trailing secondary text (e.g. "⌘E").
- **Hover interaction** — `onMouseEnter` updates `activeIndex` to highlight items on hover, matching MultiSelect dropdown behavior.

### MultiSelect: Dropdown Font Scaling

- Dropdown item text now scales with the `size` prop: sm → `font-size-sm`, md → `font-size-md`, lg → `font-size-lg`. Previously hardcoded to `font-size-sm` at all sizes.
- Placeholder/input font for `lg` corrected from `font-size-md` to `font-size-lg`.
- "No options" and "Max N selected" text scale proportionally.

### Playground

- Menu added to the component comparison playground with knobs for size, placement, trigger variant, icons, selected state, and danger items.

## 0.17.0

### Button: Ultra-Dense Size

- **`size="2xs"`** — 22px height with `space-1` padding and `radius-md`, designed for dashboard toolbars, table-inline actions, and icon triggers where `xs` (26px) is still too tall. This was the most common reason consumers fell back to plain `<button>` elements during migration.
- 8px chevron icon scaled for the smaller size.

### Button: Danger Compound Variants

- **`variant="danger-outline"`** — red border + red text on surface background. Use for destructive actions that need visual weight without a filled background (e.g. "Revoke access").
- **`variant="danger-ghost"`** — red text on transparent background, no border. Use for low-emphasis destructive actions in list rows or dense UIs (e.g. "Remove").
- Both variants share danger-colored hover shadow, press ring, and focus ring with the existing filled `danger` variant.
- Resolves the API confusion where consumers used `variant="danger"` + `style={{ color }}` and got invisible red-on-red text.

### Manifest Updates

- Expanded variant prop description with per-value usage guidance (when to use each variant).
- Expanded size prop description with pixel heights and typical use cases for each value.
- Added usage examples for `danger-outline`, `danger-ghost`, and `2xs` icon trigger patterns.

## 0.16.0

### PageLayout Chrome Theming

- **`chromeBackground` prop** now accepts `"bgBase"` | `"bgSubtle"` | `"surface"`. Chrome regions (header, sidebar, footer) can use a subtle shade of the page background for visual distinction from the main content area.
- **Outer wrapper background** matches the chrome token, eliminating white gaps behind rounded main content cards.
- **Hidden scrollbars** on all scrollable regions (sidebar, main, right sidebar) — still scrollable, no visible chrome.
- **CSS variable fix**: `--lucent-bg-base` was incorrectly referenced as `--lucent-bgBase` (camelCase). Now uses the correct kebab-case form.

### Unified Design Customizer

The dev preview's right sidebar has been rebuilt from three separate panels (Preset / Tokens / Anchors) into a single unified customizer that mirrors the token derivation system:

- **Quick start** presets (Modern / Enterprise / Playful) set palette, shape, shadow, and font/spacing scales in one click.
- **Palette picker** — 12 color palettes update all anchor colors for the current theme.
- **Anchor color pickers** with live derived-variant dots showing the derivation chain (e.g. accent → hover, active, subtle, border, textOnAccent).
- **Accent cascading** — changing the accent color automatically derives hue-tinted `bgBase` and `borderDefault`.
- **Layout sliders** — Radius (with Sharp / Rounded / Pill snap points), Elevation (Flat / Subtle / Elevated), Font scale, Spacing scale.
- **All controls use Lucent UI components**: `Collapsible` sections, `SegmentedControl` for presets/shape/shadow, `Slider` for scales, `ColorPicker` with `size="sm" inline` for anchor colors, `ColorSwatch` for derived dots, `Divider`, `Button`.

### NavLink: `inverse` Prop

- **`inverse`** — uses `surface` background with `textPrimary` instead of accent for the active state. Active inverse links render with `border-default` border, `shadow-md` elevation, and a 3px accent-colored right border indicator. Ideal for sidebar navigation on tinted chrome.

### ColorPicker Enhancements

- **`size` prop** (`"sm"` | `"md"`, default `"md"`) — `sm` renders a compact 24px swatch trigger.
- **`inline` prop** — places the label beside the swatch instead of above it.
- **Portaled popover** — the color picker panel now renders via `createPortal` to `document.body`, escaping `overflow: hidden` ancestors. Outside-click detection updated for the portal.

### SegmentedControl Improvements

- **Elevation-aware indicator** — uses `shadow-sm` from the active shadow preset, matching the Card elevation system.
- **Accurate positioning** — indicator uses `getBoundingClientRect` with `ResizeObserver` for pixel-perfect alignment.
- **Zero-padding track** with 3px inset indicator for guaranteed equal spacing on all edges.
- **Focus ring** only appears on keyboard navigation (`:focus-visible`), not mouse clicks.

### Dev Preview Restructure

- **PageLayout as app shell** — the entire preview uses `PageLayout` with tab navigation (Components / Tokens / Playground) in the header, component nav in the left sidebar, and the customizer in the right sidebar.
- **Section containers** use `Card variant="outline"` on a `bgBase` canvas with `chromeBackground="bgSubtle"` on the chrome.
- **Body styles** — `margin: 0; overflow: hidden` on `<body>` to eliminate viewport scroll artifacts.

## 0.15.0

### Card Elevation Hierarchy & Interactive Props

#### Elevation variants

Five `variant` levels form a visual importance hierarchy, from lowest to highest:

- **ghost** — transparent background, no border. Invisible container for logical groupings.
- **outline** (default) — transparent background with border. The workhorse card for lists, forms, panels.
- **filled** — `surfaceTint` background, no border. Contextually darker/lighter than its container via a hue-matched tint derived from `bgBase`.
- **elevated** — `surface` background with border and shadow. The classic floating card.
- **combo** — filled wrapper with an elevated body inset. Header/footer recede into the tint while the body pops as a bright surface.

#### Interactive cards

- **`onClick`** — renders the card as `<button>` with hover lift (`translateY(-1px)`), focus ring, and active press state matching the Button component.
- **`href`** — renders the card as `<a>` with the same interactive states.
- **`disabled`** — reduces opacity, blocks interaction, sets `cursor: not-allowed`.

#### Status accent

- **`status`** prop (`success | warning | danger | info`) adds a 3px colored bar on the left edge using the corresponding status token.

#### Selectable cards

- **`selected`** prop adds an outer `accent-subtle` ring and subtle background tint. Sets `aria-pressed` on interactive cards. Pairs with `onClick` for toggle behavior.

#### Media slot

- **`media`** prop renders full-bleed content at the top of the card (before header) with no padding. For hero images, illustrations, or any edge-to-edge top content.

### Token System Changes

- **New token: `surfaceTint`.** A hue-matched darker shade of `bgBase` (light: `adjustLightness(bgBase, -0.04)`, dark: `+0.03`). Used by `filled` and `combo` card variants. Derived automatically when `bgBase` is customized.
- **`surface` auto-derived from `bgBase`.** When `bgBase` is customized and `surface` is not explicitly set, `surface` is pushed 85% toward white (light mode) with 30% saturation retention. All surface variants (`surfaceSecondary`, `surfaceRaised`, `surfaceOverlay`) cascade from it.
- **`surface` is now optional in `ThemeAnchors`.** Consumers only need to set `bgBase` — the entire surface hierarchy derives automatically.
- **Card padding is now asymmetric.** Vertical padding is tighter than horizontal (e.g. md = `space-4` vertical, `space-5` horizontal).

### Shadow Presets Updated

- **Subtle preset:** Soft dual-layer shadows (`rgba(17,17,26)` at ~60% of elevated opacity). Diffused and gentle.
- **Elevated preset:** Same dual-layer structure at full opacity with wider blur radii (`0px 4px 16px` + `0px 8px 32px` for `shadowMd`).

## 0.14.2

### Neutral Text & Control Track Colors

- **Removed `textPrimary` from all palette presets.** Text colors now stay neutral gray (`#111827` light / `#f3f4f6` dark) regardless of accent palette. Previously each palette tinted `textPrimary` to match its accent hue, which made the UI feel too colorful.
- **Made `textPrimary` optional in `ThemeAnchors`.** Palettes and `createTheme` callers no longer need to specify it — it falls through to the base theme default.
- **New token: `controlTrack`.** A neutral gray background for inactive control surfaces (light: `#d1d5db`, dark: derived from `bgBase`). Decoupled from `borderDefault` so it isn't affected by accent-tinted palette borders.
- **Toggle:** Off-state track uses `controlTrack` instead of `borderStrong`.
- **Slider:** Unfilled track and disabled track use `controlTrack` instead of `borderDefault` (WebKit and Firefox).

## 0.14.1

### Patch Changes

- Fix form field sizing alignment and add DatePicker/DateRangePicker label, helper, and error props.

## 0.14.0

### Form Field Consistency & Picker Labels

- **Textarea:** Label font size is now size-aware, matching Input (sm/md use `font-size-sm`, lg uses `font-size-md`). Horizontal padding aligned with Input (`space-3` for sm, `space-4` for md/lg).
- **Select:** `lg` value font size corrected from `font-size-lg` to `font-size-md` to match Input.
- **DatePicker / DateRangePicker:** Added `label`, `helperText`, and `errorText` props. Fixed `box-sizing` from `content-box` to `border-box` so width no longer grows with padding. Horizontal padding is now size-aware, matching Input/Select. Icon-to-text gap is now size-aware (`space-2` for sm, midpoint for md, `space-3` for lg). Focus ring updated to border + `boxShadow` pattern matching Input/Select. Manifests updated with new props and `aria-invalid`.
- **Chip:** The `accent` variant now uses a solid accent background with auto-derived text-on-accent color for better visual weight and contrast.
- **Playground:** DatePicker and DateRangePicker entries now include label, helperText, and errorText controls.

## 0.13.0

### New: Chip Component

- **Unified replacement for Tag + Badge** — single flexible label primitive for filters, tags, statuses, and categories
- Props: `variant`, `size` (sm/md/lg), `onDismiss`, `onClick`, `leftIcon`, `swatch` (color dot), `dot` (status indicator), `borderless`, `disabled`
- Renders as `<button>` when `onClick` is provided for native semantics
- Heights scale with spacing tokens via dampened formula
- Hover animation: `translateY(-1px)` + shadow on interactive chips
- Tag and Badge kept for backward compatibility

### Checkbox / Radio / Toggle Enhancements

- **`contained` prop** — bordered container with accent border + subtle bg when checked. Use for plan cards, feature toggles, consent items
- **`helperText` prop** — secondary text below label, label auto-upgrades to medium weight
- **`lg` size** for Checkbox (20px) and Radio (20px)
- **Toggle `align` prop** — `left` (default) or `right` to push track to container end
- Font sizes aligned: sm=`font-size-sm`, md/lg=`font-size-md` across all three

### Token-Based Heights

- All form control heights use `calc(space-token × 0.5 + fixed)` for **dampened vertical scaling** — horizontal padding scales fully while height scales at 50% rate
- Applies to: Input, Select, Button, DatePicker, DateRangePicker, Checkbox/Radio/Toggle contained, MultiSelect, Chip

### MultiSelect Enhancements

- **`label`**, **`helperText`**, **`errorText`** props matching Input pattern
- Focus ring matches Input (`boxShadow` instead of `outline`)
- Dropdown positions relative to trigger (not label/helper)
- Size × density matrix for dropdown/option padding
- Checkbox size in dropdown matches MultiSelect size
- Uses Chip (not Tag) for selected values

### SearchInput Enhancements

- **`label`**, **`helperText`**, **`errorText`** passthrough to Input
- Search icon scales with size (sm=14px, md=18px, lg=20px)
- Icon padding uses `calc` with actual icon sizes + gap tokens

### Textarea

- **`size` prop** (sm/md/lg) with size-aware font and padding

### Input Fixes

- Focus ring now works when `onFocus`/`onBlur` passed via rest props (fixed `{...rest}` spread order)
- Horizontal padding bumped up (sm=`space-3`, md/lg=`space-4`)
- Size-aware label/helper/error font sizes (sm/md=`font-size-sm`, lg=`font-size-md`)
- `prefix` and `suffix` props documented in manifest

### Dev Tooling

- **Playground sliders**: spacing, font size, and roundness — scale tokens in real time
- **All sizes stacked** in preview (no size selector needed)
- **Component filter** in ComponentPreview — search to show/hide sections
- Customizer buttons use Button atom with color swatch `leftIcon`
- Radio, Chip entries added to playground with full prop controls

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
