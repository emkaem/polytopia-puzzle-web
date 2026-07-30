/**
 * hex-grid-utils.ts
 *
 * Hex-grid utility functions based on axial coordinates (q, r).
 * Reference: https://www.redblobgames.com/grids/hexagons/
 *
 * Uses flat-top orientation for pixel conversions.
 */

export type HexCoord = { q: number; r: number };

// The 6 direction vectors in axial coordinates
const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

/**
 * Returns the 6 axial neighbours of a hex cell.
 */
export function hexNeighbors(h: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map((d) => ({ q: h.q + d.q, r: h.r + d.r }));
}

/**
 * Returns the minimum step distance between two hex cells.
 * Uses the cube coordinate formula: max(|dq|, |dr|, |ds|) where s = -q-r.
 */
export function hexDistance(a: HexCoord, b: HexCoord): number {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  const ds = -dq - dr;
  return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
}

/**
 * Converts a hex coord to pixel coordinates (flat-top orientation).
 * The origin hex { q: 0, r: 0 } maps to pixel { x: 0, y: 0 }.
 *
 * @param h - The hex coordinate
 * @param size - The distance from center to corner (circumradius)
 */
export function hexToPixel(h: HexCoord, size: number): { x: number; y: number } {
  const x = size * (3 / 2) * h.q;
  const y = size * (Math.sqrt(3) / 2 * h.q + Math.sqrt(3) * h.r);
  return { x, y };
}

/**
 * Converts pixel coordinates back to a (rounded) hex coord (flat-top orientation).
 *
 * @param x - Pixel x
 * @param y - Pixel y
 * @param size - The distance from center to corner (circumradius)
 */
export function pixelToHex(x: number, y: number, size: number): HexCoord {
  const q = (2 / 3 * x) / size;
  const r = (-1 / 3 * x + Math.sqrt(3) / 3 * y) / size;
  return hexRound(q, r);
}

/**
 * Rounds fractional axial coordinates to the nearest integer hex.
 */
function hexRound(q: number, r: number): HexCoord {
  const s = -q - r;

  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(s);

  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - s);

  if (dq > dr && dq > ds) {
    rq = -rr - rs;
  } else if (dr > ds) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}
