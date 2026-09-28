import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionProps,
} from './accordion';

const questions = [
  {
    value: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Orders ship within two business days.',
  },
  {
    value: 'returns',
    question: 'What is the return policy?',
    answer: 'You can return an item within 30 days.',
  },
  {
    value: 'support',
    question: 'How do I contact support?',
    answer: 'Write to the support team from the help page.',
  },
];

function Faq(props: AccordionProps) {
  return (
    <Accordion className="w-96" {...props}>
      {questions.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { onValueChange: fn() },
  render: (args) => <Faq {...args} />,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const shipping = canvas.getByRole('button', { name: 'How long does shipping take?' });
    const returns = canvas.getByRole('button', { name: 'What is the return policy?' });
    await expect(shipping).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(shipping);
    await expect(shipping).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByText('Orders ship within two business days.')).toBeVisible();
    await expect(args.onValueChange).toHaveBeenCalledWith(['shipping'], expect.anything());

    await userEvent.click(returns);
    await expect(returns).toHaveAttribute('aria-expanded', 'true');
    await expect(shipping).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(returns);
    await expect(returns).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const shipping = canvas.getByRole('button', { name: 'How long does shipping take?' });
    const returns = canvas.getByRole('button', { name: 'What is the return policy?' });
    await userEvent.tab();
    await expect(shipping).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(shipping).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(shipping).toHaveAttribute('aria-expanded', 'false');

    await userEvent.tab();
    await expect(returns).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(returns).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(returns).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['shipping'] },
  play: async ({ canvas, userEvent }) => {
    const shipping = canvas.getByRole('button', { name: 'How long does shipping take?' });
    const support = canvas.getByRole('button', { name: 'How do I contact support?' });
    await expect(shipping).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(support);
    await expect(support).toHaveAttribute('aria-expanded', 'true');
    await expect(shipping).toHaveAttribute('aria-expanded', 'true');
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Accordion className="w-96" {...args}>
      <AccordionItem value="shipping">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>Orders ship within two business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="archived" disabled>
        <AccordionTrigger>Archived question</AccordionTrigger>
        <AccordionContent>This answer is no longer available.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas }) => {
    const archived = canvas.getByRole('button', { name: 'Archived question' });
    await expect(archived).toHaveAttribute('aria-disabled', 'true');
    archived.click();
    await waitFor(() => expect(archived).toHaveAttribute('aria-expanded', 'false'));
  },
};
