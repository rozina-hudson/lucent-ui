import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'multi-step-wizard',
  name: 'Multi-Step Wizard',
  description: 'Stepped form with progress indicator and back/next navigation. For onboarding flows, checkout, or any sequential data collection.',
  category: 'form',
  components: ['card', 'text', 'progress', 'form-field', 'input', 'select', 'button', 'stack', 'row', 'divider'],

  structure: `
Card (elevated, padding="lg")
└── Stack gap="5"
    ├── Stack gap="2"                         ← progress header
    │   ├── Text (xs, secondary)              ← "Step 2 of 4"
    │   └── Progress (sm)                     ← progress bar
    ├── Stack gap="1"                         ← step title area
    │   ├── Text (lg, semibold)               ← step title
    │   └── Text (sm, secondary)              ← step description
    ├── Divider
    ├── Stack gap="4"                         ← step content
    │   └── FormField[]                       ← fields for current step
    └── Row gap="3" justify="between"         ← navigation
        ├── Button (outline)                  ← "Back"
        └── Button (primary)                  ← "Continue"
  `.trim(),

  code: `const [step, setStep] = useState(0);

const STEPS = [
  { title: 'Shipping address', description: 'Where should we deliver your order?' },
  { title: 'Payment method', description: 'How would you like to pay?' },
  { title: 'Order preferences', description: 'Customise your delivery.' },
  { title: 'Review & confirm', description: 'Double-check everything before placing your order.' },
];

const current = STEPS[step];

<Card variant="elevated" padding="lg" style={{ width: 480 }}>
  <Stack gap="5">
    <Stack gap="2">
      <Text size="xs" color="secondary">Step {step + 1} of {STEPS.length}</Text>
      <Progress value={((step + 1) / STEPS.length) * 100} size="sm" />
    </Stack>
    <Stack gap="1">
      <Text as="h2" size="lg" weight="semibold">{current.title}</Text>
      <Text size="sm" color="secondary">{current.description}</Text>
    </Stack>
    <Divider />
    {step === 0 && (
      <Stack gap="4">
        <FormField label="Full name" htmlFor="wiz-name" required>
          <Input id="wiz-name" placeholder="Jane Doe" />
        </FormField>
        <FormField label="Street address" htmlFor="wiz-addr" required>
          <Input id="wiz-addr" placeholder="123 Main St" />
        </FormField>
        <Row gap="4">
          <FormField label="City" htmlFor="wiz-city" required style={{ flex: 2 }}>
            <Input id="wiz-city" placeholder="San Francisco" />
          </FormField>
          <FormField label="State" htmlFor="wiz-state" required style={{ flex: 1 }}>
            <Input id="wiz-state" placeholder="CA" />
          </FormField>
          <FormField label="ZIP" htmlFor="wiz-zip" required style={{ flex: 1 }}>
            <Input id="wiz-zip" placeholder="94103" />
          </FormField>
        </Row>
      </Stack>
    )}
    {step === 1 && (
      <Stack gap="4">
        <FormField label="Card number" htmlFor="wiz-card" required>
          <Input id="wiz-card" placeholder="4242 4242 4242 4242" />
        </FormField>
        <Row gap="4">
          <FormField label="Expiry" htmlFor="wiz-exp" required style={{ flex: 1 }}>
            <Input id="wiz-exp" placeholder="MM / YY" />
          </FormField>
          <FormField label="CVV" htmlFor="wiz-cvv" required style={{ flex: 1 }}>
            <Input id="wiz-cvv" placeholder="123" />
          </FormField>
        </Row>
      </Stack>
    )}
    {step === 2 && (
      <Stack gap="4">
        <FormField label="Delivery speed" htmlFor="wiz-speed">
          <Select
            id="wiz-speed"
            defaultValue="standard"
            options={[
              { value: 'standard', label: 'Standard (5-7 days)' },
              { value: 'express', label: 'Express (2-3 days)' },
              { value: 'overnight', label: 'Overnight' },
            ]}
          />
        </FormField>
        <FormField label="Gift message (optional)" htmlFor="wiz-gift">
          <Input id="wiz-gift" placeholder="Happy birthday!" />
        </FormField>
      </Stack>
    )}
    {step === 3 && (
      <Stack gap="3">
        <Row justify="between">
          <Text size="sm" color="secondary">Ship to</Text>
          <Text size="sm">Jane Doe, 123 Main St, SF 94103</Text>
        </Row>
        <Row justify="between">
          <Text size="sm" color="secondary">Payment</Text>
          <Text size="sm">Visa ending 4242</Text>
        </Row>
        <Row justify="between">
          <Text size="sm" color="secondary">Delivery</Text>
          <Text size="sm">Standard (5-7 days)</Text>
        </Row>
        <Divider />
        <Row justify="between">
          <Text size="sm" weight="semibold">Total</Text>
          <Text size="sm" weight="semibold">$49.99</Text>
        </Row>
      </Stack>
    )}
    <Row gap="3" justify="between">
      <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
        Back
      </Button>
      <Button variant="primary" onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))}>
        {step === STEPS.length - 1 ? 'Place order' : 'Continue'}
      </Button>
    </Row>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'Final step with summary & confirm',
      code: `const [step, setStep] = useState(2);
const STEPS = ['Details', 'Preferences', 'Confirm'];

<Card variant="elevated" padding="lg" style={{ width: 440 }}>
  <Stack gap="5">
    <Stack gap="2">
      <Text size="xs" color="secondary">Step {step + 1} of {STEPS.length}</Text>
      <Progress value={((step + 1) / STEPS.length) * 100} size="sm" />
    </Stack>
    <Stack gap="1">
      <Text as="h2" size="lg" weight="semibold">Confirm your details</Text>
      <Text size="sm" color="secondary">Review everything before submitting.</Text>
    </Stack>
    <Divider />
    <Stack gap="3">
      <Row justify="between">
        <Text size="sm" color="secondary">Name</Text>
        <Text size="sm">Jane Doe</Text>
      </Row>
      <Row justify="between">
        <Text size="sm" color="secondary">Email</Text>
        <Text size="sm">jane@example.com</Text>
      </Row>
      <Row justify="between">
        <Text size="sm" color="secondary">Plan</Text>
        <Text size="sm">Pro — $19/mo</Text>
      </Row>
    </Stack>
    <Row gap="3" justify="between">
      <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
      <Button variant="primary">Confirm</Button>
    </Row>
  </Stack>
</Card>`,
    },
  ],

  designNotes:
    'The progress header (step counter + Progress bar) sits at the top so the user always ' +
    'knows where they are. gap="5" between major sections gives clear breathing room without ' +
    'feeling sparse. The step title and description use gap="1" to pair tightly as a unit. ' +
    'A Divider below the title separates navigation chrome from step content. Step content ' +
    'uses gap="4" for field spacing, matching form-layout conventions. Side-by-side fields ' +
    '(city/state/zip) use Row with flex ratios so they share width proportionally. The ' +
    'navigation row uses justify="between" with outline Back and primary Continue — the ' +
    'outline variant signals "go back" without competing with the primary action. Back is ' +
    'disabled on step 0 rather than hidden, so the layout stays stable across steps. On the ' +
    'final step the button label changes to a concrete action ("Place order", "Confirm") to ' +
    'signal finality.',
};
