import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
import { X } from '../../../icons/X.js';
import { List } from '../../../icons/List.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const SCROLLBAR_HIDE_CLASS = 'lucent-pl-no-scrollbar';
const SCROLLBAR_HIDE_CSS = `.${SCROLLBAR_HIDE_CLASS}{scrollbar-width:none}.${SCROLLBAR_HIDE_CLASS}::-webkit-scrollbar{display:none}`;

const DRAWER_ANIM_DURATION = 200;
const DRAWER_KEYFRAMES = `
@keyframes lucent-drawer-in{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes lucent-drawer-out{from{transform:translateX(0)}to{transform:translateX(-100%)}}
@keyframes lucent-backdrop-in{from{opacity:0}to{opacity:1}}
@keyframes lucent-backdrop-out{from{opacity:1}to{opacity:0}}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  /** Pinned content at the top of the sidebar — logo, app name, branding. */
  sidebarHeader?: ReactNode;
  /** Pinned content at the bottom of the sidebar — account, help, secondary actions. */
  sidebarFooter?: ReactNode;
  /** Sidebar width in px or any CSS value. Default: 240 */
  sidebarWidth?: number | string;
  /** Width the sidebar collapses to (e.g. 56 for icon-only). Default: 0 */
  sidebarCollapsedWidth?: number | string;
  /** Header height in px or any CSS value. Default: 48 */
  headerHeight?: number | string;
  /** Collapse the sidebar to sidebarCollapsedWidth */
  sidebarCollapsed?: boolean;
  /** Called when the sidebar collapse handle is clicked. When provided, renders a handle on the sidebar edge. */
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  /** Sidebar display mode. 'inline' = always inline, 'drawer' = always drawer overlay, 'auto' = switches at breakpoint. Default: 'auto' */
  sidebarMode?: 'inline' | 'drawer' | 'auto';
  /** Viewport width (px) below which sidebar switches to drawer mode. Only used when sidebarMode='auto'. Default: 768 */
  sidebarDrawerBreakpoint?: number;
  /** Controlled open state when sidebar is in drawer mode. */
  sidebarDrawerOpen?: boolean;
  /** Called when the drawer open state changes (backdrop click, escape key). */
  onSidebarDrawerOpenChange?: (open: boolean) => void;
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
  /** Background token for chrome regions (header, sidebar, footer). Default: "navigation" */
  chromeBackground?: 'navigation' | 'bgBase' | 'bgSubtle' | 'surface' | 'surfaceSecondary';
  /** Style overrides for the main content card (border, borderRadius, boxShadow, etc.) */
  mainStyle?: CSSProperties;
  style?: CSSProperties;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toCss(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v;
}

// ─── SidebarHandle ────────────────────────────────────────────────────────────

function SidebarHandle({ collapsed, sidebarWidth, onClick }: { collapsed: boolean; sidebarWidth: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const pointRight = collapsed;
  let d1: string, d2: string;
  if (hovered) {
    if (pointRight) {
      d1 = 'M2,2 L6,8';
      d2 = 'M6,8 L2,14';
    } else {
      d1 = 'M6,2 L2,8';
      d2 = 'M2,8 L6,14';
    }
  } else {
    d1 = 'M1.5,2 L1.5,14';
    d2 = 'M6.5,2 L6.5,14';
  }
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: sidebarWidth,
        top: 0,
        bottom: 0,
        width: 16,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 15,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 12,
          height: 32,
          borderRadius: 'var(--lucent-radius-sm)',
          background: hovered ? 'var(--lucent-surface-secondary)' : 'transparent',
          transition: 'background 200ms',
        }}
      >
        <svg width="8" height="16" viewBox="0 0 8 16" fill="none" aria-hidden>
          <path d={d1} stroke="var(--lucent-border-strong)" strokeWidth="1.5" strokeLinecap="round" style={{ transition: 'd 200ms var(--lucent-easing-default)' }} />
          <path d={d2} stroke="var(--lucent-border-strong)" strokeWidth="1.5" strokeLinecap="round" style={{ transition: 'd 200ms var(--lucent-easing-default)' }} />
        </svg>
      </div>
    </div>
  );
}

// ─── DrawerToggle (hamburger ↔ X) ─────────────────────────────────────────────

function DrawerToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close navigation' : 'Open navigation'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderRadius: 'var(--lucent-radius-md)',
        color: 'var(--lucent-text-primary)',
        flexShrink: 0,
      }}
    >
      <span aria-hidden style={{ display: 'inline-flex', width: 20, height: 20 }}>{open ? <X /> : <List />}</span>
    </button>
  );
}

// ─── SidebarContent (shared between inline + drawer) ──────────────────────────

function SidebarContent({
  sidebarHeader,
  sidebar,
  sidebarFooter,
  scrollClass,
  sidebarCollapsed,
  sidebarCollapsedWidth,
}: {
  sidebarHeader?: ReactNode;
  sidebar?: ReactNode;
  sidebarFooter?: ReactNode;
  scrollClass: string;
  sidebarCollapsed: boolean;
  sidebarCollapsedWidth: number | string;
}) {
  return (
    <>
      {sidebarHeader != null && (
        <div style={{ flexShrink: 0 }}>{sidebarHeader}</div>
      )}
      {sidebar != null && (
        <div
          className={scrollClass}
          style={{
            flex: 1,
            overflowY: sidebarCollapsed && sidebarCollapsedWidth === 0 ? 'hidden' : 'auto',
            overflowX: 'hidden',
          }}
        >
          {sidebar}
        </div>
      )}
      {sidebarFooter != null && (
        <div style={{ flexShrink: 0 }}>{sidebarFooter}</div>
      )}
    </>
  );
}

// ─── PageLayout ───────────────────────────────────────────────────────────────

export function PageLayout({
  children,
  header,
  sidebar,
  sidebarHeader,
  sidebarFooter,
  sidebarWidth = 240,
  sidebarCollapsedWidth = 0,
  headerHeight = 48,
  sidebarCollapsed = false,
  onSidebarCollapsedChange,
  sidebarMode = 'auto',
  sidebarDrawerBreakpoint = 768,
  sidebarDrawerOpen = false,
  onSidebarDrawerOpenChange,
  rightSidebar,
  rightSidebarWidth = 240,
  rightSidebarCollapsed = false,
  footer,
  footerHeight = 28,
  chromeBackground = 'navigation',
  mainStyle,
  style,
}: PageLayoutProps) {
  const headerH = toCss(headerHeight);
  const sidebarW = toCss(sidebarWidth);
  const sidebarCW = toCss(sidebarCollapsedWidth);
  const rightSidebarW = toCss(rightSidebarWidth);
  const footerH = toCss(footerHeight);
  const hasSidebar = sidebar != null || sidebarHeader != null || sidebarFooter != null;
  const chromeBgMap: Record<string, string> = {
    navigation: 'var(--lucent-navigation)',
    bgBase: 'var(--lucent-bg-base)',
    bgSubtle: 'var(--lucent-bg-subtle)',
    surface: 'var(--lucent-surface)',
    surfaceSecondary: 'var(--lucent-surface-secondary)',
  };
  const chromeBg = chromeBgMap[chromeBackground] ?? 'var(--lucent-navigation)';

  // ── Responsive drawer logic ──
  const isBelowBreakpoint = useMediaQuery(`(max-width: ${sidebarDrawerBreakpoint - 1}px)`);
  const effectiveDrawer = hasSidebar && (
    sidebarMode === 'drawer' || (sidebarMode === 'auto' && isBelowBreakpoint)
  );

  // Drawer animation state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'entering' | 'exiting'>('idle');

  useEffect(() => {
    if (sidebarDrawerOpen && effectiveDrawer) {
      setDrawerVisible(true);
      setAnimState('entering');
    } else if (drawerVisible) {
      setAnimState('exiting');
      const timer = setTimeout(() => {
        setDrawerVisible(false);
        setAnimState('idle');
      }, DRAWER_ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [sidebarDrawerOpen, effectiveDrawer]);

  // Auto-close drawer when viewport crosses above breakpoint
  useEffect(() => {
    if (!effectiveDrawer && sidebarDrawerOpen) {
      onSidebarDrawerOpenChange?.(false);
    }
  }, [effectiveDrawer]);

  // Escape key closes drawer
  useEffect(() => {
    if (!sidebarDrawerOpen || !effectiveDrawer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSidebarDrawerOpenChange?.(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [sidebarDrawerOpen, effectiveDrawer, onSidebarDrawerOpenChange]);

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (sidebarDrawerOpen && effectiveDrawer) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [sidebarDrawerOpen, effectiveDrawer]);

  // ── Main content margin ──
  const mainMargin = effectiveDrawer
    ? '0 var(--lucent-space-3) var(--lucent-space-3) var(--lucent-space-3)'
    : rightSidebar != null
      ? '0 0 var(--lucent-space-3) 0'
      : '0 var(--lucent-space-3) var(--lucent-space-3) 0';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: chromeBg,
        fontFamily: 'var(--lucent-font-family-base)',
        ...style,
      }}
    >
      <style>{SCROLLBAR_HIDE_CSS}{effectiveDrawer ? DRAWER_KEYFRAMES : ''}</style>

      {/* Header */}
      {header != null && (
        <div
          style={{
            flexShrink: 0,
            height: headerH,
            zIndex: 10,
            background: chromeBg,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {effectiveDrawer && (
            <div style={{ flexShrink: 0, padding: '0 var(--lucent-space-2)' }}>
              <DrawerToggle open={sidebarDrawerOpen} onClick={() => onSidebarDrawerOpenChange?.(!sidebarDrawerOpen)} />
            </div>
          )}
          <div style={{ flex: 1, height: '100%', minWidth: 0 }}>{header}</div>
        </div>
      )}

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Inline sidebar (desktop) */}
        {hasSidebar && !effectiveDrawer && (
          <div
            style={{
              width: sidebarCollapsed ? sidebarCW : sidebarW,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: chromeBg,
              transition: 'width 200ms var(--lucent-easing-default)',
            }}
          >
            <SidebarContent
              sidebarHeader={sidebarHeader}
              sidebar={sidebar}
              sidebarFooter={sidebarFooter}
              scrollClass={SCROLLBAR_HIDE_CLASS}
              sidebarCollapsed={sidebarCollapsed}
              sidebarCollapsedWidth={sidebarCollapsedWidth}
            />
          </div>
        )}

        {/* Sidebar collapse handle (desktop only) */}
        {hasSidebar && !effectiveDrawer && onSidebarCollapsedChange && (
          <SidebarHandle collapsed={sidebarCollapsed} sidebarWidth={sidebarCollapsed ? sidebarCW : sidebarW} onClick={() => onSidebarCollapsedChange(!sidebarCollapsed)} />
        )}

        {/* Main content */}
        <main
          className={SCROLLBAR_HIDE_CLASS}
          style={{
            flex: 1,
            overflowY: 'auto',
            minWidth: 0,
            margin: mainMargin,
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: 'var(--lucent-shadow-sm)',
            background: 'var(--lucent-bg-base)',
            ...mainStyle,
          }}
        >
          {children}
        </main>

        {/* Right panel */}
        {rightSidebar != null && (
          <aside
            className={SCROLLBAR_HIDE_CLASS}
            style={{
              width: rightSidebarCollapsed ? 0 : rightSidebarW,
              flexShrink: 0,
              overflow: 'hidden',
              overflowY: rightSidebarCollapsed ? 'hidden' : 'auto',
              background: chromeBg,
              transition: 'width 200ms var(--lucent-easing-default)',
            }}
          >
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* Footer */}
      {footer != null && (
        <div
          style={{
            flexShrink: 0,
            height: footerH,
            zIndex: 10,
            background: chromeBg,
          }}
        >
          {footer}
        </div>
      )}

      {/* Drawer portal (mobile) */}
      {effectiveDrawer && drawerVisible && createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => onSidebarDrawerOpenChange?.(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1100,
              background: 'var(--lucent-bg-overlay)',
              animation: `${animState === 'exiting' ? 'lucent-backdrop-out' : 'lucent-backdrop-in'} ${DRAWER_ANIM_DURATION}ms var(--lucent-easing-default) forwards`,
              pointerEvents: animState === 'exiting' ? 'none' : 'auto',
            }}
          />
          {/* Drawer panel */}
          <div
            className={SCROLLBAR_HIDE_CLASS}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: sidebarW,
              maxWidth: '85vw',
              zIndex: 1101,
              display: 'flex',
              flexDirection: 'column',
              background: chromeBg,
              boxShadow: 'var(--lucent-shadow-lg)',
              animation: `${animState === 'exiting' ? 'lucent-drawer-out' : 'lucent-drawer-in'} ${DRAWER_ANIM_DURATION}ms var(--lucent-easing-decelerate) forwards`,
              fontFamily: 'var(--lucent-font-family-base)',
            }}
          >
            {/* Close button inside drawer */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 'var(--lucent-space-2)' }}>
              <DrawerToggle open onClick={() => onSidebarDrawerOpenChange?.(false)} />
            </div>
            <SidebarContent
              sidebarHeader={sidebarHeader}
              sidebar={sidebar}
              sidebarFooter={sidebarFooter}
              scrollClass={SCROLLBAR_HIDE_CLASS}
              sidebarCollapsed={false}
              sidebarCollapsedWidth={0}
            />
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}
