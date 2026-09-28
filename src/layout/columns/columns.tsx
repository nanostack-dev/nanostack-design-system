import { createContext, useContext, type ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { gapClass, type Space } from '@/lib/space';
import { cn } from '@/lib/utils';

export type ColumnsBreakpoint = 'sm' | 'md' | 'lg';
export type ColumnsAlignY = 'start' | 'center' | 'end' | 'stretch';
export type ColumnWidth = 'fill' | 'content' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';

export type ColumnsProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  space?: Space;
  collapseBelow?: ColumnsBreakpoint;
  alignY?: ColumnsAlignY;
};

export type ColumnProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  width?: ColumnWidth;
};

const rowClass: Record<ColumnsBreakpoint | 'never', string> = {
  never: 'flex-row',
  sm: 'flex-col sm:flex-row',
  md: 'flex-col md:flex-row',
  lg: 'flex-col lg:flex-row',
};

const alignYClass: Record<ColumnsAlignY, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const widthClass: Record<ColumnsBreakpoint | 'never', Record<ColumnWidth, string>> = {
  never: {
    fill: 'min-w-0 flex-1',
    content: 'shrink-0',
    '1/2': 'min-w-0 basis-1/2',
    '1/3': 'min-w-0 basis-1/3',
    '2/3': 'min-w-0 basis-2/3',
    '1/4': 'min-w-0 basis-1/4',
    '3/4': 'min-w-0 basis-3/4',
  },
  sm: {
    fill: 'min-w-0 sm:flex-1',
    content: 'sm:shrink-0',
    '1/2': 'min-w-0 sm:basis-1/2',
    '1/3': 'min-w-0 sm:basis-1/3',
    '2/3': 'min-w-0 sm:basis-2/3',
    '1/4': 'min-w-0 sm:basis-1/4',
    '3/4': 'min-w-0 sm:basis-3/4',
  },
  md: {
    fill: 'min-w-0 md:flex-1',
    content: 'md:shrink-0',
    '1/2': 'min-w-0 md:basis-1/2',
    '1/3': 'min-w-0 md:basis-1/3',
    '2/3': 'min-w-0 md:basis-2/3',
    '1/4': 'min-w-0 md:basis-1/4',
    '3/4': 'min-w-0 md:basis-3/4',
  },
  lg: {
    fill: 'min-w-0 lg:flex-1',
    content: 'lg:shrink-0',
    '1/2': 'min-w-0 lg:basis-1/2',
    '1/3': 'min-w-0 lg:basis-1/3',
    '2/3': 'min-w-0 lg:basis-2/3',
    '1/4': 'min-w-0 lg:basis-1/4',
    '3/4': 'min-w-0 lg:basis-3/4',
  },
};

const CollapseContext = createContext<ColumnsBreakpoint | 'never'>('never');

export function Columns({
  space = 'md',
  collapseBelow,
  alignY = 'stretch',
  ...props
}: ColumnsProps) {
  const breakpoint = collapseBelow ?? 'never';
  return (
    <CollapseContext.Provider value={breakpoint}>
      <div
        data-slot="columns"
        className={cn('flex min-w-0', rowClass[breakpoint], gapClass[space], alignYClass[alignY])}
        {...props}
      />
    </CollapseContext.Provider>
  );
}

export function Column({ width = 'fill', ...props }: ColumnProps) {
  const breakpoint = useContext(CollapseContext);
  return <div data-slot="column" className={widthClass[breakpoint][width]} {...props} />;
}
