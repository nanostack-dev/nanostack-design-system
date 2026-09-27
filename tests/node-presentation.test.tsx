import { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  NodeAttempts,
  NodeChecks,
  NodeElapsedTime,
  NodeMeter,
  NodeRoute,
  NodeRoutes,
  NodeRunGlyph,
} from '../src/blocks/node-presentation.js';

describe('node presentation', () => {
  it('keeps elapsed time continuous when the formatter changes and exposes the DOM ref', () => {
    vi.useFakeTimers();
    try {
      const ref = createRef<HTMLSpanElement>();
      const view = render(<NodeElapsedTime ref={ref} elapsedMs={500} format={(ms) => `${ms}ms`} />);
      expect(ref.current).toHaveTextContent('500ms');
      act(() => vi.advanceTimersByTime(1000));
      expect(ref.current).toHaveTextContent('1500ms');
      view.rerender(<NodeElapsedTime ref={ref} elapsedMs={500} format={(ms) => `${ms / 1000}s`} />);
      act(() => vi.advanceTimersByTime(100));
      expect(ref.current).toHaveTextContent('1.6s');
      view.rerender(<NodeElapsedTime ref={ref} elapsedMs={2000} format={(ms) => `${ms}ms`} />);
      expect(ref.current).toHaveTextContent('2000ms');
      view.unmount();
      expect(ref.current).toBeNull();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it('normalizes invalid attempt data and announces the real count beyond the visual cap', () => {
    const view = render(<NodeAttempts label="Attempts" total={4} used={Number.NaN} />);
    const invalid = screen.getByRole('img', { name: 'Attempts: 0 of 4' });
    expect(
      Array.from(invalid.children).every((pip) => pip.getAttribute('data-ns-state') === 'empty'),
    ).toBe(true);
    view.rerender(<NodeAttempts label="Attempts" total={40} used={27} />);
    expect(screen.getByRole('img', { name: 'Attempts: 27 of 40' }).children).toHaveLength(24);
    view.rerender(<NodeAttempts label="Attempts" total={Number.POSITIVE_INFINITY} used={4} />);
    expect(screen.getByRole('img', { name: 'Attempts: 0 of 0' }).children).toHaveLength(0);
  });
  it('announces measured progress and preserves unknown duration semantics', () => {
    const view = render(<NodeMeter label="Progress" value={2} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    view.rerender(
      <NodeMeter label="Progress" mode="duration" durationMs={4000} elapsedMs={1500} />,
    );
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
      '--ns-sweep-offset': '-1500ms',
    });
    view.rerender(<NodeMeter label="Progress" value={Number.NaN} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
  it('keeps check outcomes distinct and limits long lists without dropping their count', () => {
    render(
      <NodeChecks
        items={[
          { label: 'Check one', state: 'pending' },
          { label: 'Check two', state: 'passed' },
          { label: 'Check three', state: 'failed' },
          { label: 'Check four', state: 'pending' },
          { label: 'Check five', state: 'pending' },
        ]}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText('+1 more')).toBeVisible();
    expect(screen.getByRole('img', { name: 'Passed' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Failed' })).toBeVisible();
  });
  it('describes chosen routes and bounded attempt data without CSS overrides', () => {
    const bypass = JSON.parse(
      '{"className":"override","style":{"width":"900px"},"data-ns-state":"failed","data-ns-phase":"running"}',
    );
    render(
      <>
        <NodeRoutes>
          <NodeRoute target="next" state="taken">
            value equals ready
          </NodeRoute>
        </NodeRoutes>
        <NodeAttempts {...bypass} label="Attempts" total={4} used={2} outcome="passed" />
        <NodeRunGlyph {...bypass} phase="success" />
      </>,
    );
    expect(screen.getByText('(taken)')).toBeInTheDocument();
    const attempts = screen.getByRole('img', { name: 'Attempts: 2 of 4' });
    expect(attempts.children).toHaveLength(4);
    expect(attempts).not.toHaveClass('override');
    expect(attempts).not.toHaveAttribute('style');
    expect(attempts).not.toHaveAttribute('data-ns-state');
    expect(screen.getByRole('img', { name: 'Passed' })).toHaveAttribute('data-ns-phase', 'success');
  });
});
