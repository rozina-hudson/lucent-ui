import { useState, useCallback, useRef } from 'react';
import { useLucent } from '../provider/LucentProvider.js';
import { tokenToCssVar } from '../tokens/css.js';
import type { LucentTokens } from '../tokens/types.js';

export interface TokenOverrideState {
  tokens: LucentTokens;
  overrides: Partial<LucentTokens>;
  overrideCount: number;
  setOverride: (key: keyof LucentTokens, value: string) => void;
  removeOverride: (key: keyof LucentTokens) => void;
  resetAll: () => void;
}

export function useTokenOverrides(): TokenOverrideState {
  const { tokens } = useLucent();
  const [overrides, setOverrides] = useState<Partial<LucentTokens>>({});
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;

  const setOverride = useCallback((key: keyof LucentTokens, value: string) => {
    document.documentElement.style.setProperty(tokenToCssVar(key), value);
    setOverrides(prev => ({ ...prev, [key]: value }));
  }, []);

  const removeOverride = useCallback((key: keyof LucentTokens) => {
    document.documentElement.style.removeProperty(tokenToCssVar(key));
    setOverrides(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    for (const key of Object.keys(overridesRef.current)) {
      document.documentElement.style.removeProperty(tokenToCssVar(key));
    }
    setOverrides({});
  }, []);

  return {
    tokens,
    overrides,
    overrideCount: Object.keys(overrides).length,
    setOverride,
    removeOverride,
    resetAll,
  };
}
