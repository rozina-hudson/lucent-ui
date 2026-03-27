import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'card',
  name: 'Card',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'A surface container with five elevation variants that form a visual importance hierarchy. ' +
    'Supports optional header, body, and footer slots with configurable padding, shadow, and radius. ' +
    'Includes a CardBleed sub-component for edge-to-edge content.',

  designIntent:
    'Card provides a configurable surface with an explicit elevation hierarchy. Each variant maps to ' +
    'a distinct level of visual prominence, giving consumers a single prop to express how much attention ' +
    'a surface should command relative to its surroundings.\n\n' +

    '## Elevation hierarchy (lowest → highest)\n\n' +

    '1. **ghost** — transparent background, no border, no shadow.\n' +
    '   The card is invisible as a container — content floats directly against the page or parent surface. ' +
    'Use for logical groupings that shouldn\'t compete visually: sidebar sections, form regions, or ' +
    'layout slots where structure exists conceptually but not visually. Header/footer dividers still ' +
    'render if those slots are used, providing minimal internal structure.\n\n' +

    '2. **outline** (default) — transparent background with `border-default` border, no shadow.\n' +
    '   Like ghost, the card inherits its container\'s background — the border alone defines the boundary. ' +
    'This is the workhorse variant for lists of items, form sections, data panels, ' +
    'and any content that needs a visible container without drawing excessive attention. Header and footer ' +
    'slots are separated from the body by matching `border-default` dividers.\n\n' +

    '3. **filled** — semi-transparent tinted background, no border, no shadow.\n' +
    '   Differentiates the card from its surroundings by darkening (light mode) or lightening (dark mode) ' +
    'whatever surface it sits on. Uses `color-mix(in srgb, textPrimary 6%, transparent)` so the tint is ' +
    'always relative to the container — never a fixed color. Use for secondary content areas, inset panels, ' +
    'summary blocks, or anywhere a border would feel heavy but the card needs to be visually distinct. ' +
    'Effective for nesting (e.g., a filled card inside an elevated card creates a recessed region).\n\n' +

    '4. **elevated** — `surface` background with medium shadow, no border.\n' +
    '   The card lifts off the page through depth. The shadow creates a physical metaphor: this content ' +
    'sits above the surface it rests on. Use for primary content areas, feature highlights, pricing cards, ' +
    'or any surface that should feel physically elevated. The lack of border keeps the silhouette soft — ' +
    'the shadow alone defines the boundary.\n\n' +

    '5. **combo** — transparent wrapper with an elevated body inset.\n' +
    '   The header and footer are flat — they blend into the page background as if they were part of it. ' +
    'Only the body section is elevated: it gets `surface` background, border-radius, and shadow, appearing ' +
    'as a raised card sitting between the flat header/footer regions. This draws the eye to the primary ' +
    'content while keeping supporting info (header) and actions (footer) visually subordinate — they frame ' +
    'the elevated body without competing with it. No dividers are rendered — the elevation change IS the ' +
    'visual separator. Use for detail panels, profile cards, or settings forms where the body content is ' +
    'the focal point.\n\n' +

    '## Shadow override\n' +
    'The `shadow` prop overrides whatever shadow the variant implies. This allows fine-tuning without ' +
    'changing the variant. For example, `variant="elevated" shadow="lg"` gives an elevated card with extra ' +
    'depth, while `variant="outline" shadow="none"` gives a flat bordered card.\n\n' +

    '## Token rules\n' +
    '- `elevated` and `combo` body use `surface` (the primary component surface — white in light mode).\n' +
    '- `filled` uses a semi-transparent tint of `textPrimary` — contextually darker/lighter than its container.\n' +
    '- `combo` wrapper is transparent (header/footer blend with page); only the body is elevated with `surface`.\n' +
    '- `ghost` and `outline` use `transparent` — they inherit from whatever they\'re placed on. ' +
    'The border is the only visual differentiator for `outline`.\n' +
    '- Never use `bgBase` or `bgSubtle` on a Card — those tokens are reserved for the page canvas.\n' +
    '- Content nested inside a Card that needs a tinted fill should use `surfaceSecondary`.',

  props: [
    {
      name: 'variant',
      type: 'enum',
      required: false,
      default: 'outline',
      description:
        'The elevation variant. Controls background color, border, and default shadow. ' +
        'Ordered from lowest to highest visual prominence: ghost → outline → filled → elevated → combo.',
      enumValues: ['ghost', 'outline', 'filled', 'elevated', 'combo'],
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The card body content.',
    },
    {
      name: 'header',
      type: 'ReactNode',
      required: false,
      description:
        'Content rendered in the header slot. Separated from the body by a divider in all variants except combo, ' +
        'where the background-color change provides the separation.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      required: false,
      description:
        'Content rendered in the footer slot. Separated from the body by a divider in all variants except combo, ' +
        'where the background-color change provides the separation.',
    },
    {
      name: 'padding',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Inner padding applied equally to header, body, and footer.',
      enumValues: ['none', 'sm', 'md', 'lg'],
    },
    {
      name: 'shadow',
      type: 'enum',
      required: false,
      description:
        'Box shadow elevation. When omitted, uses the variant\'s default: ghost=none, outline=none, filled=none, elevated=md, combo=md. ' +
        'When set explicitly, overrides the variant\'s default.',
      enumValues: ['none', 'sm', 'md', 'lg'],
    },
    {
      name: 'radius',
      type: 'enum',
      required: false,
      default: 'lg',
      description: 'Border radius of the card.',
      enumValues: ['none', 'sm', 'md', 'lg'],
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the card wrapper.',
    },
    {
      name: 'onClick',
      type: 'function',
      required: false,
      description:
        'Click handler. When provided, the card renders as a <button> with hover lift, focus ring, ' +
        'and active press states matching the Button component.',
    },
    {
      name: 'href',
      type: 'string',
      required: false,
      description:
        'Link URL. When provided, the card renders as an <a>. Takes precedence over onClick for the element type, ' +
        'but onClick is still attached as a handler.',
    },
    {
      name: 'target',
      type: 'string',
      required: false,
      description: 'Passed to <a> when href is set (e.g. "_blank").',
    },
    {
      name: 'rel',
      type: 'string',
      required: false,
      description: 'Passed to <a> when href is set (e.g. "noopener noreferrer").',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description:
        'Disables interactive behavior. Reduces opacity, removes hover/focus/active states, ' +
        'and sets cursor to not-allowed. Only applies when onClick or href is set.',
    },
    {
      name: 'status',
      type: 'enum',
      required: false,
      description:
        'Adds a 3px colored inset box-shadow on the left edge of the card. Rendered as an inset shadow ' +
        '(same technique as NavMenu inverse highlight) so it naturally follows the card\'s border-radius. ' +
        'Uses the corresponding status token (successDefault, warningDefault, dangerDefault, infoDefault). ' +
        'Works with all variants.',
      enumValues: ['success', 'warning', 'danger', 'info'],
    },
    {
      name: 'selected',
      type: 'boolean',
      required: false,
      description:
        'Adds an inset accent ring and subtle background tint to indicate selection. Used for card grids ' +
        'where cards act as radio/checkbox options. Pairs with onClick for toggle behavior. ' +
        'Sets aria-pressed on interactive cards. Disabled takes precedence — ring is hidden when disabled.',
    },
    {
      name: 'hoverable',
      type: 'boolean',
      required: false,
      description:
        'Enables hover lift (translateY -1px) and neutral glow shadow without making the card a button or link. ' +
        'Use when the card contains its own interactive content (e.g. a Collapsible trigger) and the whole card ' +
        'surface should hint at interactivity. Interactive cards (onClick/href) get accent-colored hover glow; ' +
        'hoverable-only cards get a neutral glow (12% text-primary).',
    },
    {
      name: 'media',
      type: 'ReactNode',
      required: false,
      description:
        'Full-bleed content rendered at the top of the card (before header). No padding is applied. ' +
        'Use for hero images, illustrations, or any edge-to-edge top content. The card\'s overflow:hidden ' +
        'clips media to the border-radius.',
    },
  ],

  usageExamples: [
    {
      title: 'Ghost — invisible container',
      code: `<Card variant="ghost">
  <Text>Content sits directly on the page background.</Text>
</Card>`,
    },
    {
      title: 'Outline — bordered card (default)',
      code: `<Card
  header={<Text weight="semibold">Card title</Text>}
  footer={<Button variant="primary">Save</Button>}
>
  <Text color="secondary">The standard card treatment with dividers.</Text>
</Card>`,
    },
    {
      title: 'Filled — color-differentiated region',
      code: `<Card variant="filled" padding="lg">
  <Text weight="semibold">Summary</Text>
  <Text color="secondary" size="sm">A tinted panel that stands out through background color alone.</Text>
</Card>`,
    },
    {
      title: 'Elevated — shadow-lifted surface',
      code: `<Card variant="elevated">
  <Text weight="semibold">Featured</Text>
  <Text color="secondary">This card floats above the page with shadow depth.</Text>
</Card>`,
    },
    {
      title: 'Combo — two-tone card with header and footer',
      code: `<Card
  variant="combo"
  header={<Text weight="semibold">Profile</Text>}
  footer={<Button variant="primary">Update</Button>}
>
  <Text>The bright body is framed by the muted header and footer.</Text>
</Card>`,
    },
    {
      title: 'Edge-to-edge content with CardBleed',
      code: `<Card>
  <Text weight="semibold">Settings</Text>
  <CardBleed style={{ borderTop: '1px solid var(--lucent-border-default)', marginTop: 'var(--lucent-space-4)' }}>
    <Text color="secondary">This section stretches to the card edges.</Text>
  </CardBleed>
</Card>`,
    },
    {
      title: 'Clickable card',
      code: `<Card variant="elevated" onClick={() => navigate('/detail')}>
  <Text weight="semibold">Dashboard tile</Text>
  <Text color="secondary" size="sm">Click to view details</Text>
</Card>`,
    },
    {
      title: 'Link card',
      code: `<Card variant="elevated" href="/docs/getting-started" target="_blank" rel="noopener noreferrer">
  <Text weight="semibold">Documentation</Text>
  <Text color="secondary" size="sm">Opens in a new tab</Text>
</Card>`,
    },
    {
      title: 'Status accent',
      code: `<Card status="danger">
  <Text weight="semibold">Payment failed</Text>
  <Text color="secondary" size="sm">Check your card details and try again.</Text>
</Card>`,
    },
    {
      title: 'Selectable card',
      code: `<Card
  variant="elevated"
  selected={isSelected}
  onClick={() => setIsSelected(!isSelected)}
>
  <Text weight="semibold">Pro plan</Text>
  <Text color="secondary" size="sm">$29/month</Text>
</Card>`,
    },
    {
      title: 'Media card with hero image',
      code: `<Card
  variant="elevated"
  media={<img src="/hero.jpg" alt="Hero" style={{ width: '100%', display: 'block' }} />}
>
  <Text weight="semibold">Article title</Text>
  <Text color="secondary" size="sm">A card with a full-bleed hero image.</Text>
</Card>`,
    },
    {
      title: 'CollapsibleCard recipe — outline',
      code: `<Card variant="outline" padding="none" hoverable>
  <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Filters</Text>} defaultOpen>
    <Text size="sm" color="secondary">Card + Collapsible composed together.</Text>
  </Collapsible>
</Card>`,
    },
    {
      title: 'CollapsibleCard recipe — combo (filled + elevated)',
      code: `<Card variant="filled" padding="none" hoverable>
  <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Details</Text>} padded={false}>
    <Card variant="elevated" padding="sm">
      <Text size="sm" color="secondary">Two-tone: flat trigger on filled surface, content in elevated body.</Text>
    </Card>
  </Collapsible>
</Card>`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    notes:
      'Non-interactive cards have no implicit ARIA role — wrap in <section> or <article> if needed. ' +
      'Interactive cards with onClick render as <button> with focus ring. ' +
      'Interactive cards with href render as <a> with focus ring. ' +
      'Selected cards set aria-pressed on the interactive element. ' +
      'The status accent bar is aria-hidden (decorative). ' +
      'Media slot images should include alt text.',
  },
};
