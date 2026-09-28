import type { ComponentProps } from 'react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export type ResizablePanelGroupProps = ComponentProps<typeof ResizablePanelGroup>;
export type ResizablePanelProps = ComponentProps<typeof ResizablePanel>;
export type ResizableHandleProps = ComponentProps<typeof ResizableHandle>;

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
