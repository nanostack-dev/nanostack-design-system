'use client';

/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Named scroll regions need a keyboard scroll target independent of their items. */
import { useImperativeHandle, useLayoutEffect, useRef, type ReactNode } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

export type ConversationLogProps = ElementProps<'div'> & { label: string; entryCount: number };
/** Append one keyed element per entry. Streaming and older history preserve the reader's position. */
export function ConversationLog({
  label,
  entryCount,
  children,
  ref,
  onScroll,
  ...props
}: ConversationLogProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const previous = useRef<{ count: number; first: Element | null; firstOffset: number } | null>(
    null,
  );
  useImperativeHandle(ref, () => viewport.current!, []);
  function rememberPosition() {
    const first = content.current?.firstElementChild ?? null;
    previous.current = {
      count: entryCount,
      first,
      firstOffset:
        first && viewport.current
          ? first.getBoundingClientRect().top - viewport.current.getBoundingClientRect().top
          : 0,
    };
  }
  useLayoutEffect(() => {
    const scroll = viewport.current;
    const entries = content.current;
    if (!scroll || !entries) return;
    const before = previous.current;
    const first = entries.firstElementChild;
    if (before?.first && first !== before.first && entries.contains(before.first)) {
      // Retained keyed DOM nodes identify a prepend without requiring product IDs.
      const offset = before.first.getBoundingClientRect().top - scroll.getBoundingClientRect().top;
      scroll.scrollTop += offset - before.firstOffset;
    } else if (!before || first !== before.first || entryCount > before.count) {
      const firstNew = entries.children.item(before?.first === first ? before.count : 0);
      if (firstNew) {
        const offset = firstNew.getBoundingClientRect().top - entries.getBoundingClientRect().top;
        scroll.scrollTop = Math.max(offset - 8, 0);
      }
    }
    rememberPosition();
  });
  // Keyboard users must be able to scroll the log without focusing a message.
  return (
    <div
      {...safeProps(props)}
      ref={viewport}
      role="log"
      aria-label={label}
      aria-live="polite"
      tabIndex={0}
      className="ns-conversation-log"
      onScroll={(event) => {
        rememberPosition();
        onScroll?.(event);
      }}
    >
      <div ref={content} className="ns-conversation-content">
        {children}
      </div>
    </div>
  );
}
export type MessageRowProps = ElementProps<'div'> & { side?: 'start' | 'end'; avatar?: ReactNode };
export function MessageRow({ side = 'start', avatar, children, ...props }: MessageRowProps) {
  return (
    <div {...safeProps(props)} className="ns-message-row" data-ns-side={side}>
      {avatar}
      <div className="ns-message-content">{children}</div>
    </div>
  );
}
export type MessageBubbleProps = ElementProps<'div'> & {
  tone?: 'neutral' | 'accent';
  streaming?: boolean;
};
export function MessageBubble({
  tone = 'neutral',
  streaming = false,
  children,
  ...props
}: MessageBubbleProps) {
  return (
    <div {...safeProps(props)} className="ns-message-bubble" data-tone={tone}>
      {children}
      {streaming ? <span className="ns-message-caret" aria-hidden="true" /> : null}
    </div>
  );
}
