export const COMPONENT_MANIFEST = {
    id: 'tooltip',
    name: 'Tooltip',
    tier: 'atom',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'A transient label that appears on hover or focus to explain an element.',
    designIntent: 'Tooltips surface supplementary context that would clutter the UI if shown permanently — ' +
        'keyboard shortcut hints, icon button labels, truncated text expansions. They must never ' +
        'contain critical information (errors, required actions) because they are invisible until ' +
        'hovered. Keep content to one short phrase; avoid wrapping. Use placement to avoid viewport ' +
        'edges — "top" is the default and works in most cases.',
    props: [
        {
            name: 'content',
            type: 'ReactNode',
            required: true,
            description: 'Text or element shown inside the tooltip. Keep it short (under 80 chars).',
        },
        {
            name: 'children',
            type: 'ReactNode',
            required: true,
            description: 'The element that triggers the tooltip on hover/focus.',
        },
        {
            name: 'placement',
            type: 'enum',
            required: false,
            default: 'top',
            description: 'Position of the tooltip relative to the trigger.',
            enumValues: ['top', 'bottom', 'left', 'right'],
        },
        {
            name: 'delay',
            type: 'number',
            required: false,
            default: '300',
            description: 'Milliseconds before the tooltip appears. Prevents flicker on fast cursor movement.',
        },
    ],
    usageExamples: [
        { title: 'Icon button label', code: `<Tooltip content="Copy to clipboard"><IconButton icon={<CopyIcon />} /></Tooltip>` },
        { title: 'Keyboard shortcut hint', code: `<Tooltip content="⌘K"><Button variant="ghost">Search</Button></Tooltip>` },
        { title: 'Bottom placement', code: `<Tooltip content="Opens in a new tab" placement="bottom"><a href="…">Link</a></Tooltip>` },
        { title: 'No delay (instant)', code: `<Tooltip content="Delete" delay={0}><Button variant="ghost">🗑</Button></Tooltip>` },
    ],
    compositionGraph: [],
    accessibility: {
        role: 'tooltip',
        ariaAttributes: ['role="tooltip"'],
        notes: 'The tooltip is shown on both hover and focus, making it accessible to keyboard users. Content is exposed via role="tooltip".',
    },
};
