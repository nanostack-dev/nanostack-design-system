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
} from '@/components/breadcrumb';
import { DesignSystemProvider, type LinkComponentProps } from '@/provider';

const usage = `
A trail of links from the top of the product to the current page. Use it in a page header or a top bar when the page is deep in a hierarchy. For tabs inside one page, use \`Tabs\`.

\`Breadcrumb\` has no look props. \`BreadcrumbLink\` takes an \`href\` and renders the \`linkComponent\` of \`DesignSystemProvider\`, so the product router handles the click.

## Parts

| Part | Use it for |
| --- | --- |
| \`BreadcrumbLink\` | A level above the current page. |
| \`BreadcrumbPage\` | The current page, always last. It is not a link. |
| \`BreadcrumbSeparator\` | Between two items. The default is a caret. Pass \`/\` as children for a path-like trail. |
| \`BreadcrumbEllipsis\` | Levels left out of a long trail. |

## Do not

- Do not pass \`render={<Link />}\` to \`BreadcrumbLink\`. Pass \`href\`, and set the router link once on \`DesignSystemProvider\`.
- Do not make the current page a link.
- Do not restyle the current page or the separator icon. The trail has one look in every product.
`;

const meta = {
  title: 'Components/Breadcrumb',
  parameters: { docs: { description: { component: usage } } },
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

function StoryLink({ href, ref, ...props }: LinkComponentProps) {
  return <a ref={ref} href={href} data-router-link="" {...props} />;
}

export const RouterLinkAndCustomSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`BreadcrumbLink` renders the `linkComponent` of `DesignSystemProvider`. The separator here is a slash.',
      },
    },
  },
  render: (args) => (
    <DesignSystemProvider linkComponent={StoryLink}>
      <Breadcrumb {...args}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#docs">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Components</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </DesignSystemProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    const docs = canvas.getByRole('link', { name: 'Docs' });
    await expect(docs).toHaveAttribute('data-router-link');
    await expect(docs).toHaveAttribute('href', '#docs');
    await userEvent.tab();
    await expect(docs).toHaveFocus();
  },
};
