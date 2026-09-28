import { cva } from 'class-variance-authority';
import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react';
import * as RechartsPrimitive from 'recharts';
import type { TooltipValueType } from 'recharts';

import { cn } from '@/lib/utils';

export type ChartColor =
  'var(--chart-1)' | 'var(--chart-2)' | 'var(--chart-3)' | 'var(--chart-4)' | 'var(--chart-5)';

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode;
    icon?: ComponentType;
    color?: ChartColor;
  }
>;

export type ChartSize = 'sm' | 'md' | 'lg';
export type ChartTooltipIndicator = 'dot' | 'line' | 'dashed';
export type ChartLegendPosition = 'top' | 'bottom';

type TooltipNameType = number | string;

const ChartContext = createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

const chartContainerClasses = cva(
  "flex w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
  {
    variants: {
      size: { sm: 'h-40', md: 'h-64', lg: 'h-96' },
    },
    defaultVariants: { size: 'md' },
  },
);

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

export type ChartContainerProps = {
  config: ChartConfig;
  children: ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
  size?: ChartSize;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
};

export function ChartContainer({
  id,
  size = 'md',
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        data-size={size}
        className={chartContainerClasses({ size })}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={INITIAL_DIMENSION}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.color);
  if (!colorConfig.length) return null;
  const variables = colorConfig
    .map(([key, itemConfig]) => `  --color-${key}: ${itemConfig.color};`)
    .join('\n');
  return <style dangerouslySetInnerHTML={{ __html: `[data-chart=${id}] {\n${variables}\n}` }} />;
}

type ChartTooltipContentOptions = {
  indicator?: ChartTooltipIndicator;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  nameKey?: string;
  labelKey?: string;
};

type RechartsTooltipProps = RechartsPrimitive.TooltipProps<TooltipValueType, TooltipNameType>;

export type ChartTooltipProps = Pick<
  RechartsTooltipProps,
  | 'formatter'
  | 'labelFormatter'
  | 'defaultIndex'
  | 'shared'
  | 'trigger'
  | 'filterNull'
  | 'includeHidden'
  | 'isAnimationActive'
  | 'active'
> &
  ChartTooltipContentOptions & {
    cursor?: boolean;
  };

type ChartTooltipContentProps = ChartTooltipContentOptions &
  Partial<RechartsPrimitive.TooltipContentProps<TooltipValueType, TooltipNameType>>;

function ChartTooltipContent({
  active,
  payload,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  formatter,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string' ? (config[label]?.label ?? label) : itemConfig?.label;
    if (labelFormatter) {
      return <div className="font-medium">{labelFormatter(value, payload)}</div>;
    }
    if (!value) return null;
    return <div className="font-medium">{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, config, labelKey]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      data-slot="chart-tooltip"
      className="grid min-w-32 items-start gap-1.5 rounded-xl bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10"
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = item.payload?.fill ?? item.color;
            return (
              <div
                key={index}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            },
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center',
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {typeof item.value === 'number'
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export function ChartTooltip({
  indicator,
  hideLabel,
  hideIndicator,
  nameKey,
  labelKey,
  cursor = true,
  ...props
}: ChartTooltipProps) {
  return (
    <RechartsPrimitive.Tooltip
      cursor={cursor}
      content={
        <ChartTooltipContent
          indicator={indicator}
          hideLabel={hideLabel}
          hideIndicator={hideIndicator}
          nameKey={nameKey}
          labelKey={labelKey}
        />
      }
      {...props}
    />
  );
}

export type ChartLegendProps = {
  position?: ChartLegendPosition;
  hideIcon?: boolean;
  nameKey?: string;
};

type ChartLegendContentProps = {
  hideIcon?: boolean;
  nameKey?: string;
} & Partial<Pick<RechartsPrimitive.DefaultLegendContentProps, 'payload' | 'verticalAlign'>>;

function ChartLegendContent({
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) return null;
  return (
    <div
      data-slot="chart-legend"
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
      )}
    >
      {payload
        .filter((item) => item.type !== 'none')
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return (
            <div
              key={index}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

export function ChartLegend({ position = 'bottom', hideIcon, nameKey }: ChartLegendProps) {
  return (
    <RechartsPrimitive.Legend
      verticalAlign={position}
      content={<ChartLegendContent hideIcon={hideIcon} nameKey={nameKey} />}
    />
  );
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) return undefined;

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}
