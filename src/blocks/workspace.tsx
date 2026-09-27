'use client';

import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  type GroupImperativeHandle,
} from 'react-resizable-panels';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';

export type WorkspaceProps = ElementProps<'div'>;
export function Workspace(props: WorkspaceProps) {
  return <div {...safeProps(props)} className="ns-workspace" />;
}
export type WorkspaceRailProps = ElementProps<'nav'>;
export function WorkspaceRail(props: WorkspaceRailProps) {
  return <nav {...safeProps(props)} className="ns-workspace-rail" />;
}
export type WorkspaceMainProps = ElementProps<'div'>;
export function WorkspaceMain(props: WorkspaceMainProps) {
  return <div {...safeProps(props)} className="ns-workspace-main" />;
}
export type PaneProps = ElementProps<'section'> & { tone?: 'default' | 'subtle' };
export function Pane({ tone = 'default', ...props }: PaneProps) {
  return <section {...safeProps(props)} className="ns-pane" data-tone={tone} />;
}
export type PaneToolbarProps = ElementProps<'div'>;
export function PaneToolbar(props: PaneToolbarProps) {
  return <div {...safeProps(props)} className="ns-pane-toolbar" />;
}
export type PaneBodyProps = ElementProps<'div'> & {
  scroll?: 'vertical' | 'none';
  padding?: 'none' | 'sm' | 'md';
};
export function PaneBody({ scroll = 'vertical', padding = 'md', ...props }: PaneBodyProps) {
  return (
    <div
      {...safeProps(props)}
      tabIndex={scroll === 'vertical' ? 0 : undefined}
      className="ns-pane-body"
      data-ns-scroll={scroll}
      data-padding={padding}
    />
  );
}
export type PaneFooterProps = ElementProps<'div'>;
export function PaneFooter(props: PaneFooterProps) {
  return <div {...safeProps(props)} className="ns-pane-footer" />;
}

export type PaneSectionProps = Omit<ElementProps<'section'>, 'title'> & {
  title: string;
  summary?: ReactNode;
  open: boolean;
  onToggle: () => void;
  fill?: boolean;
};
export function PaneSection({
  title,
  summary,
  open,
  onToggle,
  fill = false,
  children,
  ...props
}: PaneSectionProps) {
  return (
    <section
      {...safeProps(props)}
      aria-label={title}
      className="ns-pane-section"
      data-ns-fill={fill && open}
    >
      <h3 className="ns-pane-section-heading">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="ns-pane-section-trigger"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m6 3 5 5-5 5" />
          </svg>
          {title}
          {summary ? <span className="ns-pane-section-summary">{summary}</span> : null}
        </button>
      </h3>
      {open ? <div className="ns-pane-section-body">{children}</div> : null}
    </section>
  );
}

export type SplitMode = 'primary' | 'secondary' | 'split';
/** Pane sizes as percentages of the split, from 0 to 100. */
export type WorkspaceSplitLayout = { primary: number; secondary: number };
export type WorkspaceLayoutChange = { isUserInteraction: boolean };
export interface WorkspaceSplitHandle {
  setMode(mode: SplitMode): void;
}
export type WorkspaceSplitProps = NoCustomStyle & {
  ref?: Ref<WorkspaceSplitHandle>;
  primary: ReactNode;
  secondary: ReactNode;
  label: string;
  orientation?: 'horizontal' | 'vertical';
  defaultLayout?: WorkspaceSplitLayout | undefined;
  onLayoutChanged?:
    | ((layout: WorkspaceSplitLayout, change: WorkspaceLayoutChange) => void)
    | undefined;
};

const splitLayouts: Record<SplitMode, WorkspaceSplitLayout> = {
  primary: { primary: 100, secondary: 0 },
  secondary: { primary: 0, secondary: 100 },
  split: { primary: 55, secondary: 45 },
};

/** A collapsed pane has size 0; its minimum size keeps every open pane well above 1%. */
function collapsedPanes(layout: WorkspaceSplitLayout) {
  return { primary: layout.primary < 1, secondary: layout.secondary < 1 };
}

export function WorkspaceSplit({
  ref,
  primary,
  secondary,
  label,
  orientation = 'vertical',
  defaultLayout,
  onLayoutChanged,
}: WorkspaceSplitProps) {
  const group = useRef<GroupImperativeHandle | null>(null);
  const splitId = useId();
  const panelIds = { primary: `${splitId}primary`, secondary: `${splitId}secondary` };
  const toEngine = (layout: WorkspaceSplitLayout) => ({
    [panelIds.primary]: layout.primary,
    [panelIds.secondary]: layout.secondary,
  });
  const fromEngine = (layout: Record<string, number>): WorkspaceSplitLayout => ({
    primary: layout[panelIds.primary] ?? 0,
    secondary: layout[panelIds.secondary] ?? 0,
  });
  const initialLayout = defaultLayout ?? splitLayouts.split;
  const [collapsed, setCollapsed] = useState(() => collapsedPanes(initialLayout));
  useImperativeHandle(
    ref,
    () => ({
      setMode(mode) {
        const layout = splitLayouts[mode];
        group.current?.setLayout({
          [`${splitId}primary`]: layout.primary,
          [`${splitId}secondary`]: layout.secondary,
        });
      },
    }),
    [splitId],
  );
  return (
    <Group
      groupRef={group}
      orientation={orientation}
      defaultLayout={toEngine(initialLayout)}
      onLayoutChange={(layout) => {
        const next = collapsedPanes(fromEngine(layout));
        setCollapsed((current) =>
          current.primary === next.primary && current.secondary === next.secondary ? current : next,
        );
      }}
      onLayoutChanged={(layout, meta) =>
        onLayoutChanged?.(fromEngine(layout), { isUserInteraction: meta.isUserInteraction })
      }
      className="ns-workspace-split"
    >
      <Panel
        id={panelIds.primary}
        inert={collapsed.primary}
        minSize="15%"
        collapsible
        collapsedSize="0%"
        className="ns-workspace-panel"
        style={{ overflow: 'hidden' }}
      >
        {primary}
      </Panel>
      <Separator aria-label={label} className="ns-workspace-separator">
        <span aria-hidden="true" />
      </Separator>
      <Panel
        id={panelIds.secondary}
        inert={collapsed.secondary}
        minSize="15%"
        collapsible
        collapsedSize="0%"
        className="ns-workspace-panel"
        style={{ overflow: 'hidden' }}
      >
        {secondary}
      </Panel>
    </Group>
  );
}

export type DocumentTabsProps = ElementProps<'div'> & { 'aria-label': string };
export function DocumentTabs(props: DocumentTabsProps) {
  return <div {...safeProps(props)} role="group" className="ns-document-tabs" />;
}
export type DocumentTabProps = NoCustomStyle & {
  label: string;
  leading?: ReactNode;
  active?: boolean;
  dirty?: boolean;
  onSelect: () => void;
  onClose: () => void;
};
export function DocumentTab({
  label,
  leading,
  active = false,
  dirty = false,
  onSelect,
  onClose,
}: DocumentTabProps) {
  const tabRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tab = tabRef.current;
    const viewport = tab?.parentElement;
    if (!active || !tab || !viewport) return;
    if (!viewport.clientWidth) return;
    const item = tab.getBoundingClientRect();
    const area = viewport.getBoundingClientRect();
    const offset =
      item.left < area.left + 12
        ? item.left - area.left - 12
        : item.right > area.right - 12
          ? item.right - area.right + 12
          : 0;
    if (offset)
      viewport.scrollBy({
        left: offset,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
  }, [active]);
  return (
    <div ref={tabRef} className="ns-document-tab" data-active={active}>
      <button
        type="button"
        className="ns-document-tab-label"
        aria-current={active || undefined}
        onClick={onSelect}
        onAuxClick={(event) => {
          if (event.button === 1) {
            event.preventDefault();
            onClose();
          }
        }}
      >
        {leading}
        <span>{label}</span>
      </button>
      <button
        type="button"
        className="ns-document-tab-close"
        onClick={onClose}
        aria-label={`Close ${label} tab${dirty ? ', unsaved' : ''}`}
      >
        {dirty ? <span className="ns-document-tab-dirty" aria-hidden="true" /> : null}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="m4 4 8 8m0-8-8 8" />
        </svg>
      </button>
    </div>
  );
}

export type TreeProps = ElementProps<'div'> & { 'aria-label': string };
/** Visible tree items share a roving tab stop; domain expansion stays with the item. */
export function Tree({ onKeyDown, onFocusCapture, ref, ...props }: TreeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current!);
  const availableItems = (root: HTMLDivElement) =>
    [...root.querySelectorAll<HTMLElement>('[role="treeitem"]')].filter((item) => {
      if (item.closest('[role="tree"]') !== root || item.getAttribute('aria-disabled') === 'true')
        return false;
      for (
        let element: HTMLElement | null = item;
        element && element !== root;
        element = element.parentElement
      ) {
        const style = getComputedStyle(element);
        if (
          element.hidden ||
          element.hasAttribute('inert') ||
          element.getAttribute('aria-hidden') === 'true' ||
          style.display === 'none' ||
          style.visibility === 'hidden'
        )
          return false;
      }
      return true;
    });
  const focusTarget = (item: HTMLElement) =>
    item.hasAttribute('tabindex')
      ? item
      : (item.querySelector<HTMLElement>('button:not([disabled]), a[href]') ?? item);
  const setTabStop = (items: HTMLElement[], current: HTMLElement) => {
    for (const item of items) focusTarget(item).tabIndex = item === current ? 0 : -1;
  };
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = availableItems(root);
    const current =
      items.find((item) => item.contains(document.activeElement)) ??
      items.find((item) => item.getAttribute('aria-selected') === 'true') ??
      items[0];
    if (current) setTabStop(items, current);
  });
  return (
    <div
      {...safeProps(props)}
      ref={rootRef}
      role="tree"
      tabIndex={-1}
      className="ns-tree"
      onFocusCapture={(event) => {
        onFocusCapture?.(event);
        const item = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
        if (item?.closest('[role="tree"]') === event.currentTarget)
          setTabStop(availableItems(event.currentTarget), item);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key))
          return;
        const items = availableItems(event.currentTarget);
        const current = (event.target as HTMLElement).closest('[role="treeitem"]');
        const index = items.findIndex((item) => item === current);
        if (index < 0) return;
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : Math.min(
                  items.length - 1,
                  Math.max(0, index + (event.key === 'ArrowDown' ? 1 : -1)),
                );
        const target = items[next];
        if (!target) return;
        event.preventDefault();
        setTabStop(items, target);
        focusTarget(target).focus();
      }}
    />
  );
}
export type TreeBranchProps = ElementProps<'div'>;
export function TreeBranch(props: TreeBranchProps) {
  return <div {...safeProps(props)} role="none" className="ns-tree-branch" />;
}
export type TreeGroupProps = ElementProps<'div'>;
export function TreeGroup(props: TreeGroupProps) {
  return <div {...safeProps(props)} role="group" className="ns-tree-group" />;
}
export type TreeItemProps = ElementProps<'div'> & { selected?: boolean; active?: boolean };
export function TreeItem({ selected = false, active = false, ...props }: TreeItemProps) {
  return (
    <div
      {...safeProps(props)}
      role="treeitem"
      aria-selected={props['aria-selected'] ?? selected}
      className="ns-tree-item"
      data-ns-selected={selected}
      data-active={active}
    />
  );
}
export type TreeItemButtonProps = ElementProps<'button'>;
export function TreeItemButton(props: TreeItemButtonProps) {
  return <button {...safeProps(props)} type="button" className="ns-tree-item-button" />;
}

export type WorkspaceLayoutStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};
export type WorkspaceLayoutOptions = {
  /** Unique name of the stored layout. */
  id: string;
  /** Defaults to `localStorage` in a browser. */
  storage?: WorkspaceLayoutStorage;
};
export type WorkspaceLayoutPersistence = {
  defaultLayout: WorkspaceSplitLayout | undefined;
  onLayoutChanged: (layout: WorkspaceSplitLayout, change: WorkspaceLayoutChange) => void;
};

const unavailableStorage: WorkspaceLayoutStorage = {
  getItem: () => null,
  setItem: () => undefined,
};

/** Persist a split's pane ratios; pass the result to `WorkspaceSplit`. */
export function useWorkspaceLayout({
  id,
  storage,
}: WorkspaceLayoutOptions): WorkspaceLayoutPersistence {
  const persisted = useDefaultLayout({
    id,
    storage: storage ?? (typeof localStorage === 'undefined' ? unavailableStorage : localStorage),
  });
  const stored = persisted.defaultLayout;
  return {
    defaultLayout:
      typeof stored?.primary === 'number' && typeof stored.secondary === 'number'
        ? { primary: stored.primary, secondary: stored.secondary }
        : undefined,
    onLayoutChanged: persisted.onLayoutChanged,
  };
}

/** Finite viewport presets for documentation and interaction fixtures. */
export type PreviewFrameProps = ElementProps<'div'> & {
  width?: 'narrow' | 'standard' | 'wide';
  height?: 'content' | 'panel' | 'workspace';
};
export function PreviewFrame({
  width = 'standard',
  height = 'content',
  ...props
}: PreviewFrameProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-preview-frame"
      data-ns-width={width}
      data-ns-height={height}
    />
  );
}
