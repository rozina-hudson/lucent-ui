import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'onboarding-flow',
  name: 'Onboarding Flow',
  description: 'Multi-step onboarding form with step indicator, progress bar, form fields, and back/next navigation. Steps: Profile → Preferences → Confirmation.',
  category: 'form',
  components: ['card', 'text', 'button', 'progress', 'form-field', 'input', 'select', 'checkbox', 'avatar', 'chip', 'stack', 'row', 'divider'],

  structure: `
Card (elevated, padding="lg")
└── Stack gap="6"
    ├── Stack gap="1"                         ← header
    │   ├── Text (lg, semibold, display)      ← title
    │   └── Text (sm, secondary)              ← step counter
    ├── Progress (sm)                         ← progress bar
    ├── StepIndicator                         ← custom step circles
    │   ├── Row justify="between"
    │   │   └── circle[] + connector lines
    │   └── Row justify="between"
    │       └── Text[] (xs, step labels)
    ├── Divider
    ├── Step content (conditional)
    │   ├── Step 0: Stack of FormFields (name, email, role Select)
    │   ├── Step 1: FormFields (team size, use case) + Checkbox
    │   └── Step 2: Avatar + name + email + role Chip (confirmation)
    └── Row justify="between"                 ← navigation
        ├── Button (ghost, sm)                ← Back (disabled on step 0)
        └── Button (primary, sm)              ← Continue / Complete
  `.trim(),

  code: `const [step, setStep] = useState(0);
const STEPS = ['Profile', 'Preferences', 'Confirm'];

<Card variant="elevated" padding="lg" style={{ width: 440 }}>
  <Stack gap="6">
    <Stack gap="1">
      <Text size="lg" weight="semibold" family="display">Create your account</Text>
      <Text size="sm" color="secondary">Step {step + 1} of {STEPS.length}</Text>
    </Stack>
    <Progress value={((step + 1) / STEPS.length) * 100} size="sm" />
    <Divider />
    {step === 0 && (
      <Stack gap="4">
        <FormField label="Full name" htmlFor="onb-name" required>
          <Input id="onb-name" placeholder="Jane Doe" />
        </FormField>
        <FormField label="Email address" htmlFor="onb-email" required>
          <Input id="onb-email" type="email" placeholder="jane@example.com" />
        </FormField>
        <FormField label="Role" htmlFor="onb-role">
          <Select
            id="onb-role"
            defaultValue="engineer"
            options={[
              { value: 'engineer', label: 'Engineer' },
              { value: 'designer', label: 'Designer' },
              { value: 'product', label: 'Product Manager' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </FormField>
      </Stack>
    )}
    {step === 1 && (
      <Stack gap="4">
        <FormField label="Team size" htmlFor="onb-team">
          <Select
            id="onb-team"
            defaultValue="small"
            options={[
              { value: 'solo', label: 'Just me' },
              { value: 'small', label: '2–10 people' },
              { value: 'medium', label: '11–50 people' },
              { value: 'large', label: '50+ people' },
            ]}
          />
        </FormField>
        <Checkbox label="I agree to the terms of service" />
      </Stack>
    )}
    {step === 2 && (
      <Stack gap="4" align="center">
        <Avatar alt="Jane Doe" size="xl" />
        <Stack gap="1" align="center">
          <Text size="lg" weight="semibold" family="display">Jane Doe</Text>
          <Text size="sm" color="secondary">jane@example.com</Text>
        </Stack>
        <Chip variant="accent" size="sm">Engineer</Chip>
        <Text size="sm" color="secondary" align="center">
          Everything looks good. Click "Complete" to finish setup.
        </Text>
      </Stack>
    )}
    <Row justify="between">
      <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
      <Button variant="primary" size="sm" onClick={() => setStep(s => Math.min(s + 1, 2))}>
        {step === 2 ? 'Complete' : 'Continue'}
      </Button>
    </Row>
  </Stack>
</Card>`,

  designNotes:
    'The Progress bar gives an at-a-glance sense of completion. The step indicator uses ' +
    'accent-colored circles for completed/current steps and neutral borders for future ' +
    'steps, with connector lines between them. Each step is a conditional render block ' +
    'so the form content swaps without layout shift (the Card maintains constant width). ' +
    'The confirmation step centers content with Avatar + name for a personal touch. ' +
    'Back button uses ghost variant and is disabled on step 0 to prevent confusion. ' +
    'justify="between" on the navigation row pushes Back and Continue to opposite edges, ' +
    'giving Back room to breathe so users don\'t accidentally go backwards.',
};
