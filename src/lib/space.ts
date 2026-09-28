export type Space = 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const gapClass: Record<Space, string> = {
  none: 'gap-0',
  xxs: 'gap-0.5',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
  xxl: 'gap-8',
};

export const spaces: readonly Space[] = ['none', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
