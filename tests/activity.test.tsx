import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimelineItem, StatusMarker, type StatusMarkerProps } from '../src/components/activity.js';

describe('activity presentation', () => {
  it('keeps intervals in their shared window and omits a missing interval', () => {
    const { container } = render(
      <>
        <TimelineItem label="First" interval={{ start: -20, end: 150 }} />
        <TimelineItem label="Skipped" />
        <TimelineItem label="Invalid" interval={{ start: NaN, end: -10 }} />
      </>,
    );
    const bars = container.querySelectorAll<HTMLElement>('[data-slot="timeline-bar"]');
    expect(bars).toHaveLength(2);
    expect(bars[0]?.style.left).toBe('0%');
    expect(bars[0]?.style.width).toBe('100%');
    expect(bars[1]?.style.width).toBe('0%');
  });
  it('supports keyboard selection and exposes the current item', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(<TimelineItem label="Build package" selected onClick={select} />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(select).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Build package' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });
  it('keeps labels accessible and strips visual overrides from untyped callers', () => {
    const bypass = {
      className: 'override',
      style: { color: 'red' },
      'data-tone': 'danger',
    } as unknown as StatusMarkerProps;
    const { container } = render(
      <StatusMarker {...bypass} variant="dot" tone="success">
        Available
      </StatusMarker>,
    );
    expect(screen.getByText('Available')).toHaveClass('ns-status-marker');
    expect(container.firstElementChild).not.toHaveAttribute('style');
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'success');
    expect(container.querySelector('.ns-status-dot')).toHaveAttribute('aria-hidden', 'true');
  });
});
