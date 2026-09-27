import { SignInPanel, AccountControl } from '../src/adapters/clerk.js';

<SignInPanel routing="path" path="/sign-in" forceRedirectUrl="/home" />;
<AccountControl showName />;
// @ts-expect-error Path routing requires an application path.
<SignInPanel routing="path" />;
// @ts-expect-error Hash routing does not accept a path.
<SignInPanel routing="hash" path="/sign-in" />;
// @ts-expect-error Clerk appearance stays library-owned, including structural spreads.
<SignInPanel {...{ appearance: { variables: { colorPrimary: 'red' } } }} />;
// @ts-expect-error Nested provider style bags cannot enter through a structural spread.
<AccountControl
  {...{ userProfileProps: { appearance: { variables: { colorPrimary: 'red' } } } }}
/>;
// @ts-expect-error Native presentation overrides remain forbidden.
<AccountControl style={{ display: 'none' }} />;
