import { useState, useMemo } from 'react';
import { LucentProvider, useLucent, lightTokens, deriveDarkFromLight } from '../src/index.js';
import type { LucentTokens, Theme } from '../src/index.js';

// Anchor tokens → the variant keys they derive when overridden
const DERIVED_FROM: Partial<Record<keyof LucentTokens, keyof LucentTokens>> = {
  borderSubtle: 'borderDefault',
  borderStrong: 'borderDefault',
  bgSubtle: 'bgBase',
  surface: 'bgBase',
  surfaceSecondary: 'bgBase',
  surfaceRaised: 'bgBase',
  surfaceOverlay: 'bgBase',
  textSecondary: 'textPrimary',
  textDisabled: 'textPrimary',
  accentHover: 'accentDefault',
  accentActive: 'accentDefault',
  accentSubtle: 'accentDefault',
};

const ANCHOR_KEYS = new Set<keyof LucentTokens>([
  'borderDefault', 'bgBase', 'textPrimary', 'accentDefault',
]);

export function TokenPreview() {
  const [theme, setTheme] = useState<Theme>('light');
  // lightOverrides is the source of truth for both themes.
  // darkOverrides allows additional dark-specific tweaks on top.
  const [lightOverrides, setLightOverrides] = useState<Partial<LucentTokens>>({});
  const [darkOverrides, setDarkOverrides] = useState<Partial<LucentTokens>>({});

  // In dark mode, derive from the current light customization so both modes
  // share the same hue/character, then layer any dark-specific adjustments.
  // textOnAccent and accentBorder are excluded so LucentProvider recomputes them.
  const effectiveTokens = useMemo((): Partial<LucentTokens> => {
    if (theme === 'dark') {
      const { textOnAccent: _toa, accentBorder: _ab, ...derivedDark } =
        deriveDarkFromLight({ ...lightTokens, ...lightOverrides });
      return { ...derivedDark, ...darkOverrides };
    }
    return lightOverrides;
  }, [theme, lightOverrides, darkOverrides]);

  // Overrides shown in the inspector reflect what the user explicitly picked
  // for the current mode (used for "auto" / dot badges on swatches).
  const activeOverrides = theme === 'light' ? lightOverrides : darkOverrides;

  function handleOverride(key: keyof LucentTokens, value: string) {
    if (theme === 'light') {
      setLightOverrides(prev => ({ ...prev, [key]: value }));
    } else {
      setDarkOverrides(prev => ({ ...prev, [key]: value }));
    }
  }

  function handleReset() {
    setLightOverrides({});
    setDarkOverrides({});
  }

  const hasOverrides =
    Object.keys(lightOverrides).length > 0 || Object.keys(darkOverrides).length > 0;

  return (
    <LucentProvider theme={theme} tokens={effectiveTokens}>
      <Inner
        theme={theme}
        overrides={activeOverrides}
        hasOverrides={hasOverrides}
        onToggle={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
        onOverride={handleOverride}
        onReset={handleReset}
      />
    </LucentProvider>
  );
}

interface InnerProps {
  theme: Theme;
  overrides: Partial<LucentTokens>;
  hasOverrides: boolean;
  onToggle: () => void;
  onOverride: (key: keyof LucentTokens, value: string) => void;
  onReset: () => void;
}

function Inner({ theme, overrides, hasOverrides, onToggle, onOverride, onReset }: InnerProps) {
  const { tokens } = useLucent();

  const colorGroups: Record<string, (keyof LucentTokens)[]> = {
    'Background': ['bgBase', 'bgSubtle'],
    'Surface': ['surface', 'surfaceSecondary', 'surfaceRaised', 'surfaceOverlay'],
    'Border': ['borderDefault', 'borderSubtle', 'borderStrong'],
    'Text': ['textPrimary', 'textSecondary', 'textDisabled', 'textInverse', 'textOnAccent'],
    'Accent': ['accentDefault', 'accentHover', 'accentActive', 'accentSubtle'],
    'Success': ['successDefault', 'successSubtle', 'successText'],
    'Warning': ['warningDefault', 'warningSubtle', 'warningText'],
    'Danger': ['dangerDefault', 'dangerHover', 'dangerSubtle', 'dangerText'],
    'Info': ['infoDefault', 'infoSubtle', 'infoText'],
    'Focus': ['focusRing'],
  };

  const typographyKeys = Object.keys(tokens).filter(k =>
    k.startsWith('font') || k.startsWith('lineHeight') || k.startsWith('letterSpacing')
  );
  const spacingKeys = Object.keys(tokens).filter(k => k.startsWith('space'));
  const radiusKeys = Object.keys(tokens).filter(k => k.startsWith('radius'));
  const shadowKeys = Object.keys(tokens).filter(k => k.startsWith('shadow'));
  const motionKeys = Object.keys(tokens).filter(k =>
    k.startsWith('duration') || k.startsWith('easing')
  );


  return (
    <div style={{
      background: tokens.bgBase,
      color: tokens.textPrimary,
      fontFamily: tokens.fontFamilyBase,
      minHeight: '100vh',
      padding: tokens.space8,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.space8 }}>
        <div>
          <h1 style={{ fontSize: tokens.fontSize2xl, fontWeight: tokens.fontWeightBold, margin: 0 }}>
            Lucent UI — Token Preview
          </h1>
          <p style={{ color: tokens.textSecondary, margin: `${tokens.space1} 0 0`, fontSize: tokens.fontSizeSm }}>
            {Object.keys(lightTokens).length} tokens · {theme} mode
            {hasOverrides && (
              <span style={{ marginLeft: tokens.space2, color: tokens.accentDefault }}>
                · {Object.keys(overrides).length} override{Object.keys(overrides).length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: tokens.space2 }}>
          {hasOverrides && (
            <button
              onClick={onReset}
              style={{
                background: 'transparent',
                color: tokens.textSecondary,
                border: `1px solid ${tokens.borderDefault}`,
                borderRadius: tokens.radiusMd,
                padding: `${tokens.space2} ${tokens.space4}`,
                fontFamily: tokens.fontFamilyBase,
                fontSize: tokens.fontSizeSm,
                fontWeight: tokens.fontWeightMedium,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
          <button
            onClick={onToggle}
            style={{
              background: tokens.accentDefault,
              color: tokens.textOnAccent,
              border: 'none',
              borderRadius: tokens.radiusMd,
              padding: `${tokens.space2} ${tokens.space4}`,
              fontFamily: tokens.fontFamilyBase,
              fontSize: tokens.fontSizeSm,
              fontWeight: tokens.fontWeightMedium,
              cursor: 'pointer',
            }}
          >
            Switch to {theme === 'light' ? 'dark' : 'light'}
          </button>
        </div>
      </div>

      {/* Two-column layout: token inspector + live preview */}
      <div style={{ display: 'flex', gap: tokens.space6, alignItems: 'flex-start' }}>

        {/* Left: token sections */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Color tokens */}
          <Section title="Colors" tokens={tokens}>
            <p style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, marginTop: 0, marginBottom: tokens.space6 }}>
              {hasOverrides
                ? 'Click any anchor swatch (dashed border) to pick a color. Derived tokens update automatically.'
                : 'Click any dashed-border swatch to customize an anchor color — variants derive automatically.'}
            </p>
            {Object.entries(colorGroups).map(([groupName, keys]) => (
              <div key={groupName} style={{ marginBottom: tokens.space6 }}>
                <h3 style={{ fontSize: tokens.fontSizeSm, color: tokens.textSecondary, fontWeight: tokens.fontWeightMedium, marginBottom: tokens.space3, marginTop: 0 }}>
                  {groupName}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.space3 }}>
                  {keys.map(key => {
                    const value = tokens[key] as string;
                    const isAnchor = ANCHOR_KEYS.has(key);
                    const derivedFromKey = DERIVED_FROM[key];
                    const isDerived = derivedFromKey !== undefined && derivedFromKey in overrides;
                    return (
                      <ColorSwatch
                        key={key}
                        name={key}
                        value={value}
                        tokens={tokens}
                        isAnchor={isAnchor}
                        isDerived={isDerived}
                        isOverridden={key in overrides}
                        onChange={isAnchor ? (v) => onOverride(key, v) : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </Section>

          {/* Typography */}
          <Section title="Typography" tokens={tokens}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
              {typographyKeys.map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: tokens.space3 }}>
                  <code style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, width: 240, flexShrink: 0, fontFamily: tokens.fontFamilyMono }}>
                    {key}
                  </code>
                  <span style={{ fontSize: tokens.fontSizeXs, color: tokens.accentDefault, fontFamily: tokens.fontFamilyMono, width: 200, flexShrink: 0 }}>
                    {tokens[key as keyof typeof tokens] as string}
                  </span>
                  <span style={{ fontFamily: key.startsWith('fontFamily') ? tokens[key as keyof typeof tokens] as string : undefined }}>
                    {key.startsWith('fontSize') ? <span style={{ fontSize: tokens[key as keyof typeof tokens] as string }}>Aa</span>
                      : key.startsWith('fontWeight') ? <span style={{ fontWeight: tokens[key as keyof typeof tokens] as string }}>Semibold text</span>
                      : key.startsWith('lineHeight') ? <span style={{ lineHeight: tokens[key as keyof typeof tokens] as string, display: 'block', background: tokens.accentSubtle, padding: '0 4px' }}>Line height</span>
                      : key.startsWith('fontFamily') ? <span>The quick brown fox</span>
                      : <span style={{ letterSpacing: tokens[key as keyof typeof tokens] as string }}>Letter spacing</span>}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Spacing */}
          <Section title="Spacing" tokens={tokens}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
              {spacingKeys.map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: tokens.space3 }}>
                  <code style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, width: 100, flexShrink: 0, fontFamily: tokens.fontFamilyMono }}>{key}</code>
                  <span style={{ fontSize: tokens.fontSizeXs, color: tokens.accentDefault, fontFamily: tokens.fontFamilyMono, width: 80, flexShrink: 0 }}>{tokens[key as keyof typeof tokens] as string}</span>
                  <div style={{ height: 16, width: tokens[key as keyof typeof tokens] as string, background: tokens.accentDefault, borderRadius: tokens.radiusSm, minWidth: 2 }} />
                </div>
              ))}
            </div>
          </Section>

          {/* Border radius */}
          <Section title="Border Radius" tokens={tokens}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.space4 }}>
              {radiusKeys.map(key => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.space2 }}>
                  <div style={{ width: 64, height: 64, background: tokens.accentSubtle, border: `2px solid ${tokens.accentDefault}`, borderRadius: tokens[key as keyof typeof tokens] as string }} />
                  <code style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono }}>{key}</code>
                  <span style={{ fontSize: tokens.fontSizeXs, color: tokens.accentDefault, fontFamily: tokens.fontFamilyMono }}>{tokens[key as keyof typeof tokens] as string}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Shadows */}
          <Section title="Shadows" tokens={tokens}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.space6 }}>
              {shadowKeys.map(key => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.space3 }}>
                  <div style={{ width: 80, height: 80, background: tokens.surface, borderRadius: tokens.radiusMd, boxShadow: tokens[key as keyof typeof tokens] as string, border: `1px solid ${tokens.borderSubtle}` }} />
                  <code style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono }}>{key}</code>
                </div>
              ))}
            </div>
          </Section>

          {/* Motion */}
          <Section title="Motion" tokens={tokens}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
              {motionKeys.map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: tokens.space3 }}>
                  <code style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, width: 180, flexShrink: 0, fontFamily: tokens.fontFamilyMono }}>{key}</code>
                  <span style={{ fontSize: tokens.fontSizeXs, color: tokens.accentDefault, fontFamily: tokens.fontFamilyMono }}>{tokens[key as keyof typeof tokens] as string}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Right: sticky live UI preview */}
        <div style={{ width: 360, flexShrink: 0, position: 'sticky', top: tokens.space8 }}>
          <MiniUIPreview tokens={tokens} />
        </div>
      </div>
    </div>
  );
}

// ─── Mini UI Preview ───────────────────────────────────────────────────────────

function MiniUIPreview({ tokens }: { tokens: ReturnType<typeof useLucent>['tokens'] }) {
  const t = tokens;
  const mono = t.fontFamilyMono;
  const base = t.fontFamilyBase;

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.borderDefault}`,
      borderRadius: t.radiusLg,
      overflow: 'hidden',
      boxShadow: t.shadowLg,
      fontFamily: base,
      fontSize: t.fontSizeSm,
    }}>

      {/* ── Navbar ── */}
      <div style={{
        background: t.surface,
        borderBottom: `1px solid ${t.borderDefault}`,
        padding: `${t.space3} ${t.space4}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.space3 }}>
          {/* Logo mark */}
          <div style={{
            width: 24, height: 24,
            borderRadius: t.radiusMd,
            background: t.accentDefault,
          }} />
          <span style={{ fontWeight: t.fontWeightSemibold, color: t.textPrimary, fontSize: t.fontSizeSm }}>
            Acme
          </span>
          <div style={{ display: 'flex', gap: t.space1, marginLeft: t.space2 }}>
            {['Dashboard', 'Projects', 'Team'].map((label, i) => (
              <span key={label} style={{
                padding: `${t.space1} ${t.space3}`,
                borderRadius: t.radiusMd,
                fontSize: t.fontSizeXs,
                fontWeight: i === 0 ? t.fontWeightMedium : t.fontWeightRegular,
                color: i === 0 ? t.accentDefault : t.textSecondary,
                background: i === 0 ? t.accentSubtle : 'transparent',
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>
        {/* Avatar */}
        <div style={{
          width: 28, height: 28,
          borderRadius: t.radiusFull,
          background: t.accentDefault,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.textOnAccent,
          fontSize: t.fontSizeXs,
          fontWeight: t.fontWeightSemibold,
        }}>
          JD
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ background: t.surface, padding: t.space4, display: 'flex', flexDirection: 'column', gap: t.space4 }}>

        {/* Page title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: t.fontWeightSemibold, color: t.textPrimary, fontSize: t.fontSizeMd }}>
              Overview
            </div>
            <div style={{ color: t.textSecondary, fontSize: t.fontSizeXs, marginTop: 2 }}>
              Last updated just now
            </div>
          </div>
          {/* Primary button */}
          <button style={{
            background: t.accentDefault,
            color: t.textOnAccent,
            border: 'none',
            borderRadius: t.radiusMd,
            padding: `${t.space2} ${t.space3}`,
            fontFamily: base,
            fontSize: t.fontSizeXs,
            fontWeight: t.fontWeightMedium,
            cursor: 'pointer',
          }}>
            + New project
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: t.space2 }}>
          {[
            { label: 'Projects', value: '12', accent: true },
            { label: 'Tasks', value: '48' },
            { label: 'Members', value: '6' },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{
              background: accent ? t.accentDefault : t.surface,
              border: `1px solid ${accent ? 'transparent' : t.borderDefault}`,
              borderRadius: t.radiusMd,
              padding: t.space3,
              boxShadow: t.shadowSm,
            }}>
              <div style={{
                fontSize: t.fontSizeXl,
                fontWeight: t.fontWeightBold,
                color: accent ? t.textOnAccent : t.textPrimary,
              }}>
                {value}
              </div>
              <div style={{
                fontSize: t.fontSizeXs,
                color: accent ? t.textOnAccent : t.textSecondary,
                marginTop: 2,
                opacity: accent ? 0.8 : 1,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Card with form */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.borderDefault}`,
          borderRadius: t.radiusMd,
          padding: t.space4,
          boxShadow: t.shadowSm,
        }}>
          <div style={{ fontWeight: t.fontWeightMedium, color: t.textPrimary, marginBottom: t.space3 }}>
            Add task
          </div>
          {/* Input */}
          <div style={{
            background: t.surfaceSecondary,
            border: `1px solid ${t.borderDefault}`,
            borderRadius: t.radiusMd,
            padding: `${t.space2} ${t.space3}`,
            color: t.textDisabled,
            fontSize: t.fontSizeXs,
            marginBottom: t.space3,
          }}>
            Task name…
          </div>
          {/* Button row */}
          <div style={{ display: 'flex', gap: t.space2 }}>
            <button style={{
              background: t.accentDefault,
              color: t.textOnAccent,
              border: 'none',
              borderRadius: t.radiusMd,
              padding: `${t.space2} ${t.space3}`,
              fontFamily: base,
              fontSize: t.fontSizeXs,
              fontWeight: t.fontWeightMedium,
              cursor: 'pointer',
            }}>
              Save
            </button>
            <button style={{
              background: 'transparent',
              color: t.textSecondary,
              border: `1px solid ${t.borderDefault}`,
              borderRadius: t.radiusMd,
              padding: `${t.space2} ${t.space3}`,
              fontFamily: base,
              fontSize: t.fontSizeXs,
              cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </div>

        {/* List card */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.borderDefault}`,
          borderRadius: t.radiusMd,
          overflow: 'hidden',
          boxShadow: t.shadowSm,
        }}>
          <div style={{ padding: `${t.space3} ${t.space4}`, borderBottom: `1px solid ${t.borderSubtle}`, fontWeight: t.fontWeightMedium, color: t.textPrimary, fontSize: t.fontSizeXs }}>
            Recent activity
          </div>
          {[
            { text: 'Design review completed', sub: '2 min ago', status: 'success' },
            { text: 'API keys rotated', sub: '1 hr ago', status: 'warning' },
            { text: 'Deploy failed on staging', sub: '3 hr ago', status: 'danger' },
            { text: 'New member joined', sub: 'yesterday', status: 'info' },
          ].map(({ text, sub, status }) => {
            const colors: Record<string, { bg: string; text: string; dot: string }> = {
              success: { bg: t.successSubtle, text: t.successText, dot: t.successDefault },
              warning: { bg: t.warningSubtle, text: t.warningText, dot: t.warningDefault },
              danger: { bg: t.dangerSubtle, text: t.dangerText, dot: t.dangerDefault },
              info: { bg: t.infoSubtle, text: t.infoText, dot: t.infoDefault },
            };
            const c = colors[status];
            return (
              <div key={text} style={{
                display: 'flex',
                alignItems: 'center',
                gap: t.space3,
                padding: `${t.space2} ${t.space4}`,
                borderBottom: `1px solid ${t.borderSubtle}`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: t.radiusFull, background: c.dot, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: t.fontSizeXs, color: t.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {text}
                  </div>
                  <div style={{ fontSize: '10px', color: t.textDisabled }}>{sub}</div>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontFamily: mono,
                  background: c.bg,
                  color: c.text,
                  borderRadius: t.radiusFull,
                  padding: '2px 8px',
                  whiteSpace: 'nowrap',
                }}>
                  {status}
                </span>
              </div>
            );
          })}
          {/* muted footer */}
          <div style={{ padding: `${t.space2} ${t.space4}`, background: t.surfaceSecondary }}>
            <span style={{ fontSize: '10px', color: t.textDisabled }}>Showing 4 of 24 events</span>
          </div>
        </div>

        {/* Inline code snippet */}
        <div style={{
          background: t.surfaceSecondary,
          border: `1px solid ${t.borderSubtle}`,
          borderRadius: t.radiusMd,
          padding: t.space3,
          fontFamily: mono,
          fontSize: '10px',
          color: t.textSecondary,
          lineHeight: t.lineHeightRelaxed,
        }}>
          <span style={{ color: t.textDisabled }}>// lucent.config.ts</span>{'\n'}
          <span style={{ color: t.accentDefault }}>export</span>
          {' const tokens = \{'}
          {'\n  '}
          <span style={{ color: t.successText }}>accentDefault</span>
          {`: '${t.accentDefault}',`}
          {'\n  '}
          <span style={{ color: t.successText }}>bgBase</span>
          {`: '${t.bgBase}',`}
          {'\n\};'}
        </div>

      </div>
    </div>
  );
}

// ─── Shared components ─────────────────────────────────────────────────────────

function Section({ title, tokens, children }: { title: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{
      background: tokens.surface,
      border: `1px solid ${tokens.borderDefault}`,
      borderRadius: tokens.radiusLg,
      padding: tokens.space6,
      marginBottom: tokens.space6,
    }}>
      <h2 style={{ fontSize: tokens.fontSizeLg, fontWeight: tokens.fontWeightSemibold, marginBottom: tokens.space6, marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

interface ColorSwatchProps {
  name: string;
  value: string;
  tokens: ReturnType<typeof useLucent>['tokens'];
  isAnchor?: boolean;
  isDerived?: boolean;
  isOverridden?: boolean;
  onChange?: (value: string) => void;
}

function ColorSwatch({ name, value, tokens, isAnchor, isDerived, isOverridden, onChange }: ColorSwatchProps) {
  const isPickable = isAnchor && value.startsWith('#');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.space1 }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: tokens.radiusMd,
          background: value,
          border: isAnchor
            ? `2px dashed ${tokens.borderStrong}`
            : `1px solid ${tokens.borderDefault}`,
          boxShadow: tokens.shadowSm,
          cursor: isPickable ? 'pointer' : 'default',
          boxSizing: 'border-box',
        }} />
        {isPickable && (
          <input
            type="color"
            value={value.length === 7 ? value : '#000000'}
            onChange={e => onChange?.(e.target.value)}
            title={`Edit ${name}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
              padding: 0,
              border: 'none',
            }}
          />
        )}
        {isOverridden && (
          <div style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: tokens.accentDefault,
            border: `1.5px solid ${tokens.bgBase}`,
          }} />
        )}
      </div>
      <code style={{ fontSize: '10px', color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, textAlign: 'center', maxWidth: 72 }}>
        {name}
      </code>
      <span style={{ fontSize: '10px', color: tokens.textDisabled, fontFamily: tokens.fontFamilyMono }}>
        {value.length > 12 ? value.slice(0, 10) + '…' : value}
      </span>
      {isDerived && (
        <span style={{
          fontSize: '9px',
          color: tokens.accentDefault,
          fontFamily: tokens.fontFamilyMono,
          background: tokens.accentSubtle,
          borderRadius: tokens.radiusSm,
          padding: '1px 4px',
          lineHeight: 1.4,
        }}>
          auto
        </span>
      )}
    </div>
  );
}
