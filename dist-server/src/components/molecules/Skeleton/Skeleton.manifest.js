export const COMPONENT_MANIFEST = {
    id: 'skeleton',
    name: 'Skeleton',
    tier: 'molecule',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'Animated placeholder that matches the shape of content while it loads.',
    designIntent: 'Skeleton uses a shimmer animation to communicate that content is loading without showing a spinner. ' +
        'The three variants (text, circle, rectangle) cover the most common content shapes: inline text, ' +
        'avatars/thumbnails, and generic content blocks. The text variant with lines > 1 mimics a paragraph ' +
        'by stacking multiple text skeletons and shortening the last line to 70%, which is a widely recognised ' +
        'convention for body copy placeholders. The shimmer gradient uses bg-muted and bg-subtle so it adapts ' +
        'correctly in both light and dark themes without hard-coded colors.',
    props: [
        {
            name: 'variant',
            type: 'enum',
            required: false,
            default: 'rectangle',
            description: 'Shape of the skeleton — text (1em tall), circle (equal width/height), or rectangle.',
            enumValues: ['text', 'circle', 'rectangle'],
        },
        {
            name: 'width',
            type: 'string',
            required: false,
            default: '"100%"',
            description: 'Width of the skeleton. Accepts any CSS value or a number (interpreted as px).',
        },
        {
            name: 'height',
            type: 'string',
            required: false,
            description: 'Height of the skeleton. Defaults: text=1em, circle=40px, rectangle=40px.',
        },
        {
            name: 'lines',
            type: 'number',
            required: false,
            default: '1',
            description: 'Number of stacked text lines to render. Only applies to the text variant.',
        },
        {
            name: 'animate',
            type: 'boolean',
            required: false,
            default: 'true',
            description: 'Enables the shimmer animation. Set to false to render a static placeholder.',
        },
        {
            name: 'radius',
            type: 'string',
            required: false,
            description: 'Override the default border-radius for the variant.',
        },
        {
            name: 'style',
            type: 'object',
            required: false,
            description: 'Inline style overrides.',
        },
    ],
    usageExamples: [
        {
            title: 'Paragraph placeholder',
            code: `<Skeleton variant="text" lines={3} />`,
        },
        {
            title: 'Avatar placeholder',
            code: `<Skeleton variant="circle" width={40} height={40} />`,
        },
        {
            title: 'Card placeholder',
            code: `<Card>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Skeleton variant="rectangle" height={160} />
    <Skeleton variant="text" lines={2} />
    <Skeleton variant="text" width="40%" />
  </div>
</Card>`,
        },
        {
            title: 'Static (no animation)',
            code: `<Skeleton variant="rectangle" width={200} height={32} animate={false} />`,
        },
    ],
    compositionGraph: [],
    accessibility: {
        ariaAttributes: ['aria-busy', 'aria-label'],
        notes: 'Wrap loading regions with aria-busy="true" on the container so screen readers know content ' +
            'is loading. Individual Skeleton elements are presentational and do not need ARIA attributes themselves.',
    },
};
