export const COMPONENT_MANIFEST = {
    id: 'textarea',
    name: 'Textarea',
    tier: 'atom',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'A multi-line text input with optional auto-resize and character count.',
    designIntent: 'Use autoResize for open-ended fields (bio, description) where content length is unpredictable. ' +
        'Use maxLength + showCount for fields with hard limits (tweet-style). ' +
        'Behaves identically to Input for label/helper/error patterns.',
    props: [
        { name: 'label', type: 'string', required: false, description: 'Visible label above the textarea.' },
        { name: 'helperText', type: 'string', required: false, description: 'Hint text shown below.' },
        { name: 'errorText', type: 'string', required: false, description: 'Validation error. Triggers error styling.' },
        { name: 'autoResize', type: 'boolean', required: false, default: 'false', description: 'Grows with content, disables manual resize handle.' },
        { name: 'maxLength', type: 'number', required: false, description: 'Character limit. Displays counter when set.' },
        { name: 'showCount', type: 'boolean', required: false, default: 'false', description: 'Always show character counter even without maxLength.' },
        { name: 'value', type: 'string', required: false, description: 'Controlled value.' },
        { name: 'onChange', type: 'function', required: false, description: 'Change handler.' },
        { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text.' },
        { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disables the textarea.' },
    ],
    usageExamples: [
        { title: 'Basic', code: `<Textarea label="Bio" placeholder="Tell us about yourself…" />` },
        { title: 'Auto-resize', code: `<Textarea label="Description" autoResize value={value} onChange={e => setValue(e.target.value)} />` },
        { title: 'With character count', code: `<Textarea label="Tweet" maxLength={280} showCount value={value} onChange={e => setValue(e.target.value)} />` },
        { title: 'Error state', code: `<Textarea label="Notes" errorText="Required" value="" />` },
    ],
    compositionGraph: [],
    accessibility: {
        role: 'textbox',
        ariaAttributes: ['aria-multiline', 'aria-invalid', 'aria-describedby'],
        keyboardInteractions: ['Tab — focuses the textarea'],
    },
};
