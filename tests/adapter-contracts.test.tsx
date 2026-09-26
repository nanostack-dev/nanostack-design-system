import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  SignInPanel,
  AccountControl,
  type SignInPanelProps,
  type AccountControlProps,
} from '../src/adapters/clerk.js';

const captured = vi.hoisted(() => ({ signIn: vi.fn(), account: vi.fn() }));
vi.mock('@clerk/clerk-react', () => ({
  SignIn: (props: unknown) => {
    captured.signIn(props);
    return null;
  },
  UserButton: (props: unknown) => {
    captured.account(props);
    return null;
  },
}));

describe('optional identity adapter contract', () => {
  it('preserves path routing and redirects while keeping styling bags private', () => {
    const unsafe = {
      appearance: { variables: { colorPrimary: 'red' } },
      style: { display: 'none' },
      className: 'override',
    } as unknown as SignInPanelProps;
    render(
      <SignInPanel
        {...unsafe}
        routing="path"
        path="/identity/sign-in"
        forceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/welcome"
      />,
    );
    const forwarded = captured.signIn.mock.lastCall?.[0];
    expect(forwarded).toMatchObject({
      routing: 'path',
      path: '/identity/sign-in',
      forceRedirectUrl: '/dashboard',
      signUpForceRedirectUrl: '/welcome',
      appearance: { variables: { colorPrimary: 'var(--ns-accent)' } },
    });
    expect(forwarded).not.toHaveProperty('style');
    expect(forwarded).not.toHaveProperty('className');
  });
  it('defaults to hash routing and prevents nested account presentation overrides', () => {
    render(<SignInPanel />);
    expect(captured.signIn.mock.lastCall?.[0]).toMatchObject({ routing: 'hash' });
    expect(captured.signIn.mock.lastCall?.[0]).not.toHaveProperty('path');
    const unsafe = {
      appearance: { elements: { rootBox: 'override' } },
      userProfileProps: { appearance: {} },
    } as unknown as AccountControlProps;
    render(<AccountControl {...unsafe} showName />);
    expect(captured.account.mock.lastCall?.[0]).toMatchObject({
      showName: true,
      appearance: { elements: { rootBox: 'ns-auth-widget' } },
    });
    expect(captured.account.mock.lastCall?.[0]).not.toHaveProperty('userProfileProps');
  });
});
