import { DownloadSimpleIcon, FileTextIcon, XIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  type AttachmentSize,
  type AttachmentState,
  AttachmentTitle,
  AttachmentTrigger,
} from './attachment';

const states: AttachmentState[] = ['idle', 'uploading', 'processing', 'error', 'done'];
const sizes: AttachmentSize[] = ['default', 'sm', 'xs'];

const onDownload = fn();
const onRemove = fn();
const onOpen = fn();

const meta = {
  title: 'Components/Attachment',
  component: Attachment,
  args: { state: 'done', size: 'default', orientation: 'horizontal' },
  argTypes: {
    state: { control: 'select', options: states },
    size: { control: 'select', options: sizes },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia variant="icon">
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>homepage-feedback.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Download homepage-feedback.pdf" onClick={onDownload}>
          <DownloadSimpleIcon />
        </AttachmentAction>
        <AttachmentAction aria-label="Remove homepage-feedback.pdf" onClick={onRemove}>
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('homepage-feedback.pdf')).toBeVisible();
    await expect(canvas.getByText('PDF · 2.4 MB')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Download homepage-feedback.pdf' }));
    await expect(onDownload).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove homepage-feedback.pdf' }));
    await expect(onRemove).toHaveBeenCalledOnce();
  },
};

export const States: Story = {
  render: (args) => (
    <div className="flex w-md flex-col gap-3">
      {states.map((state) => (
        <Attachment key={state} {...args} state={state}>
          <AttachmentMedia variant="icon">
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{`report-${state}.pdf`}</AttachmentTitle>
            <AttachmentDescription>
              {state === 'error' ? 'Upload failed' : `State: ${state}`}
            </AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const state of states) {
      const title = canvas.getByText(`report-${state}.pdf`);
      const attachment = title.closest('[data-slot="attachment"]');
      await expect(attachment).toHaveAttribute('data-state', state);
    }
    const idle = canvas.getByText('report-idle.pdf').closest('[data-slot="attachment"]')!;
    await expect(getComputedStyle(idle).borderStyle).toBe('dashed');
    const failed = canvas.getByText('Upload failed');
    const done = canvas.getByText('State: done');
    await expect(getComputedStyle(failed).color).not.toBe(getComputedStyle(done).color);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {sizes.map((size) => (
        <Attachment key={size} {...args} size={size}>
          <AttachmentMedia variant="icon">
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{size}</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) =>
        canvas.getByText(size).closest('[data-slot="attachment"]')!.getBoundingClientRect().height,
    );
    await expect([...heights].sort((a, b) => b - a)).toEqual(heights);
  },
};

export const Group: Story = {
  render: (args) => (
    <div className="w-md">
      <AttachmentGroup role="group" aria-label="Attachments" tabIndex={0}>
        {['brief.pdf', 'wireframes.fig', 'notes.md', 'budget.xlsx'].map((name) => (
          <Attachment key={name} {...args}>
            <AttachmentMedia variant="icon">
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="attachment-group"]')!;
    await expect(canvas.getByText('brief.pdf')).toBeVisible();
    await expect(getComputedStyle(group).overflowX).toBe('auto');
    const topOf = (name: string) =>
      canvas.getByText(name).closest('[data-slot="attachment"]')!.getBoundingClientRect().top;
    await expect(topOf('brief.pdf')).toBe(topOf('budget.xlsx'));
  },
};

export const Openable: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentTrigger aria-label="Open brief.pdf" onClick={onOpen} />
      <AttachmentMedia variant="icon">
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>brief.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 120 KB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Open brief.pdf' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onOpen).toHaveBeenCalledOnce();
  },
};
