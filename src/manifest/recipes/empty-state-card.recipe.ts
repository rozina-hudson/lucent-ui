import type { CompositionRecipe } from '../types.js';

export const RECIPE: CompositionRecipe = {
  id: 'empty-state-card',
  name: 'Empty State Card',
  description: 'Centered empty state with illustration icon, heading, description, and call-to-action button inside a card.',
  category: 'card',
  components: ['card', 'empty-state', 'icon', 'button'],

  structure: `
Card (outline, padding="lg")
└── EmptyState
    ├── illustration: Icon (xl)              ← decorative SVG
    ├── title: string                        ← heading
    ├── description: string                  ← explanatory text
    └── action: Button (secondary / primary) ← CTA
  `.trim(),

  code: `<Card variant="outline" padding="lg" style={{ width: 400 }}>
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
</Card>`,

  variants: [
    {
      title: 'Getting started empty state',
      code: `<Card variant="elevated" padding="lg" style={{ width: 400 }}>
  <EmptyState
    illustration={
      <Icon size="xl">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Icon>
    }
    title="No projects yet"
    description="Create your first project to get started."
    action={<Button variant="primary" size="sm">Create project</Button>}
  />
</Card>`,
    },
    {
      title: 'Error empty state with retry',
      code: `<Card variant="outline" padding="lg" style={{ width: 400 }}>
  <EmptyState
    illustration={
      <Icon size="xl">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={12} r={10} />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </Icon>
    }
    title="Something went wrong"
    description="We couldn't load your data. Please try again."
    action={<Button variant="outline" size="sm">Retry</Button>}
  />
</Card>`,
    },
  ],

  designNotes:
    'EmptyState handles internal centering and spacing — no need for manual Stack/Row ' +
    'layout inside it. The illustration uses Icon at xl size for visual weight without ' +
    'overwhelming the text. Card variant should match the context: outline for inline ' +
    'empty states (e.g. a table with no rows), elevated for standalone pages. The ' +
    'action button uses size="sm" to avoid competing with the heading for attention.',
};
