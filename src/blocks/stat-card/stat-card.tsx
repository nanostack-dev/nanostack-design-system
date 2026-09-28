import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

import { Badge, type BadgeProps, type BadgeVariant } from '@/components/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardDescriptionProps,
  type CardProps,
  type CardTitleProps,
} from '@/components/card';
import { cn } from '@/lib/utils';

export type StatCardProps = CardProps;
export type StatCardLabelProps = CardDescriptionProps;
export type StatCardValueProps = CardTitleProps;
export type StatCardDescriptionProps = CardDescriptionProps;
export type StatCardTrendDirection = 'up' | 'down' | 'flat';
export type StatCardTrendTone = 'positive' | 'negative' | 'neutral';
export type StatCardTrendProps = Omit<BadgeProps, 'variant' | 'children'> & {
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

const badgeVariantByTone: Record<StatCardTrendTone, BadgeVariant> = {
  positive: 'success',
  negative: 'destructive',
  neutral: 'secondary',
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
      <CardHeader className="gap-2">{children}</CardHeader>
    </Card>
  );
}

export function StatCardLabel(props: StatCardLabelProps) {
  return <CardDescription data-slot="stat-card-label" {...props} />;
}

export function StatCardValue({ className, ...props }: StatCardValueProps) {
  return (
    <CardTitle
      data-slot="stat-card-value"
      className={cn('font-heading text-3xl font-semibold tabular-nums wrap-anywhere', className)}
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
  const TrendIcon = iconByDirection[direction];
  return (
    <CardAction>
      <Badge
        data-slot="stat-card-trend"
        data-direction={direction}
        data-tone={tone}
        variant={badgeVariantByTone[tone]}
        {...props}
      >
        <TrendIcon data-icon="inline-start" aria-hidden="true" />
        <span className="sr-only">{`${directionLabel} `}</span>
        {children}
      </Badge>
    </CardAction>
  );
}

export function StatCardDescription({ className, ...props }: StatCardDescriptionProps) {
  return (
    <CardDescription
      data-slot="stat-card-description"
      className={cn('col-span-full', className)}
      {...props}
    />
  );
}
