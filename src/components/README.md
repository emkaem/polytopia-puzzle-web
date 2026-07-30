# src/components — React componenten

---

## HexTile.tsx

Een SVG-component voor één hexagonale tegel. Meerdere `<HexTile>`-componenten bij elkaar vormen een visueel grid.

### Props

| Prop | Type | Verplicht | Standaard | Beschrijving |
|---|---|---|---|---|
| `q` | `number` | ja | — | Axial q-coördinaat |
| `r` | `number` | ja | — | Axial r-coördinaat |
| `terrain` | `string` | ja | — | Terreintype, bepaalt de kleur |
| `size` | `number` | nee | `40` | Afstand van middelpunt naar hoekpunt (circumradius) |
| `selected` | `boolean` | nee | `false` | Geeft de tegel een oranje rand |
| `onClick` | `(q, r) => void` | nee | — | Callback bij klikken, ontvangt de coördinaten |

### Terrein en kleuren

| Terrain-string | Kleur |
|---|---|
| `"plains"` | Lichtgroen |
| `"forest"` | Donkergroen |
| `"water"` | Blauw |
| `"mountain"` | Grijs |
| `"city"` | Geel |
| Onbekend | Lichtgrijs (fallback) |

Nieuwe terreintypen toevoegen: voeg een entry toe aan `TERRAIN_COLORS` in `HexTile.tsx`.

### Basisgebruik

`<HexTile>` moet altijd binnen een `<svg>`-element staan. De component tekent zichzelf op de positie die overeenkomt met zijn coördinaten. Gebruik een `viewBox` op de SVG om de zichtbare ruimte in te stellen.

```tsx
import { HexTile } from './components/HexTile';

function SimpleGrid() {
  return (
    <svg width={400} height={400} viewBox="-200 -200 400 400">
      <HexTile q={0} r={0} terrain="plains" />
      <HexTile q={1} r={0} terrain="forest" />
      <HexTile q={0} r={1} terrain="water" />
    </svg>
  );
}
```

### Met klik-interactie

```tsx
const [selected, setSelected] = useState<string | null>(null);

<svg viewBox="-200 -200 400 400">
  {tiles.map(tile => (
    <HexTile
      key={`${tile.q},${tile.r}`}
      q={tile.q}
      r={tile.r}
      terrain={tile.terrain}
      selected={selected === `${tile.q},${tile.r}`}
      onClick={(q, r) => setSelected(`${q},${r}`)}
    />
  ))}
</svg>
```

### SVG-coördinaten en viewBox

De component plaatst zichzelf op basis van `hexToPixel(q, r, size)`. Bij `size=40` en `q=0, r=0` is de positie `(0, 0)`. Een grid van 4×4 tegels heeft een breedte van ongeveer `size * 1.5 * gridBreedte` pixels.

Een handige vuistregel voor de `viewBox`:

```
viewBox="-{halveBreedte} -{halveHoogte} {volleBreedte} {volleHoogte}"
```

Of gebruik dynamisch berekende grenzen op basis van de tiles in het scenario.

### Waarom `React.memo`?

De component is gewrapped met `React.memo`. Dat betekent: React slaat de vorige render op en vergelijkt de nieuwe props met de oude. Als niets veranderd is, wordt de component niet opnieuw gerenderd.

**Belangrijk:** coördinaten worden als losse getallen doorgegeven (`q={tile.q}` en `r={tile.r}`), niet als één object (`coord={tile}`). Een nieuw object is in JavaScript altijd een nieuwe referentie — ook als de waarden identiek zijn — waardoor `React.memo` dan nooit zou werken.

```tsx
// Goed — primitieven worden vergeleken op waarde:
<HexTile q={tile.q} r={tile.r} terrain={tile.terrain} />

// Fout — een nieuw object bij elke render omzeilt memo:
<HexTile coord={{ q: tile.q, r: tile.r }} terrain={tile.terrain} />
```

### Een grid-component bouwen

`HexTile` is opzettelijk een enkelvoudige tegel zonder eigen grid-logica. Een `HexGrid`-component bouw je er zelf omheen:

```tsx
import { HexTile } from './HexTile';
import type { PuzzleState } from '../lib/puzzle-state';
import type { TileData } from '../lib/scenario-format';

type HexGridProps = {
  tiles: TileData[];
  board: PuzzleState['board'];
  selectedCoord?: string;
  onTileClick?: (q: number, r: number) => void;
  tileSize?: number;
};

export function HexGrid({ tiles, board, selectedCoord, onTileClick, tileSize = 40 }: HexGridProps) {
  return (
    <svg width={600} height={500} viewBox="-300 -250 600 500">
      {tiles.map(tile => {
        const key = `${tile.q},${tile.r}`;
        const boardTile = board[key];
        return (
          <HexTile
            key={key}
            q={tile.q}
            r={tile.r}
            terrain={boardTile?.terrain ?? tile.terrain}
            size={tileSize}
            selected={selectedCoord === key}
            onClick={onTileClick}
          />
        );
      })}
    </svg>
  );
}
```
