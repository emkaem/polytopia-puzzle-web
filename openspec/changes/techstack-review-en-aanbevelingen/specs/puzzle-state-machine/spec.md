## ADDED Requirements

### Requirement: Puzzel-state type
De module SHALL een `PuzzleState` type definiëren met minimaal: `board: Record<string, Tile>`, `turn: number`, `past: PuzzleState[]`, `future: PuzzleState[]`.

#### Scenario: Initiële state heeft lege history
- **WHEN** een nieuwe puzzel wordt geïnitialiseerd
- **THEN** zijn `past` en `future` beide lege arrays en is `turn` gelijk aan `0`

### Requirement: Reducer verwerkt acties
De module SHALL een `puzzleReducer(state: PuzzleState, action: PuzzleAction): PuzzleState` functie bieden die immutable updates uitvoert via `immer`.

#### Scenario: PLACE_UNIT voegt een unit toe aan het bord
- **WHEN** de actie `{ type: 'PLACE_UNIT', coord, unit }` wordt gedispatcht
- **THEN** staat de unit op de opgegeven coord in `board` en is `turn` met 1 verhoogd

#### Scenario: Onbekende actie wijzigt de state niet
- **WHEN** een onbekend action-type wordt gedispatcht
- **THEN** geeft de reducer de bestaande state ongewijzigd terug

### Requirement: Undo
De reducer SHALL een `UNDO`-actie ondersteunen die de vorige state herstelt.

#### Scenario: Undo na een actie
- **WHEN** een actie wordt uitgevoerd en daarna `UNDO` wordt gedispatcht
- **THEN** is de state gelijk aan de state vóór die actie, en is de actie verplaatst naar `future`

#### Scenario: Undo zonder history doet niets
- **WHEN** `UNDO` wordt gedispatcht terwijl `past` leeg is
- **THEN** blijft de state ongewijzigd

### Requirement: Redo
De reducer SHALL een `REDO`-actie ondersteunen die een ongedane actie opnieuw toepast.

#### Scenario: Redo na undo
- **WHEN** een actie wordt uitgevoerd, daarna `UNDO`, daarna `REDO`
- **THEN** is de state gelijk aan de state na de oorspronkelijke actie

### Requirement: Reset
De reducer SHALL een `RESET`-actie ondersteunen die de state terugzet naar de opgegeven beginstate.

#### Scenario: Reset wist board en history
- **WHEN** `{ type: 'RESET', initialState }` wordt gedispatcht
- **THEN** is `board` gelijk aan `initialState.board`, zijn `past` en `future` leeg

### Requirement: History-cap
De reducer SHALL de `past`-stack beperken tot maximaal 50 entries om geheugengebruik te begrenzen.

#### Scenario: History groeit niet voorbij 50
- **WHEN** meer dan 50 acties worden uitgevoerd
- **THEN** bevat `past` niet meer dan 50 entries
