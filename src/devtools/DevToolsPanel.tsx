import { useState, type CSSProperties } from 'react';
import type { LucentTokens, Theme } from '../tokens/types.js';
import type { TokenOverrideState } from './useTokenOverrides.js';
import { TOKEN_GROUPS, type TokenGroup, type TokenMeta } from './tokenMeta.js';
import { serializeAsProvider, copyToClipboard } from './copyConfig.js';
import { ColorControl } from './controls/ColorControl.js';
import { SliderControl } from './controls/SliderControl.js';
import { TextControl } from './controls/TextControl.js';
import { DesignView } from './DesignView.js';
import { TypographyView } from './TypographyView.js';
import { DevToolsScope } from './DevToolsScope.js';
import { Tabs } from '../components/molecules/Tabs/index.js';
import { Button } from '../components/atoms/Button/index.js';
import { Toggle } from '../components/atoms/Toggle/index.js';
import { Text } from '../components/atoms/Text/index.js';
import { Badge } from '../components/atoms/Badge/index.js';
import { PANEL } from './panelColors.js';
import { X } from '../icons/X.js';

type PanelTab = 'design' | 'type' | 'tokens';

export type PanelMode = 'overlay' | 'push';

interface DevToolsPanelProps {
  state: TokenOverrideState;
  theme: Theme;
  position: 'left' | 'right';
  mode: PanelMode;
  onModeChange: (mode: PanelMode) => void;
  onThemeChange?: (theme: Theme) => void;
  onClose: () => void;
}

export function DevToolsPanel({ state, theme, position, mode, onModeChange, onThemeChange, onClose }: DevToolsPanelProps) {
  const [tab, setTab] = useState<PanelTab>('design');
  const [filter, setFilter] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of TOKEN_GROUPS) {
      initial[group.label] = group.defaultExpanded ?? false;
    }
    return initial;
  });
  const [copied, setCopied] = useState(false);

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleCopy = async () => {
    const text = serializeAsProvider(state.overrides);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filterLower = filter.toLowerCase();

  return (
    <DevToolsScope>
      <div style={{
        ...panelStyle,
        [position]: 0,
        borderLeft: position === 'right' ? `1px solid ${PANEL.border}` : undefined,
        borderRight: position === 'left' ? `1px solid ${PANEL.border}` : undefined,
      }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 60 60" fill="none">
              <rect x="8" y="8" width="18" height="22" rx="2" fill="#e9c96b" opacity="0.92"/>
              <rect x="8" y="40" width="44" height="12" rx="2" fill="#e9c96b" opacity="0.92"/>
              <rect x="36" y="8" width="16" height="28" rx="2" fill="#e9c96b" opacity="0.08"/>
            </svg>
            <Text size="sm" weight="semibold">Lucent DevTools</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onThemeChange && (
              <Toggle
                checked={theme === 'dark'}
                onChange={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
                size="sm"
              />
            )}
            <Button
              variant="ghost"
              size="2xs"
              onClick={() => onModeChange(mode === 'overlay' ? 'push' : 'overlay')}
              aria-label={mode === 'overlay' ? 'Push content' : 'Overlay'}
              title={mode === 'overlay' ? 'Push content' : 'Overlay'}
            >
              {mode === 'overlay' ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <rect x="10" y="1" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.5" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <rect x="10" y="1" width="3" height="12" rx="0.5" fill="currentColor" />
                </svg>
              )}
            </Button>
            <Button variant="ghost" size="2xs" onClick={onClose} aria-label="Close">
              <span aria-hidden style={{ display: 'inline-flex', width: 14, height: 14 }}><X /></span>
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ flexShrink: 0 }}>
          <Tabs
            value={tab}
            onChange={v => setTab(v as PanelTab)}
            tabs={[
              { value: 'design', label: 'Design' },
              { value: 'type', label: 'Typography' },
              { value: 'tokens', label: 'Tokens' },
            ]}
          />
        </div>

        {/* Content area */}
        {tab === 'tokens' && (
          <>
            <div style={{ padding: '8px 12px' }}>
              <input
                type="text"
                placeholder="Filter tokens..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={searchStyle}
                spellCheck={false}
              />
            </div>
            <div style={scrollAreaStyle}>
              {TOKEN_GROUPS.map(group => (
                <Section
                  key={group.label}
                  group={group}
                  state={state}
                  filter={filterLower}
                  expanded={expandedSections[group.label] ?? false}
                  onToggle={() => toggleSection(group.label)}
                />
              ))}
            </div>
          </>
        )}

        {tab === 'design' && (
          <div style={scrollAreaStyle}>
            <DesignView state={state} theme={theme} />
          </div>
        )}

        {tab === 'type' && (
          <div style={scrollAreaStyle}>
            <TypographyView state={state} theme={theme} />
          </div>
        )}

        {/* Footer */}
        <div style={footerStyle}>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            <Button size="xs" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Config'}
            </Button>
            {state.overrideCount > 0 && (
              <Button variant="outline" size="xs" onClick={state.resetAll}>
                Reset All
              </Button>
            )}
          </div>
          {state.overrideCount > 0 && (
            <Badge variant="accent" size="sm">
              {state.overrideCount} override{state.overrideCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>
    </DevToolsScope>
  );
}

// ── Section ─────────────────────────────────────────────────────────────────

interface SectionProps {
  group: TokenGroup;
  state: TokenOverrideState;
  filter: string;
  expanded: boolean;
  onToggle: () => void;
}

function Section({ group, state, filter, expanded, onToggle }: SectionProps) {
  const allTokens = group.subgroups
    ? group.subgroups.flatMap(sg => sg.tokens)
    : (group.tokens ?? []);

  const hasMatch = filter === '' || allTokens.some(t => t.key.toLowerCase().includes(filter));
  if (!hasMatch) return null;

  const isExpanded = expanded || filter !== '';

  return (
    <div style={{ borderBottom: `1px solid ${PANEL.border}` }}>
      <button onClick={onToggle} style={sectionHeaderStyle}>
        <svg
          width="10" height="10" viewBox="0 0 10 10"
          style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms' }}
        >
          <path d="M3 1l4 4-4 4" stroke={PANEL.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <Text size="xs" weight="semibold">{group.label}</Text>
        <Text size="xs" color="secondary" style={{ marginLeft: 'auto' }}>{allTokens.length}</Text>
      </button>

      {isExpanded && (
        <div style={{ padding: '0 12px 8px' }}>
          {group.subgroups
            ? group.subgroups.map(sg => {
                const filtered = filter
                  ? sg.tokens.filter(t => t.key.toLowerCase().includes(filter))
                  : sg.tokens;
                if (filtered.length === 0) return null;
                return (
                  <div key={sg.label} style={{ marginBottom: 8 }}>
                    <div style={subgroupLabelStyle}>{sg.label}</div>
                    {filtered.map(meta => (
                      <TokenRow key={meta.key} meta={meta} state={state} />
                    ))}
                  </div>
                );
              })
            : (group.tokens ?? [])
                .filter(t => !filter || t.key.toLowerCase().includes(filter))
                .map(meta => <TokenRow key={meta.key} meta={meta} state={state} />)}
        </div>
      )}
    </div>
  );
}

// ── Token Row ───────────────────────────────────────────────────────────────

function TokenRow({ meta, state }: { meta: TokenMeta; state: TokenOverrideState }) {
  const currentValue = (state.overrides[meta.key] ?? state.tokens[meta.key]) as string;
  const isOverridden = meta.key in state.overrides;

  const handleChange = (value: string) => state.setOverride(meta.key, value);
  const handleReset = () => state.removeOverride(meta.key);

  switch (meta.controlType) {
    case 'color':
      return (
        <ColorControl
          label={meta.key}
          value={currentValue}
          isOverridden={isOverridden}
          onChange={handleChange}
          onReset={handleReset}
        />
      );
    case 'slider':
      return (
        <SliderControl
          label={meta.key}
          value={currentValue}
          isOverridden={isOverridden}
          min={meta.sliderConfig!.min}
          max={meta.sliderConfig!.max}
          step={meta.sliderConfig!.step}
          unit={meta.sliderConfig!.unit}
          onChange={handleChange}
          onReset={handleReset}
        />
      );
    case 'text':
      return (
        <TextControl
          label={meta.key}
          value={currentValue}
          isOverridden={isOverridden}
          onChange={handleChange}
          onReset={handleReset}
        />
      );
  }
}

// ── Styles ──────────────────────────────────────────────────────────────────

const panelStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  width: 320,
  background: 'var(--lucent-bg-base)',
  color: 'var(--lucent-text-primary)',
  fontFamily: 'var(--lucent-font-family-base)',
  fontSize: 'var(--lucent-font-size-sm)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 99999,
  boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  flexShrink: 0,
};

const searchStyle: CSSProperties = {
  width: '100%',
  background: 'var(--lucent-surface-secondary)',
  color: 'var(--lucent-text-primary)',
  border: '1px solid var(--lucent-border-default)',
  borderRadius: 'var(--lucent-radius-md)',
  padding: '6px 10px',
  fontSize: 'var(--lucent-font-size-xs)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const scrollAreaStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  minHeight: 0,
};

const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  padding: '10px 12px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'inherit',
  fontFamily: 'inherit',
  textAlign: 'left',
};

const subgroupLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--lucent-text-secondary)',
  marginBottom: 4,
  marginTop: 4,
};

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 12px',
  borderTop: '1px solid var(--lucent-border-default)',
  flexShrink: 0,
};
