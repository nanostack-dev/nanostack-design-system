'use client';

import type { ReactNode } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

export type ChoiceCardProps = Omit<ElementProps<'button'>, 'children' | 'title'> & {
  title: string;
  description: string;
  icon?: ReactNode;
  selected?: boolean;
};
/** A full-card action or selection. Content is deliberately limited to safe text and an icon. */
export function ChoiceCard({ title, description, icon, selected, ...props }: ChoiceCardProps) {
  return (
    <button {...safeProps(props)} type="button" className="ns-choice-card" aria-pressed={selected}>
      {icon ? <span className="ns-choice-card-icon">{icon}</span> : null}
      <span className="ns-choice-card-title">{title}</span>
      <span className="ns-choice-card-description">{description}</span>
    </button>
  );
}
