import type { ComponentProps } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel';

export type CarouselProps = ComponentProps<typeof Carousel>;
export type CarouselOptions = CarouselProps['opts'];
export type CarouselPlugin = CarouselProps['plugins'];
export type CarouselContentProps = ComponentProps<typeof CarouselContent>;
export type CarouselItemProps = ComponentProps<typeof CarouselItem>;
export type CarouselPreviousProps = ComponentProps<typeof CarouselPrevious>;
export type CarouselNextProps = ComponentProps<typeof CarouselNext>;

export type { CarouselApi };
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel };
