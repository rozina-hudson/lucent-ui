import {
  Card, Avatar, Text, Chip, Button, Stack, Row, Divider,
} from '../../src/index.js';

export function ProfileCard() {
  return (
    <Card variant="elevated" padding="none" style={{ width: 340, padding: 'var(--lucent-space-6)' }}>
      <Stack gap="5">
        <Row gap="3" align="center">
          <Avatar alt="Jane Doe" size="lg" />
          <Stack gap="1">
            <Row gap="2" align="center">
              <Text size="lg" weight="semibold" family="display">Jane Doe</Text>
              <Chip variant="success" size="sm" dot>Pro</Chip>
            </Row>
            <Text size="sm" color="secondary">Software Engineer</Text>
          </Stack>
        </Row>
        <Text size="sm">
          Building design systems and component libraries.
          Passionate about accessible, token-driven UI.
        </Text>
        <Row gap="2" wrap>
          <Chip variant="neutral" borderless onClick={() => {}}>React</Chip>
          <Chip variant="neutral" borderless onClick={() => {}}>TypeScript</Chip>
          <Chip variant="neutral" borderless onClick={() => {}}>Design Systems</Chip>
        </Row>
        <Divider />
        <Row gap="6" justify="around">
          <Stack gap="0" align="center">
            <Text size="2xl" weight="bold" family="display">128</Text>
            <Text size="xs" color="secondary">Posts</Text>
          </Stack>
          <Stack gap="0" align="center">
            <Text size="2xl" weight="bold" family="display">4.2k</Text>
            <Text size="xs" color="secondary">Followers</Text>
          </Stack>
          <Stack gap="0" align="center">
            <Text size="2xl" weight="bold" family="display">312</Text>
            <Text size="xs" color="secondary">Following</Text>
          </Stack>
        </Row>
        <Row gap="3">
          <Button variant="primary" style={{ flex: 1 }}>Follow</Button>
          <Button variant="outline" style={{ flex: 1 }}>Message</Button>
        </Row>
      </Stack>
    </Card>
  );
}
