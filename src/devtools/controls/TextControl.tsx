import { Text } from '../../components/atoms/Text/index.js';
import { Input } from '../../components/atoms/Input/index.js';
import { Button } from '../../components/atoms/Button/index.js';
import { X } from '../../icons/X.js';
import type { CSSProperties } from 'react';

interface TextControlProps {
  label: string;
  value: string;
  isOverridden: boolean;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function TextControl({ label, value, isOverridden, onChange, onReset }: TextControlProps) {
  return (
    <div style={rowStyle}>
      <Text as="code" size="xs" family="mono" color="secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
        {label}
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Input
          size="sm"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: 140, fontFamily: 'var(--lucent-font-family-mono)' }}
          spellCheck={false}
        />
        {isOverridden && (
          <Button variant="ghost" size="2xs" onClick={onReset} aria-label="Reset to default">
            <span aria-hidden style={{ display: 'inline-flex', width: 10, height: 10 }}><X /></span>
          </Button>
        )}
      </div>
    </div>
  );
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '4px 0',
  minHeight: 28,
};
