import type { CSSProperties, ComponentType, MouseEvent, ReactNode } from 'react';
import { Text } from '../../atoms/Text/index.js';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

/**
 * Props that Breadcrumb passes to a user-supplied `LinkComponent`.
 * Shape mirrors a native `<a>` so simple drop-ins work and custom link
 * primitives (react-router `<Link>`, Next.js `<Link>`, etc.) can adapt
 * with a thin wrapper.
 */
export interface BreadcrumbLinkProps {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Separator between items. Defaults to "/" */
  separator?: ReactNode;
  style?: CSSProperties;
  /**
   * Optional custom link component used for items with an `href`.
   * Enables SPA-friendly navigation (react-router, Next.js, etc.) without
   * falling back to a full-page reload.
   *
   * The component receives `{ href, children, style, onClick, onMouseEnter, onMouseLeave }`.
   * If your link primitive uses a different prop name for the URL (e.g. react-router's
   * `to`), wrap it in a small adapter:
   *
   * ```tsx
   * const RouterLink = ({ href, ...rest }) => <Link to={href} {...rest} />;
   * <Breadcrumb LinkComponent={RouterLink} items={...} />
   * ```
   *
   * Your adapter must forward `style` to the rendered DOM element so Breadcrumb's
   * typography and hover styling are preserved.
   */
  LinkComponent?: ComponentType<BreadcrumbLinkProps>;
}

export function Breadcrumb({ items, separator = '/', style, LinkComponent }: BreadcrumbProps) {
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
          const linkStyle: CSSProperties = {
            fontSize: 'var(--lucent-font-size-sm)',
            color: 'var(--lucent-text-secondary)',
            textDecoration: 'none',
            fontFamily: 'var(--lucent-font-family-base)',
            transition: 'color var(--lucent-duration-fast) var(--lucent-easing-default)',
          };
          const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
            e.currentTarget.style.color = 'var(--lucent-text-primary)';
          };
          const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
            e.currentTarget.style.color = 'var(--lucent-text-secondary)';
          };
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-1)' }}>
              {isLast ? (
                <Text size="sm" color="primary" as="span" aria-current="page">
                  {item.label}
                </Text>
              ) : item.href != null ? (
                LinkComponent ? (
                  <LinkComponent
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    {...(item.onClick && { onClick: item.onClick })}
                  >
                    {item.label}
                  </LinkComponent>
                ) : (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    style={linkStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.label}
                  </a>
                )
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
