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
  /** Right panel content rendered as a flex sibling of <main> */
  rightSidebar?: ReactNode;
  /** Right panel width in px or any CSS value. Default: 240 */
  rightSidebarWidth?: number | string;
  /** Collapse the right panel to zero width */
  rightSidebarCollapsed?: boolean;
  /** Footer content rendered below the body row */
  footer?: ReactNode;
  /** Footer height in px or any CSS value. Default: 48 */
  footerHeight?: number | string;
  /** Style overrides for the main content card (border, borderRadius, boxShadow, etc.) */
  mainStyle?: CSSProperties;
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
  rightSidebar,
  rightSidebarWidth = 240,
  rightSidebarCollapsed = false,
  footer,
  footerHeight = 28,
  mainStyle,
  style,
}: PageLayoutProps) {
  const headerH = toCss(headerHeight);
  const sidebarW = toCss(sidebarWidth);
  const rightSidebarW = toCss(rightSidebarWidth);
  const footerH = toCss(footerHeight);

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
      {/* Header — no border, floats above the body */}
      {header != null && (
        <div
          style={{
            flexShrink: 0,
            height: headerH,
            zIndex: 10,
            background: 'var(--lucent-surface-default)',
          }}
        >
          {header}
        </div>
      )}

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar — no border-right */}
        {sidebar != null && (
          <div
            style={{
              width: sidebarCollapsed ? 0 : sidebarW,
              flexShrink: 0,
              overflow: 'hidden',
              overflowY: sidebarCollapsed ? 'hidden' : 'auto',
              background: 'var(--lucent-surface-default)',
              transition: 'width 200ms var(--lucent-easing-default)',
            }}
          >
            {sidebar}
          </div>
        )}

        {/* Main content — card with border, radius, shadow */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            minWidth: 0,
            margin: rightSidebar != null
              ? '0 0 var(--lucent-space-3) 0'
              : '0 var(--lucent-space-3) var(--lucent-space-3) 0',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: 'var(--lucent-shadow-sm)',
            background: 'var(--lucent-surface-default)',
            ...mainStyle,
          }}
        >
          {children}
        </main>

        {/* Right panel — structural sibling of <main> */}
        {rightSidebar != null && (
          <aside
            style={{
              width: rightSidebarCollapsed ? 0 : rightSidebarW,
              flexShrink: 0,
              overflow: 'hidden',
              overflowY: rightSidebarCollapsed ? 'hidden' : 'auto',
              background: 'var(--lucent-surface-default)',
              transition: 'width 200ms var(--lucent-easing-default)',
            }}
          >
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* Footer — mirrors header, sits below the body row */}
      {footer != null && (
        <div
          style={{
            flexShrink: 0,
            height: footerH,
            zIndex: 10,
            background: 'var(--lucent-surface-default)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
