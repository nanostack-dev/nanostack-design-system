import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';

const products = [
  { title: 'Analytics', href: '#analytics', description: 'Measure usage across projects.' },
  { title: 'Automation', href: '#automation', description: 'Run workflows on a schedule.' },
  { title: 'Integrations', href: '#integrations', description: 'Connect the tools you use.' },
];

const meta = {
  title: 'Components/Navigation Menu',
  component: NavigationMenu,
  parameters: { layout: 'padded' },
  render: (args) => (
    <NavigationMenu aria-label="Main" {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 gap-1">
              {products.map((product) => (
                <li key={product.title}>
                  <NavigationMenuLink href={product.href} className="flex-col items-start">
                    <span className="font-medium">{product.title}</span>
                    <span className="text-muted-foreground">{product.description}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#docs" className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" active className={navigationMenuTriggerStyle()}>
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
