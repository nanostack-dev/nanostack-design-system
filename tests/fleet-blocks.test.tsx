import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WorkerAvatar } from '../src/components/worker-avatar.js';
import { CapacityMeter } from '../src/components/capacity-meter.js';
import {
  ResourceTile,
  ResourceTileBody,
  ResourceTileLabel,
  ResourceTileStatus,
} from '../src/blocks/resource-tile.js';

describe('capacity telemetry and resource tiles', () => {
  it('keeps the pebble load and health precedence readable without animation', () => {
    const view = render(<WorkerAvatar variant="pebble" label="Worker" load={1} />);
    const worker = screen.getByRole('img', { name: 'Worker' });
    expect(worker).toHaveAttribute('data-ns-state', 'full');
    view.rerender(<WorkerAvatar variant="pebble" label="Worker" load={1} staling />);
    expect(worker).toHaveAttribute('data-ns-state', 'staling');
    view.rerender(<WorkerAvatar variant="pebble" label="Worker" load={1} staling alarmed />);
    expect(worker).toHaveAttribute('data-ns-state', 'alarmed');
    view.rerender(<WorkerAvatar variant="pebble" label="Worker" load={Number.NaN} />);
    expect(worker).toHaveAttribute('data-ns-state', 'idle');
    expect(worker.getAttribute('style')).not.toMatch(/NaN/);
    expect(worker.style.getPropertyValue('--pebble-liquid-y')).toBe('40px');
  });

  it('replays a heartbeat only when the observed event changes', () => {
    const view = render(<WorkerAvatar variant="pebble" label="Worker" beat="first" />);
    const worker = screen.getByRole('img');
    const beat = worker.querySelector('.ns-worker-pebble-eyes-beat');
    view.rerender(<WorkerAvatar variant="pebble" label="Worker" load={0.5} beat="first" />);
    expect(worker.querySelector('.ns-worker-pebble-eyes-beat')).toBe(beat);
    view.rerender(<WorkerAvatar variant="pebble" label="Worker" beat="second" />);
    expect(worker.querySelector('.ns-worker-pebble-eyes-beat')).not.toBe(beat);
  });

  it('keeps a named tile keyboard operable and its telemetry decorative', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    const inspect = vi.fn();
    const leave = vi.fn();
    const bypass = JSON.parse(
      '{"className":"override","style":{"width":"999px"},"data-ns-selected":"false"}',
    );
    render(
      <ResourceTile
        {...bypass}
        aria-label="Worker one, one expired lease"
        selected
        onClick={toggle}
      >
        <WorkerAvatar {...bypass} variant="pebble" load={1} alarmed />
        <ResourceTileBody>
          <ResourceTileLabel>Worker one</ResourceTileLabel>
          <CapacityMeter
            {...bypass}
            segments={[{ id: 'one', state: 'expired' }]}
            hiddenCount={2}
            onSegmentEnter={inspect}
            onSegmentLeave={leave}
          />
          <ResourceTileStatus tone="danger">One expired lease</ResourceTileStatus>
        </ResourceTileBody>
      </ResourceTile>,
    );
    const tile = screen.getByRole('button', { name: 'Worker one, one expired lease' });
    expect(tile).toHaveAttribute('data-ns-selected', 'true');
    expect(tile).not.toHaveClass('override');
    expect(tile.style.width).toBe('');
    expect(screen.queryByRole('img')).toBeNull();
    await user.tab();
    expect(tile).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(toggle).toHaveBeenCalledOnce();
    const segment = tile.querySelector('.ns-capacity-segment')!;
    await user.hover(segment);
    expect(inspect).toHaveBeenCalledWith(0);
    await user.unhover(segment);
    expect(leave).toHaveBeenCalled();
    expect(tile).toHaveTextContent('+2');
  });
});
