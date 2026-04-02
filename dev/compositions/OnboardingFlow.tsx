import { useState } from 'react';
import {
  Card, Text, Button, Stack, Row, FormField, Input, Select, Checkbox, Avatar, Chip, Divider, Stepper,
} from '../../src/index.js';

const STEPS = ['Profile', 'Preferences', 'Confirm'] as const;

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [role, setRole] = useState('engineer');
  const [agreed, setAgreed] = useState(false);

  return (
    <Card variant="elevated" padding="lg" style={{ width: 440 }}>
      <Stack gap="6">
        <Stack gap="1">
          <Text size="lg" weight="semibold" family="display">Create your account</Text>
          <Text size="sm" color="secondary">Step {step + 1} of {STEPS.length}</Text>
        </Stack>

        <Stepper steps={STEPS} current={step} />

        <Divider />

        {step === 0 && (
          <Stack gap="4">
            <FormField label="Full name" htmlFor="onb-name" required>
              <Input id="onb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </FormField>
            <FormField label="Email address" htmlFor="onb-email" required>
              <Input id="onb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
            </FormField>
            <FormField label="Role" htmlFor="onb-role">
              <Select
                id="onb-role"
                value={role}
                onChange={(val) => setRole(val)}
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
            <FormField label="Primary use case" htmlFor="onb-use">
              <Select
                id="onb-use"
                defaultValue="internal"
                options={[
                  { value: 'internal', label: 'Internal tools' },
                  { value: 'saas', label: 'SaaS product' },
                  { value: 'website', label: 'Marketing website' },
                  { value: 'mobile', label: 'Mobile app' },
                ]}
              />
            </FormField>
            <Checkbox
              label="I agree to the terms of service"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
          </Stack>
        )}

        {step === 2 && (
          <Stack gap="4" align="center">
            <Avatar alt={name} size="xl" />
            <Stack gap="1" align="center">
              <Text size="lg" weight="semibold" family="display">{name}</Text>
              <Text size="sm" color="secondary">{email}</Text>
            </Stack>
            <Row gap="2" wrap justify="center">
              <Chip variant="accent" size="sm">{role.charAt(0).toUpperCase() + role.slice(1)}</Chip>
            </Row>
            <Text size="sm" color="secondary" align="center">
              Everything looks good. Click &ldquo;Complete&rdquo; to finish setting up your account.
            </Text>
          </Stack>
        )}

        <Row gap="2" justify="between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))}
            disabled={step === STEPS.length - 1}
          >
            {step === STEPS.length - 1 ? 'Complete' : 'Continue'}
          </Button>
        </Row>
      </Stack>
    </Card>
  );
}
