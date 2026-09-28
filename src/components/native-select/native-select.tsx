import type { ComponentProps } from 'react';

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '@/components/ui/native-select';

export type NativeSelectProps = ComponentProps<typeof NativeSelect>;
export type NativeSelectSize = NonNullable<NativeSelectProps['size']>;
export type NativeSelectOptGroupProps = ComponentProps<typeof NativeSelectOptGroup>;
export type NativeSelectOptionProps = ComponentProps<typeof NativeSelectOption>;

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
