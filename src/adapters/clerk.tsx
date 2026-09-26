'use client';

import { SignIn, UserButton } from '@clerk/clerk-react';
import type { ComponentProps } from 'react';
import type { NoCustomStyle } from '../internal/props.js';

const appearance = {
  variables: {
    colorPrimary: 'var(--ns-accent)',
    colorText: 'var(--ns-text)',
    colorTextSecondary: 'var(--ns-muted)',
    colorBackground: 'var(--ns-surface)',
    colorInputBackground: 'var(--ns-surface)',
    colorInputText: 'var(--ns-text)',
    colorDanger: 'var(--ns-danger)',
    borderRadius: '0.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  elements: { rootBox: 'ns-auth-widget', cardBox: 'ns-auth-card', card: 'ns-auth-card' },
} satisfies NonNullable<ComponentProps<typeof SignIn>['appearance']>;

type RedirectOptions = Pick<
  ComponentProps<typeof SignIn>,
  'forceRedirectUrl' | 'signUpForceRedirectUrl'
>;
export type SignInPanelProps = NoCustomStyle & { appearance?: never } & RedirectOptions &
  ({ routing: 'path'; path: string } | { routing?: 'hash' | 'virtual'; path?: never });
/** Keeps all identity-provider flows, including MFA, inside the supported widget. */
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
