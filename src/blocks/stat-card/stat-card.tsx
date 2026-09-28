import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { Badge, type BadgeProps, type BadgeTone } from '@/components/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  type CardDescriptionProps,
  type CardProps,
} from '@/components/card';
import { Box } from '@/layout/box';
import type { ClosedProps } from '@/lib/closed-props';

export type StatCardProps = CardProps;
export type StatCardLabelProps = CardDescriptionProps;
export type StatCardValueProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type StatCardDescriptionProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type StatCardTrendDirection = 'up' | 'down' | 'flat';
export type StatCardTrendTone = 'positive' | 'negative' | 'neutral';
export type StatCardTrendProps = Omit<BadgeProps, 'variant' | 'tone' | 'icon' | 'children'> & {
  direction: StatCardTrendDirection;
  tone?: StatCardTrendTone;
  directionLabel?: string;
  children: ReactNode;
};

const defaultToneByDirection: Record<StatCardTrendDirection, StatCardTrendTone> = {
  up: 'positive',
  down: 'negative',
  flat: 'neutral',
};

const badgeToneByTrendTone: Record<StatCardTrendTone, BadgeTone> = {
  positive: 'success',
  negative: 'critical',
  neutral: 'neutral',
};

const iconByDirection = {
  up: ArrowUpRightIcon,
  down: ArrowDownRightIcon,
  flat: ArrowRightIcon,
} as const;

const defaultDirectionLabel: Record<StatCardTrendDirection, string> = {
  up: 'Increase',
  down: 'Decrease',
  flat: 'No change',
};

export function StatCard({ children, ...props }: StatCardProps) {
  return (
    <Card data-slot="stat-card" {...props}>
      <CardHeader>{children}</CardHeader>
    </Card>
  );
}

export function StatCardLabel(props: StatCardLabelProps) {
  return <CardDescription data-slot="stat-card-label" {...props} />;
}

export function StatCardValue(props: StatCardValueProps) {
  return (
    <Box
      data-slot="stat-card-value"
      className="font-heading text-3xl font-semibold tabular-nums wrap-anywhere"
      {...props}
    />
  );
}

export function StatCardTrend({
  direction,
  tone = defaultToneByDirection[direction],
  directionLabel = defaultDirectionLabel[direction],
  children,
  ...props
}: StatCardTrendProps) {
  return (
    <CardAction>
      <Badge
        data-slot="stat-card-trend"
        data-direction={direction}
        data-tone={tone}
        tone={badgeToneByTrendTone[tone]}
        icon={iconByDirection[direction]}
        {...props}
      >
        <span className="sr-only">{`${directionLabel} `}</span>
        {children}
      </Badge>
    </CardAction>
  );
}

export function StatCardDescription(props: StatCardDescriptionProps) {
  return (
    <Box
      data-slot="stat-card-description"
      className="col-span-full text-sm text-muted-foreground"
      {...props}
    />
  );
}
