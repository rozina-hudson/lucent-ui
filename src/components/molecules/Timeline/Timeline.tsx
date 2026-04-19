import { type CSSProperties, type ReactNode } from 'react';
import { Text } from '../../atoms/Text/index.js';
import { Check } from '../../../icons/Check.js';
import { X } from '../../../icons/X.js';
import { AlertTriangle } from '../../../icons/AlertTriangle.js';
import { CircleInfo } from '../../../icons/CircleInfo.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineItemStatus = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Rich nested content — comment cards, embedded blocks, etc. */
  content?: ReactNode;
  date?: string;
  status?: TimelineItemStatus;
  icon?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  style?: CSSProperties;
}

// ─── Status fills ────────────────────────────────────────────────────────────

const STATUS_FILL: Record<TimelineItemStatus, string> = {
  default: 'var(--lucent-text-disabled)',
  success: 'var(--lucent-success-default)',
  warning: 'var(--lucent-warning-default)',
  danger: 'var(--lucent-danger-default)',
  info: 'var(--lucent-info-default)',
};

// ─── Default icons (white on filled background) ──────────────────────────────

function DefaultIcon({ status }: { status: TimelineItemStatus }) {
  const iconFor: Partial<Record<TimelineItemStatus, ReactNode>> = {
    success: <Check />,
    danger: <X />,
    warning: <AlertTriangle />,
    info: <CircleInfo />,
  };
  const node = iconFor[status];
  if (node) {
    return (
      <span aria-hidden style={{ display: 'inline-flex', width: 10, height: 10, color: '#fff' }}>{node}</span>
    );
  }
  // default: small inner dot
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden>
      <circle cx="3" cy="3" r="3" fill="#fff" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Timeline({ items, style }: TimelineProps) {
  return (
    <ol
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {items.map((item, i) => {
        const status = item.status ?? 'default';
        const fill = STATUS_FILL[status];
        const isLast = i === items.length - 1;

        return (
          <li
            key={item.id}
            style={{
              display: 'flex',
              gap: 'var(--lucent-space-3)',
              position: 'relative',
            }}
          >
            {/* Left column: dot + connector */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              width: 20,
            }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 'var(--lucent-radius-full)',
                background: fill,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1,
              }}>
                {item.icon ?? <DefaultIcon status={status} />}
              </div>

              {!isLast && (
                <div style={{
                  flex: 1,
                  width: 1.5,
                  background: 'var(--lucent-border-subtle)',
                  minHeight: 'var(--lucent-space-3)',
                }} />
              )}
            </div>

            {/* Right column: content */}
            <div style={{
              flex: 1,
              paddingBottom: isLast ? 0 : 'var(--lucent-space-5)',
              paddingTop: 1,
              minWidth: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--lucent-space-2)', flexWrap: 'wrap' }}>
                <Text weight="medium" size="sm">{item.title}</Text>
                {item.date && <Text size="xs" color="secondary">{item.date}</Text>}
              </div>
              {item.description && (
                <div style={{ marginTop: 'var(--lucent-space-1)' }}>
                  <Text size="sm" color="secondary">{item.description}</Text>
                </div>
              )}
              {item.content && (
                <div style={{ marginTop: 'var(--lucent-space-3)' }}>
                  {item.content}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
