import { useState, useMemo, type ReactNode } from 'react';
import { LucentProvider } from '../src/index.js';
import type { LucentTokens } from '../src/index.js';
import { Input } from '../src/components/atoms/Input/index.js';
import { Textarea } from '../src/components/atoms/Textarea/index.js';
import { Select } from '../src/components/atoms/Select/index.js';
import { Checkbox } from '../src/components/atoms/Checkbox/index.js';
import { Radio, RadioGroup } from '../src/components/atoms/Radio/index.js';
import { Toggle } from '../src/components/atoms/Toggle/index.js';
import { Button } from '../src/components/atoms/Button/index.js';
import { Tag } from '../src/components/atoms/Tag/index.js';
import { Badge } from '../src/components/atoms/Badge/index.js';
import { SearchInput } from '../src/components/molecules/SearchInput/index.js';
import { MultiSelect } from '../src/components/molecules/MultiSelect/index.js';
import { DatePicker } from '../src/components/molecules/DatePicker/index.js';
import { DateRangePicker } from '../src/components/molecules/DateRangePicker/index.js';
import { Text } from '../src/components/atoms/Text/index.js';

/* ------------------------------------------------------------------ */
/*  Prop control definitions                                          */
/* ------------------------------------------------------------------ */

type PropDef =
  | { type: 'select'; options: string[]; default: string }
  | { type: 'boolean'; default: boolean }
  | { type: 'text'; default: string };

type PropDefs = Record<string, PropDef>;

const selectOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'dragonfruit', label: 'Dragonfruit' },
];

const multiSelectOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
];

/* Each entry: { props, render }
   `props` defines the controllable knobs.
   `render(propValues)` returns the JSX. */
const registry: Record<string, {
  props: PropDefs;
  render: (vals: Record<string, string | boolean>) => ReactNode;
}> = {
  Input: {
    props: {
      size:      { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      label:     { type: 'text', default: 'Label' },
      placeholder: { type: 'text', default: 'Type here…' },
      helperText: { type: 'text', default: '' },
      errorText: { type: 'text', default: '' },
      disabled:  { type: 'boolean', default: false },
    },
    render: (v) => (
      <Input
        size={v.size as 'sm' | 'md' | 'lg'}
        label={v.label as string || undefined}
        placeholder={v.placeholder as string}
        helperText={v.helperText as string || undefined}
        errorText={v.errorText as string || undefined}
        disabled={v.disabled as boolean}
      />
    ),
  },

  Textarea: {
    props: {
      size:      { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      label:     { type: 'text', default: 'Label' },
      placeholder: { type: 'text', default: 'Type here…' },
      helperText: { type: 'text', default: '' },
      errorText: { type: 'text', default: '' },
      autoResize: { type: 'boolean', default: false },
      disabled:  { type: 'boolean', default: false },
    },
    render: (v) => (
      <Textarea
        size={v.size as 'sm' | 'md' | 'lg'}
        label={v.label as string || undefined}
        placeholder={v.placeholder as string}
        helperText={v.helperText as string || undefined}
        errorText={v.errorText as string || undefined}
        autoResize={v.autoResize as boolean}
        disabled={v.disabled as boolean}
      />
    ),
  },

  Select: {
    props: {
      size:      { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      label:     { type: 'text', default: 'Label' },
      placeholder: { type: 'text', default: 'Choose…' },
      helperText: { type: 'text', default: '' },
      errorText: { type: 'text', default: '' },
      disabled:  { type: 'boolean', default: false },
    },
    render: (v) => (
      <Select
        size={v.size as 'sm' | 'md' | 'lg'}
        label={v.label as string || undefined}
        placeholder={v.placeholder as string}
        helperText={v.helperText as string || undefined}
        errorText={v.errorText as string || undefined}
        disabled={v.disabled as boolean}
        options={selectOptions}
      />
    ),
  },

  SearchInput: {
    props: {
      size:       { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      label:      { type: 'text', default: '' },
      placeholder: { type: 'text', default: 'Search…' },
      helperText: { type: 'text', default: '' },
      errorText:  { type: 'text', default: '' },
      disabled:   { type: 'boolean', default: false },
      isLoading:  { type: 'boolean', default: false },
    },
    render: (v) => (
      <SearchInput
        value=""
        onChange={() => {}}
        size={v.size as 'sm' | 'md' | 'lg'}
        placeholder={v.placeholder as string}
        disabled={v.disabled as boolean}
        isLoading={v.isLoading as boolean}
        {...(v.label ? { label: v.label as string } : {})}
        {...(v.helperText ? { helperText: v.helperText as string } : {})}
        {...(v.errorText ? { errorText: v.errorText as string } : {})}
      />
    ),
  },

  Button: {
    props: {
      size:    { type: 'select', options: ['xs', 'sm', 'md', 'lg'], default: 'md' },
      variant: { type: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'danger'], default: 'primary' },
      text:    { type: 'text', default: 'Click me' },
      disabled: { type: 'boolean', default: false },
    },
    render: (v) => (
      <Button
        size={v.size as 'sm' | 'md' | 'lg'}
        variant={v.variant as 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'}
        disabled={v.disabled as boolean}
      >
        {v.text as string}
      </Button>
    ),
  },

  Checkbox: {
    props: {
      size:       { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      label:      { type: 'text', default: 'Agree to terms' },
      helperText: { type: 'text', default: '' },
      contained:  { type: 'boolean', default: false },
      checked:    { type: 'boolean', default: false },
      disabled:   { type: 'boolean', default: false },
    },
    render: (v) => (
      <Checkbox
        key={String(v.checked)}
        size={v.size as 'sm' | 'md' | 'lg'}
        label={v.label as string}
        {...(v.helperText ? { helperText: v.helperText as string } : {})}
        contained={v.contained as boolean}
        defaultChecked={v.checked as boolean}
        disabled={v.disabled as boolean}
      />
    ),
  },

  Radio: {
    props: {
      size:       { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      label:      { type: 'text', default: 'Option A' },
      helperText: { type: 'text', default: '' },
      contained:  { type: 'boolean', default: false },
      disabled:   { type: 'boolean', default: false },
    },
    render: (v) => (
      <RadioGroup name="playground-radio" value="a" onChange={() => {}}>
        <Radio
          value="a"
          size={v.size as 'sm' | 'md' | 'lg'}
          label={v.label as string}
          {...(v.helperText ? { helperText: v.helperText as string } : {})}
          contained={v.contained as boolean}
          disabled={v.disabled as boolean}
        />
      </RadioGroup>
    ),
  },

  Toggle: {
    props: {
      label:      { type: 'text', default: 'Enable feature' },
      helperText: { type: 'text', default: '' },
      size:       { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      align:      { type: 'select', options: ['left', 'right'], default: 'left' },
      contained:  { type: 'boolean', default: false },
      checked:    { type: 'boolean', default: false },
      disabled:   { type: 'boolean', default: false },
    },
    render: (v) => (
      <Toggle
        key={String(v.checked)}
        label={v.label as string}
        {...(v.helperText ? { helperText: v.helperText as string } : {})}
        size={v.size as 'sm' | 'md' | 'lg'}
        align={v.align as 'left' | 'right'}
        contained={v.contained as boolean}
        defaultChecked={v.checked as boolean}
        disabled={v.disabled as boolean}
      />
    ),
  },

  Tag: {
    props: {
      variant: { type: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'], default: 'neutral' },
      size:    { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      text:    { type: 'text', default: 'Tag label' },
      dismissible: { type: 'boolean', default: false },
    },
    render: (v) => (
      <Tag
        variant={v.variant as 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'}
        size={v.size as 'sm' | 'md' | 'lg'}
        onDismiss={v.dismissible ? () => {} : undefined}
      >
        {v.text as string}
      </Tag>
    ),
  },

  Badge: {
    props: {
      variant: { type: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'], default: 'neutral' },
      size:    { type: 'select', options: ['sm', 'md'], default: 'md' },
      text:    { type: 'text', default: 'Badge' },
    },
    render: (v) => (
      <Badge
        variant={v.variant as 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'}
        size={v.size as 'sm' | 'md'}
      >
        {v.text as string}
      </Badge>
    ),
  },

  MultiSelect: {
    props: {
      size:        { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      label:       { type: 'text', default: '' },
      placeholder: { type: 'text', default: 'Select…' },
      helperText:  { type: 'text', default: '' },
      errorText:   { type: 'text', default: '' },
      disabled:    { type: 'boolean', default: false },
    },
    render: (v) => (
      <MultiSelect
        options={multiSelectOptions}
        size={v.size as 'sm' | 'md' | 'lg'}
        {...(v.label ? { label: v.label as string } : {})}
        placeholder={v.placeholder as string}
        {...(v.helperText ? { helperText: v.helperText as string } : {})}
        {...(v.errorText ? { errorText: v.errorText as string } : {})}
        disabled={v.disabled as boolean}
      />
    ),
  },

  DatePicker: {
    props: {
      size:        { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      placeholder: { type: 'text', default: 'Pick a date' },
      disabled:    { type: 'boolean', default: false },
    },
    render: (v) => (
      <DatePicker
        size={v.size as 'sm' | 'md' | 'lg'}
        placeholder={v.placeholder as string}
        disabled={v.disabled as boolean}
      />
    ),
  },

  DateRangePicker: {
    props: {
      size:        { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      placeholder: { type: 'text', default: 'Pick a date range' },
      disabled:    { type: 'boolean', default: false },
    },
    render: (v) => (
      <DateRangePicker
        size={v.size as 'sm' | 'md' | 'lg'}
        placeholder={v.placeholder as string}
        disabled={v.disabled as boolean}
      />
    ),
  },
};

const componentNames = Object.keys(registry);

/* ------------------------------------------------------------------ */
/*  Prop controls panel                                               */
/* ------------------------------------------------------------------ */

function PropControls({
  defs,
  values,
  onChange,
}: {
  defs: PropDefs;
  values: Record<string, string | boolean>;
  onChange: (key: string, val: string | boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Object.entries(defs).map(([key, def]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{
            width: '90px',
            fontSize: '12px',
            fontFamily: 'var(--lucent-font-family-mono, monospace)',
            color: '#6b7280',
            flexShrink: 0,
          }}>
            {key}
          </label>

          {def.type === 'boolean' && (
            <input
              type="checkbox"
              checked={values[key] as boolean}
              onChange={(e) => onChange(key, e.target.checked)}
            />
          )}

          {def.type === 'select' && (
            <select
              value={values[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
              style={{
                fontSize: '12px',
                padding: '2px 4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontFamily: 'inherit',
              }}
            >
              {def.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}

          {def.type === 'text' && (
            <input
              type="text"
              value={values[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={`(empty)`}
              style={{
                fontSize: '12px',
                padding: '2px 6px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontFamily: 'inherit',
                flex: 1,
                minWidth: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single component panel                                            */
/* ------------------------------------------------------------------ */

function ComponentPanel({
  side,
  selectedName,
  onSelectName,
  propValues,
  onPropChange,
}: {
  side: 'A' | 'B';
  selectedName: string;
  onSelectName: (name: string) => void;
  propValues: Record<string, string | boolean>;
  onPropChange: (key: string, val: string | boolean) => void;
}) {
  const entry = registry[selectedName];

  return (
    <div style={{
      flex: '1 1 0',
      minWidth: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header: component picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {side}
        </span>
        <select
          value={selectedName}
          onChange={(e) => onSelectName(e.target.value)}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontFamily: 'inherit',
            background: '#fff',
          }}
        >
          {componentNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Controls */}
      <div style={{
        padding: '12px',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}>
        <PropControls
          defs={entry.props}
          values={propValues}
          onChange={onPropChange}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper: get defaults from a registry entry                        */
/* ------------------------------------------------------------------ */

function getDefaults(name: string): Record<string, string | boolean> {
  const defs = registry[name].props;
  const out: Record<string, string | boolean> = {};
  for (const [k, d] of Object.entries(defs)) {
    out[k] = d.default;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Main export                                                       */
/* ------------------------------------------------------------------ */

export function SelectPlayground() {
  const [nameA, setNameA] = useState('Input');
  const [nameB, setNameB] = useState('Select');
  const [propsA, setPropsA] = useState<Record<string, string | boolean>>(() => getDefaults('Input'));
  const [propsB, setPropsB] = useState<Record<string, string | boolean>>(() => getDefaults('Select'));

  const [spaceScale, setSpaceScale] = useState(100);
  const [fontScale, setFontScale] = useState(100);
  const [radiusScale, setRadiusScale] = useState(100);

  const pickA = (name: string) => { setNameA(name); setPropsA(getDefaults(name)); };
  const pickB = (name: string) => { setNameB(name); setPropsB(getDefaults(name)); };
  const changeA = (key: string, val: string | boolean) => setPropsA((p) => ({ ...p, [key]: val }));
  const changeB = (key: string, val: string | boolean) => setPropsB((p) => ({ ...p, [key]: val }));

  const entryA = registry[nameA];
  const entryB = registry[nameB];

  const baseSpaces = { space0: 0, space1: 0.25, space2: 0.5, space3: 0.75, space4: 1, space5: 1.25, space6: 1.5, space8: 2, space10: 2.5, space12: 3, space16: 4, space20: 5, space24: 6 };
  const baseFonts = { fontSizeXs: 0.6875, fontSizeSm: 0.8125, fontSizeMd: 0.9375, fontSizeLg: 1.125 };
  const baseRadii = { radiusNone: 0, radiusSm: 0.25, radiusMd: 0.375, radiusLg: 0.5, radiusXl: 0.75 };

  const tokenOverrides = useMemo(() => {
    const t: Partial<LucentTokens> = {};
    const sm = spaceScale / 100;
    const fm = fontScale / 100;
    const rm = radiusScale / 100;
    for (const [k, v] of Object.entries(baseSpaces)) {
      (t as Record<string, string>)[k] = `${(v * sm).toFixed(4)}rem`;
    }
    for (const [k, v] of Object.entries(baseFonts)) {
      (t as Record<string, string>)[k] = `${(v * fm).toFixed(4)}rem`;
    }
    for (const [k, v] of Object.entries(baseRadii)) {
      (t as Record<string, string>)[k] = `${(v * rm).toFixed(4)}rem`;
    }
    // radiusFull stays fixed (pill shape)
    t.radiusFull = '9999px';
    return t;
  }, [spaceScale, fontScale, radiusScale]);

  return (
    <LucentProvider tokens={tokenOverrides}>
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <Text as="h1" size="2xl" weight="bold" style={{ marginBottom: '8px' }}>
          Component Playground
        </Text>
        <Text as="p" size="sm" color="secondary" style={{ marginBottom: '24px' }}>
          Pick two components, tweak their props, and see how they look together.
        </Text>

        {/* Scale sliders */}
        <div style={{
          display: 'flex',
          gap: '32px',
          marginBottom: '24px',
          padding: '12px',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px' }}>
            <label style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6b7280', whiteSpace: 'nowrap' }}>
              Spacing
            </label>
            <input
              type="range"
              min={50}
              max={200}
              value={spaceScale}
              onChange={(e) => setSpaceScale(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#374151', minWidth: '36px', textAlign: 'right' }}>
              {spaceScale}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px' }}>
            <label style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6b7280', whiteSpace: 'nowrap' }}>
              Font size
            </label>
            <input
              type="range"
              min={50}
              max={200}
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#374151', minWidth: '36px', textAlign: 'right' }}>
              {fontScale}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px' }}>
            <label style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6b7280', whiteSpace: 'nowrap' }}>
              Roundness
            </label>
            <input
              type="range"
              min={0}
              max={300}
              value={radiusScale}
              onChange={(e) => setRadiusScale(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#374151', minWidth: '36px', textAlign: 'right' }}>
              {radiusScale}%
            </span>
          </div>
        </div>

        {/* Controls row */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}>
          <ComponentPanel
            side="A"
            selectedName={nameA}
            onSelectName={pickA}
            propValues={propsA}
            onPropChange={changeA}
          />
          <ComponentPanel
            side="B"
            selectedName={nameB}
            onSelectName={pickB}
            propValues={propsB}
            onPropChange={changeB}
          />
        </div>

        {/* Shared preview — show all sizes if component has a size prop */}
        <div style={{
          padding: '32px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {(() => {
            const aSizes = entryA.props.size;
            const bSizes = entryB.props.size;
            const aOptions = aSizes?.type === 'select' ? aSizes.options : null;
            const bOptions = bSizes?.type === 'select' ? bSizes.options : null;
            const sizes = aOptions ?? bOptions ?? [null];

            return sizes.map((s) => (
              <div key={s ?? 'default'}>
                {s && (
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    display: 'block',
                  }}>
                    {s}
                  </span>
                )}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    {entryA.render(s && aOptions ? { ...propsA, size: s } : propsA)}
                  </div>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    {entryB.render(s && bOptions ? { ...propsB, size: s } : propsB)}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </LucentProvider>
  );
}
