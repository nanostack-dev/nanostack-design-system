'use client';

import { Fragment, useId } from 'react';
import { Tooltip } from '@base-ui/react/tooltip';
import { safeProps, type ElementProps } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';
import { getVariableMatches, type VariableMatchOptions } from './editor-variables.js';
import type { VariableAwareInputVariable } from './variable-aware-input.js';

export type VariableTextProps = Omit<ElementProps<'span'>, 'children'> & {
  value: string;
  variables?: readonly VariableAwareInputVariable[] | undefined;
  placeholder?: string | undefined;
  tone?: 'default' | 'muted' | undefined;
  wrap?: 'wrap' | 'nowrap' | undefined;
  variablesEnabled?: boolean | undefined;
  /** Set false inside another control: chips then add no tab stop or tooltip of their own. */
  interactive?: boolean | undefined;
  variablePattern?: VariableMatchOptions['pattern'];
  variableTemplates?: VariableMatchOptions['templates'];
};
export function VariableText({
  value,
  variables,
  placeholder,
  tone = 'default',
  wrap = 'wrap',
  variablesEnabled = true,
  interactive = true,
  variablePattern,
  variableTemplates,
  ...props
}: VariableTextProps) {
  const theme = useThemeSettings();
  const tooltipId = useId();
  const known = new Map(
    (variables ?? []).map((variable) => [(variable.name ?? variable.key ?? '').trim(), variable]),
  );
  const matches = variablesEnabled
    ? getVariableMatches(value, { pattern: variablePattern, templates: variableTemplates })
    : [];
  return (
    <span
      {...safeProps(props)}
      className="ns-variable-text"
      data-tone={value ? tone : 'muted'}
      data-ns-wrap={wrap}
    >
      {value ? (
        <>
          {matches.map((match, index) => {
            const details = known.get(match.name);
            const detailText = details
              ? details.value === ''
                ? '(Empty string)'
                : (details.value ?? 'No value provided')
              : 'Variable not found';
            const before = value.slice(matches[index - 1]?.to ?? 0, match.from);
            if (!interactive)
              return (
                <Fragment key={match.from}>
                  {before}
                  <span
                    className="ns-variable-chip"
                    data-variable={match.name}
                    data-ns-resolved={Boolean(details)}
                  >
                    {value.slice(match.from, match.to)}
                  </span>
                </Fragment>
              );
            return (
              <Fragment key={match.from}>
                {before}
                <Tooltip.Root>
                  <Tooltip.Trigger
                    render={<span />}
                    tabIndex={0}
                    className="ns-variable-chip"
                    data-variable={match.name}
                    data-ns-resolved={Boolean(details)}
                    delay={120}
                    aria-label={`${match.name}: ${detailText}`}
                    aria-describedby={`${tooltipId}-${match.from}`}
                  >
                    {value.slice(match.from, match.to)}
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Theme {...theme}>
                      <Tooltip.Positioner sideOffset={6} className="ns-tooltip-positioner">
                        <Tooltip.Popup
                          className="ns-tooltip-content"
                          role="tooltip"
                          id={`${tooltipId}-${match.from}`}
                        >
                          <strong>{match.name}</strong>
                          {details?.description ? <p>{details.description}</p> : null}
                          <p>{detailText}</p>
                        </Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Theme>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Fragment>
            );
          })}
          {value.slice(matches.at(-1)?.to ?? 0)}
        </>
      ) : (
        placeholder
      )}
    </span>
  );
}
