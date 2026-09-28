import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/navigation-menu';
import { DesignSystemProvider, type LinkComponentProps } from '@/provider';

const products = [
  { title: 'Analytics', href: '#analytics', description: 'Measure usage across projects.' },
  { title: 'Automation', href: '#automation', description: 'Run workflows on a schedule.' },
  { title: 'Integrations', href: '#integrations', description: 'Connect the tools you use.' },
];

const usage = `
Top-level site navigation with panels that open on hover or focus. Use it in the header of a marketing site or a documentation site.

For the navigation of an application use \`Sidebar\`. For the actions of one item use \`DropdownMenu\`. For editor commands use \`Menubar\`.

The parts do not accept \`className\` or \`style\`. \`NavigationMenuLink\` renders the \`linkComponent\` of \`DesignSystemProvider\`, so the product router handles the click.

## NavigationMenuLink

| Where | Look |
| --- | --- |
| Directly in a \`NavigationMenuItem\` | A top-level link. It has the same height and look as \`NavigationMenuTrigger\`. |
| In a \`NavigationMenuContent\` | A link in the panel. Add \`description\` for a second line under the title. |

## Other props

- \`active\` on \`NavigationMenuLink\`: the link of the current page. It sets \`aria-current="page"\`.
- \`description\` on \`NavigationMenuLink\`: one short sentence about the destination. Use it in a panel, not in the top row.
- \`align\` on \`NavigationMenu\`: where the panel lines up with the trigger. The default is \`start\`.

## Do not

- Do not pass \`navigationMenuTriggerStyle()\` to a link. A top-level link gets that look by itself.
- Do not put actions (buttons) in a navigation menu. Every entry goes to a page.
- Do not use a navigation menu inside the application shell. Use \`Sidebar\`.
`;

const meta = {
  title: 'Components/Navigation Menu',
  component: NavigationMenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: usage,
      },
    },
  },
  render: (args) => (
    <NavigationMenu aria-label="Main" {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 gap-1">
              {products.map((product) => (
                <li key={product.title}>
                  <NavigationMenuLink href={product.href} description={product.description}>
                    {product.title}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#docs">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" active>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Products' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const analytics = await screen.findByRole('link', { name: /Analytics/ });
    await waitFor(() => expect(analytics).toBeVisible());

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(screen.queryByRole('link', { name: /Analytics/ })).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Products' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const analytics = await screen.findByRole('link', { name: /Analytics/ });
    await waitFor(() => expect(analytics).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(screen.queryByRole('link', { name: /Analytics/ })).toBeNull());
    await waitFor(() => expect(document.querySelector('[data-base-ui-focus-guard]')).toBeNull());
  },
};

export const ActiveLink: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.getByRole('link', { name: 'Documentation' })).not.toHaveAttribute(
      'aria-current',
    );
  },
};

function StoryLink({ href, ref, onClick, ...props }: LinkComponentProps) {
  return (
    <a
      ref={ref}
      href={href}
      data-router-link=""
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    />
  );
}

export const RouterLinks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Links render the `linkComponent` of `DesignSystemProvider`. A top-level link has the height of a trigger. A link in a panel shows its `description` under the title.',
      },
    },
  },
  decorators: [
    (Story) => (
      <DesignSystemProvider linkComponent={StoryLink}>
        <Story />
      </DesignSystemProvider>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const documentation = canvas.getByRole('link', { name: 'Documentation' });
    await expect(documentation).toHaveAttribute('data-router-link');
    const trigger = canvas.getByRole('button', { name: 'Products' });
    await expect(documentation.getBoundingClientRect().height).toBe(
      trigger.getBoundingClientRect().height,
    );
    await userEvent.click(trigger);
    const analytics = await screen.findByRole('link', { name: /Analytics/ });
    await waitFor(() => expect(analytics).toBeVisible());
    await expect(analytics).toHaveAttribute('href', '#analytics');
    await expect(analytics).toHaveAttribute('data-router-link');
    await expect(analytics).toHaveTextContent('Measure usage across projects.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(screen.queryByRole('link', { name: /Analytics/ })).toBeNull());
    await waitFor(() => expect(document.querySelector('[data-base-ui-focus-guard]')).toBeNull());
  },
};
