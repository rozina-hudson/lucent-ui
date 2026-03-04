import { useState, useRef, useLayoutEffect, type CSSProperties, type ReactNode, type KeyboardEvent } from 'react';

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

export function Tabs({ tabs, defaultValue, value, onChange, style }: TabsProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? tabs[0]?.value ?? '');
  const activeValue = isControlled ? value! : internalValue;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number; animate: boolean } | null>(null);
  const mounted = useRef(false);

  useLayoutEffect(() => {
    const activeIdx = tabs.findIndex(t => t.value === activeValue);
    const el = tabRefs.current[activeIdx];
    if (!el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, animate: mounted.current });
    mounted.current = true;
  }, [activeValue, tabs]);

  const activate = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const enabledIndexes = tabs.map((t, i) => (!t.disabled ? i : -1)).filter((i): i is number => i !== -1);
    const pos = enabledIndexes.indexOf(idx);
    let next = -1;
    if (e.key === 'ArrowRight') next = enabledIndexes[(pos + 1) % enabledIndexes.length] ?? -1;
    if (e.key === 'ArrowLeft') next = enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length] ?? -1;
    if (e.key === 'Home') next = enabledIndexes[0] ?? -1;
    if (e.key === 'End') next = enabledIndexes[enabledIndexes.length - 1] ?? -1;
    if (next !== -1) {
      e.preventDefault();
      tabRefs.current[next]?.focus();
      activate(tabs[next]!.value);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {/* Tab list */}
      <div
        role="tablist"
        style={{
          position: 'relative',
          display: 'flex',
          borderBottom: '1px solid var(--lucent-border-default)',
        }}
      >
        {tabs.map((tab, i) => {
          const isActive = tab.value === activeValue;
          const isDisabled = tab.disabled ?? false;
          return (
            <button
              key={tab.value}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`lucent-tabpanel-${tab.value}`}
              id={`lucent-tab-${tab.value}`}
              disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => { if (!isDisabled) activate(tab.value); }}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onMouseEnter={() => { if (!isDisabled) setHoveredIndex(i); }}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: 'var(--lucent-space-1) var(--lucent-space-2) var(--lucent-space-3)',
                background: 'none',
                border: 'none',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--lucent-font-family-base)',
                fontSize: 'var(--lucent-font-size-md)',
                fontWeight: isActive ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
                color: isDisabled
                  ? 'var(--lucent-text-disabled)'
                  : isActive
                  ? 'var(--lucent-text-primary)'
                  : 'var(--lucent-text-secondary)',
                transition: 'color var(--lucent-duration-fast) var(--lucent-easing-default)',
                whiteSpace: 'nowrap',
                outline: 'none',
              }}
            >
              <span style={{
                display: 'block',
                padding: 'var(--lucent-space-1) var(--lucent-space-3)',
                borderRadius: 'var(--lucent-radius-md)',
                background: hoveredIndex === i && !isActive
                  ? 'var(--lucent-bg-subtle)'
                  : 'transparent',
                transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Sliding indicator */}
        {indicator != null && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              bottom: 0,
              left: indicator.left,
              width: indicator.width,
              height: 2,
              background: 'var(--lucent-accent-default)',
              borderRadius: 'var(--lucent-radius-sm)',
              transition: indicator.animate
                ? 'left 220ms var(--lucent-easing-default), width 220ms var(--lucent-easing-default)'
                : 'none',
            }}
          />
        )}
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => (
        <div
          key={tab.value}
          role="tabpanel"
          id={`lucent-tabpanel-${tab.value}`}
          aria-labelledby={`lucent-tab-${tab.value}`}
          hidden={tab.value !== activeValue}
          style={{ padding: 'var(--lucent-space-4) 0', outline: 'none' }}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
