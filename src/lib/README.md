# src/lib — Spellogica en hooks

Deze map bevat alle kern-modules van het project. Ze zijn bewust los van React-componenten gehouden zodat ze makkelijk te testen en te begrijpen zijn.

---

## Inhoudsopgave

- [hex-grid-utils.ts](#hex-grid-utilsts) — Hex-grid wiskunde
- [puzzle-state.ts](#puzzle-statets) — State machine voor puzzels
- [scenario-format.ts](#scenario-formatts) — JSON-formaat en validatie
- [use-drag.ts](#use-dragts) — Drag-hook via Pointer Events

---

## hex-grid-utils.ts

### Achtergrond: axial coördinaten

Een hexagonaal grid kan op meerdere manieren worden beschreven. Dit project gebruikt **axial coördinaten**: elke cel heeft twee getallen `q` (kolom-as) en `r` (rij-as). De derde as `s = -q - r` bestaat impliciet en wordt alleen in berekeningen gebruikt.

```
      q
     /
    /
   +----> r
   |
   (s gaat schuin omlaag-links)
```

Waarom axial? Het is de compactste representatie (2 getallen), JSON-serialiseerbaar, en alle standaardberekeningen werken er direct op. Meer achtergrond: [redblobgames.com/grids/hexagons](https://www.redblobgames.com/grids/hexagons/).

### Flat-top vs. pointy-top

Dit project gebruikt **flat-top** hexagonen: de platte kant is boven en onder. De pixel-conversieformules zijn hierop afgestemd.

```
  ___
 /   \     ← flat-top: platte zijde boven
 \___/
```

### Geëxporteerde functies

#### `HexCoord`

```ts
type HexCoord = { q: number; r: number }
```

Het basistype voor een hexcel. Gebruik altijd dit type, niet losse getallen of strings als coördinaat.

---

#### `hexNeighbors(h: HexCoord): HexCoord[]`

Geeft de 6 aangrenzende cellen terug.

```ts
hexNeighbors({ q: 0, r: 0 })
// → [{ q:1, r:0 }, { q:1, r:-1 }, { q:0, r:-1 }, { q:-1, r:0 }, { q:-1, r:1 }, { q:0, r:1 }]
```

Intern worden de 6 richtingsvectoren opgeteld bij de invoer. De volgorde is altijd dezelfde (beginpositie = oost, rechtsom).

---

#### `hexDistance(a: HexCoord, b: HexCoord): number`

Geeft het minimale aantal stappen terug om van `a` naar `b` te komen.

```ts
hexDistance({ q: 0, r: 0 }, { q: 2, r: -1 }) // → 2
hexDistance({ q: 0, r: 0 }, { q: 0, r: 0 })  // → 0
```

Intern wordt de cube-coordinatenformule gebruikt: `max(|dq|, |dr|, |ds|)`. Dit werkt omdat de drie assen in een hexgrid altijd optellen tot nul.

---

#### `hexToPixel(h: HexCoord, size: number): { x: number; y: number }`

Zet een hexcel om naar het middelpunt in pixels. `size` is de afstand van het midden naar een hoekpunt (circumradius).

```ts
hexToPixel({ q: 0, r: 0 }, 40) // → { x: 0, y: 0 }
hexToPixel({ q: 1, r: 0 }, 40) // → { x: 60, y: 34.64... }
```

Gebruik de uitkomst als middelpunt voor het tekenen van een hexagoon in SVG.

---

#### `pixelToHex(x: number, y: number, size: number): HexCoord`

Doet het omgekeerde: zet een pixelpositie om naar de dichtstbijzijnde hexcel. Handig voor muisklikken of touch-input omzetten naar een grid-coördinaat.

```ts
pixelToHex(60, 34, 40) // → { q: 1, r: 0 }
```

Intern gebruikt dit `hexRound` om de fractie-coördinaten correct af te ronden (gewone `Math.round` per as werkt niet correct voor hex).

---

## puzzle-state.ts

### Hoe de state machine werkt

De puzzel-state wordt beheerd via het React-patroon `useReducer`. De state is een enkel object; alle wijzigingen gaan via acties (actions). `immer` zorgt voor immutable updates zodat je de draft-state direct kunt muteren zonder spread-operators.

### State-structuur

```ts
type PuzzleState = {
  board: Record<string, Tile>  // sleutel is "q,r", bijv. "2,-1"
  turn: number                 // huidig beurt-nummer
  past: Snapshot[]             // history voor undo (max 50)
  future: Snapshot[]           // history voor redo
}

type Tile = {
  terrain: string    // bijv. "plains", "forest", "water"
  unit?: Unit        // optionele unit op de tegel
}

type Unit = {
  type: string   // bijv. "warrior", "archer"
  owner: string  // bijv. "player1"
}
```

De board-sleutel `"q,r"` (bijv. `"2,-1"`) zorgt voor snelle opzoek en is direct serialiseerbaar naar JSON.

### Acties

| Actie | Effect |
|---|---|
| `PLACE_UNIT` | Plaatst een unit op een coördinaat, verhoogt turn, slaat snapshot op in `past` |
| `UNDO` | Herstelt de vorige snapshot, verplaatst huidige staat naar `future` |
| `REDO` | Past de eerste snapshot in `future` opnieuw toe |
| `RESET` | Zet state terug naar een opgegeven beginstate, wist `past` en `future` |

### Undo/redo in detail

```
Initieel:  past=[]  board={}  future=[]

na PLACE_UNIT:
  past=[snap0]  board={...unit}  future=[]

na UNDO:
  past=[]  board={}  future=[snap_met_unit]

na REDO:
  past=[snap0]  board={...unit}  future=[]
```

De `past`-stack wordt begrensd op **50 entries** om geheugengebruik te beheersen. Als je meer dan 50 acties uitvoert, valt de oudste snapshot weg.

### Gebruik in een component

```tsx
import { useReducer } from 'react';
import { puzzleReducer, createInitialState } from './puzzle-state';

function MyPuzzle() {
  const [state, dispatch] = useReducer(puzzleReducer, createInitialState());

  const handlePlace = (q: number, r: number) => {
    dispatch({
      type: 'PLACE_UNIT',
      coord: { q, r },
      unit: { type: 'warrior', owner: 'player1' },
    });
  };

  const handleUndo = () => dispatch({ type: 'UNDO' });

  return (
    <>
      <button onClick={handleUndo} disabled={state.past.length === 0}>
        Ongedaan maken
      </button>
      {/* render state.board */}
    </>
  );
}
```

### `toKey(coord)` hulpfunctie

```ts
import { toKey } from './puzzle-state';
toKey({ q: 2, r: -1 }) // → "2,-1"

// Tegel ophalen:
const tile = state.board[toKey({ q: 2, r: -1 })];
```

---

## scenario-format.ts

### Het JSON-schema

Een puzzelbestand beschrijft de beginopstelling, het grid en de doelstelling. Alle puzzels beginnen met `"version": 1`.

**Verplichte velden:**

```json
{
  "version": 1,
  "id": "unieke-string",
  "title": "Naam van de puzzel",
  "grid": {
    "shape": "rhombus",
    "size": 4
  },
  "tiles": [
    { "q": 0, "r": 0, "terrain": "plains" }
  ]
}
```

**Optionele velden:**

```json
{
  "description": "Korte omschrijving",
  "tiles": [
    {
      "q": 0, "r": 0,
      "terrain": "city",
      "unit": { "type": "warrior", "owner": "player1" }
    }
  ],
  "objectives": [
    { "type": "capture", "target": "3,0", "turns": 5 }
  ],
  "constraints": {
    "maxTurns": 10,
    "allowedUnits": ["warrior", "archer"]
  }
}
```

### Toegestane waarden

| Veld | Toegestane waarden |
|---|---|
| `grid.shape` | `"rhombus"`, `"hexagon"`, `"rectangle"` |
| `objective.type` | `"capture"`, `"survive"`, `"reach"` |
| `tile.terrain` | Vrij string — `HexTile.tsx` heeft kleuren voor: `plains`, `forest`, `water`, `mountain`, `city` |

### `validateScenario(data: unknown): PuzzleScenario`

Valideer altijd data uit een JSON-bestand voordat je het gebruikt. De functie gooit een `ValidationError` als er iets ontbreekt of ongeldig is.

```ts
import { validateScenario } from './scenario-format';
import rawData from '../data/my-puzzle.json';

// Gooit een ValidationError als het bestand ongeldig is:
const scenario = validateScenario(rawData);
console.log(scenario.tiles); // type is nu PuzzleScenario
```

### Een nieuwe puzzel maken

1. Kopieer `src/data/example-puzzle.json`
2. Geef het een uniek `id` en een eigen `title`
3. Voeg tiles toe met `q`, `r` en `terrain`
4. Controleer of het geldig is: `validateScenario(jouwData)` — als het geen fout gooit, is het correct

### Het versieveld

Het veld `"version": 1` staat erin zodat je later het formaat kunt uitbreiden zonder oude puzzelbestanden te breken. Als je het formaat wijzigt, verhoog je de versie en schrijf je een migratiefunctie.

---

## use-drag.ts

### Waarom Pointer Events?

Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`) werken uniform op muis, touch en stylus — één implementatie voor alle apparaten. Je hoeft geen aparte touch- en mousehandlers te schrijven.

### `setPointerCapture`

Dit is het kritieke onderdeel voor goede drag-werking op mobiel. Normaal gesproken stoppen `pointermove`-events als de pointer buiten het element beweegt. Door `setPointerCapture` aan te roepen bij dragstart blijven alle events naar het originele element komen, ongeacht waar de pointer naartoe gaat.

### `touch-action: none` — verplicht!

Zonder deze CSS-property probeert de browser de pagina te scrollen tijdens een touch-drag. Voeg dit altijd toe aan het element dat de drag-handlers ontvangt:

```tsx
<div {...dragHandlers} style={{ touchAction: 'none' }}>
  {/* grid */}
</div>
```

Of in Tailwind CSS: `className="touch-none"`

### De hook gebruiken

```tsx
import { useDrag } from './use-drag';

function DraggableGrid() {
  const { dragging, dragHandlers } = useDrag({
    onDragMove: ({ x, y }) => {
      // x en y zijn clientX/clientY coördinaten
      console.log('sleep naar', x, y);
    },
    onDragEnd: ({ x, y }) => {
      console.log('drag gestopt op', x, y);
    },
    threshold: 4, // minimale pixels voor dragstart (standaard: 4)
  });

  return (
    <div
      {...dragHandlers}
      style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
    >
      Sleep hier
    </div>
  );
}
```

### `threshold`

Er is een dode zone van 4 pixels (instelbaar via `threshold`). Hierdoor wordt een klik niet per ongeluk als een drag gezien. Pas `threshold` aan als je een grotere of kleinere tolerantie wilt.

### Wat de hook teruggeeft

| Property | Type | Beschrijving |
|---|---|---|
| `dragging` | `boolean` | `true` zolang een actieve drag-sessie loopt |
| `dragHandlers` | `DragHandlers` | Object met `onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel` — spread dit op je element |

### Pixel-naar-hex tijdens drag

Combineer `useDrag` met `pixelToHex` om te bepalen over welke tegel de pointer zweeft:

```ts
import { pixelToHex } from './hex-grid-utils';

const { dragHandlers } = useDrag({
  onDragMove: ({ x, y }) => {
    const svgElement = svgRef.current;
    if (!svgElement) return;
    const rect = svgElement.getBoundingClientRect();
    const localX = x - rect.left - svgCenterX;
    const localY = y - rect.top - svgCenterY;
    const hex = pixelToHex(localX, localY, tileSize);
    setHoveredHex(hex);
  },
});
```
