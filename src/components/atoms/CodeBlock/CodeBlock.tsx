import { useState, type ReactNode } from 'react';

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
  /** Optional descriptive text rendered between the tab bar and the code area */
  helperText?: string;
  showCopyButton?: boolean;
  style?: React.CSSProperties;
}

const COPY_TIMEOUT = 2000;

function ClipboardIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function CodeBlock({
  code,
  language,
  tabs,
  variant = 'code',
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
          e.currentTarget.style.background = 'var(--lucent-bg-hover)';
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
            background: 'var(--lucent-surface-default)',
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
      {!hasTabs && (Boolean(currentLanguage) || showCopyButton) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: currentLanguage ? 'space-between' : 'flex-end',
            padding: '0 var(--lucent-space-3)',
            height: 36,
            background: 'var(--lucent-bg-muted)',
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
            background: 'var(--lucent-bg-muted)',
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
              paddingRight: hasTabs && showCopyButton ? 'var(--lucent-space-16)' : 'var(--lucent-space-4)',
              background: 'var(--lucent-bg-muted)',
              overflowX: 'auto',
              lineHeight: 1.65,
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
          {hasTabs && showCopyButton && (
            <div style={{ position: 'absolute', top: 'var(--lucent-space-2)', right: 'var(--lucent-space-3)' }}>
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
            background: 'var(--lucent-bg-muted)',
          }}
        >
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
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
