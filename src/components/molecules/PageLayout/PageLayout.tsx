import type { CSSProperties, ReactNode } from 'react';

export interface PageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  /** Sidebar width in px or any CSS value. Default: 240 */
  sidebarWidth?: number | string;
  /** Header height in px or any CSS value. Default: 48 */
  headerHeight?: number | string;
  /** Collapse the sidebar to zero width */
  sidebarCollapsed?: boolean;
  style?: CSSProperties;
}

function toCss(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v;
}

export function PageLayout({
  children,
  header,
  sidebar,
  sidebarWidth = 240,
  headerHeight = 48,
  sidebarCollapsed = false,
  style,
}: PageLayoutProps) {
  const headerH = toCss(headerHeight);
  const sidebarW = toCss(sidebarWidth);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'var(--lucent-font-family-base)',
        ...style,
      }}
    >
      {/* Header */}
      {header != null && (
        <div
          style={{
            flexShrink: 0,
            height: headerH,
            zIndex: 10,
            borderBottom: '1px solid var(--lucent-border-default)',
            background: 'var(--lucent-surface-default)',
          }}
        >
          {header}
        </div>
      )}

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        {sidebar != null && (
          <div
            style={{
              width: sidebarCollapsed ? 0 : sidebarW,
              flexShrink: 0,
              overflow: 'hidden',
              overflowY: sidebarCollapsed ? 'hidden' : 'auto',
              borderRight: '1px solid var(--lucent-border-default)',
              background: 'var(--lucent-surface-default)',
              transition: 'width 200ms var(--lucent-easing-default)',
            }}
          >
            {sidebar}
          </div>
        )}

        {/* Main content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            minWidth: 0,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
