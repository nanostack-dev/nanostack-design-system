import type { ReactNode } from 'react';

import { Box } from '@/layout/box';
import { useMaterialAttributes } from '@/lib/material';

export type DataTableFrameElement = 'div' | 'section' | 'fieldset';

export type DataTableFrameProps = {
  children: ReactNode;
  /**
   * The rendered element. `fieldset` lets `disabled` turn off every control
   * inside, for example while a bulk action runs.
   */
  as?: DataTableFrameElement;
  /** Disables every control inside. Only applies with `as="fieldset"`. */
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-busy'?: boolean;
};

/**
 * The bordered surface around a data table: its toolbar, the table and its
 * footer. `DataTable` draws its table in it. A product that runs its own table
 * engine wraps its table in it too, so the frame looks the same and, under the
 * glass material, the table inside does not draw a second surface.
 */
export function DataTableFrame({ as = 'div', disabled, children, ...aria }: DataTableFrameProps) {
  const material = useMaterialAttributes();
  const fieldset = as === 'fieldset' ? { disabled } : {};
  return (
    <Box
      as={as as 'div'}
      data-slot="data-table-frame"
      className="min-w-0 overflow-hidden rounded-2xl border"
      {...fieldset}
      {...aria}
      {...material}
    >
      {children}
    </Box>
  );
}
