import { useState } from 'react';

export interface CodeBlockProps {
  code: string;
  language?: string;
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
  showCopyButton = true,
  style,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_TIMEOUT);
    } catch {
      // clipboard unavailable — silently fail
    }
  };

  const hasHeader = Boolean(language) || showCopyButton;

  return (
    <div
      style={{
        borderRadius: 'var(--lucent-radius-lg)',
        border: '1px solid var(--lucent-border-default)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {hasHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: language ? 'space-between' : 'flex-end',
            padding: '0 var(--lucent-space-3)',
            height: 36,
            background: 'var(--lucent-bg-muted)',
            borderBottom: '1px solid var(--lucent-border-default)',
          }}
        >
          {language && (
            <span
              style={{
                fontSize: 'var(--lucent-font-size-xs)',
                fontFamily: 'var(--lucent-font-family-mono)',
                color: 'var(--lucent-text-secondary)',
                letterSpacing: 'var(--lucent-letter-spacing-wide)',
              }}
            >
              {language}
            </span>
          )}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Copied!' : 'Copy code'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--lucent-space-1)',
                padding: '3px var(--lucent-space-2)',
                border: '1px solid transparent',
                borderRadius: 'var(--lucent-radius-md)',
                background: 'transparent',
                color: copied
                  ? 'var(--lucent-success-default)'
                  : 'var(--lucent-text-secondary)',
                fontFamily: 'var(--lucent-font-family-base)',
                fontSize: 'var(--lucent-font-size-xs)',
                cursor: 'pointer',
                transition:
                  'color var(--lucent-duration-fast) var(--lucent-easing-default), background var(--lucent-duration-fast) var(--lucent-easing-default)',
              }}
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
          )}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: 'var(--lucent-space-4)',
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
          {code}
        </code>
      </pre>
    </div>
  );
}
