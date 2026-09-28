import { useEffect, useRef, type ComponentProps, type ReactElement, type Ref } from 'react';
import { useDayPicker, type DayButtonProps, type WeekNumberProps } from 'react-day-picker';

import {
  Calendar as CalendarPrimitive,
  CalendarDayButton as CalendarDayButtonPrimitive,
} from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export type CalendarProps = ComponentProps<typeof CalendarPrimitive>;
export type CalendarDayButtonProps = ComponentProps<typeof CalendarDayButtonPrimitive>;

const CalendarDayButtonWithRef = CalendarDayButtonPrimitive as (
  props: CalendarDayButtonProps & { ref?: Ref<HTMLButtonElement> },
) => ReactElement;

export function CalendarDayButton({ modifiers, ...props }: CalendarDayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return <CalendarDayButtonWithRef ref={ref} modifiers={modifiers} {...props} />;
}

function CalendarContextDayButton(props: DayButtonProps) {
  const { dayPickerProps } = useDayPicker();
  return <CalendarDayButton locale={dayPickerProps.locale} {...props} />;
}

function CalendarWeekNumber({ children, className, week: _week, ...props }: WeekNumberProps) {
  return (
    <th className={cn('font-normal', className)} {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </th>
  );
}

export function Calendar({ components, ...props }: CalendarProps) {
  return (
    <CalendarPrimitive
      components={{
        DayButton: CalendarContextDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  );
}
