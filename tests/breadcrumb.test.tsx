import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../src/components/breadcrumb.js';
it('retains native ancestor links and identifies the current page without a fake link', () => {
  render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator variant="slash" />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
  );
  expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
  expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  expect(screen.getByText('Collapsed ancestors')).toBeInTheDocument();
});
