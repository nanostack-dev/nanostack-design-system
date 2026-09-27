import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkerAvatar } from '../src/components/worker-avatar.js';
import { workerPhase, workerSteamTier } from '../src/internal/worker-tuning.js';

describe('worker activity visualization', () => {
  it('keeps load thresholds and stable identity deterministic', () => {
    expect([0, 0.49, 0.5, 0.74, 0.75, 0.99, 1].map(workerSteamTier)).toEqual([0, 0, 1, 1, 2, 2, 3]);
    expect(workerPhase('worker-a')).toBe(workerPhase('worker-a'));
    expect(workerPhase('worker-a')).not.toBe(workerPhase('worker-b'));
  });
  it('describes a worker or remains decorative and clamps invalid telemetry', () => {
    const view = render(<WorkerAvatar label="Worker running at capacity" load={2} alarmed />);
    const image = screen.getByRole('img', { name: 'Worker running at capacity' });
    expect(image).toHaveAttribute('data-steam', '3');
    expect(image).toHaveAttribute('data-alarmed', 'true');
    view.rerender(<WorkerAvatar load={Number.NaN} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(image).toHaveAttribute('aria-hidden', 'true');
    expect(image).toHaveAttribute('data-working', 'false');
    expect(image.getAttribute('style')).not.toMatch(/NaN/);
  });
  it('replays only a changed observed heartbeat and rejects CSS overrides', () => {
    const bypass = JSON.parse('{"className":"override","style":{"width":"900px"}}');
    const view = render(<WorkerAvatar {...bypass} label="Worker" beat="first" />);
    const image = screen.getByRole('img');
    const initial = image.querySelector('.ns-worker-avatar-beat');
    view.rerender(<WorkerAvatar label="Worker" beat="first" load={0.5} />);
    expect(image.querySelector('.ns-worker-avatar-beat')).toBe(initial);
    view.rerender(<WorkerAvatar label="Worker" beat="second" />);
    expect(image.querySelector('.ns-worker-avatar-beat')).not.toBe(initial);
    expect(image).not.toHaveClass('override');
    expect(image.style.width).toBe('');
  });
});
