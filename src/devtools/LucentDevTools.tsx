import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useLucent } from '../provider/LucentProvider.js';
import type { Theme } from '../tokens/types.js';
import { useTokenOverrides } from './useTokenOverrides.js';
import { DevToolsPanel, type PanelMode } from './DevToolsPanel.js';
import { PANEL } from './panelColors.js';

export interface LucentDevToolsProps {
  /**
   * Keyboard shortcut to toggle the panel.
   * Default: 'meta+shift+d' (Mac) or 'ctrl+shift+d'.
   */
  shortcut?: string;
  /**
   * Which side the panel appears on.
   * Default: 'right'.
   */
  position?: 'left' | 'right';
  /**
   * Whether the panel starts open.
   * Default: false.
   */
  defaultOpen?: boolean;
  /**
   * Called when the user toggles the theme inside the panel.
   * Since theme is a LucentProvider prop, the consumer must
   * update their state to make the switch happen.
   */
  onThemeChange?: (theme: Theme) => void;
  /**
   * Optional z-index for the panel.
   * Default: 99999.
   */
  zIndex?: number;
}

interface ShortcutKeys {
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  key: string;
}

function parseShortcut(shortcut: string): ShortcutKeys {
  const parts = shortcut.toLowerCase().split('+');
  return {
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('meta') || parts.includes('cmd'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    key: parts[parts.length - 1] ?? '',
  };
}

function matchesShortcut(e: KeyboardEvent, parsed: ShortcutKeys): boolean {
  const isMac = navigator.platform.toUpperCase().includes('MAC');

  // 'ctrl' in the shortcut string means Ctrl on Windows, Cmd on Mac
  const modifierOk = parsed.meta
    ? (isMac ? e.metaKey : e.ctrlKey)
    : parsed.ctrl
      ? (isMac ? e.metaKey : e.ctrlKey)
      : (!e.ctrlKey && !e.metaKey);

  return (
    modifierOk &&
    parsed.shift === e.shiftKey &&
    parsed.alt === e.altKey &&
    e.key.toLowerCase() === parsed.key
  );
}

export function LucentDevTools({
  shortcut = 'meta+shift+d',
  position = 'right',
  defaultOpen = false,
  onThemeChange,
  zIndex = 99999,
}: LucentDevToolsProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<PanelMode>('overlay');
  const { theme } = useLucent();
  const state = useTokenOverrides();

  const toggle = useCallback(() => setOpen(prev => !prev), []);

  // Push mode: add margin to body so content shifts
  useEffect(() => {
    if (!open || mode !== 'push') {
      document.body.style.removeProperty(`margin-${position}`);
      document.body.style.removeProperty('transition');
      return;
    }
    document.body.style.transition = 'margin 200ms ease';
    document.body.style[position === 'right' ? 'marginRight' : 'marginLeft'] = '320px';
    return () => {
      document.body.style.removeProperty(`margin-${position}`);
      document.body.style.removeProperty('transition');
    };
  }, [open, mode, position]);

  // Keyboard shortcut
  useEffect(() => {
    const parsed = parseShortcut(shortcut);
    const handler = (e: KeyboardEvent) => {
      if (matchesShortcut(e, parsed)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcut, toggle]);

  const portal = createPortal(
    <>
      {/* Toggle button (visible when panel is closed) */}
      {!open && (
        <button onClick={toggle} style={{ ...toggleBtnStyle, [position]: 16, zIndex }} title="Open Lucent DevTools">
          <svg width="20" height="20" viewBox="0 0 60 60" fill="none">
            <rect x="8" y="8" width="18" height="22" rx="2" fill="#e9c96b" opacity="0.92"/>
            <rect x="8" y="40" width="44" height="12" rx="2" fill="#e9c96b" opacity="0.92"/>
            <rect x="36" y="8" width="16" height="28" rx="2" fill="#e9c96b" opacity="0.08"/>
          </svg>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div style={{ zIndex }}>
          <DevToolsPanel
            state={state}
            theme={theme}
            position={position}
            mode={mode}
            onModeChange={setMode}
            {...(onThemeChange !== undefined && { onThemeChange })}
            onClose={toggle}
          />
        </div>
      )}
    </>,
    document.body,
  );

  return portal;
}

const toggleBtnStyle: CSSProperties = {
  position: 'fixed',
  bottom: 16,
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: PANEL.bg,
  border: `1px solid ${PANEL.border}`,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
  transition: 'transform 150ms ease, box-shadow 150ms ease',
};
