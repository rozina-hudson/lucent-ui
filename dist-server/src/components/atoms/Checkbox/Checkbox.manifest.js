export const COMPONENT_MANIFEST = {
    id: 'checkbox',
    name: 'Checkbox',
    tier: 'atom',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'A binary selection control for boolean values or multi-select lists.',
    designIntent: 'Checkboxes represent independent boolean choices — they do not affect each other. ' +
        'Use a Checkbox for settings that take effect immediately (e.g. "Remember me") or for ' +
        'selecting multiple items from a list. When only one option may be active at a time, use ' +
        'Radio instead. The indeterminate state communicates a "select all" parent whose children ' +
        'are partially checked — never use it for a third logical state. ' +
        'Use the contained variant when you want to add visual emphasis to individual options — ' +
        'for example, plan selection cards, feature toggles, or consent checkboxes. Contained is ' +
        'especially useful when checkboxes are standalone or unrelated to each other, since the ' +
        'border gives each option its own visual weight. Pair with helperText to provide additional ' +
        'context without cluttering the label.',
    props: [
        {
            name: 'checked',
            type: 'boolean',
            required: false,
            description: 'Controlled checked state. Pair with onChange for controlled usage.',
        },
        {
            name: 'defaultChecked',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Initial checked state for uncontrolled usage.',
        },
        {
            name: 'onChange',
            type: 'function',
            required: false,
            description: 'Called when the checked state changes.',
        },
        {
            name: 'label',
            type: 'string',
            required: false,
            description: 'Visible label rendered beside the checkbox.',
        },
        {
            name: 'indeterminate',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Displays a dash to indicate a partially-checked parent state.',
        },
        {
            name: 'disabled',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Prevents interaction and dims the control.',
        },
        {
            name: 'size',
            type: 'enum',
            required: false,
            default: 'md',
            description: 'Size of the checkbox box and label text.',
            enumValues: ['sm', 'md', 'lg'],
        },
        {
            name: 'contained',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Wraps the checkbox in a bordered container. Use for standalone choices that need visual emphasis — plan cards, feature toggles, consent items. The border highlights with the accent colour when checked.',
        },
        {
            name: 'helperText',
            type: 'string',
            required: false,
            description: 'Secondary text below the label for additional context. The label becomes medium-weight for visual hierarchy.',
        },
    ],
    usageExamples: [
        { title: 'Controlled', code: `<Checkbox checked={agreed} onChange={e => setAgreed(e.target.checked)} label="I agree to the terms" />` },
        { title: 'Uncontrolled', code: `<Checkbox defaultChecked label="Send me updates" />` },
        { title: 'Indeterminate', code: `<Checkbox indeterminate label="Select all" />` },
        { title: 'Disabled', code: `<Checkbox disabled label="Unavailable option" />` },
        { title: 'Contained with helper', code: `<Checkbox contained label="Pro plan" helperText="Unlimited projects, 100 GB storage" />` },
        { title: 'Contained standalone', code: `<Checkbox contained label="I accept the terms and conditions" />` },
    ],
    compositionGraph: [],
    accessibility: {
        role: 'checkbox',
        ariaAttributes: ['aria-checked', 'aria-disabled'],
        keyboardInteractions: ['Space — toggles checked state'],
    },
};
