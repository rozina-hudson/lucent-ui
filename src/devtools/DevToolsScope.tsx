import { useMemo, useCallback, useContext, createContext, useState, type ReactNode } from 'react';
import { darkTokens } from '../tokens/dark.js';
import { tokenToCssVar } from '../tokens/css.js';
import type { LucentTokens } from '../tokens/types.js';
import { PANEL } from './panelColors.js';

/**
 * Context that provides the scoped container element for portals.
 * Components like ColorPicker need to portal into this element
 * so their popover inherits the devtools CSS var scope.
 */
const ScopeContainerContext = createContext<HTMLDivElement | null>(null);

export function useScopeContainer(): HTMLDivElement | null {
  return useContext(ScopeContainerContext);
}

/**
 * Wraps devtools content in a div that sets all --lucent-* CSS vars to a
 * fixed dark theme via inline styles. This scopes lucent-ui components
 * inside the panel to the dark theme, regardless of what overrides are
 * applied to :root by the devtools.
 */
export function DevToolsScope({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const refCallback = useCallback((el: HTMLDivElement | null) => {
    if (el) setContainer(el);
  }, []);

  const scopeStyle = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(darkTokens)) {
      vars[tokenToCssVar(key)] = value;
    }
    // Override a few tokens for the devtools-specific dark palette
    vars[tokenToCssVar('bgBase')] = PANEL.bg;
    vars[tokenToCssVar('surface')] = PANEL.surface;
    vars[tokenToCssVar('surfaceSecondary')] = PANEL.inputBg;
    vars[tokenToCssVar('borderDefault')] = PANEL.border;
    vars[tokenToCssVar('borderSubtle')] = PANEL.border;
    vars[tokenToCssVar('textPrimary')] = PANEL.text;
    vars[tokenToCssVar('textSecondary')] = PANEL.textMuted;
    vars[tokenToCssVar('accentDefault')] = PANEL.accent;
    vars[tokenToCssVar('accentFg')] = '#0a0a0a';
    vars[tokenToCssVar('accentSubtle')] = 'rgba(233, 201, 107, 0.12)';
    vars[tokenToCssVar('accentHover')] = '#d4b55a';
    vars[tokenToCssVar('accentBorder')] = PANEL.accent;

    return vars as unknown as React.CSSProperties;
  }, []);

  return (
    <div ref={refCallback} style={scopeStyle}>
      <ScopeContainerContext.Provider value={container}>
        {children}
      </ScopeContainerContext.Provider>
    </div>
  );
}

/**
 * Converts a LucentTokens object to inline style CSS vars.
 * Useful for scoping lucent components to a specific token set.
 */
export function tokensToCssVarStyle(tokens: Partial<LucentTokens>): React.CSSProperties {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    vars[tokenToCssVar(key)] = value;
  }
  return vars as unknown as React.CSSProperties;
}
