import { useState } from 'react';
import { LucentProvider, useLucent, lightTokens, darkTokens } from '../src/index.js';
import type { Theme } from '../src/index.js';

export function TokenPreview() {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <LucentProvider theme={theme}>
      <Inner theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
    </LucentProvider>
  );
}

function Inner({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const { tokens } = useLucent();

  const colorGroups: Record<string, string[]> = {
    'Background': ['bgBase', 'bgSubtle', 'bgMuted'],
    'Surface': ['surfaceDefault', 'surfaceRaised', 'surfaceOverlay'],
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

  const tokenValue = (key: string) => tokens[key as keyof typeof tokens] as string;

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
          </p>
        </div>
        <button
          onClick={onToggle}
          style={{
            background: tokens.accentDefault,
            color: tokens.textInverse,
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

      {/* Color tokens */}
      <Section title="Colors" tokens={tokens}>
        {Object.entries(colorGroups).map(([groupName, keys]) => (
          <div key={groupName} style={{ marginBottom: tokens.space6 }}>
            <h3 style={{ fontSize: tokens.fontSizeSm, color: tokens.textSecondary, fontWeight: tokens.fontWeightMedium, marginBottom: tokens.space3 }}>
              {groupName}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.space2 }}>
              {keys.map(key => (
                <ColorSwatch key={key} name={key} value={tokenValue(key)} tokens={tokens} />
              ))}
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
                {tokenValue(key)}
              </span>
              <span style={{ fontFamily: key.startsWith('fontFamily') ? tokenValue(key) : undefined }}>
                {key.startsWith('fontSize') ? <span style={{ fontSize: tokenValue(key) }}>Aa</span>
                  : key.startsWith('fontWeight') ? <span style={{ fontWeight: tokenValue(key) }}>Semibold text</span>
                  : key.startsWith('lineHeight') ? <span style={{ lineHeight: tokenValue(key), display: 'block', background: tokens.accentSubtle, padding: '0 4px' }}>Line height</span>
                  : key.startsWith('fontFamily') ? <span>The quick brown fox</span>
                  : <span style={{ letterSpacing: tokenValue(key) }}>Letter spacing</span>}
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
              <span style={{ fontSize: tokens.fontSizeXs, color: tokens.accentDefault, fontFamily: tokens.fontFamilyMono, width: 80, flexShrink: 0 }}>{tokenValue(key)}</span>
              <div style={{ height: 16, width: tokenValue(key), background: tokens.accentDefault, borderRadius: tokens.radiusSm, minWidth: 2 }} />
            </div>
          ))}
        </div>
      </Section>

      {/* Border radius */}
      <Section title="Border Radius" tokens={tokens}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.space4 }}>
          {radiusKeys.map(key => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.space2 }}>
              <div style={{ width: 64, height: 64, background: tokens.accentSubtle, border: `2px solid ${tokens.accentDefault}`, borderRadius: tokenValue(key) }} />
              <code style={{ fontSize: tokens.fontSizeXs, color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono }}>{key}</code>
              <span style={{ fontSize: tokens.fontSizeXs, color: tokens.accentDefault, fontFamily: tokens.fontFamilyMono }}>{tokenValue(key)}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Shadows */}
      <Section title="Shadows" tokens={tokens}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.space6 }}>
          {shadowKeys.map(key => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.space3 }}>
              <div style={{ width: 80, height: 80, background: tokens.surfaceDefault, borderRadius: tokens.radiusMd, boxShadow: tokenValue(key), border: `1px solid ${tokens.borderSubtle}` }} />
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
              <span style={{ fontSize: tokens.fontSizeXs, color: tokens.accentDefault, fontFamily: tokens.fontFamilyMono }}>{tokenValue(key)}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, tokens, children }: { title: string; tokens: ReturnType<typeof useLucent>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{
      background: tokens.surfaceDefault,
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

function ColorSwatch({ name, value, tokens }: { name: string; value: string; tokens: ReturnType<typeof useLucent>['tokens'] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.space1 }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: tokens.radiusMd,
        background: value,
        border: `1px solid ${tokens.borderDefault}`,
        boxShadow: tokens.shadowSm,
      }} />
      <code style={{ fontSize: '10px', color: tokens.textSecondary, fontFamily: tokens.fontFamilyMono, textAlign: 'center', maxWidth: 64 }}>
        {name}
      </code>
      <span style={{ fontSize: '10px', color: tokens.textDisabled, fontFamily: tokens.fontFamilyMono }}>
        {value.length > 12 ? value.slice(0, 10) + '…' : value}
      </span>
    </div>
  );
}
