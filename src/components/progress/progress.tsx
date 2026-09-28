import type { ComponentProps } from 'react';

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/components/ui/progress';

export type ProgressProps = ComponentProps<typeof Progress>;
export type ProgressTrackProps = ComponentProps<typeof ProgressTrack>;
export type ProgressIndicatorProps = ComponentProps<typeof ProgressIndicator>;
export type ProgressLabelProps = ComponentProps<typeof ProgressLabel>;
export type ProgressValueProps = ComponentProps<typeof ProgressValue>;

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue };
