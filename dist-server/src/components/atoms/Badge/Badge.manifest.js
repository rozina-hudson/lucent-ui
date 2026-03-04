export const COMPONENT_MANIFEST = {
    id: 'badge',
    name: 'Badge',
    tier: 'atom',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'A small inline label for status, count, or category.',
    designIntent: 'Badges communicate status or category at a glance. Match variant to semantic meaning — ' +
        'never use "danger" for non-critical states or "success" for neutral counts. ' +
        'Use dot=true when a single colour indicator is enough context (e.g. online status). ' +
        'Keep badge text short: 1–3 words maximum.',
    props: [
        { name: 'variant', type: 'enum', required: false, default: 'neutral', description: 'Colour scheme conveying semantic meaning.', enumValues: ['neutral', 'success', 'warning', 'danger', 'info', 'accent'] },
        { name: 'size', type: 'enum', required: false, default: 'md', description: 'Controls height and font size.', enumValues: ['sm', 'md'] },
        { name: 'dot', type: 'boolean', required: false, default: 'false', description: 'Prepends a coloured dot indicator.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Badge label.' },
    ],
    usageExamples: [
        { title: 'Status', code: `<Badge variant="success" dot>Active</Badge>` },
        { title: 'Count', code: `<Badge variant="danger">12</Badge>` },
        { title: 'Category', code: `<Badge variant="info">Beta</Badge>` },
        { title: 'Neutral tag', code: `<Badge>Draft</Badge>` },
    ],
    compositionGraph: [],
    accessibility: {
        role: 'status',
        notes: 'Use aria-label on the parent element when badge meaning depends on context.',
    },
};
