import type { ComponentProps } from 'react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type CardProps = ComponentProps<typeof Card>;
export type CardSize = NonNullable<CardProps['size']>;
export type CardHeaderProps = ComponentProps<typeof CardHeader>;
export type CardTitleProps = ComponentProps<typeof CardTitle>;
export type CardDescriptionProps = ComponentProps<typeof CardDescription>;
export type CardActionProps = ComponentProps<typeof CardAction>;
export type CardContentProps = ComponentProps<typeof CardContent>;
export type CardFooterProps = ComponentProps<typeof CardFooter>;

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
