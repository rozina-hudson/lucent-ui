import { useState, type ReactNode } from 'react';
import {
  Card, Text, Badge, Toggle, Select, Slider, Button, Stack, Row, Divider, Menu, MenuItem, MenuSeparator,
  MoreVertical, Email, Notification, Save,
} from '../../src/index.js';

function OverflowIcon() {
  return (
    <span aria-hidden style={{ display: 'inline-flex', width: 16, height: 16 }}><MoreVertical /></span>
  );
}

function SettingIcon({ icon }: { icon: ReactNode }) {
  return (
    <span aria-hidden style={{ display: 'inline-flex', width: 16, height: 16, color: 'var(--lucent-text-secondary)' }}>{icon}</span>
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
              <SettingIcon icon={<Email />} />
              <Stack gap="1">
                <Text size="sm" weight="medium">Email alerts</Text>
                <Text size="xs" color="secondary">Get notified when someone mentions you.</Text>
              </Stack>
            </Row>
            <Toggle checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          </Row>
          <Row justify="between" align="center">
            <Row gap="3" align="center">
              <SettingIcon icon={<Notification />} />
              <Stack gap="1">
                <Text size="sm" weight="medium">Push notifications</Text>
                <Text size="xs" color="secondary">Receive push notifications on your device.</Text>
              </Stack>
            </Row>
            <Toggle checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} />
          </Row>
          <Row justify="between" align="center">
            <Row gap="3" align="center">
              <SettingIcon icon={<Save />} />
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
