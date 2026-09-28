import type { ComponentProps } from 'react';

import { Toggle, toggleVariants } from '@/components/ui/toggle';

export type ToggleProps = ComponentProps<typeof Toggle>;
export type ToggleVariant = NonNullable<ToggleProps['variant']>;
export type ToggleSize = NonNullable<ToggleProps['size']>;

export { Toggle, toggleVariants };
