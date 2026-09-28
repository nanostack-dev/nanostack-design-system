import type { ComponentProps } from 'react';

import { DirectionProvider, useDirection } from '@/components/ui/direction';

export type DirectionProviderProps = ComponentProps<typeof DirectionProvider>;
export type TextDirection = ReturnType<typeof useDirection>;

export { DirectionProvider, useDirection };
