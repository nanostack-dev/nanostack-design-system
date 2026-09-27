'use client';

import { SignIn, UserButton } from '@clerk/clerk-react';
import type { ComponentProps } from 'react';
import type { NoCustomStyle } from '../internal/props.js';

const monochromeProviderIcon = 'ns-auth-monochrome-icon';

const appearance = {
  variables: {
    colorPrimary: 'var(--ns-accent)',
    colorPrimaryForeground: 'var(--ns-on-accent)',
    colorForeground: 'var(--ns-text)',
    colorMutedForeground: 'var(--ns-muted)',
    colorMuted: 'var(--ns-subtle)',
    colorBackground: 'var(--ns-surface)',
    colorInput: 'var(--ns-surface)',
    colorInputForeground: 'var(--ns-text)',
    colorNeutral: 'var(--ns-text)',
    colorBorder: 'var(--ns-control-border)',
    colorRing: 'var(--ns-accent)',
    colorDanger: 'var(--ns-danger)',
    colorSuccess: 'var(--ns-success)',
    colorWarning: 'var(--ns-warning)',
    borderRadius: '0.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  elements: {
    rootBox: 'ns-auth-widget',
    cardBox: 'ns-auth-card',
    card: 'ns-auth-card',
    providerIcon__apple: monochromeProviderIcon,
    providerIcon__github: monochromeProviderIcon,
    providerIcon__vercel: monochromeProviderIcon,
    providerIcon__x: monochromeProviderIcon,
  },
} satisfies NonNullable<ComponentProps<typeof SignIn>['appearance']>;

type RedirectOptions = Pick<
  ComponentProps<typeof SignIn>,
  'forceRedirectUrl' | 'signUpForceRedirectUrl'
>;
export type SignInPanelProps = NoCustomStyle & { appearance?: never } & RedirectOptions &
  ({ routing: 'path'; path: string } | { routing?: 'hash' | 'virtual'; path?: never });
/**
 * Keeps all identity-provider flows, including MFA, inside the supported widget.
 * With `routing="path"`, route every address under `path` to this panel too:
 * Clerk moves to `/sign-in/factor-one` for the password step.
 */
export function SignInPanel({
  routing = 'hash',
  path,
  forceRedirectUrl,
  signUpForceRedirectUrl,
}: SignInPanelProps) {
  const route = routing === 'path' ? { routing, path: path! } : { routing };
  return (
    <SignIn
      {...route}
      appearance={appearance}
      {...(forceRedirectUrl ? { forceRedirectUrl } : {})}
      {...(signUpForceRedirectUrl ? { signUpForceRedirectUrl } : {})}
    />
  );
}

export type AccountControlProps = NoCustomStyle & {
  showName?: boolean;
  appearance?: never;
  userProfileProps?: never;
};
export function AccountControl({ showName = false }: AccountControlProps) {
  return <UserButton showName={showName} appearance={appearance} />;
}
