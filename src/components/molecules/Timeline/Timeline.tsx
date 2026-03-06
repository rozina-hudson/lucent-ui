import { type CSSProperties, type ReactNode } from 'react';
import { Text } from '../../atoms/Text/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineItemStatus = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  date?: string;
  status?: TimelineItemStatus;
  icon?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  style?: CSSProperties;
}

// ─── Status colors ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<TimelineItemStatus, string> = {
  default: 'var(--lucent-border-strong)',
  success: 'var(--lucent-success-default)',
  warning: 'var(--lucent-warning-default)',
  danger: 'var(--lucent-danger-default)',
  info: 'var(--lucent-info-default)',
};

const STATUS_BG: Record<TimelineItemStatus, string> = {
  default: 'var(--lucent-bg-muted)',
  success: 'var(--lucent-success-subtle)',
  warning: 'var(--lucent-warning-subtle)',
  danger: 'var(--lucent-danger-subtle)',
  info: 'var(--lucent-info-subtle)',
};

// ─── Default icons ────────────────────────────────────────────────────────────

function DefaultDot({ status }: { status: TimelineItemStatus }) {
  if (status === 'success') {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'danger') {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === 'warning') {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="M5 2v4M5 7.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
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
        const dotColor = STATUS_COLOR[status];
        const dotBg = STATUS_BG[status];
        const isLast = i === items.length - 1;

        return (
          <li
            key={item.id}
            style={{
              display: 'flex',
              gap: 'var(--lucent-space-4)',
              position: 'relative',
            }}
          >
            {/* Left column: dot + connector line */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              width: 28,
            }}>
              {/* Dot */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--lucent-radius-full)',
                border: `2px solid ${dotColor}`,
                background: dotBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: dotColor,
                flexShrink: 0,
                zIndex: 1,
              }}>
                {item.icon ?? <DefaultDot status={status} />}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  flex: 1,
                  width: 2,
                  background: 'var(--lucent-border-subtle)',
                  minHeight: 'var(--lucent-space-4)',
                  margin: '2px 0',
                }} />
              )}
            </div>

            {/* Right column: content */}
            <div style={{
              flex: 1,
              paddingBottom: isLast ? 0 : 'var(--lucent-space-6)',
              paddingTop: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--lucent-space-3)', flexWrap: 'wrap' }}>
                <Text weight="medium" size="sm">{item.title}</Text>
                {item.date && <Text size="xs" color="secondary">{item.date}</Text>}
              </div>
              {item.description && (
                <div style={{ marginTop: 'var(--lucent-space-1)' }}>
                  <Text size="sm" color="secondary">{item.description}</Text>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
