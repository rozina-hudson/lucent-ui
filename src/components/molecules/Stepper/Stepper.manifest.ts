import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'stepper',
  name: 'Stepper',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',
  description: 'A step indicator for multi-step flows — onboarding, wizards, checkout. Supports horizontal and vertical orientations with animated transitions.',
  designIntent:
    'Use Stepper to visualise progress through a sequence of discrete steps. ' +
    'Steps can be simple strings or objects with label, description, and custom icon. ' +
    'Completed steps show an animated checkmark (spring scale 0→1.2→1), the current step ' +
    'is highlighted with accent, and future steps are subdued. In horizontal mode the connector ' +
    'track runs behind all circles as a continuous bar; the filled portion animates smoothly ' +
    'between steps. First/last labels align left/right; middle labels center under their circles. ' +
    'Enable numbered to show "STEP N" prefixes and showStatus for Completed/In Progress/Pending ' +
    'Chip badges (success/accent/neutral variants). The vertical orientation suits sidebar layouts ' +
    'and forms with longer descriptive steps. ' +
    'Unlike Progress, Stepper is for discrete named stages, not continuous percentages.',
  props: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      description:
        'Step definitions. Each element is either a string (used as label) or an object ' +
        '{ label: string, description?: string, icon?: ReactNode }. Custom icons override ' +
        'the default number/checkmark in the circle.',
    },
    { name: 'current', type: 'number', required: true, description: 'Zero-based index of the active step. Steps before this index show as completed; steps after show as pending.' },
    { name: 'size', type: 'enum', required: false, default: 'md', description: 'Controls circle diameter (sm=24, md=32, lg=40), checkmark size, connector thickness, and label font size.', enumValues: ['sm', 'md', 'lg'] },
    { name: 'orientation', type: 'enum', required: false, default: 'horizontal', description: 'Layout direction. Horizontal shows circles in a row with a connector track behind them; vertical stacks them with a connector column on the left.', enumValues: ['horizontal', 'vertical'] },
    { name: 'numbered', type: 'boolean', required: false, default: 'false', description: 'Show uppercase "STEP N" prefix above each step label.' },
    { name: 'showStatus', type: 'boolean', required: false, default: 'false', description: 'Show a Chip badge below each label — "Completed" (success), "In Progress" (accent), or "Pending" (neutral).' },
    { name: 'style', type: 'object', required: false, description: 'Inline style overrides for the root container.' },
  ],
  usageExamples: [
    {
      title: 'Basic horizontal',
      code: `<Stepper steps={['Profile', 'Preferences', 'Confirm']} current={1} />`,
      description: 'Minimal stepper — string labels, no extras.',
    },
    {
      title: 'Numbered with status badges',
      code: `<Stepper
  steps={['Basic Details', 'Company Details', 'Subscription', 'Payment']}
  current={2}
  numbered
  showStatus
/>`,
      description: 'STEP N prefixes and Completed/In Progress/Pending chips.',
    },
    {
      title: 'Large size',
      code: `<Stepper steps={['Cart', 'Shipping', 'Payment']} current={2} size="lg" showStatus />`,
      description: 'Larger circles and text for prominent placement.',
    },
    {
      title: 'Vertical with descriptions',
      code: `<Stepper
  orientation="vertical"
  numbered
  showStatus
  size="lg"
  current={1}
  steps={[
    { label: 'Basic Details', description: 'Name, email, and contact info' },
    { label: 'Company Details', description: 'Organization and team size' },
    { label: 'Subscription Plan', description: 'Choose your plan and billing' },
    { label: 'Payment Details', description: 'Card information and billing address' },
  ]}
/>`,
      description: 'Vertical layout with step descriptions for sidebar or form flows.',
    },
    {
      title: 'Custom icons',
      code: `<Stepper
  current={1}
  steps={[
    { label: 'Cart', icon: <CartIcon /> },
    { label: 'Shipping', icon: <TruckIcon /> },
    { label: 'Payment', icon: <CreditCardIcon /> },
  ]}
/>`,
      description: 'Custom icon per step overrides the default number/checkmark.',
    },
    {
      title: 'In onboarding flow',
      code: `const [step, setStep] = useState(0);

<Card variant="elevated" padding="lg">
  <Stack gap="6">
    <Stepper steps={['Profile', 'Preferences', 'Confirm']} current={step} />
    <Divider />
    {/* Step content */}
    <Row justify="between">
      <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
      <Button variant="primary" size="sm" onClick={() => setStep(s => s + 1)}>Continue</Button>
    </Row>
  </Stack>
</Card>`,
      description: 'Stepper paired with step content and navigation buttons inside a Card.',
    },
  ],
  compositionGraph: [
    { componentId: 'chip', componentName: 'Chip', role: 'Status badge for each step (Completed/In Progress/Pending)', required: false },
  ],
  accessibility: {
    role: 'group',
    ariaAttributes: ['aria-label', 'aria-current'],
    keyboardInteractions: [],
    notes:
      'Root element has role="group" with aria-label="Progress steps". ' +
      'The current step circle receives aria-current="step" so screen readers ' +
      'can identify which step is active. Step labels are visible text, not aria-only. ' +
      'The checkmark animation uses prefers-reduced-motion: the spring scale is purely ' +
      'decorative and does not affect content comprehension.',
  },
};
