export const COMPONENT_MANIFEST = {
    id: 'tag',
    name: 'Tag',
    tier: 'atom',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'A dismissible label for applied filters, selected values, or categorisation.',
    designIntent: 'Tags represent user-applied selections that can be removed — filters, multi-select ' +
        'values, categories. They differ from Badge in that they are interactive: provide ' +
        'onDismiss when the user should be able to remove the tag. Without onDismiss they render ' +
        'as a static pill (identical to Badge in purpose). Use semantic variants to match meaning; ' +
        'default to neutral for user-generated content where no semantic applies.',
    props: [
        {
            name: 'children',
            type: 'ReactNode',
            required: true,
            description: 'Tag label content.',
        },
        {
            name: 'variant',
            type: 'enum',
            required: false,
            default: 'neutral',
            description: 'Colour scheme conveying semantic meaning.',
            enumValues: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
        },
        {
            name: 'size',
            type: 'enum',
            required: false,
            default: 'md',
            description: 'Controls height and font size.',
            enumValues: ['sm', 'md'],
        },
        {
            name: 'onDismiss',
            type: 'function',
            required: false,
            description: 'When provided, renders an × button that calls this handler on click.',
        },
        {
            name: 'disabled',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Dims the tag and prevents the dismiss action.',
        },
    ],
    usageExamples: [
        { title: 'Dismissible filter', code: `<Tag onDismiss={() => removeFilter('react')}>React</Tag>` },
        { title: 'Multi-select value', code: `<Tag variant="accent" onDismiss={() => deselect(id)}>Jane Doe</Tag>` },
        { title: 'Static category', code: `<Tag variant="info">Beta</Tag>` },
        { title: 'Danger (removable)', code: `<Tag variant="danger" onDismiss={handleRemove}>Blocked</Tag>` },
    ],
    compositionGraph: [],
    accessibility: {
        role: 'group',
        notes: 'The dismiss button has aria-label="Dismiss" and is keyboard-focusable.',
        keyboardInteractions: ['Enter / Space — activates the dismiss button when focused'],
    },
};
