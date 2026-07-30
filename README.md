# Polytopia Puzzle Web

Een fan-website voor het maken en spelen van puzzels gebaseerd op het spel [Polytopia](https://store.steampowered.com/app/796000/The_Battle_of_Polytopia/). Het project is gebouwd met React, TypeScript en Vite.

---

## Inhoudsopgave

- [Snel starten](#snel-starten)
- [Projectstructuur](#projectstructuur)
- [Architectuurkeuzes](#architectuurkeuzes)
- [Modules](#modules)
- [Puzzelformaat](#puzzelformaat)
- [Tests](#tests)
- [Verder bouwen](#verder-bouwen)

---

## Snel starten

```bash
npm install
npm run dev       # start de development server op http://localhost:5173
npm test          # voer alle unit-tests uit
npm run build     # bouw voor productie
```

---

## Projectstructuur

```
polytopia-puzzle-web/
├── src/
│   ├── lib/                  # Spellogica en hooks (framework-onafhankelijk)
│   │   ├── hex-grid-utils.ts     # Hex-grid wiskunde (axial coordinates)
│   │   ├── puzzle-state.ts       # State machine voor puzzels (useReducer + immer)
│   │   ├── scenario-format.ts    # Types en validatie voor het puzzel-JSON-formaat
│   │   └── use-drag.ts           # React hook voor drag via Pointer Events API
│   ├── components/           # React UI-componenten
│   │   └── HexTile.tsx           # SVG-component voor één hex-tegel
│   ├── data/
│   │   └── example-puzzle.json   # Voorbeeldpuzzel die het JSON-formaat demonstreert
│   ├── App.tsx               # Hoofdcomponent (nog Vite-standaard, te vervangen)
│   └── main.tsx              # React entry point
├── openspec/                 # Projectplanning (proposal, design, specs, tasks)
├── vitest.config.ts          # Vitest testconfiguratie
├── vite.config.ts            # Vite bouwconfiguratie
└── package.json
```

### Waarom `src/lib/` apart?

Alle spellogica zit in `src/lib/` zonder React-afhankelijkheden (behalve `use-drag.ts` die een React hook is). Dit maakt de logica:

- **Testbaar** zonder rendering — de Vitest-tests draaien in een Node-omgeving
- **Herbruikbaar** — de functies zijn pure en kunnen ook buiten React-componenten worden gebruikt
- **Begrijpelijk** — je kunt de spellogica lezen los van de UI

---

## Architectuurkeuzes

Dit zijn de belangrijkste beslissingen die zijn gemaakt en waarom:

### Hex-grid: eigen implementatie op basis van axial coordinates

Externe hex-grid libraries (zoals `honeycomb-grid`) voegen klassen en abstracties toe die wrijving geven bij serialisatie en testen. In plaats daarvan zijn de formules van [redblobgames.com](https://www.redblobgames.com/grids/hexagons/) direct geïmplementeerd.

Een hex-cel wordt beschreven als `{ q: number, r: number }` — twee getallen, niet meer. Intern worden soms cube-coördinaten gebruikt (`s = -q - r`) voor berekeningen zoals afstand, maar die worden nooit opgeslagen.

### State management: `useReducer` + `immer`, geen Zustand

Puzzel-state is van nature sequentieel en actiegericht: je zet een unit neer, je maakt een zet ongedaan, je reset de puzzel. Dat past precies bij een reducer. `immer` zorgt ervoor dat je de state als muteerbaar kunt schrijven terwijl het intern immutable blijft — dit scheelt veel `...spread`-boilerplate.

Zustand is niet gekozen omdat het geen reducer-semantiek of ingebouwde undo/redo biedt.

### Undo/redo via history-stack

In `PuzzleState` zitten twee arrays: `past` en `future`. Bij elke actie wordt een snapshot van de huidige state in `past` gepusht. Bij `UNDO` wordt de laatste snapshot teruggezet en de huidige staat naar `future` verplaatst. De stack wordt begrensd op 50 entries.

### Rendering: `React.memo` op tegel-component

Een hex-grid kan 50–200+ tegels bevatten. Zonder `React.memo` herrendert de hele grid bij elke state-update. De coördinaten worden als losse primitieven doorgegeven (`q: number, r: number` — niet als `{ q, r }`-object) omdat React `memo` referentie-gelijkheid vergelijkt: een nieuw object is altijd ongelijk, zelfs als de waarden hetzelfde zijn.

### Input: Pointer Events API + `setPointerCapture`

Pointer Events werken uniform op muis, touch en stylus. `setPointerCapture` zorgt dat drag-events blijven binnenkomen op het oorspronkelijke element, ook als de pointer daarbuiten beweegt — dit is essentieel voor drag op mobiel. Let op: het grid-element heeft `touch-action: none` nodig in CSS, anders scrollt de browser mee tijdens het slepen.

---

## Modules

Elke module heeft een eigen README met meer detail:

- [`src/lib/README.md`](src/lib/README.md) — hex-grid-utils, puzzle-state, scenario-format, use-drag
- [`src/components/README.md`](src/components/README.md) — HexTile component

---

## Puzzelformaat

Puzzels worden beschreven in JSON. Een minimaal voorbeeld:

```json
{
  "version": 1,
  "id": "mijn-puzzel-001",
  "title": "Mijn eerste puzzel",
  "grid": { "shape": "rhombus", "size": 4 },
  "tiles": [
    { "q": 0, "r": 0, "terrain": "plains", "unit": { "type": "warrior", "owner": "player1" } },
    { "q": 1, "r": 0, "terrain": "forest" }
  ]
}
```

Zie [`src/data/example-puzzle.json`](src/data/example-puzzle.json) voor een volledig voorbeeld, en [`src/lib/README.md`](src/lib/README.md) voor de volledige schemadocumentatie.

---

## Tests

```bash
npm test              # eenmalig alle tests uitvoeren
npm run test:watch    # herstart tests automatisch bij bestandswijzigingen
```

Er zijn 31 unit-tests verdeeld over drie bestanden:

| Testbestand | Wat wordt getest |
|---|---|
| `src/lib/hex-grid-utils.test.ts` | Neighbours, afstand, pixel-conversie (round-trip) |
| `src/lib/puzzle-state.test.ts` | PLACE_UNIT, UNDO, REDO, RESET, history-cap |
| `src/lib/scenario-format.test.ts` | Validatie van geldig/ongeldig JSON, ontbrekende velden, onbekende types |

Tests draaien via [Vitest](https://vitest.dev/) in een Node-omgeving — geen browser of rendering nodig.

---

## Verder bouwen

De basis-infrastructuur staat. De logische volgende stappen zijn:

1. **Vervang `App.tsx`** met een echte puzzel-UI: laad een `PuzzleScenario`, render de tegels met `<HexTile>`, koppel `puzzleReducer` via `useReducer`
2. **Bouw een `HexGrid`-component** die een `board` van tiles omzet naar een SVG met meerdere `<HexTile>`-elementen
3. **Koppel `useDrag`** aan het grid voor drag-interacties
4. **Voeg meer acties toe** aan de reducer (bijv. `MOVE_UNIT`, `REMOVE_UNIT`)
5. **Voeg `localStorage`-persistentie toe** — de state is al volledig serialiseerbaar

### Beginnen met een grid renderen

```tsx
import { useReducer } from 'react';
import { puzzleReducer, createInitialState } from './lib/puzzle-state';
import { HexTile } from './components/HexTile';
import scenarioData from './data/example-puzzle.json';
import { validateScenario } from './lib/scenario-format';

const scenario = validateScenario(scenarioData);
const initialBoard = Object.fromEntries(
  scenario.tiles.map(t => [`${t.q},${t.r}`, { terrain: t.terrain, unit: t.unit }])
);

function PuzzleView() {
  const [state, dispatch] = useReducer(puzzleReducer, createInitialState(initialBoard));

  return (
    <svg width={600} height={600} viewBox="-200 -200 400 400">
      {scenario.tiles.map(tile => (
        <HexTile
          key={`${tile.q},${tile.r}`}
          q={tile.q}
          r={tile.r}
          terrain={state.board[`${tile.q},${tile.r}`]?.terrain ?? 'plains'}
          onClick={(q, r) => dispatch({ type: 'PLACE_UNIT', coord: { q, r }, unit: { type: 'warrior', owner: 'player1' } })}
        />
      ))}
    </svg>
  );
}
```
