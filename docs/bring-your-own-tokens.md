# Bring Your Own Tokens

Point your Figma token export at Lucent and get a manifest file back — no manual token hunting required.

## Quick start (Figma Variables)

```bash
npx lucent-manifest init \
  --figma-token YOUR_FIGMA_TOKEN \
  --file-key YOUR_FILE_KEY
```

This fetches your Figma Variables, maps them to the Lucent token schema, and writes `lucent.manifest.json` to your project root.

### How to get your credentials

| Value | Where to find it |
|-------|-----------------|
| `--figma-token` | Figma → Account settings → Personal access tokens |
| `--file-key` | The alphanumeric ID in your Figma file URL: `figma.com/file/**FILE_KEY**/…` |

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `--figma-token` | — | Figma personal access token (**required**) |
| `--file-key` | — | Figma file key (**required**) |
| `--light-mode` | `light` | Mode name to treat as the light theme |
| `--dark-mode` | `dark` | Mode name to treat as the dark theme |
| `--name` | `My Design System` | Display name written into the manifest |
| `--out` | `lucent.manifest.json` | Output file path |

### Figma variable naming conventions

The mapper converts Figma variable names into Lucent token keys using these rules:

1. An optional leading category segment (`color`, `typography`, `spacing`, `radius`, `shadow`, `motion`) is stripped.
2. Path segments (separated by `/`) and word segments (separated by `-`) are joined as camelCase.

| Figma variable name | Lucent token key |
|--------------------|-----------------|
| `color/bg/base` | `bgBase` |
| `color/text/primary` | `textPrimary` |
| `color/accent/default` | `accentDefault` |
| `typography/font-size/xl` | `fontSizeXl` |
| `typography/font-family/base` | `fontFamilyBase` |
| `spacing/space-4` | `space4` |
| `radius/radius-md` | `radiusMd` |

Variables that don't map to a known Lucent token key are reported as warnings and excluded from the output — they won't cause the command to fail.

---

## Manual fallback (no Figma)

If you're not using Figma Variables, generate a pre-filled JSON template and edit it by hand:

```bash
npx lucent-manifest init --template
```

This writes a `lucent.manifest.json` with all semantic color tokens pre-populated with Lucent's default light and dark values. Replace any values you want to override and delete the rest.

---

## Using the manifest

Pass the manifest to `LucentProvider`:

```tsx
import manifest from './lucent.manifest.json';
import { LucentProvider } from 'lucent-ui';

export default function App() {
  return (
    <LucentProvider tokens={manifest.tokens}>
      {/* your app */}
    </LucentProvider>
  );
}
```

Only the tokens you include in the manifest are overridden — everything else falls back to Lucent's defaults.

### Theme-specific overrides

You can supply only `light`, only `dark`, or both.  In many cases you
only need to override the **accent** colour – Lucent will automatically
compute a sensible border shade and ensure text on accent surfaces meets
WCAG contrast in both light and dark mode.  This makes it hard to pick a
combination that looks bad on one theme or the other.

If you do want fine‑grained control you can still override the derived
value (`accentBorder`) yourself; otherwise just set `accentDefault` and
possibly hover/active/subtle variants.

```json
{
  "version": "1.0",
  "name": "My Design System",
  "tokens": {
    "light": {
      "accentDefault": "#7c3aed",
      "accentHover": "#6d28d9",
      "accentActive": "#5b21b6",
      "accentSubtle": "#f5f3ff",
      "focusRing": "#7c3aed"
      // ``accentBorder`` is calculated automatically, no need to include it
    }
  }
}
```
---

## Token reference

For a full list of supported token keys and their semantics, see the [Component Manifest Spec](./COMPONENT_MANIFEST_SPEC.md) and the TypeScript types in [`src/tokens/types.ts`](../src/tokens/types.ts).
