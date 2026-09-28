import type { ComponentProps } from 'react';

import { Marker, MarkerContent, MarkerIcon, markerVariants } from '@/components/ui/marker';

export type MarkerProps = ComponentProps<typeof Marker>;
export type MarkerVariant = NonNullable<MarkerProps['variant']>;
export type MarkerIconProps = ComponentProps<typeof MarkerIcon>;
export type MarkerContentProps = ComponentProps<typeof MarkerContent>;

export { Marker, MarkerContent, MarkerIcon, markerVariants };
