import { describe, it, expect } from 'vitest';
import {
  hexNeighbors,
  hexDistance,
  hexToPixel,
  pixelToHex,
  type HexCoord,
} from './hex-grid-utils';

describe('hexNeighbors', () => {
  it('returns exactly 6 neighbours for the origin', () => {
    const neighbours = hexNeighbors({ q: 0, r: 0 });
    expect(neighbours).toHaveLength(6);
  });

  it('all neighbours are unique', () => {
    const neighbours = hexNeighbors({ q: 0, r: 0 });
    const keys = neighbours.map((n) => `${n.q},${n.r}`);
    expect(new Set(keys).size).toBe(6);
  });

  it('is symmetric: if B is a neighbour of A, then A is a neighbour of B', () => {
    const a: HexCoord = { q: 2, r: -1 };
    for (const b of hexNeighbors(a)) {
      const bNeighbours = hexNeighbors(b).map((n) => `${n.q},${n.r}`);
      expect(bNeighbours).toContain(`${a.q},${a.r}`);
    }
  });
});

describe('hexDistance', () => {
  it('distance to itself is 0', () => {
    expect(hexDistance({ q: 3, r: -2 }, { q: 3, r: -2 })).toBe(0);
  });

  it('distance to a direct neighbour is 1', () => {
    const a: HexCoord = { q: 0, r: 0 };
    for (const b of hexNeighbors(a)) {
      expect(hexDistance(a, b)).toBe(1);
    }
  });

  it('is symmetric', () => {
    const a: HexCoord = { q: 1, r: 2 };
    const b: HexCoord = { q: -2, r: 3 };
    expect(hexDistance(a, b)).toBe(hexDistance(b, a));
  });

  it('known distance', () => {
    // (0,0) to (2,-2): dq=2, dr=2, ds=0 → max=2
    expect(hexDistance({ q: 0, r: 0 }, { q: 2, r: -2 })).toBe(2);
  });
});

describe('hexToPixel / pixelToHex', () => {
  it('origin maps to (0, 0)', () => {
    const { x, y } = hexToPixel({ q: 0, r: 0 }, 32);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });

  it('round-trip pixel → hex → pixel stays within 1 pixel', () => {
    const size = 32;
    const cases: HexCoord[] = [
      { q: 0, r: 0 },
      { q: 1, r: 0 },
      { q: 0, r: 1 },
      { q: -1, r: 2 },
      { q: 3, r: -3 },
    ];
    for (const h of cases) {
      const { x, y } = hexToPixel(h, size);
      const roundTripped = pixelToHex(x, y, size);
      expect(roundTripped.q).toBe(h.q);
      expect(roundTripped.r).toBe(h.r);
    }
  });
});
