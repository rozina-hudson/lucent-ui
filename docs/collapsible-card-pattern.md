# Pattern: CollapsibleCard

A composition pattern that combines `Card` and `Collapsible` into a collapsible panel with optional localStorage persistence.

This is a **pattern**, not a built-in component — copy and adapt it to your needs.

## Basic CollapsibleCard

```tsx
import { useState } from 'react';
import { Card, Collapsible, Text } from 'lucent-ui';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleCard({ title, children, defaultOpen = true }: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card variant="outline" padding="none">
      <Collapsible open={open} onOpenChange={setOpen} trigger={
        <Text as="span" weight="semibold">{title}</Text>
      }>
        {children}
      </Collapsible>
    </Card>
  );
}
```

Usage:

```tsx
<CollapsibleCard title="Advanced options">
  <Text size="sm" color="secondary">
    Configure additional settings here.
  </Text>
</CollapsibleCard>
```

## With localStorage persistence

Add a `storageKey` prop so the open/closed state survives page reloads:

```tsx
import { useState, useCallback } from 'react';
import { Card, Collapsible, Text } from 'lucent-ui';

function usePersistedState(key: string, defaultValue: boolean): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? stored === 'true' : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setPersisted = useCallback((next: boolean) => {
    setValue(next);
    try {
      localStorage.setItem(key, String(next));
    } catch {
      // storage full or unavailable — fail silently
    }
  }, [key]);

  return [value, setPersisted];
}

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** When set, open/closed state is persisted to localStorage under this key. */
  storageKey?: string;
}

function CollapsibleCard({ title, children, defaultOpen = true, storageKey }: CollapsibleCardProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const [persistedOpen, setPersistedOpen] = usePersistedState(
    storageKey ?? '',
    defaultOpen,
  );

  const open = storageKey ? persistedOpen : localOpen;
  const setOpen = storageKey ? setPersistedOpen : setLocalOpen;

  return (
    <Card variant="outline" padding="none">
      <Collapsible open={open} onOpenChange={setOpen} trigger={
        <Text as="span" weight="semibold">{title}</Text>
      }>
        {children}
      </Collapsible>
    </Card>
  );
}
```

Usage:

```tsx
<CollapsibleCard title="Filters" storageKey="filters-panel-open">
  {/* filter controls */}
</CollapsibleCard>
```

## With Skeleton loading

Combine with `Skeleton` to show a loading placeholder while content is fetching:

```tsx
import { Skeleton, Text } from 'lucent-ui';

function CollapsibleCardWithLoading({
  title,
  loading,
  children,
  ...rest
}: CollapsibleCardProps & { loading?: boolean }) {
  return (
    <CollapsibleCard title={title} {...rest}>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-2)' }}>
          <Skeleton width="100%" height={16} />
          <Skeleton width="75%" height={16} />
          <Skeleton width="50%" height={16} />
        </div>
      ) : (
        children
      )}
    </CollapsibleCard>
  );
}
```

## Why a pattern, not a component?

Collapsible panels vary widely in practice — some need status indicators, resize handles, action buttons in the header, or context-specific state management. Shipping a one-size-fits-all component would either be too limited or too complex. The pattern gives you the composition approach; you add only the pieces you need.
