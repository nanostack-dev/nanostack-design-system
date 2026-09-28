import type { ComponentProps } from 'react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export type EmptyProps = ComponentProps<typeof Empty>;
export type EmptyHeaderProps = ComponentProps<typeof EmptyHeader>;
export type EmptyMediaProps = ComponentProps<typeof EmptyMedia>;
export type EmptyTitleProps = ComponentProps<typeof EmptyTitle>;
export type EmptyDescriptionProps = ComponentProps<typeof EmptyDescription>;
export type EmptyContentProps = ComponentProps<typeof EmptyContent>;

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };
