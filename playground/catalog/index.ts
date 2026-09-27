import type { ComponentType } from 'react';
import { Collections } from './collections.js';
import { DataDisplay } from './data.js';
import { Editors } from './editors.js';
import { Forms } from './forms.js';
import { Foundations } from './foundations.js';
import { Layouts } from './layouts.js';
import { Overlays } from './overlays.js';

export type CatalogSection = {
  id: string;
  label: string;
  summary: string;
  Content: ComponentType;
};

export const catalogSections: readonly CatalogSection[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    summary: 'Theme, layout, typography, lists, icons, brand marks and loading states.',
    Content: Foundations,
  },
  {
    id: 'forms',
    label: 'Forms',
    summary: 'Fields, validation, selects, autocomplete, tags, checkboxes and choice cards.',
    Content: Forms,
  },
  {
    id: 'overlays',
    label: 'Overlays and navigation',
    summary: 'Dialogs, menus, popovers, tooltips, confirmations, toasts, commands and breadcrumbs.',
    Content: Overlays,
  },
  {
    id: 'layouts',
    label: 'Pages and screens',
    summary: 'The application shell, focused screens, sections, cards and responsive panels.',
    Content: Layouts,
  },
  {
    id: 'collections',
    label: 'Collections',
    summary: 'Resource lists, inspectors, typed and semantic tables, and activity.',
    Content: Collections,
  },
  {
    id: 'editors',
    label: 'Editors',
    summary: 'A plain code editor and viewer, and inline text editing.',
    Content: Editors,
  },
  {
    id: 'data',
    label: 'Data display',
    summary: 'Metrics, sparklines, progress, status markers, measured history and reports.',
    Content: DataDisplay,
  },
];
