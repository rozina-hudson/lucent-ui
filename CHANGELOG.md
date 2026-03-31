# lucent-ui

## 0.31.0

### Golden Compositions

Six interactive compositions in `dev/compositions/` that serve as visual proof the component system produces polished, real-world UI:

- **ProfileCard** — Avatar, name/status chip, bio, skill tags, stats row, follow/message buttons
- **PreferencesCard** — Header with version badge, overflow menu, toggle setting rows with icons, slider, select dropdown, save/reset actions
- **PricingTable** — Three-tier pricing cards (Free/Pro/Enterprise) with feature lists, middle card highlighted with accent border
- **NotificationFeed** — Notification list with read/unread states (accent-tinted background), type chips, icon action buttons with tooltips
- **OnboardingFlow** — Multi-step form with Stepper, form fields, and back/next navigation
- **DashboardHeader** — Breadcrumb navigation, page title with icon action buttons, four stat cards with trend chips

Added as a **Compositions** nav group in the dev playground alongside Atoms, Molecules, and Patterns.

### Stepper molecule

**New molecule** — `Stepper` — a step indicator for multi-step flows (onboarding, wizards, checkout).

- **Horizontal orientation** — continuous connector track behind circles with animated fill between steps; first/last labels align left/right, middle labels center under their circles
- **Vertical orientation** — connector column on the left with labels, descriptions, and status beside circles
- **Props:** `steps` (strings or `{ label, description, icon }` objects), `current`, `size` (sm/md/lg), `orientation`, `numbered` (STEP N prefix), `showStatus` (Chip badges)
- **Animated checkmark** — spring scale (0→1.2→1) on step completion
- **Status badges** — Chip atoms (success/accent/neutral borderless) for Completed/In Progress/Pending
- **Custom icons** — per-step icon prop overrides the default number/checkmark
- Full manifest with 6 usage examples, composition graph, and accessibility notes

### Recipes renamed to Patterns

Renamed the "recipes" tier to **"patterns"** across the entire codebase to clarify the design system hierarchy:

```
Atoms → Molecules → Patterns → Compositions
```

- **Directory:** `src/manifest/recipes/` → `src/manifest/patterns/`
- **Files:** `.recipe.ts` → `.pattern.ts`
- **Types:** `CompositionRecipe` → `CompositionPattern`, `RecipeCategory` → `PatternCategory`
- **MCP tools:** `get_composition_recipe` → `get_composition_pattern`
- **Server:** `recipe-registry.ts` → `pattern-registry.ts`, `ALL_RECIPES` → `ALL_PATTERNS`
- **Nav:** "Recipes" → "Patterns" in the dev playground sidebar
- Deprecated type aliases kept for backward compatibility

### New patterns

Four new pattern manifests for AI retrieval:

- **pricing-table** — three-tier pricing card layout
- **notification-feed** — notification list with read/unread states and action buttons
- **onboarding-flow** — multi-step form with progress indicator
- **dashboard-header** — page header with breadcrumbs, title, actions, and stat cards

## 0.30.0

### Timeline redesign

Redesigned from outlined-ring event list to a modern activity-feed pattern.

- **Filled dots** — compact 20px circles filled with the status color, white iconography (was 28px outlined rings with colored icons)
- **Inline title + date** — date follows title on the same line instead of being pushed to the far right
- **`content` prop** — new slot on `TimelineItem` for embedding rich nested blocks (e.g. `<Card>`) below the title/description
- **`info` status icon** — added (was missing)
- **Default dot** — small white inner dot on muted fill
- **Thinner connector** — 1.5px (was 2px)
- Updated manifest with activity feed usage example and Card in compositionGraph

### FilterMultiSelect enhancements

- Added `xs` size for compact toolbar usage
- Added `ghost` variant
- Label-less triggers no longer render a chevron

## 0.29.0

### Recipe: Search / Filter Bar

**New composition recipe** — `search-filter-bar` — a compact toolbar pattern for filtering and sorting lists and data tables.

**Compact button-based design:** All filters are secondary buttons that open popovers — no visible input fields or select dropdowns cluttering the bar.

- **Collapsible search** — square icon-only button that expands to an Input on click, collapses back when blurred empty
- **Single-select filters** — secondary button + chevron opens a Menu with selectable items (e.g. Availability)
- **Multi-select filters** — controlled Menu that stays open on toggle, with accent Chip count badge in the button label (e.g. Status, Tags)
- **Tags with visual identity** — Menu items combine Checkbox + Chip with colored swatches for rich multi-select visuals
- **Date range filter** — DateRangePicker with new `trigger` prop renders a Button instead of default input-style trigger
- **Conditional "Clear all"** — ghost button appears when any filter is active, resets all on click
- **Sort + view toggle** — pushed to right edge via flex spacer; sort button with icon + chevron, SegmentedControl with grid/list icons

**DateRangePicker enhancement:** New optional `trigger` prop accepts a custom ReactNode, replacing the default input-style button. Same pattern as Menu's trigger prop.

**Recipe variants:** Default (full toolbar), Minimal (search + sort only), Pipeline (multi-select filters only).

Registered in MCP tools (`get_composition_recipe`, `search_components`) and added to ComponentPreview.

## 0.28.0

### LucentDevTools — Live Token Editor & Design System Explorer

**New: `lucent-ui/devtools` entry point** — a floating panel for real-time design system manipulation. Drop `<LucentDevTools />` inside your `<LucentProvider>` and toggle with Cmd+Shift+D.

**Three-tab panel:**
- **Design** — preset gallery (10 design personalities), accent/background/surface/border color pickers with auto-derivation, density slider, roundness slider, shadow style selector (9 styles), font family per preset
- **Typography** — font family picker with 14 Google Fonts (auto-loaded on demand), category filter (sans/serif/mono/display), type scale controls (base size + ratio + named presets), text color pickers, live paragraph preview
- **Tokens** — raw token editor for all ~80 tokens with per-token color pickers, sliders, and text inputs

**10 curated design presets:** Default, Modern, Liquid Glass, Bento, Brutalist, Terminal, Soft UI, Bloom, Minimal, Enterprise — each a harmonious combination of accent color, font family, type scale, density, roundness, and shadow style.

**Panel features:**
- Overlay or push mode (push shifts page content left)
- Theme toggle (light/dark)
- Copy Config — exports current overrides as a `<LucentProvider tokens={...}>` snippet
- Reset All — clears all overrides instantly
- Override count badge
- CSS var override mechanism — instant visual updates, no React re-render
- Built with lucent-ui components (Tabs, Button, Toggle, Badge, Text, Slider, Input, Select, SegmentedControl, ColorPicker) scoped to a fixed dark theme via `DevToolsScope`
- Separate entry point — zero devtools code in the main `lucent-ui` bundle

### 8 new shadow presets + dark-mode-native shadows

**New shadow styles:** Liquid Glass, Brutalist, Neumorphic, Natural, Glow — added to the existing Flat, Subtle, Elevated.

**Dark mode paradigm shift:** Every dark-mode shadow variant rewritten from scratch. Instead of darkening (invisible on dark backgrounds), shadows now simulate light sources:

| Preset | Dark mode technique |
|--------|-------------------|
| Default | Lit edge — `inset 0 1px` white highlight simulating overhead light |
| Subtle | Ambient — large soft accent-tinted glow via `color-mix()` |
| Elevated | Inset glow — internal luminosity via `inset 0 0 Npx rgba(255,255,255)` |
| Natural | Layered lit edges — stacked `inset` highlights at increasing intensity |
| Liquid Glass | Frosted backlight — inner white glow + outer white diffusion |
| Neumorphic | Chromatic — accent-colored glow on one side, white highlight on the other |
| Brutalist | Accent outline — bright accent ring + accent offset block (not dark) |
| Glow | Pure accent glow (already dark-mode-native) |

**Brutalist shadows** use `color-mix()` with `var(--lucent-accent-default)` for the thick outline ring and offset block — automatically follows palette changes.

### 7 new combined design presets

Full design personalities that bundle palette + shape + density + shadow:

| Preset | Shadow | Shape | Density | Palette |
|--------|--------|-------|---------|---------|
| `liquidGlass` | Liquid Glass | Pill | Spacious | Ocean |
| `bento` | Natural | Rounded | Default | Indigo |
| `brutalist` | Brutalist | Sharp | Compact | Coral |
| `terminal` | Glow | Sharp | Compact | Emerald |
| `softUI` | Neumorphic | Pill | Default | Violet |
| `bloom` | Glow | Rounded | Spacious | Indigo |
| `minimal` | Flat | Rounded | Default | Slate |

Usage: `<LucentProvider preset="brutalist">` or `<LucentProvider preset={{ shadow: 'glow', shape: 'pill' }}>`.

### Other changes

- **Tabs:** `content` is now optional on `TabItem` — when no tab has content, panel rendering is skipped (header-only / controlled mode)
- **ColorPicker:** `zIndex` increased to `999999` to render above high-z-index containers
- **`tokenToCssVar`** exported from `src/tokens/css.ts` — converts camelCase token keys to `--lucent-*` CSS var names
- **Dynamic Google Font loading** — devtools automatically injects `<link>` tags for fonts when presets or the font picker are used

## 0.27.2

### Contained variant & Card selected: neutral fills

- **Checkbox/Radio/Toggle contained wrapper**: border is now always `border-strong` (no accent tint). Checked background uses `color-mix(textPrimary 6%, transparent)` — neutral, adapts to parent. Unchecked is `transparent` (outline only).
- **Removed hover state** from contained wrappers — simplified to static `border-strong`, removed unused `hovered`/`setHovered` and mouse handlers.
- **Card selected state**: unified to `accent-subtle` for all variants instead of per-variant `color-mix` into opaque backgrounds.

## 0.27.1

### BREAKING: Accent token revamp & color-mix architecture

**Token renames (CSS vars changed):**
- `--lucent-text-on-accent` renamed to `--lucent-accent-fg` (moved into accent group)
- `--lucent-focus-ring` removed (merged into `--lucent-accent-border`)
- `--lucent-accent-active` removed (not in the 5-token accent model)

**Accent layer: 5 tokens derived from a single color**
- `accentDefault` — primary button bg, active toggle, checkbox fill
- `accentHover` — hover state of the above
- `accentSubtle` — low-opacity tint for selected rows, active nav items
- `accentBorder` — focus rings, selected item borders, active tab underline
- `accentFg` — hue-tinted text/icon on accent surfaces (no longer pure black/white)

**New: `accentTokens(color, theme?)` function** — standalone helper that derives all 5 accent tokens from a single hex input. Exported from the public API.

**New: `getAccentFg(color)` function** — returns a hue-tinted foreground color instead of pure `#000000`/`#ffffff`. Bright accents get `hsl(H, min(S,60%), 12%)`, dark accents get `hsl(H, min(S,20%), 95%)`.

**Button variant updates:**
- Secondary: `color-mix(accent 16%, transparent)` fill, `textPrimary` text
- Outline: `textPrimary` text, softened accent-tinted border
- Ghost: `textPrimary` text, transparent bg
- All disabled: `color-mix(textPrimary 6%, transparent)` fill, no border
- Press ring: single translucent halo (`accent@40%`) replaces opaque double ring
- Hover shadows: `color-mix(accent, transparent)` replaces opaque `accent-subtle`

**color-mix(transparent) architecture for neutral fills:**
- SegmentedControl, Toggle off track, Slider unfilled, Progress bar track, CodeBlock, Card filled/combo, Table/DataTable headers & stripes, disabled inputs — all use `color-mix(in srgb, var(--lucent-text-primary) N%, transparent)` instead of opaque `surfaceSecondary`. Adapts to any parent background, eliminates accent bleed from palette derivation.

**PageLayout: `surfaceSecondary` chrome option**
- New `chromeBackground="surfaceSecondary"` option for visible stage/chrome separation.
- Playground switched from `bgSubtle` to `surfaceSecondary` for sidebars.

**Collapsible padding increase:**
- Trigger vertical padding bumped from `space-3` to `space-4`
- Content padding bumped from `space-2/space-3` to `space-3/space-4`

## 0.26.0

### Composition recipes: manifest type + MCP tool + preview sections

- **`CompositionRecipe` type** — new manifest type in `src/manifest/types.ts` describing how multiple components compose into real UIs. Fields: `id`, `name`, `description`, `category`, `components`, `structure` (ASCII tree), `code` (working JSX), `variants`, and `designNotes`.
- **7 initial recipes** in `src/manifest/recipes/`:
  - **Profile Card** — avatar, name (display font), bio, borderless clickable chips, stat row (2xl display), action buttons. Compact collapsible variant on filled Card.
  - **Settings Panel** — toggle rows with descriptions, select dropdown, action footer. Drill-down variant with NavMenu sidebar.
  - **Stats Row** — individual stat cards with trend chips and comparison text. Revenue variant with avatar headers.
  - **Action Bar** — page header (breadcrumb + 3xl display title + divider) and card header (uppercase label + md title, tight letter-spacing).
  - **Form Layout** — stacked form with section grouping, side-by-side fields, dividers, and submit/cancel footer.
  - **Empty State Card** — icon illustration + heading + description + CTA in three variants (no results, getting started, error).
  - **Collapsible Card** — all card variants (ghost/outline/filled/elevated) with auto-bleed Collapsible, plus combo two-tone layout.
- **New MCP tool: `get_composition_recipe`** — query by name/id, by category, or list all. Returns full recipe with structure tree, working code, variants, and design notes.
- **`search_components` extended** — now returns both `components` and `recipes` in results.
- **Recipes nav group in ComponentPreview** — new "Recipes" section in the sidebar with Cards and Layouts sub-groups, each recipe rendered as a live interactive demo.

### Divider: zero default spacing

- **`spacing` default changed from `var(--lucent-space-4)` to `0`** — Dividers inside gap-based layouts (Stack, Row) no longer double up spacing. Pass `spacing` explicitly for standalone use outside flex containers.

## 0.25.1

### Collapsible + Card composition fix

- **Collapsible auto-bleed inside Card** — Collapsible now consumes `CardPaddingContext` and applies negative margins to cancel the Card body's padding. `<Card hoverable><Collapsible>` just works — no `padding="none"` on Card required.
- **Card overflow:visible by default** — cards without a `media` prop now default to `overflow: visible` so nested child shadows (e.g. an elevated Card inside a combo recipe) are never clipped. Cards with `media` keep `overflow: hidden` to clip images at rounded corners; the media slot also self-clips with matching top border-radius.
- **Collapsible dynamic overflow** — the animated content wrapper uses `overflow: hidden` only during the height transition and switches to `overflow: visible` once fully expanded, preventing shadow clipping in the resting state.
- **Combo recipe tighter spacing** — reduced top margin between trigger and inner elevated Card from `space-3` to `space-1`.
- Updated Card and Collapsible manifests with simplified CollapsibleCard recipe examples (no `padding="none"` needed).

## 0.25.0

### Collapsible: smooth collapse animation, hover feedback, and polish

- **Smooth collapse animation** — height animation now uses direct DOM manipulation via `useLayoutEffect` to avoid React 18 batching issues. Expand and collapse both animate reliably with `scrollHeight` snapshot → forced reflow → transition.
- **Snappier timing** — height transition tightened to 180ms (from 250ms), content fade to 80ms (from 100ms). All durations and easings now use design tokens (`duration-fast`, `easing-default`).
- **CSS-driven hover feedback** — trigger gets a 5% `text-primary` tint on hover (same `color-mix` pattern as NavMenu). Chevron darkens from `text-secondary` to `text-primary`. Uses injected `[data-lucent-collapsible-trigger]` CSS rule instead of JS hover state.
- **Focus-visible ring** — keyboard focus now shows a `2px surface + 4px accent-default` ring matching the system focus pattern. Previously had `outline: none` with no replacement.
- **Style deduplication** — CSS rules are injected once to `<head>` via a module-level guard, instead of a `<style>` tag per instance.
- **`disabled` prop** — reduces trigger opacity to 0.5, sets `cursor: not-allowed`, prevents toggling. Hover rules skip `:disabled`.
- **`padded` prop** — when `false`, removes the built-in content padding so children (e.g. a nested Card) can provide their own spacing.
- **`color: inherit`** — trigger button now explicitly inherits text color instead of relying on browser UA defaults.
- **Unmount safety** — animation timers are tracked in a ref and cleared on unmount.

### Card: hoverable prop, larger default radius, inset status accent

- **`hoverable` prop** — enables hover lift (`translateY(-1px)`) and neutral glow shadow without making the card a button or link. Interactive cards (`onClick`/`href`) get accent-colored glow; `hoverable`-only cards get a neutral glow (12% `text-primary`). Use when the card wraps its own interactive content (e.g. a Collapsible).
- **Default radius bumped to `lg`** — cards now use `radius-lg` (0.5rem) by default instead of `radius-md` (0.375rem) for a more container-appropriate feel.
- **Inset status accent** — the colored left-edge status bar is now rendered as an `inset 3px 0 0` box-shadow instead of a positioned `<div>`. This follows the same technique as NavMenu's inverse highlight, so the accent naturally curves with the card's border-radius.

### CollapsibleCard recipe (docs + preview)

- Added CollapsibleCard recipe row to `ComponentPreview` showing all five card variants (ghost, outline, filled, elevated, combo) with Collapsible inside.
- Combo recipe: filled Card wrapping a Collapsible with `padded={false}`, containing an elevated Card for the body — two-tone layout via pure composition.
- Recipe examples added to both Card and Collapsible manifests.

### Docs

- `docs/style-escape-hatch.md` — documents the `style` prop as the official escape hatch for one-off custom styling beyond the token system.
- `docs/collapsible-card-recipe.md` — CollapsibleCard composition recipe with localStorage persistence pattern.

## 0.24.0

### New Molecule: NavMenu

- **NavMenu** — hierarchical navigation for sidebar and top-bar layouts with a DOM-driven sliding highlight pill. Root-driven measurement via `MutationObserver` + `ResizeObserver` + `requestAnimationFrame` — zero timeout coordination.
  - Compound API: `NavMenu.Item`, `NavMenu.Group`, `NavMenu.Sub`, `NavMenu.Separator`.
  - **Sliding highlight pill** — always-in-DOM, positioned via direct style mutation. Queries `data-active` / `data-active-parent` attributes; uses `aria-hidden` ancestry for collapsed-item detection.
  - **Three highlight states:** child active (full accent), collapsed-with-active-child (12% accent tint), self-active parent (full accent on parent itself for section-level pages).
  - **CSS hover** — injected `[data-lucent-navitem]` rule with `:not()` exclusions. 5% translucent `text-primary` tint that never conflicts with the accent pill.
  - **Inverse mode** — surface background with accent right-border (`inset -3px`) and elevation shadow.
  - **`hasIcons` prop** — controls left-padding alignment globally. Group headers, items, and sub-menu children all respond via context (`parentHasIcon`) for consistent text alignment.
  - Three sizes (`sm`/`md`/`lg`), collapsible groups with height animation, horizontal dropdown with viewport collision detection.
  - Props: `orientation`, `inverse`, `size`, `hasIcons`, `aria-label`, `style`.
  - Full manifest with 8 usage examples, composition graph, and accessibility metadata.

## 0.23.0

### New Atoms: SplitButton & ButtonGroup

- **SplitButton** — compound button pairing a primary action with a chevron dropdown for secondary actions. Each half is an independent button with its own hover lift and press ring, separated by a token-scaled gap with subtle inner corner radius (`radius-sm`). Composes the Menu molecule for dropdown keyboard navigation, positioning, and portal rendering.
  - All 7 variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `danger-outline`, `danger-ghost`.
  - All 5 sizes: `2xs`, `xs`, `sm`, `md`, `lg`.
  - Props: `onClick`, `menuItems` (with `label`, `onSelect`, `disabled?`, `danger?`, `icon?`), `leftIcon`, `disabled`, `loading`, `bordered`, `menuPlacement`.
  - Ghost variants use tighter inner padding to keep the halves visually close.
  - Full manifest with designIntent, 7 usage examples, and accessibility metadata.
- **ButtonGroup** — layout wrapper that visually groups Button or SplitButton children with a small token-based gap and flattened inner corner radius so the set reads as a unit. Works with any variant combination including ghost toolbars.

### Button enhancements

- **Wider horizontal padding** — increased one spacing step across all sizes for better breathing room on text buttons.
- **Icon-only auto-sizing** — buttons without `children` (only `leftIcon`/`rightIcon`) automatically render as squares via `aspect-ratio: 1`.
- **Transparent outline backgrounds** — `outline` and `danger-outline` variants now use `transparent` instead of `var(--lucent-surface)`, so they work correctly on any container background.

## 0.22.0

### Chip: pulse, ghost, and dot-only mode

- **`pulse` prop** — pulsing ring animation on the status dot for in-progress/live states (deploying, syncing, live incident). Only applies when `dot=true`. Uses injected `@keyframes lucent-chip-pulse` following the existing pattern.
- **`ghost` prop** — transparent background with text color only, no border. Subtle 8% tint on hover when interactive. Ideal for inline status indicators in tables and lists.
- **Dot-only mode** — omit `children` with `dot=true` to render a compact circular indicator (no padding, `border-radius: 50%`). Works with `pulse` for a minimal pulsing dot.
- `children` is now optional on Chip.
- Manifest updated with status-first design intent and reorganized usage examples.

## 0.21.0

### New Atom: Progress Bar

- **Progress** — horizontal bar for completion, usage, or health metrics. Props: `value`, `max` (default 100), `variant` (accent/success/warning/danger), `size` (sm/md/lg), `label` (true for percentage, or custom ReactNode).
- **Threshold auto-variant** — `warnAt` and `dangerAt` props auto-switch color based on the current value. Ascending thresholds (`warnAt < dangerAt`) suit "high is bad" metrics (CPU, disk); descending (`warnAt > dangerAt`) suit "low is bad" metrics (battery, health).
- Accessible `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Smooth CSS transitions on value and variant changes.
- Full manifest with `designIntent` and usage examples.
- **Playground** — Progress and Slider added to the component playground for side-by-side comparison with prop knobs.
- **Density preview** — widened compact/comfortable multipliers (65%/140%) so density changes are actually visible.

## 0.20.0

### New Atoms: Stack & Row Layout Primitives

- **Stack** — vertical flex container. Props: `gap` (spacing token `"0"`–`"24"`), `align`, `justify`, `as` (polymorphic: `div | section | nav | form | fieldset | ul | ol`), `wrap`. Default: `gap="4"`, `align="stretch"`.
- **Row** — horizontal flex container with the same API. Default: `gap="3"`, `align="center"` (tuned for horizontal layouts like label/action pairs and button groups).
- Gap values reference `var(--lucent-space-{n})` tokens, so density presets (compact/default/spacious) scale layout automatically.
- Full manifests with `designIntent` and usage examples for AI composition.
- Dev preview sections added for both components.
- Internal `Section` and `Row` dev helpers refactored to use the new primitives.

## 0.19.1

### Overlay Polish

- **Frosted glass** — all overlay components (CommandPalette, Menu, MultiSelect, DatePicker, DateRangePicker, SearchInput, ColorPicker) now use a frosted glass backdrop: 85% opacity `surface-overlay` with `backdrop-filter: blur(6px)`.
- **Accent glow** — overlay borders are tinted with 15% `accent-default` via `color-mix`, and a soft 24px accent glow shadow adapts automatically to any palette preset.
- **Portal dropdowns** — MultiSelect, DatePicker, DateRangePicker, and SearchInput dropdowns now render via `createPortal` with `position: fixed`, so they escape Card `overflow: hidden`.
- **CommandPalette arrow keys (#91)** — fixed keyboard navigation cycling through items; added wrapping at top/bottom. Active highlight now uses accent-tinted background visible in both light and dark mode.
- **CommandPalette UI** — rounded inset item highlights, Button `xs` keycaps in footer and search bar, frosted glass panel with blurred backdrop.
- **DatePicker/DateRangePicker size scaling** — Calendar content (cell height, font size, nav buttons, padding, minWidth) now scales with the `size` prop (sm/md/lg).
- **DatePicker dark mode hover** — day hover uses `color-mix(accent-default 20%, surface-secondary)` for visibility in dark mode.
- **SearchInput** — fixed duplicate clear button (native `type="search"` X), aligned dropdown text/spacing/rounding with Menu pattern, text size now matches input size.

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
