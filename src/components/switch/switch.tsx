import type { ComponentProps } from 'react';

import { Switch } from '@/components/ui/switch';

export type SwitchProps = ComponentProps<typeof Switch>;
export type SwitchSize = NonNullable<SwitchProps['size']>;

export { Switch };
