'use client';

import { Dialog } from '@base-ui/react/dialog';
import {
  createContext,
  use,
  useCallback,
  useId,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';

const mobileQuery = '(max-width: 767px)';

function mobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

const desktopSnapshot = () => false;

type ShellState = {
  mobile: boolean;
  mainId: string;
  navigationLabel: string;
  openNavigationLabel: string;
  closeNavigationLabel: string;
  navigation: Dialog.Handle<unknown>;
  navigationOpen: boolean;
  setNavigationOpen: (open: boolean) => void;
};

const ShellContext = createContext<ShellState | null>(null);

function useShell() {
  const shell = use(ShellContext);
  if (!shell) throw new Error('AppShell parts must be inside AppShell.');
  return shell;
}

export type AppShellProps = ElementProps<'div'> & {
  layout?: 'page' | 'workspace';
  mainId?: string;
  navigationLabel?: string;
  openNavigationLabel?: string;
  closeNavigationLabel?: string;
  skipLabel?: string;
};

export function AppShell({
  children,
  layout = 'page',
  mainId: providedMainId,
  navigationLabel = 'Workspace navigation',
  openNavigationLabel = 'Open navigation',
  closeNavigationLabel = 'Close navigation',
  skipLabel = 'Skip to main content',
  ...props
}: AppShellProps) {
  const id = useId();
  const mainId = providedMainId ?? `ns-main-${id}`;
  const [navigation] = useState(() => Dialog.createHandle());
  const [open, setOpen] = useState(false);
  const subscribeMobile = useCallback(
    (onChange: () => void) => {
      const query = window.matchMedia(mobileQuery);
      const handleChange = () => {
        if (!query.matches) setOpen(false);
        onChange();
      };
      query.addEventListener('change', handleChange);
      return () => query.removeEventListener('change', handleChange);
    },
    [setOpen],
  );
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, desktopSnapshot);

  return (
    <ShellContext
      value={{
        mobile,
        mainId,
        navigationLabel,
        openNavigationLabel,
        closeNavigationLabel,
        navigation,
        navigationOpen: mobile && open,
        setNavigationOpen: setOpen,
      }}
    >
      <div {...safeProps(props)} className="ns-shell" data-layout={layout}>
        <a className="ns-shell-skip" href={`#${mainId}`}>
          {skipLabel}
        </a>
        {children}
      </div>
    </ShellContext>
  );
}

export type AppShellSidebarProps = ElementProps<'aside'>;

export function AppShellSidebar({ children, ...props }: AppShellSidebarProps) {
  const {
    mobile,
    navigationLabel,
    closeNavigationLabel,
    navigation,
    navigationOpen,
    setNavigationOpen,
  } = useShell();
  const theme = useThemeSettings();

  // Keep the portal in the tree so Base UI can finish closing across breakpoints.
  return (
    <>
      {!mobile ? (
        <aside {...safeProps(props)} className="ns-shell-sidebar">
          {children}
        </aside>
      ) : null}
      <Dialog.Root handle={navigation} open={navigationOpen} onOpenChange={setNavigationOpen}>
        <Dialog.Portal>
          <Theme {...theme}>
            <Dialog.Backdrop className="ns-shell-overlay" />
            <Dialog.Popup className="ns-shell-drawer">
              <div className="ns-shell-drawer-header">
                <Dialog.Title className="ns-shell-drawer-title">{navigationLabel}</Dialog.Title>
                <Dialog.Close className="ns-shell-close" aria-label={closeNavigationLabel}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12M6 18 18 6" />
                  </svg>
                </Dialog.Close>
              </div>
              <aside {...safeProps(props)} className="ns-shell-sidebar">
                {children}
              </aside>
            </Dialog.Popup>
          </Theme>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export function AppShellHeader({ children, ...props }: ElementProps<'header'>) {
  const { mobile, navigation, openNavigationLabel } = useShell();
  return (
    <header {...safeProps(props)} className="ns-shell-header">
      {mobile ? (
        <Dialog.Trigger
          handle={navigation}
          className="ns-shell-mobile-trigger"
          aria-label={openNavigationLabel}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Dialog.Trigger>
      ) : null}
      <div className="ns-shell-header-content">{children}</div>
    </header>
  );
}

/** The current screen's name in the top bar. It shortens with an ellipsis instead of wrapping. */
export function AppShellHeaderTitle(props: ElementProps<'p'>) {
  return <p {...safeProps(props)} className="ns-shell-header-title" />;
}

/** Top bar controls. They stay on one line and hide keyboard hints on a phone. */
export function AppShellHeaderActions(props: ElementProps<'div'>) {
  return <div {...safeProps(props)} className="ns-shell-header-actions" />;
}

export type AppShellMainProps = Omit<ElementProps<'main'>, 'id'>;

export function AppShellMain(props: AppShellMainProps) {
  const { mainId } = useShell();
  return <main {...safeProps(props)} id={mainId} className="ns-shell-main" tabIndex={-1} />;
}

export function AppShellBrand(props: ElementProps<'div'>) {
  return <div {...safeProps(props)} className="ns-shell-brand" />;
}

export type AppShellNavProps = Omit<ElementProps<'nav'>, 'aria-label' | 'aria-labelledby'> & {
  label: string;
};

export function AppShellNav({ label, children, ...props }: AppShellNavProps) {
  return (
    <nav {...safeProps(props)} aria-label={label} className="ns-shell-nav">
      <p className="ns-shell-nav-label" aria-hidden="true">
        {label}
      </p>
      <div className="ns-shell-nav-items">{children}</div>
    </nav>
  );
}

export type AppShellNavLinkProps = Omit<ElementProps<'a'>, 'aria-current'> & {
  href: string;
  active?: boolean;
  icon?: ReactNode;
};

export function AppShellNavLink({
  href,
  active = false,
  icon,
  children,
  onClick,
  ...props
}: AppShellNavLinkProps) {
  const { setNavigationOpen } = useShell();
  return (
    <a
      {...safeProps(props)}
      href={href}
      className="ns-shell-nav-link"
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey &&
          event.button === 0
        )
          setNavigationOpen(false);
      }}
    >
      {icon ? (
        <span className="ns-shell-nav-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="ns-shell-nav-text">{children}</span>
    </a>
  );
}

export function AppShellFooter(props: ElementProps<'footer'>) {
  return <footer {...safeProps(props)} className="ns-shell-footer" />;
}

export type AppShellBodyProps = ElementProps<'div'>;
export function AppShellBody(props: AppShellBodyProps) {
  return <div {...safeProps(props)} className="ns-shell-body" />;
}
export type AppShellDockProps = ElementProps<'div'>;
export function AppShellDock(props: AppShellDockProps) {
  return <div {...safeProps(props)} className="ns-shell-dock" />;
}
