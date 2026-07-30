/**
 * HexTile.tsx
 *
 * SVG-component voor een enkele hex-tegel (flat-top orientatie).
 *
 * Coord wordt als losse primitieven (q, r) doorgegeven — niet als object —
 * zodat React.memo referentie-gelijkheid correct kan vergelijken en onnodige
 * herrendering van de volledige grid wordt voorkomen.
 */

import { memo } from 'react';
import { hexToPixel } from '../lib/hex-grid-utils';

export type HexTileProps = {
  /** Axial q-coördinaat */
  q: number;
  /** Axial r-coördinaat */
  r: number;
  /** Terrein-type (bijv. "plains", "forest", "water") */
  terrain: string;
  /** Grootte van de hex (afstand van middelpunt naar hoekpunt) */
  size?: number;
  /** Of de tegel geselecteerd is */
  selected?: boolean;
  /** Klik-callback */
  onClick?: (q: number, r: number) => void;
};

const TERRAIN_COLORS: Record<string, string> = {
  plains: '#c8e6a0',
  forest: '#4a7c3f',
  water: '#5b9bd5',
  mountain: '#9e9e9e',
  city: '#f5c842',
  default: '#e0e0e0',
};

/**
 * Berekent de 6 hoekpunten van een flat-top hexagoon gecentreerd op (cx, cy).
 */
function hexPoints(cx: number, cy: number, size: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

function HexTileInner({
  q,
  r,
  terrain,
  size = 40,
  selected = false,
  onClick,
}: HexTileProps) {
  const { x, y } = hexToPixel({ q, r }, size);
  const fill = TERRAIN_COLORS[terrain] ?? TERRAIN_COLORS['default'];
  const strokeColor = selected ? '#ff6b00' : '#555';
  const strokeWidth = selected ? 2.5 : 1;

  return (
    <polygon
      points={hexPoints(x, y, size - 1)}
      fill={fill}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      onClick={onClick ? () => onClick(q, r) : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
}

/**
 * React.memo zodat de component alleen herrendert als q, r, terrain,
 * size, selected of onClick daadwerkelijk wijzigen.
 */
export const HexTile = memo(HexTileInner);
HexTile.displayName = 'HexTile';
