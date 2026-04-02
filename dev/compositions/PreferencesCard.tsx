import { useState } from 'react';
import {
  Card, Text, Badge, Toggle, Select, Slider, Button, Stack, Row, Divider, Menu, MenuItem, MenuSeparator,
} from '../../src/index.js';

function OverflowIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function SettingIcon({ d }: { d: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--lucent-text-secondary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function PreferencesCard() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState(14);

  return (
    <Card variant="elevated" padding="lg" style={{ width: 420 }}>
      <Stack gap="5">
        <Row justify="between" align="center">
          <Row gap="2" align="center">
            <Text size="lg" weight="semibold">Preferences</Text>
            <Badge variant="neutral">v2.4.1</Badge>
          </Row>
          <Menu
            trigger={
              <Button variant="ghost" size="xs" aria-label="More options">
                <OverflowIcon />
              </Button>
            }
          >
            <MenuItem onSelect={() => {}}>Import settings</MenuItem>
            <MenuItem onSelect={() => {}}>Export settings</MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => {}}>Reset to defaults</MenuItem>
          </Menu>
        </Row>
        <Divider />
        <Stack gap="4">
          <Row justify="between" align="center">
            <Row gap="3" align="center">
              <SettingIcon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
              <Stack gap="1">
                <Text size="sm" weight="medium">Email alerts</Text>
                <Text size="xs" color="secondary">Get notified when someone mentions you.</Text>
              </Stack>
            </Row>
            <Toggle checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          </Row>
          <Row justify="between" align="center">
            <Row gap="3" align="center">
              <SettingIcon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0" />
              <Stack gap="1">
                <Text size="sm" weight="medium">Push notifications</Text>
                <Text size="xs" color="secondary">Receive push notifications on your device.</Text>
              </Stack>
            </Row>
            <Toggle checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} />
          </Row>
          <Row justify="between" align="center">
            <Row gap="3" align="center">
              <SettingIcon d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />
              <Stack gap="1">
                <Text size="sm" weight="medium">Auto-save</Text>
                <Text size="xs" color="secondary">Automatically save changes as you edit.</Text>
              </Stack>
            </Row>
            <Toggle checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} />
          </Row>
        </Stack>
        <Divider />
        <Stack gap="3">
          <Row justify="between" align="center">
            <Text size="sm" weight="medium">Editor font size</Text>
            <Text size="xs" color="secondary" family="mono">{fontSize}px</Text>
          </Row>
          <Slider value={fontSize} min={10} max={24} step={1} onChange={(e) => setFontSize(Number(e.target.value))} />
        </Stack>
        <Row justify="between" align="center">
          <Stack gap="1">
            <Text size="sm" weight="medium">Digest frequency</Text>
            <Text size="xs" color="secondary">How often to send summary emails.</Text>
          </Stack>
          <Select
            defaultValue="weekly"
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ]}
            size="sm"
            style={{ width: 120 }}
          />
        </Row>
        <Divider />
        <Row gap="2" justify="end">
          <Button variant="ghost" size="sm">Reset</Button>
          <Button variant="primary" size="sm">Save changes</Button>
        </Row>
      </Stack>
    </Card>
  );
}
