import { useState, type ReactNode } from 'react';
import { Copy } from '../../../icons/Copy.js';
import { Check } from '../../../icons/Check.js';

export interface CodeBlockTab {
  label: string;
  code: string;
  language?: string;
  icon?: ReactNode;
}

export type CodeBlockVariant = 'code' | 'prompt';

export interface CodeBlockProps {
  /** Code string — used in single (non-tabbed) mode */
  code?: string;
  /** Language label shown in the header (non-tabbed mode only) */
  language?: string;
  /** Tabbed mode: each entry is a selectable code snippet */
  tabs?: CodeBlockTab[];
  /**
   * 'code' (default) renders a <pre><code> block.
   * 'prompt' renders a single-line display for AI prompts — full text is
   * always copied even when visually truncated.
   */
  variant?: CodeBlockVariant;
  /** When true, wraps long lines instead of scrolling horizontally. Defaults to false. */
  wrap?: boolean;
  /** When true, hides the header bar and shows only a corner copy button. */
  minimal?: boolean;
  /** Optional descriptive text rendered between the tab bar and the code area */
  helperText?: string;
  showCopyButton?: boolean;
  style?: React.CSSProperties;
}

const COPY_TIMEOUT = 2000;

function ClipboardIcon() {
  return (
    <span aria-hidden style={{ display: 'inline-flex', width: 13, height: 13 }}><Copy /></span>
  );
}

function CheckIcon() {
  return (
    <span aria-hidden style={{ display: 'inline-flex', width: 13, height: 13 }}><Check /></span>
  );
}

export function CodeBlock({
  code,
  language,
  tabs,
  variant = 'code',
  wrap,
  minimal,
  helperText,
  showCopyButton = true,
  style,
}: CodeBlockProps) {
  const hasTabs = Boolean(tabs?.length);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentCode = hasTabs ? (tabs![activeTab]?.code ?? '') : (code ?? '');
  const currentLanguage = hasTabs ? tabs![activeTab]?.language : language;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_TIMEOUT);
    } catch {
      // clipboard unavailable — silently fail
    }
  };

  const copyBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--lucent-space-1)',
    padding: '3px var(--lucent-space-2)',
    border: '1px solid transparent',
    borderRadius: 'var(--lucent-radius-md)',
    background: 'transparent',
    color: copied ? 'var(--lucent-success-default)' : 'var(--lucent-text-secondary)',
    fontFamily: 'var(--lucent-font-family-base)',
    fontSize: 'var(--lucent-font-size-xs)',
    cursor: 'pointer',
    flexShrink: 0,
    transition:
      'color var(--lucent-duration-fast) var(--lucent-easing-default), background var(--lucent-duration-fast) var(--lucent-easing-default)',
  };

  const CopyButton = () => (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy code'}
      style={copyBtnStyle}
      onMouseEnter={e => {
        if (!copied) {
          e.currentTarget.style.background = 'var(--lucent-surface-secondary)';
          e.currentTarget.style.color = 'var(--lucent-text-primary)';
        }
      }}
      onMouseLeave={e => {
        if (!copied) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--lucent-text-secondary)';
        }
      }}
    >
      {copied ? <CheckIcon /> : <ClipboardIcon />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );

  return (
    <div
      style={{
        borderRadius: 'var(--lucent-radius-lg)',
        border: '1px solid var(--lucent-border-default)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* ── Tab bar (tabbed mode) ── */}
      {hasTabs && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            background: 'var(--lucent-surface)',
            borderBottom: '1px solid var(--lucent-border-default)',
            padding: '0 var(--lucent-space-2)',
          }}
        >
          {tabs!.map((tab, i) => {
            const isActive = i === activeTab;
            return (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(i); setCopied(false); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--lucent-space-1)',
                  padding: 'var(--lucent-space-2) var(--lucent-space-3)',
                  border: 'none',
                  borderBottom: isActive
                    ? '2px solid var(--lucent-accent-default)'
                    : '2px solid transparent',
                  marginBottom: -1,
                  background: 'transparent',
                  color: isActive ? 'var(--lucent-text-primary)' : 'var(--lucent-text-secondary)',
                  fontFamily: 'var(--lucent-font-family-base)',
                  fontSize: 'var(--lucent-font-size-sm)',
                  fontWeight: isActive
                    ? 'var(--lucent-font-weight-semibold)'
                    : 'var(--lucent-font-weight-regular)',
                  cursor: 'pointer',
                  transition: 'color var(--lucent-duration-fast) var(--lucent-easing-default)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--lucent-text-primary)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--lucent-text-secondary)';
                }}
              >
                {tab.icon !== undefined && (
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Header bar (non-tabbed mode) ── */}
      {!minimal && !hasTabs && (Boolean(currentLanguage) || showCopyButton) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: currentLanguage ? 'space-between' : 'flex-end',
            padding: '0 var(--lucent-space-3)',
            height: 36,
            background: 'var(--lucent-surface)',
            borderBottom: '1px solid var(--lucent-border-default)',
          }}
        >
          {currentLanguage && (
            <span
              style={{
                fontSize: 'var(--lucent-font-size-xs)',
                fontFamily: 'var(--lucent-font-family-mono)',
                color: 'var(--lucent-text-secondary)',
                letterSpacing: 'var(--lucent-letter-spacing-wide)',
              }}
            >
              {currentLanguage}
            </span>
          )}
          {showCopyButton && <CopyButton />}
        </div>
      )}

      {/* ── Helper text ── */}
      {helperText && (
        <div
          style={{
            padding: 'var(--lucent-space-2) var(--lucent-space-4)',
            fontSize: 'var(--lucent-font-size-xs)',
            color: 'var(--lucent-text-secondary)',
            fontFamily: 'var(--lucent-font-family-base)',
            background: 'color-mix(in srgb, var(--lucent-text-primary) 5%, transparent)',
            borderBottom: '1px solid var(--lucent-border-default)',
          }}
        >
          {helperText}
        </div>
      )}

      {/* ── Code area ── */}
      {variant === 'code' ? (
        <div style={{ position: 'relative' }}>
          <pre
            style={{
              margin: 0,
              padding: 'var(--lucent-space-4)',
              paddingRight: (hasTabs || minimal) && showCopyButton ? 'var(--lucent-space-16)' : 'var(--lucent-space-4)',
              background: 'color-mix(in srgb, var(--lucent-text-primary) 5%, transparent)',
              overflowX: wrap ? 'hidden' : 'auto',
              lineHeight: 1.65,
              ...(wrap && { whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const }),
            }}
          >
            <code
              style={{
                fontFamily: 'var(--lucent-font-family-mono)',
                fontSize: 'var(--lucent-font-size-sm)',
                color: 'var(--lucent-text-primary)',
              }}
            >
              {currentCode}
            </code>
          </pre>
          {(hasTabs || minimal) && showCopyButton && (
            <div style={{ position: 'absolute', top: minimal ? 0 : 'var(--lucent-space-2)', bottom: minimal ? 0 : undefined, right: 'var(--lucent-space-3)', display: 'flex', alignItems: 'center' }}>
              <CopyButton />
            </div>
          )}
        </div>
      ) : (
        /* ── Prompt area ── */
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--lucent-space-3)',
            padding: 'var(--lucent-space-3) var(--lucent-space-4)',
            background: 'color-mix(in srgb, var(--lucent-text-primary) 5%, transparent)',
          }}
        >
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              ...(wrap
                ? { whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const }
                : { whiteSpace: 'nowrap' as const, textOverflow: 'ellipsis' }),
              fontFamily: 'var(--lucent-font-family-mono)',
              fontSize: 'var(--lucent-font-size-sm)',
              color: 'var(--lucent-text-primary)',
            }}
          >
            {currentCode}
          </span>
          {showCopyButton && <CopyButton />}
        </div>
      )}
    </div>
  );
}
