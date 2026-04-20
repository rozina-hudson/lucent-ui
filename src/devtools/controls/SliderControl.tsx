import { Text } from '../../components/atoms/Text/index.js';
import { Slider } from '../../components/atoms/Slider/index.js';
import { Button } from '../../components/atoms/Button/index.js';
import { X } from '../../icons/X.js';
import type { CSSProperties } from 'react';

interface SliderControlProps {
  label: string;
  value: string;
  isOverridden: boolean;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function SliderControl({
  label, value, isOverridden, min, max, step, unit, onChange, onReset,
}: SliderControlProps) {
  const numericValue = parseFloat(value) || 0;

  return (
    <div style={rowStyle}>
      <Text as="code" size="xs" family="mono" color="secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
        {label}
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Slider
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={v => onChange(`${v}${unit}`)}
          size="sm"
          style={{ width: 80 }}
        />
        <Text as="code" size="xs" family="mono" color="onAccent" style={{ width: 52, textAlign: 'right', flexShrink: 0, color: 'var(--lucent-accent-default)' }}>
          {value}
        </Text>
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
