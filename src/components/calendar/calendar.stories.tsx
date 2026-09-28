import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { DateRange, Matcher } from 'react-day-picker';
import { expect, fn } from 'storybook/test';

import { Calendar } from './calendar';

const january2026 = new Date(2026, 0, 1);
const fixedToday = new Date(2026, 0, 8);

type SingleCalendarProps = {
  onSelect: (date: Date | undefined) => void;
  initialDate?: Date;
  disabled?: Matcher;
};

function SingleCalendar({ onSelect, initialDate, disabled }: SingleCalendarProps) {
  const [selected, setSelected] = useState(initialDate);
  return (
    <Calendar
      mode="single"
      defaultMonth={january2026}
      today={fixedToday}
      disabled={disabled}
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
        onSelect(date);
      }}
    />
  );
}

function RangeCalendar({ onSelect }: { onSelect: (range: DateRange | undefined) => void }) {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      defaultMonth={january2026}
      today={fixedToday}
      selected={range}
      onSelect={(next) => {
        setRange(next);
        onSelect(next);
      }}
    />
  );
}

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  args: { defaultMonth: january2026, today: fixedToday },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const onSelectSingle = fn();

export const Single: Story = {
  render: () => <SingleCalendar onSelect={onSelectSingle} />,
  beforeEach: () => onSelectSingle.mockClear(),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('January 2026')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Today, Thursday, January 8th, 2026' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Thursday, January 15th, 2026' }));
    await expect(
      canvas.getByRole('button', { name: 'Thursday, January 15th, 2026, selected' }),
    ).toHaveAttribute('data-selected-single', 'true');
    await expect(onSelectSingle).toHaveBeenCalledOnce();
    await expect(onSelectSingle).toHaveBeenCalledWith(new Date(2026, 0, 15));
  },
};

export const Keyboard: Story = {
  render: () => <SingleCalendar onSelect={onSelectSingle} initialDate={new Date(2026, 0, 15)} />,
  beforeEach: () => onSelectSingle.mockClear(),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /previous month/i })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    await expect(
      canvas.getByRole('button', { name: 'Thursday, January 15th, 2026, selected' }),
    ).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: /January 16th, 2026/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: /January 23rd, 2026/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('button', { name: /January 22nd, 2026/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(
      canvas.getByRole('button', { name: 'Thursday, January 22nd, 2026, selected' }),
    ).toHaveFocus();
    await expect(onSelectSingle).toHaveBeenCalledOnce();
    await expect(onSelectSingle).toHaveBeenCalledWith(new Date(2026, 0, 22));
    await userEvent.keyboard('{PageDown}');
    await expect(await canvas.findByText('February 2026')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /February 22nd, 2026/ })).toHaveFocus();
  },
};

export const MonthNavigation: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /next month/i }));
    await expect(await canvas.findByText('February 2026')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: /previous month/i }));
    await userEvent.click(canvas.getByRole('button', { name: /previous month/i }));
    await expect(await canvas.findByText('December 2025')).toBeVisible();
  },
};

const onSelectRange = fn();

export const Range: Story = {
  render: () => <RangeCalendar onSelect={onSelectRange} />,
  beforeEach: () => onSelectRange.mockClear(),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('February 2026')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: /January 12th, 2026/ }));
    await userEvent.click(canvas.getByRole('button', { name: /January 16th, 2026/ }));
    await expect(canvas.getByRole('button', { name: /January 12th, 2026/ })).toHaveAttribute(
      'data-range-start',
      'true',
    );
    await expect(canvas.getByRole('button', { name: /January 14th, 2026/ })).toHaveAttribute(
      'data-range-middle',
      'true',
    );
    await expect(canvas.getByRole('button', { name: /January 16th, 2026/ })).toHaveAttribute(
      'data-range-end',
      'true',
    );
    await expect(onSelectRange).toHaveBeenLastCalledWith({
      from: new Date(2026, 0, 12),
      to: new Date(2026, 0, 16),
    });
  },
};

export const DisabledDays: Story = {
  render: () => <SingleCalendar onSelect={onSelectSingle} disabled={{ before: fixedToday }} />,
  beforeEach: () => onSelectSingle.mockClear(),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('button', { name: /January 5th, 2026/ })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: /January 20th, 2026/ }));
    await expect(onSelectSingle).toHaveBeenCalledOnce();
    await expect(onSelectSingle).toHaveBeenCalledWith(new Date(2026, 0, 20));
  },
};

export const DropdownCaption: Story = {
  args: {
    captionLayout: 'dropdown',
    startMonth: new Date(2024, 0, 1),
    endMonth: new Date(2027, 11, 1),
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: /year/i }), '2027');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: /month/i }), '5');
    await expect(canvas.getByRole('gridcell', { name: 'Thursday, June 10th, 2027' })).toBeVisible();
  },
};

export const WeekNumbers: Story = {
  args: { showWeekNumber: true },
  play: async ({ canvas }) => {
    const weeks = canvas.getAllByRole('rowheader');
    await expect(weeks.length).toBeGreaterThanOrEqual(5);
    await expect(weeks[0]).toHaveAccessibleName('Week 1');
    await expect(weeks[0].tagName).toBe('TH');
  },
};
