// ─── Design Rules ────────────────────────────────────────────────────────────
// Structured layout guidance injected into the MCP system prompt so AI agents
// produce aesthetically consistent Lucent UI layouts, not just valid props.

export interface DesignRuleSection {
  id: string;
  title: string;
  body: string;
}

export const DESIGN_RULES: DesignRuleSection[] = [
  {
    id: 'spacing',
    title: 'Spacing scale',
    body: `
Use Stack and Row components for all layout — never raw flexbox.
Gap values map to the spacing token scale (default density, 14px base):

| Gap | Token    | Rem     | ~px | Use for                                             |
|-----|----------|---------|-----|-----------------------------------------------------|
| 0   | space-0  | 0       | 0   | Stacked label + description (no visible gap)        |
| 1   | space-1  | 0.25rem | 3.5 | Tight inline pairs: icon + label, badge + name      |
| 2   | space-2  | 0.5rem  | 7   | Related items in a row: chip gap, button-group gap   |
| 3   | space-3  | 0.75rem | 10  | Label-to-control gap, rows in a settings list        |
| 4   | space-4  | 1rem    | 14  | Sections within a card, standard Stack gap (default) |
| 5   | space-5  | 1.25rem | 17  | Between content blocks inside a page section         |
| 6   | space-6  | 1.5rem  | 21  | Card-to-card gap, major section separation           |
| 8   | space-8  | 2rem    | 28  | Page-level section separation                        |
| 10+ | space-10+| 2.5rem+ | 35+ | Hero spacing, page margins (rare in components)      |

Card padding sizes:
- sm: py=space-2, px=space-3  — compact lists, dense data
- md: py=space-4, px=space-5  — forms, standard content (default)
- lg: py=space-6, px=space-8  — hero content, featured cards
    `.trim(),
  },
  {
    id: 'typography',
    title: 'Typography hierarchy',
    body: `
Always use the Text component — never raw HTML tags with inline font styles.
Three font families: base (DM Sans), mono (DM Mono), display (Georama).
Use display family for large numeric values (stats, prices, counters).

| Role         | Size | Weight   | Color     | Element | Family  |
|--------------|------|----------|-----------|---------|---------|
| Page title   | 2xl  | bold     | primary   | h1      | base    |
| Section head | lg   | semibold | primary   | h2      | base    |
| Card title   | md   | semibold | primary   | h3      | base    |
| Body text    | sm   | regular  | primary   | p       | base    |
| Label        | xs   | medium   | secondary | label   | base    |
| Caption      | xs   | regular  | secondary | span    | base    |
| Stat value   | 2xl  | bold     | primary   | span    | display |
| Code/mono    | sm   | regular  | primary   | code    | mono    |

Font size scale (14px base):
- xs: 0.75rem (10.5px) — labels, captions, metadata
- sm: 0.875rem (12.25px) — body text, descriptions
- md: 1rem (14px) — card titles, emphasized text
- lg: 1.125rem (15.75px) — section headings
- xl: 1.25rem (17.5px) — page subtitles
- 2xl: 1.5rem (21px) — page titles, stat values
- 3xl: 1.875rem (26.25px) — hero headings (rare)
    `.trim(),
  },
  {
    id: 'buttons',
    title: 'Button pairing rules',
    body: `
Button variants: primary, secondary (filled), outline (bordered), ghost, danger.

Pairing guidelines:
- Primary + Outline: balanced dual actions (Save / Cancel, Confirm / Back)
- Primary + Ghost: dominant + dismiss (Submit / Reset, Continue / Skip)
- Single Primary: sole call-to-action (Sign up, Follow, Add to cart)
- Outline only: equal-weight options in a row (Edit, Share, Export)
- Danger + Outline: destructive confirmation (Delete / Cancel)
- Never place two primary buttons in the same Row

Size pairing:
- Buttons in the same Row should use the same size
- Form action buttons: md (default)
- Card inline actions: sm
- Toolbar/compact actions: xs
- Button heights (border-box): sm=34px, md=42px, lg=48px — these align with input total heights

Icon usage:
- leftIcon for semantic context (+ Add, ↓ Download)
- rightIcon for directional flow (Next →)
- chevron prop for dropdown triggers (built-in chevron-down SVG)
    `.trim(),
  },
  {
    id: 'layout',
    title: 'Common layout patterns',
    body: `
Always use Stack (vertical) and Row (horizontal) — never raw div with flex styles.
Stack default gap: 4. Row default gap: 3.

Toggle / checkbox row:
  Row gap="3" align="center"
  ├── Toggle or Checkbox
  └── Stack gap="0"
      ├── Text size="sm" weight="medium"   ← label
      └── Text size="xs" color="secondary" ← description

Stats block:
  Stack gap="0" align="center"
  ├── Text size="2xl" weight="bold" family="display" ← value
  └── Text size="xs" color="secondary"               ← label

Form layout:
  Stack gap="4"
  └── FormField[]  ← each field includes its own label + error

Action bar (form actions):
  Row gap="2" justify="end"
  ├── Button variant="outline"  ← secondary action
  └── Button variant="primary"  ← primary action

Card content:
  Card padding="md"
  └── Stack gap="4"
      ├── Text size="md" weight="semibold" ← card title
      ├── Stack gap="3"                    ← card body
      └── Row gap="2" justify="end"        ← card actions

Page section:
  Stack gap="5"
  ├── Row justify="between" align="center"
  │   ├── Text size="2xl" weight="bold" ← page title
  │   └── Button variant="outline"      ← page action
  └── Stack gap="6"                     ← section content
    `.trim(),
  },
  {
    id: 'color',
    title: 'Color usage',
    body: `
Lucent uses CSS custom properties for all colors. Never use raw hex values.

Text colors (via Text color prop):
- primary: default text, headings, values
- secondary: labels, captions, metadata, descriptions
- disabled: disabled state text (neutral gray, never accent-tinted)
- inverse: text on dark backgrounds
- onAccent: text on accent-colored backgrounds (auto-computed for contrast)
- success / warning / danger / info: semantic status text

Surface usage:
- Card variant="elevated": raised cards with shadow
- Card variant="outline": bordered cards, lower emphasis
- Card variant="filled": subtle background fill, no border

Accent color:
- Applied automatically by LucentProvider to primary buttons, toggles, checkboxes, radio
- textOnAccent is auto-computed via APCA contrast algorithm
- Light mode default accent: near-black (#111827)
- Dark mode default accent: near-white (#f9fafb)
- 12 palette presets available: default, brand, indigo, violet, emerald, teal, rose, coral, amber, ocean, slate, sage

Status colors (Chip/Badge/Alert variants):
- success: positive trends, confirmations, online status
- warning: attention needed, approaching limits
- danger: errors, destructive actions, critical alerts
- info: neutral information, tips, updates

Disabled state:
- Always use neutral gray — never accent-tinted surfaces
- Applied via color-mix with neutral gray, not opacity
    `.trim(),
  },
  {
    id: 'density',
    title: 'Density and responsive patterns',
    body: `
Three density presets scale all spacing tokens proportionally:
- compact: tighter spacing (~80% of default) — data-dense dashboards, admin panels
- default: standard spacing — general purpose
- spacious: generous spacing (~125% of default) — marketing, onboarding, hero sections

Responsive wrapping:
- Use Row with wrap prop for responsive card grids
- Set minWidth on flex children (e.g. style={{ flex: 1, minWidth: 180 }})
- This creates equal-width cards that wrap gracefully without media queries

Card grids:
  Row gap="4" wrap
  └── Card[] style={{ flex: 1, minWidth: 240 }}

Compact list items:
  Stack gap="2"
  └── Row[] gap="3" align="center" (each row is an item)
    `.trim(),
  },
];

/** Full design rules as a single markdown string for system prompt injection. */
export const DESIGN_RULES_TEXT = DESIGN_RULES.map(
  (s) => `## ${s.title}\n\n${s.body}`,
).join('\n\n');

/** Compact summary for the system prompt (keeps token budget reasonable). */
export const DESIGN_RULES_SUMMARY = `# Lucent UI Design Rules

These rules ensure AI-generated layouts are aesthetically consistent, not just technically valid.

${DESIGN_RULES_TEXT}`;
