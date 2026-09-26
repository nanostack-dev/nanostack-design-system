import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress, Sparkline } from '../src/components/data-visualization.js';

describe('compact data displays', () => {
  it('exposes progress and bounds invalid or over-complete work', () => {
    const view = render(<Progress label="Sending requests" value={14} max={10} />);
    const progress = screen.getByRole('progressbar', { name: 'Sending requests' });
    expect(progress).toHaveAttribute('value', '10');
    expect(progress).toHaveAttribute('max', '10');
    view.rerender(<Progress label="Sending requests" />);
    expect(progress).not.toHaveAttribute('value');
    view.rerender(<Progress label="Sending requests" value={-2} max={0} />);
    expect(progress).toHaveAttribute('value', '0');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('keeps empty, single and invalid samples accessible without invalid geometry', () => {
    const view = render(<Sparkline values={[]} label="No requests" />);
    const chart = screen.getByRole('img', { name: 'No requests' });
    expect(chart.querySelector('polyline')).toBeNull();
    view.rerender(<Sparkline values={[5]} label="Five requests" />);
    expect(chart.querySelector('circle')).toHaveAttribute('cx', '66');
    view.rerender(<Sparkline values={[0, Number.NaN, 8, -2]} label="Request trend" />);
    expect(chart.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(chart.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('strips untyped appearance overrides', () => {
    const bypass = JSON.parse('{"className":"custom","style":{"width":900},"data-tone":"danger"}');
    render(<Sparkline {...bypass} values={[1, 3]} label="Traffic" tone="success" />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveClass('ns-sparkline');
    expect(chart).not.toHaveClass('custom');
    expect(chart).not.toHaveAttribute('style');
    expect(chart).toHaveAttribute('data-tone', 'success');
  });
});
