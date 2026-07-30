## Context

De Polytopia fan-website bevindt zich in de vroege experimenteerfase. Er is nog geen productiecodebase; alle beslissingen worden nu gemaakt voordat implementatie start. De initiële techstack was informeel samengesteld. Dit design legt de definitieve architectuurkeuzes vast op vier kritieke gebieden: hex-grid wiskunde, state management, rendering-optimalisatie en pointer-input. Tevens wordt het scenario/puzzle-formaat gedefinieerd en de test-tooling opgezet.

De applicatie is een React + TypeScript + Vite project, bedoeld voor het tonen en spelen van Polytopia-puzzels in de browser op zowel desktop als mobiel (inclusief iOS Safari).

## Goals / Non-Goals

**Goals:**
- Vastleggen van het axial coordinatensysteem als enige coördinatenrepresentatie in de codebase
- Definiëren van een JSON-formaat voor puzzels/scenario's dat als bron van waarheid dient
- Kiezen van `useReducer` + `immer` als state management voor puzzel-state, met undo/redo ondersteuning
- Opzetten van `React.memo` als standaardpatroon op de tegel-component
- Definiëren van cross-device input via Pointer Events API met `setPointerCapture`
- Opzetten van Vitest voor unit-tests op spellogica los van rendering
- Verwijderen of sterk inperken van de `honeycomb-grid` dependency

**Non-Goals:**
- Multiplayer of server-side state
- Animaties of transitie-systemen
- Internationalisatie (i18n)
- Volledige implementatie van alle Polytopia-spelregels — alleen puzzel-mechanica die nodig is voor de fan-site

## Decisions

### 1. Hex-grid coördinaten: Axial (redblobgames-formules), geen externe library

**Keuze:** Eigen `hex-utils` module op basis van axial coordinates, gebaseerd op de formules van [redblobgames.com](https://www.redblobgames.com/grids/hexagons/).

**Rationale:** `honeycomb-grid` voegt abstractielagen toe (klassen, instanties) die wrijving geven bij serialisatie, testen en de specifieke Polytopia-gridvorm. De redblobgames-formules zijn goed gedocumenteerd, compact en stabiel. Axial coordinates (`q`, `r`) zijn de minimale representatie; cube-coordinates worden alleen lokaal gebruikt in berekeningen die dat vereisen (bijv. afstand).

**Alternatieven overwogen:**
- `honeycomb-grid` behouden: meer abstractie maar meer overhead; niet waard voor dit project
- Offset coordinates: intuïtief voor grids maar omslachtig voor neighbour-berekeningen en pathfinding

**Interface (schets):**
```ts
type HexCoord = { q: number; r: number };
function hexNeighbors(h: HexCoord): HexCoord[];
function hexDistance(a: HexCoord, b: HexCoord): number;
function hexToPixel(h: HexCoord, size: number): { x: number; y: number };
function pixelToHex(x: number, y: number, size: number): HexCoord;
```

---

### 2. State management: `useReducer` + `immer`, geen Zustand

**Keuze:** Puzzel-state wordt beheerd via React's `useReducer` in combinatie met `immer` voor immutable updates. Een history-stack (`past: State[], future: State[]`) zit in dezelfde reducer voor undo/redo.

**Rationale:** Puzzel-state is sequentieel en actiegericht (zet een unit, verplaats, reset). Een reducer sluit hier natuurlijk op aan. `immer` elimineert de boilerplate van handmatige spreads in complexe nested state. De state is serialiseerbaar naar JSON, wat `localStorage`-persistentie triviaal maakt. Zustand biedt geen voordeel voor dit gebruik: het is primarily voor globale UI-state, niet voor deterministisch spelgedrag met history.

**Alternatieven overwogen:**
- Zustand: geschikt voor globale UI-state (sidebar open/dicht, thema), maar geen ingebouwde reducer-semantiek of undo-patroon
- XState: krachtig, maar veel overhead voor een fan-site puzzel
- Plain `useState`: te veel lokale coordinatie nodig bij undo/redo

**State-schets:**
```ts
type PuzzleState = {
  board: Record<string, Tile>; // key: "q,r"
  turn: number;
  history: PuzzleState[];
  future: PuzzleState[];
};
type PuzzleAction =
  | { type: 'PLACE_UNIT'; coord: HexCoord; unit: Unit }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };
```

---

### 3. Rendering: `React.memo` op tegel-component als standaard

**Keuze:** De `<HexTile>` component wordt standaard gewrapped met `React.memo`. Props zijn primitief of stabiel (coord als `q`/`r` getallen, niet als object-reference).

**Rationale:** Een hex-grid kan 50–200+ tegels bevatten. Bij elke state-update zonder memo herrendert de volledige grid. `React.memo` is laagdrempelig en effectief als tegels stabiele props krijgen. Coord als twee losse getallen (`q`, `r`) in plaats van een object vermijdt referentie-instabiliteit.

**Alternatieven overwogen:**
- Virtualisatie (react-window): te vroeg en te complex; memo volstaat voor dit schaalbereik
- Geen optimalisatie: acceptabel voor klein grid, maar memo is gratis als props stabiel zijn

---

### 4. Pointer-input: Pointer Events API met `setPointerCapture`

**Keuze:** Drag-interacties worden geïmplementeerd via `onPointerDown`, `onPointerMove`, `onPointerUp` met `element.setPointerCapture(event.pointerId)` bij dragstart.

**Rationale:** Pointer Events werken uniform op muis, touch en stylus. `setPointerCapture` zorgt dat `pointermove`/`pointerup` events naar het originele element gaan, ook als de pointer buiten het element beweegt — essentieel voor drag op mobiel. iOS Safari ondersteunt Pointer Events volledig vanaf iOS 13.

**Alternatieven overwogen:**
- Touch Events + Mouse Events apart: verdubbelt code, moeilijk te combineren
- Hammer.js of andere gesture-library: onnodige dependency voor het beperkte drag-gebruik hier

---

### 5. Scenario/puzzle-formaat: JSON

**Keuze:** Puzzels worden beschreven in een JSON-formaat met de volgende structuur:

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "grid": {
    "shape": "rhombus" | "hexagon" | "rectangle",
    "size": number
  },
  "tiles": [
    { "q": number, "r": number, "terrain": "string", "unit"?: { "type": "string", "owner": "string" } }
  ],
  "objectives": [
    { "type": "capture" | "survive" | "reach", "target": "string | HexCoord", "turns"?: number }
  ],
  "constraints": {
    "maxTurns"?: number,
    "allowedUnits"?: ["string"]
  }
}
```

**Rationale:** JSON is direct serialiseerbaar, versiebeheervriendelijk, en importeerbaar zonder build-stap. Het formaat is intentioneel plat gehouden — geen geneste objectgrafen die moeilijk te difften zijn.

---

### 6. Test-tooling: Vitest

**Keuze:** Vitest voor unit-tests op spellogica (hex-utils, reducer, scenario-validatie).

**Rationale:** Vitest is native Vite-geïntegreerd, snel, en ondersteunt TypeScript zonder extra configuratie. Tests voor spellogica zijn pure functietests — geen rendering nodig.

**Alternatieven overwogen:**
- Jest: werkt, maar vereist extra Vite/TS-configuratie; geen voordeel boven Vitest in dit project
- Playwright/Cypress: voor e2e, niet voor unit-tests op spellogica

## Risks / Trade-offs

- **Eigen hex-utils onderhoud** → We beperken de scope tot neighbors, distance, pixel-conversie en één pathfinding-variant (BFS). Geen volledige hex-library. Als scope groeit, herbeoordelen of een library toch de moeite waard is.
- **`immer` bundle-size** → immer voegt ~14 kB (gzip) toe. Acceptabel voor een fan-site; monitor met `vite-bundle-visualizer` als het een issue wordt.
- **iOS Safari drag-gedrag** → `setPointerCapture` werkt op iOS 13+, maar er zijn edge cases bij scroll vs drag. Mitigatie: expliciete `touch-action: none` CSS op het grid-element.
- **History-stack geheugengebruik** → Bij grote grids en lange sessies kan de history-stack groeien. Mitigatie: cap de history op 50 stappen.
- **JSON-formaat evolutie** → Als het puzzelformaat wijzigt, zijn oude puzzel-bestanden incompatibel. Mitigatie: versieveld (`"version": 1`) toevoegen vanaf het begin.
