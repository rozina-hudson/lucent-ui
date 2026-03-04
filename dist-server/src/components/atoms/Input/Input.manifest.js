export const COMPONENT_MANIFEST = {
    id: 'input',
    name: 'Input',
    tier: 'atom',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'A single-line text field with optional label, helper text, and error state.',
    designIntent: 'Always pair with a visible label — never rely on placeholder text alone as it ' +
        'disappears on input and is inaccessible. Use errorText (not helperText) to surface ' +
        'validation failures; the component applies danger styling automatically. ' +
        'leftElement and rightElement accept icons or small controls (e.g. currency symbol, clear button).',
    props: [
        { name: 'type', type: 'enum', required: false, default: 'text', description: 'HTML input type.', enumValues: ['text', 'number', 'password', 'email', 'tel', 'url', 'search'] },
        { name: 'label', type: 'string', required: false, description: 'Visible label rendered above the input.' },
        { name: 'helperText', type: 'string', required: false, description: 'Supplementary hint shown below the input.' },
        { name: 'errorText', type: 'string', required: false, description: 'Validation error message. When set, input renders in error state.' },
        { name: 'leftElement', type: 'ReactNode', required: false, description: 'Icon or adornment rendered inside the left edge.' },
        { name: 'rightElement', type: 'ReactNode', required: false, description: 'Icon or adornment rendered inside the right edge.' },
        { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text. Use as a hint, not a label.' },
        { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disables the input.' },
        { name: 'value', type: 'string', required: false, description: 'Controlled value.' },
        { name: 'onChange', type: 'function', required: false, description: 'Change handler.' },
    ],
    usageExamples: [
        { title: 'Basic', code: `<Input label="Email" type="email" placeholder="you@example.com" />` },
        { title: 'With helper text', code: `<Input label="Username" helperText="3–20 characters, letters and numbers only" />` },
        { title: 'Error state', code: `<Input label="Password" type="password" value={value} errorText="Must be at least 8 characters" />` },
        { title: 'With icon', code: `<Input label="Search" leftElement={<SearchIcon />} placeholder="Search…" />` },
    ],
    compositionGraph: [],
    accessibility: {
        role: 'textbox',
        ariaAttributes: ['aria-invalid', 'aria-describedby', 'aria-label'],
        keyboardInteractions: ['Tab — focuses the input'],
    },
};
