'use client';

/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Named scroll regions need a keyboard scroll target independent of their items. */

import { useCallback, useEffect, useRef, useState, type Key, type ReactNode } from 'react';
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import { safeProps, type ElementProps } from '../internal/props.js';
import { Button } from '../components/button.js';
import { Spinner } from '../components/icon.js';

export type VirtualListProps<T> = Omit<ElementProps<'div'>, 'children'> & {
  label: string;
  items: readonly T[];
  getItemKey: (item: T) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  height?: 'panel' | 'fill';
  density?: 'compact' | 'comfortable';
  hasMore?: boolean;
  loadingMore?: boolean;
  /** The last page request failed: the list stops requesting and offers Retry, which calls onEndReached. */
  loadMoreFailed?: boolean;
  onEndReached?: () => void;
  loadingMessage?: string;
  loadMoreFailedMessage?: string;
  retryLabel?: string;
  emptyState?: ReactNode;
};

/** Owns measurement, scroll position and pagination sentinels. Rows are library assemblies. */
export function VirtualList<T>({
  label,
  items,
  getItemKey,
  renderItem,
  height = 'panel',
  density = 'compact',
  hasMore = false,
  loadingMore = false,
  loadMoreFailed = false,
  onEndReached,
  loadingMessage = 'Loading more…',
  loadMoreFailedMessage = 'More items could not be loaded.',
  retryLabel = 'Retry',
  emptyState,
  ...props
}: VirtualListProps<T>) {
  const viewport = useRef<HTMLDivElement>(null);
  const requestedCount = useRef<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const rangeExtractor = useCallback(
    (range: Parameters<typeof defaultRangeExtractor>[0]) => {
      const visible = defaultRangeExtractor(range);
      return focusedIndex !== null && focusedIndex < items.length
        ? [...new Set([...visible, focusedIndex])].sort((a, b) => a - b)
        : visible;
    },
    [focusedIndex, items.length],
  );
  const virtualizer = useVirtualizer({
    count: items.length + (hasMore || loadingMore || loadMoreFailed ? 1 : 0),
    getScrollElement: () => viewport.current,
    getItemKey: (index) => (index < items.length ? getItemKey(items[index]!) : '__ns-loading'),
    estimateSize: () => (density === 'compact' ? 64 : 80),
    overscan: 8,
    rangeExtractor,
    useFlushSync: false,
  });
  const rows = virtualizer.getVirtualItems();
  const lastIndex = rows.at(-1)?.index ?? -1;
  useEffect(() => {
    if (!hasMore) requestedCount.current = null;
    if (
      !loadingMore &&
      !loadMoreFailed &&
      hasMore &&
      onEndReached &&
      lastIndex >= items.length - 1 &&
      requestedCount.current !== items.length
    ) {
      requestedCount.current = items.length;
      onEndReached();
    }
  }, [hasMore, loadingMore, loadMoreFailed, onEndReached, lastIndex, items.length]);
  const retry = () => {
    viewport.current?.focus({ preventScroll: true });
    onEndReached?.();
  };
  return (
    <div
      {...safeProps(props)}
      className="ns-virtual-list"
      data-ns-height={height}
      data-ns-density={density}
    >
      {/* The scrollport is keyboard reachable independently of its virtual rows. */}
      <div
        ref={viewport}
        className="ns-virtual-viewport"
        role="region"
        aria-label={label}
        tabIndex={0}
        onFocusCapture={(event) => {
          const row = event.target.closest<HTMLElement>('[data-ns-virtual-index]');
          setFocusedIndex(row ? Number(row.dataset.nsVirtualIndex) : null);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusedIndex(null);
        }}
      >
        {items.length === 0 && !loadingMore && !loadMoreFailed && !hasMore ? (
          emptyState
        ) : (
          <div
            role="list"
            aria-label={label}
            className="ns-virtual-items"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {rows.map((row) => (
              <div
                key={row.key}
                role="listitem"
                aria-setsize={hasMore ? -1 : items.length}
                aria-posinset={row.index + 1}
                className="ns-virtual-row"
                data-index={row.index}
                data-ns-virtual-index={row.index}
                ref={virtualizer.measureElement}
                style={{ transform: `translateY(${row.start}px)` }}
              >
                {row.index < items.length ? (
                  renderItem(items[row.index]!, row.index)
                ) : loadMoreFailed && !loadingMore ? (
                  <div className="ns-virtual-loading">
                    <span role="status">{loadMoreFailedMessage}</span>
                    <Button variant="secondary" size="sm" onClick={retry}>
                      {retryLabel}
                    </Button>
                  </div>
                ) : (
                  <div className="ns-virtual-loading" role="status">
                    <Spinner />
                    {loadingMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
