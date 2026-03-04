import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../../atoms/Text/index.js';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Separator between items. Defaults to "/" */
  separator?: ReactNode;
  style?: CSSProperties;
}

export function Breadcrumb({ items, separator = '/', style }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" style={style}>
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--lucent-space-1)',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontFamily: 'var(--lucent-font-family-base)',
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-1)' }}>
              {isLast ? (
                <Text size="sm" color="primary" as="span" aria-current="page">
                  {item.label}
                </Text>
              ) : item.href != null ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  style={{
                    fontSize: 'var(--lucent-font-size-sm)',
                    color: 'var(--lucent-text-secondary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--lucent-font-family-base)',
                    transition: 'color var(--lucent-duration-fast) var(--lucent-easing-default)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lucent-text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lucent-text-secondary)'; }}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={item.onClick}
                  style={{
                    fontSize: 'var(--lucent-font-size-sm)',
                    color: 'var(--lucent-text-secondary)',
                    fontFamily: 'var(--lucent-font-family-base)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'color var(--lucent-duration-fast) var(--lucent-easing-default)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lucent-text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lucent-text-secondary)'; }}
                >
                  {item.label}
                </button>
              )}
              {!isLast && (
                <span aria-hidden style={{ color: 'var(--lucent-text-disabled)', fontSize: 'var(--lucent-font-size-sm)', userSelect: 'none' }}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
