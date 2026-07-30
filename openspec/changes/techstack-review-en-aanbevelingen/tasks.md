## 1. Project setup

- [x] 1.1 Verwijder `honeycomb-grid` uit package.json en verwijder eventuele imports
- [x] 1.2 Voeg `immer` toe als dependency
- [x] 1.3 Installeer en configureer `vitest` inclusief `vitest.config.ts`

## 2. hex-grid-utils

- [x] 2.1 Maak `src/lib/hex-grid-utils.ts` aan met het `HexCoord` type
- [x] 2.2 Implementeer `hexNeighbors(h: HexCoord): HexCoord[]`
- [x] 2.3 Implementeer `hexDistance(a: HexCoord, b: HexCoord): number`
- [x] 2.4 Implementeer `hexToPixel(h: HexCoord, size: number): { x: number; y: number }` (flat-top)
- [x] 2.5 Implementeer `pixelToHex(x: number, y: number, size: number): HexCoord` (flat-top, met rounding)
- [x] 2.6 Schrijf unit-tests in `src/lib/hex-grid-utils.test.ts`

## 3. puzzle-state-machine

- [x] 3.1 Definieer `Tile`, `Unit`, `PuzzleState` en `PuzzleAction` types in `src/lib/puzzle-state.ts`
- [x] 3.2 Implementeer `puzzleReducer` met `immer` voor `PLACE_UNIT`
- [x] 3.3 Voeg `UNDO`-ondersteuning toe aan de reducer (past → current → future)
- [x] 3.4 Voeg `REDO`-ondersteuning toe aan de reducer
- [x] 3.5 Voeg `RESET`-actie toe aan de reducer
- [x] 3.6 Begrens de `past`-stack tot maximaal 50 entries
- [x] 3.7 Schrijf unit-tests in `src/lib/puzzle-state.test.ts`

## 4. scenario-format

- [x] 4.1 Definieer het `PuzzleScenario` TypeScript type in `src/lib/scenario-format.ts`
- [x] 4.2 Schrijf een `validateScenario(data: unknown): PuzzleScenario` validatiefunctie (geeft fout bij ontbrekende velden)
- [x] 4.3 Maak een voorbeeldpuzzel `src/data/example-puzzle.json` die voldoet aan het schema
- [x] 4.4 Schrijf unit-tests voor validatie in `src/lib/scenario-format.test.ts`

## 5. pointer-input

- [x] 5.1 Maak `src/lib/use-drag.ts` aan: een React hook die drag-state beheert via Pointer Events
- [x] 5.2 Zorg dat `setPointerCapture` wordt aangeroepen bij dragstart in `onPointerDown`
- [x] 5.3 Beëindig drag-state en release capture op zowel `onPointerUp` als `onPointerCancel`
- [x] 5.4 Documenteer gebruik van `touch-action: none` op het grid-element in een commentaar of README-notitie

## 6. React.memo op tegel-component

- [x] 6.1 Maak `src/components/HexTile.tsx` aan (of pas bestaande aan) met `React.memo`
- [x] 6.2 Zorg dat coord als losse primitieven (`q: number`, `r: number`) worden doorgegeven, niet als object-reference
