import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { expect, fn } from 'storybook/test';

import { Button } from '@/components/button';

import { Alert, AlertAction, AlertDescription, AlertTitle, type AlertVariant } from './alert';

const variants: { variant: AlertVariant; icon: ComponentType; title: string }[] = [
  { variant: 'default', icon: InfoIcon, title: 'Heads up' },
  { variant: 'destructive', icon: XCircleIcon, title: 'Deployment failed' },
  { variant: 'success', icon: CheckCircleIcon, title: 'Deployment finished' },
  { variant: 'warning', icon: WarningIcon, title: 'Quota almost reached' },
  { variant: 'info', icon: WarningCircleIcon, title: 'Maintenance tonight' },
];

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: { variant: 'default' },
  argTypes: {
    variant: { control: 'select', options: variants.map(({ variant }) => variant) },
  },
  render: (args) => (
    <Alert {...args} className="w-96">
      <InfoIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can add components to your app with the CLI.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert');
    await expect(alert).toHaveTextContent('Heads up');
    await expect(alert).toHaveTextContent('You can add components to your app with the CLI.');
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col gap-3">
      {variants.map(({ variant, icon: Icon, title }) => (
        <Alert key={variant} {...args} variant={variant}>
          <Icon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>This alert uses the {variant} variant.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const alerts = canvas.getAllByRole('alert');
    await expect(alerts).toHaveLength(variants.length);
    const colorOf = (title: string) =>
      getComputedStyle(canvas.getByText(title).closest('[role="alert"]')!).color;
    const statusColors = ['Deployment finished', 'Quota almost reached', 'Maintenance tonight'].map(
      colorOf,
    );
    await expect(new Set(statusColors).size).toBe(3);
    for (const color of statusColors) {
      await expect(color).not.toBe(colorOf('Heads up'));
      await expect(color).not.toBe(colorOf('Deployment failed'));
    }
  },
};

export const WithAction: Story = {
  args: { variant: 'warning' },
  render: (args) => {
    const onUpgrade = fn();
    return (
      <Alert {...args} className="w-96">
        <WarningIcon />
        <AlertTitle>Quota almost reached</AlertTitle>
        <AlertDescription>You used 92% of the monthly quota.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="outline" onClick={onUpgrade}>
            Upgrade
          </Button>
        </AlertAction>
      </Alert>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Upgrade' });
    await expect(canvas.getByRole('alert')).toContainElement(button);
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

export const LongContent: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args} className="w-80">
      <XCircleIcon />
      <AlertTitle>The build could not reach the package registry after several retries</AlertTitle>
      <AlertDescription>
        The registry returned a timeout three times in a row. Check the network settings of the
        workspace, confirm that the registry token is valid, and run the build again. The previous
        artifacts stay available until the next successful build.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert');
    await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
  },
};
