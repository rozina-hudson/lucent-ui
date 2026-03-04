export const COMPONENT_MANIFEST = {
    id: 'form-field',
    name: 'FormField',
    tier: 'molecule',
    domain: 'neutral',
    specVersion: '0.1',
    description: 'Wraps any form control (Input, Select, Textarea) with a label, helper text, and validation message.',
    designIntent: 'FormField standardises the vertical rhythm around form controls. A label is linked to the control ' +
        'via htmlFor so screen readers announce it correctly. The required asterisk is decorative (aria-hidden) ' +
        'because the actual required state should be communicated on the input via aria-required. Helper text ' +
        'provides proactive guidance; errorMessage replaces it when validation fails, using danger color to ' +
        'draw attention. The gap between elements uses space-2 to create a tight but breathable stack.',
    props: [
        {
            name: 'label',
            type: 'string',
            required: false,
            description: 'Label text rendered above the control as a <label> element.',
        },
        {
            name: 'htmlFor',
            type: 'string',
            required: false,
            description: 'ID of the form control this label describes. Forwarded to the label htmlFor attribute.',
        },
        {
            name: 'required',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Appends a danger-colored asterisk after the label text.',
        },
        {
            name: 'helperText',
            type: 'string',
            required: false,
            description: 'Secondary text below the control providing guidance. Hidden when errorMessage is set.',
        },
        {
            name: 'errorMessage',
            type: 'string',
            required: false,
            description: 'Validation error shown in danger color below the control. Replaces helperText when set.',
        },
        {
            name: 'children',
            type: 'ReactNode',
            required: true,
            description: 'The form control to wrap — typically Input, Select, or Textarea.',
        },
        {
            name: 'style',
            type: 'object',
            required: false,
            description: 'Inline style overrides for the outer wrapper.',
        },
    ],
    usageExamples: [
        {
            title: 'Basic field',
            code: `<FormField label="Email" htmlFor="email">
  <Input id="email" placeholder="you@example.com" />
</FormField>`,
        },
        {
            title: 'Required with helper',
            code: `<FormField label="Username" htmlFor="username" required helperText="Letters and numbers only">
  <Input id="username" />
</FormField>`,
        },
        {
            title: 'With validation error',
            code: `<FormField label="Password" htmlFor="pw" errorMessage="Must be at least 8 characters">
  <Input id="pw" type="password" />
</FormField>`,
        },
        {
            title: 'Wrapping a Select',
            code: `<FormField label="Country" htmlFor="country">
  <Select id="country" options={countryOptions} />
</FormField>`,
        },
    ],
    compositionGraph: [
        { componentId: 'text', componentName: 'Text', role: 'Label, helper text, and error message', required: false },
    ],
    accessibility: {
        ariaAttributes: ['aria-required', 'aria-describedby'],
        notes: 'Link the wrapped control to an error message using aria-describedby on the control and a matching id ' +
            'on the error element for full screen reader support. The required asterisk is aria-hidden; ' +
            'set aria-required="true" on the control itself.',
    },
};
