import { useState, useRef, useLayoutEffect, useEffect, type CSSProperties, type ReactNode, type KeyboardEvent } from 'react';

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'underline' | 'pills';

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  style?: CSSProperties;
}

export function Tabs({ tabs, defaultValue, value, onChange, variant = 'underline', style }: TabsProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? tabs[0]?.value ?? '');
  const activeValue = isControlled ? value! : internalValue;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number; animate: boolean } | null>(null);
  const mounted = useRef(false);

  const isPills = variant === 'pills';

  // Overflow state
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreHovered, setMoreHovered] = useState(false);
  const [dropdownHoveredIndex, setDropdownHoveredIndex] = useState<number | null>(null);

  const visibleTabs = tabs.slice(0, visibleCount);
  const overflowTabs = tabs.slice(visibleCount);
  const hasOverflow = overflowTabs.length > 0;
  // If the active tab is in overflow, we still need to know for the panel rendering
  const activeInOverflow = overflowTabs.some(t => t.value === activeValue);

  const measure = () => {
    if (activeInOverflow) {
      setIndicator(null);
      return;
    }
    const activeIdx = tabs.findIndex((t, i) => i < visibleCount && t.value === activeValue);
    const el = tabRefs.current[activeIdx];
    if (!el) return;
    if (isPills) {
      const inner = el.querySelector('span') as HTMLElement | null;
      if (!inner) return;
      setIndicator({ left: inner.offsetLeft + el.offsetLeft, width: inner.offsetWidth, animate: mounted.current });
    } else {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, animate: mounted.current });
    }
    mounted.current = true;
  };

  useLayoutEffect(() => {
    measure();
    document.fonts.ready.then(measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeValue, visibleCount, isPills]);

  // Overflow measurement
  useEffect(() => {
    const tablist = tablistRef.current;
    if (!tablist) return;

    const computeOverflow = () => {
      const containerWidth = tablist.clientWidth;
      // Estimate "More..." button width (~70px)
      const moreWidth = 70;
      let usedWidth = 0;
      let count = 0;

      for (let i = 0; i < tabs.length; i++) {
        const el = tabRefs.current[i];
        if (!el) {
          // Tab element not rendered yet — assume it fits
          count++;
          continue;
        }
        const w = el.offsetWidth;
        if (i < tabs.length - 1) {
          // Need room for this tab + more button
          if (usedWidth + w + moreWidth > containerWidth) break;
        } else {
          // Last tab — no more button needed if it fits
          if (usedWidth + w > containerWidth) break;
        }
        usedWidth += w;
        count++;
      }

      // If only 1 or 0 overflow, show all (avoid "More..." for just 1 item)
      if (count >= tabs.length - 1 && count < tabs.length) {
        // Check if all tabs actually fit without the more button
        let totalWidth = 0;
        for (let i = 0; i < tabs.length; i++) {
          const el = tabRefs.current[i];
          if (el) totalWidth += el.offsetWidth;
        }
        if (totalWidth <= containerWidth) {
          count = tabs.length;
        }
      }

      setVisibleCount(count < 1 ? 1 : count);
    };

    // We need all tabs rendered to measure — render all first, then compute
    // Use a double rAF to ensure layout is complete
    let frameId: number;
    const deferredCompute = () => {
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(computeOverflow);
      });
    };

    deferredCompute();

    const ro = new ResizeObserver(computeOverflow);
    ro.observe(tablist);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [tabs]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        moreButtonRef.current && !moreButtonRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
        setDropdownHoveredIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [moreOpen]);

  const activate = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const enabledIndexes = visibleTabs.map((t, i) => (!t.disabled ? i : -1)).filter((i): i is number => i !== -1);
    const pos = enabledIndexes.indexOf(idx);
    let next = -1;
    if (e.key === 'ArrowRight') next = enabledIndexes[(pos + 1) % enabledIndexes.length] ?? -1;
    if (e.key === 'ArrowLeft') next = enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length] ?? -1;
    if (e.key === 'Home') next = enabledIndexes[0] ?? -1;
    if (e.key === 'End') next = enabledIndexes[enabledIndexes.length - 1] ?? -1;
    if (next !== -1) {
      e.preventDefault();
      tabRefs.current[next]?.focus();
      activate(visibleTabs[next]!.value);
    }
  };

  // For overflow measurement, we render hidden tabs off-screen to measure their widths.
  // But we only need this when visibleCount < tabs.length on first pass.
  // Instead, we render all tabs but hide overflow ones via display:none after measurement.

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', ...style }}>
      {/* Tab list */}
      <div
        ref={tablistRef}
        role="tablist"
        style={{
          position: 'relative',
          display: 'flex',
          overflow: 'hidden',
          ...(isPills
            ? {
                padding: 'var(--lucent-space-1)',
              }
            : {
                borderBottom: '1px solid var(--lucent-border-default)',
              }),
        }}
      >
        {tabs.map((tab, i) => {
          const isVisible = i < visibleCount;
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
              tabIndex={isActive && isVisible ? 0 : -1}
              onClick={() => { if (!isDisabled) activate(tab.value); }}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onMouseEnter={() => { if (!isDisabled && isVisible) setHoveredIndex(i); }}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: isPills
                  ? 'var(--lucent-space-1) var(--lucent-space-2)'
                  : 'var(--lucent-space-1) var(--lucent-space-2) var(--lucent-space-3)',
                background: 'none',
                border: 'none',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--lucent-font-family-base)',
                fontSize: 'var(--lucent-font-size-md)',
                fontWeight: isActive ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
                color: isDisabled
                  ? 'var(--lucent-text-disabled)'
                  : isPills && isActive
                  ? 'var(--lucent-accent-fg)'
                  : isActive
                  ? 'var(--lucent-text-primary)'
                  : 'var(--lucent-text-secondary)',
                transition: 'color var(--lucent-duration-fast) var(--lucent-easing-default)',
                whiteSpace: 'nowrap',
                outline: 'none',
                position: isVisible ? 'relative' : 'absolute',
                zIndex: isActive ? 1 : 0,
                // Hidden overflow tabs are positioned off-screen for measurement
                ...(isVisible ? {} : { visibility: 'hidden' as const, pointerEvents: 'none' as const, left: -9999 }),
              }}
            >
              <span style={{
                display: 'block',
                padding: 'var(--lucent-space-1) var(--lucent-space-3)',
                borderRadius: 'var(--lucent-radius-md)',
                background: !isPills && hoveredIndex === i && !isActive && !isDisabled
                  ? 'var(--lucent-surface-secondary)'
                  : 'transparent',
                transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
              }}>
                {tab.label}
              </span>
              {/* Pills hover background — matches accent pill height */}
              {isPills && hoveredIndex === i && !isActive && !isDisabled && isVisible && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: 'var(--lucent-radius-md)',
                    background: 'var(--lucent-surface-secondary)',
                    zIndex: -1,
                    transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
                  }}
                />
              )}
            </button>
          );
        })}

        {/* More button */}
        {hasOverflow && (
          <button
            ref={moreButtonRef}
            onClick={() => setMoreOpen(v => !v)}
            onMouseEnter={() => setMoreHovered(true)}
            onMouseLeave={() => setMoreHovered(false)}
            style={{
              padding: isPills
                ? 'var(--lucent-space-1) var(--lucent-space-2)'
                : 'var(--lucent-space-1) var(--lucent-space-2) var(--lucent-space-3)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--lucent-font-family-base)',
              fontSize: 'var(--lucent-font-size-md)',
              fontWeight: activeInOverflow ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
              color: activeInOverflow ? 'var(--lucent-text-primary)' : 'var(--lucent-text-secondary)',
              whiteSpace: 'nowrap',
              outline: 'none',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <span style={{
              display: 'block',
              padding: 'var(--lucent-space-1) var(--lucent-space-3)',
              borderRadius: 'var(--lucent-radius-md)',
              background: moreHovered
                ? 'var(--lucent-surface-secondary)'
                : 'transparent',
              transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
            }}>
              More…
            </span>
          </button>
        )}

        {/* Sliding indicator */}
        {indicator != null && (
          <span
            aria-hidden
            style={isPills ? {
              position: 'absolute',
              top: 'var(--lucent-space-1)',
              bottom: 'var(--lucent-space-1)',
              left: indicator.left,
              width: indicator.width,
              background: 'var(--lucent-accent-default)',
              borderRadius: 'var(--lucent-radius-md)',
              transition: indicator.animate
                ? 'left 220ms var(--lucent-easing-default), width 220ms var(--lucent-easing-default)'
                : 'none',
            } : {
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

      {/* Overflow dropdown */}
      {hasOverflow && moreOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            zIndex: 50,
            marginTop: 'var(--lucent-space-1)',
            background: 'var(--lucent-surface-primary)',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-md)',
            boxShadow: 'var(--lucent-shadow-md)',
            padding: 'var(--lucent-space-1) 0',
            minWidth: 140,
          }}
        >
          {overflowTabs.map((tab, i) => {
            const isActive = tab.value === activeValue;
            const isDisabled = tab.disabled ?? false;
            const isHovered = dropdownHoveredIndex === i;
            return (
              <button
                key={tab.value}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    activate(tab.value);
                    setMoreOpen(false);
                  }
                }}
                onMouseEnter={() => { if (!isDisabled) setDropdownHoveredIndex(i); }}
                onMouseLeave={() => setDropdownHoveredIndex(null)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: 'var(--lucent-space-2) var(--lucent-space-4)',
                  background: isActive
                    ? 'var(--lucent-surface-secondary)'
                    : isHovered
                    ? 'var(--lucent-surface-secondary)'
                    : 'none',
                  border: 'none',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--lucent-font-family-base)',
                  fontSize: 'var(--lucent-font-size-md)',
                  fontWeight: isActive ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
                  color: isDisabled
                    ? 'var(--lucent-text-disabled)'
                    : isActive || isHovered
                    ? 'var(--lucent-text-primary)'
                    : 'var(--lucent-text-secondary)',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), color var(--lucent-duration-fast) var(--lucent-easing-default)',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

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
