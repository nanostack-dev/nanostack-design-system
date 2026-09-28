import { CaretDownIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from '@/components/button';

import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './button-group';

const meta = {
  title: 'Components/Button Group',
  parameters: {
    docs: {
      description: {
        component:
          'A row or a column of related buttons with shared borders. Use it for a split button or for a small set of actions on the same object.',
      },
    },
  },
  component: ButtonGroup,
  args: { 'aria-label': 'Message actions' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Message actions' });
    const [archive, report, snooze] = ['Archive', 'Report', 'Snooze'].map((name) =>
      canvas.getByRole('button', { name }),
    );
    await expect(group).toContainElement(report);
    await expect(getComputedStyle(archive).borderTopRightRadius).toBe('0px');
    await expect(getComputedStyle(report).borderTopLeftRadius).toBe('0px');
    await expect(getComputedStyle(report).borderLeftWidth).toBe('0px');
    await expect(getComputedStyle(snooze).borderTopRightRadius).not.toBe('0px');
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', 'aria-label': 'Zoom' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Zoom in">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Zoom out">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    const zoomIn = canvas.getByRole('button', { name: 'Zoom in' });
    const zoomOut = canvas.getByRole('button', { name: 'Zoom out' });
    await expect(zoomOut.getBoundingClientRect().top).toBeCloseTo(
      zoomIn.getBoundingClientRect().bottom,
      0,
    );
  },
};

export const WithText: Story = {
  args: { 'aria-label': 'Website address' },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="outline">nanostack.dev</Button>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('https://')).toBeVisible();
  },
};

export const SplitButton: Story = {
  args: { 'aria-label': 'Publish' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button onClick={fn()}>Publish</Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More publish options">
        <CaretDownIcon />
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    await expect(canvas.getByRole('button', { name: 'More publish options' })).toBeVisible();
  },
};

export const Nested: Story = {
  args: { 'aria-label': 'Pagination' },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup aria-label="Pages">
        <Button variant="outline">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Navigation">
        <Button variant="outline">Next</Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    const pages = canvas.getByRole('group', { name: 'Pages' });
    const navigation = canvas.getByRole('group', { name: 'Navigation' });
    await expect(navigation.getBoundingClientRect().left).toBeGreaterThan(
      pages.getBoundingClientRect().right,
    );
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Archive' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Report' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Snooze' })).toHaveFocus();
  },
};
