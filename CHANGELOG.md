# lucent-ui

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
