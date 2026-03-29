import type { CompositionRecipe } from '../types.js';

export const RECIPE: CompositionRecipe = {
  id: 'collapsible-card',
  name: 'Collapsible Card',
  description: 'Card with an expandable/collapsible section using smooth height animation, available in all card variants.',
  category: 'card',
  components: ['card', 'collapsible', 'text'],

  structure: `
Card (padding="none", hoverable)
└── Collapsible
    ├── trigger: Text (sm, semibold)         ← clickable header
    └── children                             ← collapsible body
        └── Text (sm, secondary)             ← content
  `.trim(),

  code: `<Card variant="outline" padding="none" hoverable style={{ width: 360 }}>
  <Collapsible
    trigger={<Text as="span" weight="semibold" size="sm">Details</Text>}
    defaultOpen
  >
    <Text size="sm" color="secondary">
      The Collapsible auto-detects its Card parent and bleeds the trigger
      full-width. Content inherits the card's padding.
    </Text>
  </Collapsible>
</Card>`,

  variants: [
    {
      title: 'Ghost variant',
      code: `<Card variant="ghost" padding="none" hoverable style={{ width: 360 }}>
  <Collapsible trigger={<Text as="span" weight="semibold" size="sm">FAQ item</Text>}>
    <Text size="sm" color="secondary">
      Transparent container — content floats directly on the page surface.
    </Text>
  </Collapsible>
</Card>`,
    },
    {
      title: 'Elevated variant',
      code: `<Card variant="elevated" padding="none" hoverable style={{ width: 360 }}>
  <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Advanced options</Text>}>
    <Text size="sm" color="secondary">
      Elevated cards cast a shadow — use for prominent collapsible sections.
    </Text>
  </Collapsible>
</Card>`,
    },
    {
      title: 'Combo (two-tone nested cards)',
      code: `<Card variant="filled" padding="none" hoverable style={{ width: 360 }}>
  <Collapsible
    padded={false}
    trigger={<Text as="span" weight="semibold" size="sm">Combo layout</Text>}
  >
    <Card
      variant="elevated"
      padding="sm"
      style={{ margin: 'var(--lucent-space-1) var(--lucent-space-2) var(--lucent-space-2)' }}
    >
      <Text size="sm" color="secondary">
        Two-tone layout — flat trigger surface, elevated body.
      </Text>
    </Card>
  </Collapsible>
</Card>`,
    },
    {
      title: 'With localStorage persistence',
      code: `function CollapsibleSection({ id, title, children }) {
  const storageKey = \`collapsible-\${id}\`;
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved === 'true' : true;
  });

  const handleChange = (next) => {
    setOpen(next);
    localStorage.setItem(storageKey, String(next));
  };

  return (
    <Card variant="outline" padding="none" hoverable>
      <Collapsible
        open={open}
        onOpenChange={handleChange}
        trigger={<Text as="span" weight="semibold" size="sm">{title}</Text>}
      >
        {children}
      </Collapsible>
    </Card>
  );
}`,
    },
  ],

  designNotes:
    'Card uses padding="none" because the Collapsible auto-detects its Card parent ' +
    'via CardPaddingContext and bleeds the trigger full-width while applying card ' +
    'padding to the body content. The hoverable prop gives hover lift feedback ' +
    'without making the card itself interactive — the Collapsible trigger handles ' +
    'clicks. For the combo variant, padded={false} on Collapsible removes its built-in ' +
    'content padding so the nested elevated Card can control its own spacing with ' +
    'custom margin. This creates a two-tone visual: flat trigger + elevated body.',
};
