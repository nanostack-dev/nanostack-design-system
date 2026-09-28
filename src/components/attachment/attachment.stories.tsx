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
  AttachmentTitle,
  AttachmentTrigger,
  type AttachmentSize,
  type AttachmentState,
} from '@/components/attachment';
import { Stack } from '@/layout/stack';

const states: AttachmentState[] = ['idle', 'uploading', 'processing', 'error', 'done'];
const sizes: AttachmentSize[] = ['md', 'sm', 'xs'];

const onDownload = fn();
const onRemove = fn();
const onOpen = fn();

const usage = `
A file chip that shows a name, a type, a progress state and actions. Use it for uploads in a form or files in a message. For a file in a list of records, use \`Item\`.

The props are the whole API. No part accepts \`className\` or \`style\`.

## state: where the file is in its upload

| Value | Use it for |
| --- | --- |
| \`idle\` | A slot that waits for a file. The border is dashed. |
| \`uploading\` | The bytes are on their way. The title shimmers. |
| \`processing\` | The server reads the file: a scan, a parse, a preview. |
| \`error\` | The upload or the processing failed. Say why in \`AttachmentDescription\`. |
| \`done\` | The default. The file is ready. |

## size

| Value | Use it for |
| --- | --- |
| \`md\` | The default. A file in a form or in a message. |
| \`sm\` | A file in a dense list or in a composer. |
| \`xs\` | A file chip inside a line of text or a table cell. |

## orientation

| Value | Use it for |
| --- | --- |
| \`horizontal\` | The default. A file with a name that people read. |
| \`vertical\` | An image grid, where the preview matters more than the name. |

## Parts

- \`AttachmentMedia\`: \`icon\` for a file type icon, or \`image\` with an \`<img>\` child for a preview.
- \`AttachmentAction\`: an icon button. It needs \`icon\` and \`label\`. The label is the accessible name and the tooltip.
- \`AttachmentTrigger\`: makes the whole chip open the file. Pass \`render={<a href="…" />}\` for a link.
- \`AttachmentGroup\`: a row that scrolls sideways. Give it \`role="group"\` and an \`aria-label\`.

## Do not

- Do not show an error in the title. Keep the file name, and put the reason in the description.
- Do not put more than two actions on one attachment.
`;

const meta = {
  title: 'Components/Attachment',
  parameters: { docs: { description: { component: usage } } },
  component: Attachment,
  args: { state: 'done', size: 'md', orientation: 'horizontal' },
  argTypes: {
    state: { control: 'select', options: states },
    size: { control: 'select', options: sizes },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia icon={FileTextIcon} />
      <AttachmentContent>
        <AttachmentTitle>homepage-feedback.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          icon={DownloadSimpleIcon}
          label="Download homepage-feedback.pdf"
          onClick={onDownload}
        />
        <AttachmentAction icon={XIcon} label="Remove homepage-feedback.pdf" onClick={onRemove} />
      </AttachmentActions>
    </Attachment>
  ),
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  beforeEach: () => {
    onDownload.mockClear();
    onRemove.mockClear();
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'The description of an `error` attachment uses `--destructive-on-tint`, so the text passes WCAG AA.',
      },
    },
  },
  render: (args) => (
    <div className="w-md">
      <Stack space="md">
        {states.map((state) => (
          <Attachment key={state} {...args} state={state}>
            <AttachmentMedia icon={FileTextIcon} />
            <AttachmentContent>
              <AttachmentTitle>{`report-${state}.pdf`}</AttachmentTitle>
              <AttachmentDescription>
                {state === 'error' ? 'Upload failed' : `State: ${state}`}
              </AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </Stack>
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
    await expect(canvas.getByText('Upload failed')).toHaveClass(
      'group-data-[state=error]/attachment:text-destructive-on-tint',
    );
    const failed = canvas.getByText('Upload failed');
    const done = canvas.getByText('State: done');
    await expect(getComputedStyle(failed).color).not.toBe(getComputedStyle(done).color);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack space="md" align="start">
      {sizes.map((size) => (
        <Attachment key={size} {...args} size={size}>
          <AttachmentMedia icon={FileTextIcon} />
          <AttachmentContent>
            <AttachmentTitle>{size}</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) =>
        canvas.getByText(size).closest('[data-slot="attachment"]')!.getBoundingClientRect().height,
    );
    await expect([...heights].sort((a, b) => b - a)).toEqual(heights);
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  parameters: {
    docs: {
      description: {
        story: 'A vertical attachment puts the media on top and the actions over its corner.',
      },
    },
  },
  play: async ({ canvas }) => {
    const media = canvas
      .getByText('homepage-feedback.pdf')
      .closest('[data-slot="attachment"]')!
      .querySelector('[data-slot="attachment-media"]')!;
    const title = canvas.getByText('homepage-feedback.pdf');
    await expect(media.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      title.getBoundingClientRect().top,
    );
  },
};

export const Group: Story = {
  render: (args) => (
    <div className="w-md">
      <AttachmentGroup role="group" aria-label="Attachments" tabIndex={0}>
        {['brief.pdf', 'wireframes.fig', 'notes.md', 'budget.xlsx'].map((name) => (
          <Attachment key={name} {...args}>
            <AttachmentMedia icon={FileTextIcon} />
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Attachments' });
    await expect(canvas.getByText('brief.pdf')).toBeVisible();
    await expect(getComputedStyle(group).overflowX).toBe('auto');
    const topOf = (name: string) =>
      canvas.getByText(name).closest('[data-slot="attachment"]')!.getBoundingClientRect().top;
    await expect(topOf('brief.pdf')).toBe(topOf('budget.xlsx'));
  },
};

export const Openable: Story = {
  beforeEach: () => onOpen.mockClear(),
  render: (args) => (
    <Attachment {...args}>
      <AttachmentTrigger aria-label="Open brief.pdf" onClick={onOpen} />
      <AttachmentMedia icon={FileTextIcon} />
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
