import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home');
    const projects = canvas.getByRole('link', { name: 'Projects' });
    await expect(projects).not.toHaveAttribute('aria-current');
    const current = canvas.getByRole('link', { name: 'Settings' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(current).toHaveAttribute('aria-disabled', 'true');
  },
};

export const WithEllipsis: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Billing</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement, canvas }) => {
    const ellipsis = canvasElement.querySelector('[data-slot="breadcrumb-ellipsis"]');
    await expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByRole('link', { name: 'Billing' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const CustomSeparator: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#docs" />}>Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Docs' })).toHaveFocus();
  },
};
