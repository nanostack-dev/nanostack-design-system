import type { View } from '@effect/ui';
import type { Html } from '@effect/ui/html';

import { cn } from '@/lib/utils';
import type { Material } from '@/lib/material';
import {
  buttonStyles,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
  type ButtonWidth,
} from '@/recipes/button';
import {
  cardContentClass,
  cardDescriptionClass,
  cardHeaderClass,
  cardStyles,
  type CardSize,
  type CardVariant,
} from '@/recipes/card';
import { headingStyles, type HeadingLevel } from '@/recipes/heading';
import { inputStyles, type InputFont, type InputSize, type InputVariant } from '@/recipes/input';
import { labelStyles, type LabelSize, type LabelTone } from '@/recipes/label';
import { sidebarMenuButtonStyles } from '@/recipes/sidebar';
import {
  tableBodyClass,
  tableCellStyles,
  tableClass,
  tableContainerClass,
  tableEmptyCellClass,
  tableHeaderClass,
  tableHeadStyles,
  tableRowStyles,
  type TableCellAlign,
  type TableCellFont,
  type TableCellTone,
  type TableHeadWidth,
} from '@/recipes/table';
import { textLinkStyles, type TextLinkTone } from '@/recipes/text-link';

export type { Material };

export {
  dialogBodyClass,
  dialogDescriptionClass,
  dialogFooterClass,
  dialogHeaderClass,
  dialogOverlayClass,
  dialogPopupStyles,
  dialogTitleClass,
} from '@/recipes/dialog';
export { menuItemStyles, menuPopupStyles, menuPositionerClass } from '@/recipes/menu';
export { sidebarMenuButtonStyles } from '@/recipes/sidebar';

export interface ButtonOptions {
  readonly variant?: ButtonVariant;
  readonly tone?: ButtonTone;
  readonly size?: ButtonSize;
  readonly width?: ButtonWidth;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly iconOnly?: boolean;
}

export const Button = <M>(h: Html.H<M>, options: ButtonOptions = {}) => {
  const variant = options.variant ?? 'outline';
  const loading = options.loading ?? false;
  return h.button
    .attrs({
      type: options.type ?? 'button',
      'data-slot': 'button',
      'data-variant': variant,
      'aria-busy': loading ? 'true' : undefined,
    })
    .class(
      buttonStyles({
        variant,
        tone: options.tone,
        size: options.size,
        width: options.width,
        iconOnly: options.iconOnly,
      }),
    )
    .disabled((options.disabled ?? false) || loading);
};

export interface ButtonLinkOptions {
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly tone?: ButtonTone;
  readonly size?: ButtonSize;
  readonly width?: ButtonWidth;
}

export const ButtonLink = <M>(h: Html.H<M>, options: ButtonLinkOptions) =>
  h.a.attrs({ href: options.href, 'data-slot': 'button' }).class(
    buttonStyles({
      variant: options.variant ?? 'outline',
      tone: options.tone,
      size: options.size,
      width: options.width,
    }),
  );

export interface InputOptions {
  readonly variant?: InputVariant;
  readonly size?: InputSize;
  readonly font?: InputFont;
  readonly material?: Material;
}

export const Input = <M>(h: Html.H<M>, options: InputOptions = {}) =>
  h.input
    .attrs({
      'data-slot': 'input',
      'data-variant': options.variant ?? 'soft',
      'data-ns-material': options.material ?? 'solid',
    })
    .class(inputStyles({ variant: options.variant, size: options.size, font: options.font }));

export interface LabelOptions {
  readonly size?: LabelSize;
  readonly tone?: LabelTone;
}

export const Label = <M>(h: Html.H<M>, options: LabelOptions = {}) =>
  h.label
    .attrs({ 'data-slot': 'label' })
    .class(labelStyles({ size: options.size, tone: options.tone }));

export const FieldError = <M>(h: Html.H<M>) =>
  h.p
    .attrs({ 'data-slot': 'field-error', role: 'alert' })
    .class('text-sm font-normal text-destructive');

export interface HeadingOptions {
  readonly level: HeadingLevel;
  readonly truncate?: boolean;
}

export const Heading = <M>(h: Html.H<M>, options: HeadingOptions) => {
  const element =
    options.level === 1 ? h.h1 : options.level === 2 ? h.h2 : options.level === 3 ? h.h3 : h.h4;
  return element.attrs({ 'data-slot': 'heading' }).class(headingStyles(options));
};

export const Text = <M>(h: Html.H<M>, options: { readonly tone?: 'default' | 'muted' } = {}) =>
  h.p.class(cn('text-sm', options.tone === 'muted' && 'text-muted-foreground'));

export interface TextLinkOptions {
  readonly href: string;
  readonly tone?: TextLinkTone;
  readonly external?: boolean;
}

export const TextLink = <M>(h: Html.H<M>, options: TextLinkOptions) =>
  h.a
    .attrs({
      href: options.href,
      'data-slot': 'text-link',
      target: options.external ? '_blank' : undefined,
      rel: options.external ? 'noreferrer' : undefined,
    })
    .class(textLinkStyles({ tone: options.tone }));

export interface CardOptions {
  readonly variant?: CardVariant;
  readonly size?: CardSize;
  readonly material?: Material;
}

export const Card = <M>(h: Html.H<M>, options: CardOptions = {}) => {
  const variant = options.variant ?? 'solid';
  const size = options.size ?? 'md';
  return h.div
    .attrs({
      'data-slot': 'card',
      'data-variant': variant,
      'data-size': size,
      'data-ns-material': options.material ?? 'solid',
    })
    .class(cardStyles({ variant, size }));
};

export const CardHeader = <M>(h: Html.H<M>) =>
  h.div.attrs({ 'data-slot': 'card-header' }).class(cardHeaderClass);

export const CardContent = <M>(h: Html.H<M>) =>
  h.div.attrs({ 'data-slot': 'card-content' }).class(cardContentClass);

export const CardDescription = <M>(h: Html.H<M>) =>
  h.div.attrs({ 'data-slot': 'card-description' }).class(cardDescriptionClass);

export const Table = <M>(h: Html.H<M>, options: { readonly material?: Material } = {}) =>
  h.table
    .attrs({ 'data-slot': 'table' })
    .class(tableClass)
    .forward((table) =>
      h.div
        .attrs({ 'data-slot': 'table-container', 'data-ns-material': options.material ?? 'solid' })
        .class(tableContainerClass)
        .children(table),
    );

export const TableHeader = <M>(h: Html.H<M>) =>
  h.thead.attrs({ 'data-slot': 'table-header' }).class(tableHeaderClass);

export const TableBody = <M>(h: Html.H<M>) =>
  h.tbody.attrs({ 'data-slot': 'table-body' }).class(tableBodyClass);

export const TableRow = <M>(h: Html.H<M>, options: { readonly interactive?: boolean } = {}) =>
  h.tr.attrs({ 'data-slot': 'table-row' }).class(tableRowStyles(options));

export const TableHead = <M>(
  h: Html.H<M>,
  options: { readonly align?: TableCellAlign; readonly width?: TableHeadWidth } = {},
) => h.th.attrs({ 'data-slot': 'table-head' }).class(tableHeadStyles(options));

export interface TableCellOptions {
  readonly align?: TableCellAlign;
  readonly numeric?: boolean;
  readonly tone?: TableCellTone;
  readonly font?: TableCellFont;
}

export const TableCell = <M>(h: Html.H<M>, options: TableCellOptions = {}) =>
  h.td.attrs({ 'data-slot': 'table-cell' }).class(tableCellStyles(options));

export const TableEmpty = <M>(h: Html.H<M>, options: { readonly colSpan: number }) =>
  h.td
    .attrs({ colspan: String(options.colSpan) })
    .class(tableEmptyCellClass)
    .forward((cell) => h.tr.attrs({ 'data-slot': 'table-empty' }).children(cell));

export interface SidebarNavItemOptions {
  readonly href: string;
  readonly active?: boolean;
}

export const SidebarNavItem = <M>(h: Html.H<M>, options: SidebarNavItemOptions) =>
  h.a
    .attrs({
      href: options.href,
      'data-slot': 'sidebar-menu-button',
      'data-sidebar': 'menu-button',
      'data-active': options.active ? '' : undefined,
      'aria-current': options.active ? 'page' : undefined,
    })
    .class(sidebarMenuButtonStyles({ size: 'md' }));

export interface AppShellOptions<C1, C2> {
  readonly sidebar: C1;
  readonly main: C2;
  readonly material?: Material;
  readonly mainId?: string;
  readonly skipLinkLabel?: string;
}

export const AppShell = <M, C1 extends View.Children<M>, C2 extends View.Children<M>>(
  h: Html.H<M>,
  options: AppShellOptions<C1, C2>,
) => {
  const material = options.material ?? 'solid';
  const mainId = options.mainId ?? 'app-shell-main';
  return h.div
    .attrs({ 'data-slot': 'sidebar-wrapper', 'data-ns-material': material })
    .class('group/sidebar-wrapper flex min-h-svh w-full')
    .children(
      h.a
        .attr('href', `#${mainId}`)
        .class(
          'sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:bg-background focus:px-3 focus:py-2',
        )
        .children(options.skipLinkLabel ?? 'Skip to content'),
      h.aside
        .attrs({ 'data-slot': 'sidebar', 'data-ns-material': material })
        .class(
          'hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex',
        )
        .children(
          h.div.class('sticky top-0 flex h-svh flex-col gap-2 p-2').children(options.sidebar),
        ),
      h.main
        .attrs({ id: mainId, 'data-slot': 'sidebar-inset', 'data-ns-material': material })
        .class('relative flex w-full min-w-0 flex-1 flex-col bg-background')
        .children(options.main),
    );
};

export interface PageHeaderOptions {
  readonly title: string;
  readonly description?: string;
}

export const PageHeader = <M>(h: Html.H<M>, options: PageHeaderOptions) =>
  h.header
    .attrs({ 'data-slot': 'page-header' })
    .class('flex flex-col gap-1')
    .children(
      Heading(h, { level: 1 }).children(options.title),
      options.description === undefined
        ? null
        : h.p.class('text-sm text-muted-foreground').children(options.description),
    );
