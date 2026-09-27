import { describe, expect, it } from 'vitest';
import { inspectorEase, revealOffset } from '../src/internal/graph/reveal.js';

describe('minimal canvas reveal', () => {
  it('leaves a visible node and zoom alone', () => {
    expect(revealOffset({ left: 40, top: 40, right: 200, bottom: 160 }, 800, 600)).toEqual({ dx: 0, dy: 0 });
  });
  it('pans just enough to uncover far edges and preserve the readable margin', () => {
    expect(revealOffset({ left: 700, top: 500, right: 1020, bottom: 700 }, 800, 600)).toEqual({ dx: -244, dy: -124 });
  });
  it('keeps oversized nodes readable and handles a collapsed available area', () => {
    expect(revealOffset({ left: 0, top: -30, right: 900, bottom: 900 }, 400, 300)).toEqual({ dx: 24, dy: 54 });
    expect(revealOffset({ left: 100, top: 100, right: 200, bottom: 200 }, -16, 0)).toEqual({ dx: -76, dy: -76 });
  });
  it('lands the inspector motion precisely without reversing direction', () => {
    expect(inspectorEase(0)).toBe(0);
    expect(inspectorEase(1)).toBe(1);
    const samples = Array.from({ length: 101 }, (_, i) => inspectorEase(i / 100));
    expect(samples.every((value, i) => value >= (samples[i - 1] ?? 0) && value <= 1)).toBe(true);
  });
});
