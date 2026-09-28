import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/field';

import { RadioGroup, RadioGroupItem } from './radio-group';

const plans = ['Starter', 'Team', 'Enterprise'];

const meta = {
  title: 'Components/Radio Group',
  component: RadioGroup,
  args: { defaultValue: 'Team', onValueChange: fn() },
  render: (args) => (
    <FieldSet className="w-64">
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup {...args}>
        {plans.map((plan) => (
          <Field key={plan} orientation="horizontal">
            <RadioGroupItem value={plan} id={`plan-${plan}`} />
            <FieldLabel htmlFor={`plan-${plan}`} className="font-normal">
              {plan}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole('radio', { name: 'Team' })).toBeChecked();
    await userEvent.click(canvas.getByText('Enterprise'));
    await expect(canvas.getByRole('radio', { name: 'Enterprise' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Team' })).not.toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith('Enterprise', expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'Team' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Enterprise' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'Enterprise' })).toBeChecked();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(canvas.getByRole('radio', { name: 'Starter' })).toBeChecked();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Starter' }));
    await expect(canvas.getByRole('radio', { name: 'Team' })).toBeChecked();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const DisabledItem: Story = {
  render: (args) => (
    <FieldSet className="w-64">
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup {...args}>
        {plans.map((plan) => (
          <Field key={plan} orientation="horizontal" data-disabled={plan === 'Enterprise'}>
            <RadioGroupItem value={plan} id={`plan-${plan}`} disabled={plan === 'Enterprise'} />
            <FieldLabel htmlFor={`plan-${plan}`} className="font-normal">
              {plan}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Starter' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'Enterprise' })).not.toBeChecked();
  },
};

export const Invalid: Story = {
  args: { defaultValue: undefined, 'aria-describedby': 'plan-error' },
  render: (args) => (
    <FieldSet className="w-64" data-invalid>
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup {...args}>
        {plans.map((plan) => (
          <Field key={plan} orientation="horizontal" data-invalid>
            <RadioGroupItem value={plan} id={`plan-${plan}`} aria-invalid />
            <FieldLabel htmlFor={`plan-${plan}`} className="font-normal">
              {plan}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <FieldError id="plan-error">Choose a plan.</FieldError>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    for (const plan of plans) {
      const radio = canvas.getByRole('radio', { name: plan });
      await expect(radio).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(canvas.getByRole('radiogroup')).toHaveAccessibleDescription('Choose a plan.');
  },
};

export const ChoiceCards: Story = {
  render: (args) => (
    <FieldSet className="w-96">
      <FieldLegend variant="label">Compute</FieldLegend>
      <RadioGroup {...args} defaultValue="shared">
        {[
          { value: 'shared', title: 'Shared', description: 'Burstable CPU for small services.' },
          {
            value: 'dedicated',
            title: 'Dedicated',
            description: 'Reserved cores for steady load.',
          },
        ].map((option) => (
          <FieldLabel key={option.value} htmlFor={`compute-${option.value}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{option.title}</FieldTitle>
                <FieldDescription>{option.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={option.value} id={`compute-${option.value}`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Dedicated'));
    await expect(canvas.getAllByRole('radio')[1]).toBeChecked();
  },
};
