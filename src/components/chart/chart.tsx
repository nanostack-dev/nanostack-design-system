import type { ComponentProps } from 'react';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export type ChartContainerProps = ComponentProps<typeof ChartContainer>;
export type ChartTooltipProps = ComponentProps<typeof ChartTooltip>;
export type ChartTooltipContentProps = ComponentProps<typeof ChartTooltipContent>;
export type ChartLegendProps = ComponentProps<typeof ChartLegend>;
export type ChartLegendContentProps = ComponentProps<typeof ChartLegendContent>;
export type ChartStyleProps = ComponentProps<typeof ChartStyle>;

export type { ChartConfig };
export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
