import { Breadcrumb, BreadcrumbLink, BreadcrumbSeparator } from '../src/components/breadcrumb.js';
<Breadcrumb aria-label="Location" />;
<BreadcrumbLink href="/projects">Projects</BreadcrumbLink>;
// @ts-expect-error Styling belongs to the library.
<Breadcrumb className="custom" />;
// @ts-expect-error Native links always require a destination.
<BreadcrumbLink>Projects</BreadcrumbLink>;
// @ts-expect-error Appearance only uses named variants.
<BreadcrumbSeparator variant="custom" />;
// @ts-expect-error Arbitrary separator drawing is not supported.
<BreadcrumbSeparator>
  <span>custom</span>
</BreadcrumbSeparator>;
