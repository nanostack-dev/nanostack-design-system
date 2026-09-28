import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  XCircleIcon,
  type Icon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  type AlertTone,
} from '@/components/alert';
import { Button } from '@/components/button';
import { Stack } from '@/layout/stack';

const tones: { tone: AlertTone; icon: Icon; title: string }[] = [
  { tone: 'neutral', icon: InfoIcon, title: 'Heads up' },
  { tone: 'critical', icon: XCircleIcon, title: 'Deployment failed' },
  { tone: 'success', icon: CheckCircleIcon, title: 'Deployment finished' },
  { tone: 'warning', icon: WarningIcon, title: 'Quota almost reached' },
  { tone: 'info', icon: WarningCircleIcon, title: 'Maintenance tonight' },
];

const usage = `
A message inside the page that stays visible: a status, a warning, or the result of an action. It does not interrupt the user. For a short confirmation that goes away, use a toast. For a decision that blocks the user, use \`AlertDialog\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`.

## tone: what the message means

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. A note with no special meaning. |
| \`critical\` | An error the user must fix, such as a failed save or a rejected request. |
| \`success\` | A result that went well and that the user must see, such as a finished import. |
| \`warning\` | A state that can become a problem: a quota near its limit, an expiring key. |
| \`info\` | News the user did not ask for: planned maintenance, a new feature. |

## Parts

- \`AlertTitle\`: one short line.
- \`AlertDescription\`: the detail and what to do next.
- \`AlertAction\`: one small action in the top-right corner, such as a \`Button size="xs"\`.
- \`icon\` on \`Alert\`: a Phosphor icon in front of the title. It is decorative.

## Do not

- Do not use \`critical\` for a message that is only important. Use \`warning\` or \`info\`.
- Do not put more than one action in \`AlertAction\`.
- Do not add margin around an alert. Put it in a \`Stack\`.
`;

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { docs: { description: { component: usage } } },
  args: { tone: 'neutral', icon: InfoIcon },
  argTypes: { tone: { control: 'select', options: tones.map(({ tone }) => tone) } },
  render: (args) => (
    <div className="w-96">
      <Alert {...args}>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can add components to your app with the CLI.</AlertDescription>
      </Alert>
    </div>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert');
    await expect(alert).toHaveTextContent('Heads up');
    await expect(alert).toHaveTextContent('You can add components to your app with the CLI.');
    await expect(alert.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Tones: Story = {
  parameters: {
    docs: { description: { story: 'Every `tone`. Each one has its own colour and icon.' } },
  },
  render: (args) => (
    <div className="w-96">
      <Stack space="sm">
        {tones.map(({ tone, icon, title }) => (
          <Alert key={tone} {...args} tone={tone} icon={icon}>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>This alert uses the {tone} tone.</AlertDescription>
          </Alert>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const alerts = canvas.getAllByRole('alert');
    await expect(alerts).toHaveLength(tones.length);
    const colors = alerts.map((alert) => getComputedStyle(alert).color);
    await expect(new Set(colors).size).toBe(tones.length);
  },
};

export const WithAction: Story = {
  args: { tone: 'warning', icon: WarningIcon },
  render: (args) => {
    const onUpgrade = fn();
    return (
      <div className="w-96">
        <Alert {...args}>
          <AlertTitle>Quota almost reached</AlertTitle>
          <AlertDescription>You used 92% of the monthly quota.</AlertDescription>
          <AlertAction>
            <Button size="xs" onClick={onUpgrade}>
              Upgrade
            </Button>
          </AlertAction>
        </Alert>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Upgrade' });
    await expect(canvas.getByRole('alert')).toContainElement(button);
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

export const WithoutIcon: Story = {
  args: { icon: undefined, tone: 'info' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert').querySelector('svg')).toBeNull();
  },
};

export const LongContent: Story = {
  args: { tone: 'critical', icon: XCircleIcon },
  render: (args) => (
    <div className="w-80">
      <Alert {...args}>
        <AlertTitle>
          The build could not reach the package registry after several retries
        </AlertTitle>
        <AlertDescription>
          The registry returned a timeout three times in a row. Check the network settings of the
          workspace, confirm that the registry token is valid, and run the build again. The previous
          artifacts stay available until the next successful build.
        </AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert');
    await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
  },
};
