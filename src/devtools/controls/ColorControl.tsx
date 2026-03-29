import { Text } from '../../components/atoms/Text/index.js';
import { Button } from '../../components/atoms/Button/index.js';
import { ColorPicker } from '../../components/atoms/ColorPicker/index.js';
import type { CSSProperties } from 'react';

interface ColorControlProps {
  label: string;
  value: string;
  isOverridden: boolean;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function ColorControl({ label, value, isOverridden, onChange, onReset }: ColorControlProps) {
  return (
    <div style={rowStyle}>
      <Text as="code" size="xs" family="mono" color="secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
        {label}
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ColorPicker
          value={value}
          onChange={onChange}
          size="sm"
        />
        {isOverridden && (
          <Button variant="ghost" size="2xs" onClick={onReset} aria-label="Reset to default">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
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
