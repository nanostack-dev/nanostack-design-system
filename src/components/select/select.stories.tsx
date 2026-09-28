import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { Field, FieldError, FieldLabel } from '@/components/field';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  type SelectTriggerSize,
  SelectValue,
} from './select';

const regions = [
  { label: 'Choose a region', value: null },
  { label: 'US East', value: 'us-east-1' },
  { label: 'EU West', value: 'eu-west-1' },
  { label: 'Asia Pacific South', value: 'ap-south-1' },
];

const sizes: SelectTriggerSize[] = ['sm', 'default'];

const meta = {
  title: 'Components/Select',
  parameters: {
    docs: {
      description: {
        component:
          'A button that opens a list of options for one value. Use it for five or more options in a form.\n\n**Nanostack addition:** `SelectContent` is at least as wide as its trigger (minimum 9rem) and grows to fit long labels up to the available width, instead of the trigger width.',
      },
    },
  },
  component: Select,
  args: { items: regions, onValueChange: fn() },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel htmlFor="region">Region</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="region" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {regions.map((region) => (
              <SelectItem key={region.label} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await expect(trigger).toHaveTextContent('Choose a region');
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'EU West' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('EU West');
    await expect(args.onValueChange).toHaveBeenCalledWith('eu-west-1', expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(await screen.findByRole('listbox')).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Choose a region' })).toHaveFocus(),
    );
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(screen.getByRole('option', { name: 'EU West' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('EU West');
    await expect(trigger).toHaveFocus();
  },
};

export const Escape: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await userEvent.click(trigger);
    await expect(await screen.findByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const Groups: Story = {
  args: { items: undefined, defaultValue: 'postgres' },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel htmlFor="engine">Engine</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="engine" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Relational</SelectLabel>
            <SelectItem value="postgres">PostgreSQL</SelectItem>
            <SelectItem value="mysql">MySQL</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Key-value</SelectLabel>
            <SelectItem value="redis">Redis</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Engine' }));
    await expect(await screen.findByRole('group', { name: 'Relational' })).toBeVisible();
    await expect(screen.getByRole('group', { name: 'Key-value' })).toBeVisible();
    await expect(screen.getByRole('option', { name: 'PostgreSQL' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <Field key={size} className="w-64">
          <FieldLabel htmlFor={`region-${size}`}>{size}</FieldLabel>
          <Select {...args}>
            <SelectTrigger id={`region-${size}`} size={size}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {regions.map((region) => (
                  <SelectItem key={region.label} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const small = canvas.getByRole('combobox', { name: 'sm' }).getBoundingClientRect().height;
    const regular = canvas
      .getByRole('combobox', { name: 'default' })
      .getBoundingClientRect().height;
    await expect(small).toBeLessThan(regular);
  },
};

export const LongOption: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Nanostack fix: the list grows past the trigger width to show a long option in full.',
      },
    },
  },
  args: {
    items: [
      { label: 'Small', value: 'small' },
      { label: 'Dedicated compute with 64 vCPU and 256 GB memory', value: 'xl' },
    ],
    defaultValue: 'small',
  },
  render: (args) => (
    <Field className="w-28">
      <FieldLabel htmlFor="machine">Machine</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="machine" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="xl">Dedicated compute with 64 vCPU and 256 GB memory</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Machine' });
    await userEvent.click(trigger);
    const option = await screen.findByRole('option', {
      name: 'Dedicated compute with 64 vCPU and 256 GB memory',
    });
    const popup = option.closest('[data-slot=select-content]') as HTMLElement;
    const triggerWidth = trigger.getBoundingClientRect().width;
    await expect(triggerWidth).toBeLessThan(150);
    await waitFor(() =>
      expect(popup.getBoundingClientRect().width).toBeGreaterThan(triggerWidth * 2),
    );
    await expect(option.scrollWidth).toBeLessThanOrEqual(option.clientWidth);
    await expect(popup.scrollWidth).toBeLessThanOrEqual(popup.clientWidth);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Field className="w-64" data-disabled>
      <FieldLabel htmlFor="region">Region</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="region" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {regions.map((region) => (
              <SelectItem key={region.label} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Field className="w-64" data-invalid>
      <FieldLabel htmlFor="region">Region</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="region" className="w-full" aria-invalid aria-describedby="region-error">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {regions.map((region) => (
              <SelectItem key={region.label} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError id="region-error">Choose a region.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAccessibleDescription('Choose a region.');
  },
};
