## ADDED Requirements

### Requirement: Axial coordinate type
De module SHALL een `HexCoord` type exporteren dat een hex-cel beschrijft als `{ q: number; r: number }` in het axial coordinatensysteem.

#### Scenario: HexCoord aanmaken
- **WHEN** een coord wordt aangemaakt als `{ q: 1, r: -1 }`
- **THEN** is het een geldig `HexCoord` object zonder aanvullende transformatie

### Requirement: Neighbours berekenen
De module SHALL een functie `hexNeighbors(h: HexCoord): HexCoord[]` bieden die de 6 aangrenzende hexen teruggeeft.

#### Scenario: Neighbours van oorsprong
- **WHEN** `hexNeighbors({ q: 0, r: 0 })` wordt aangeroepen
- **THEN** geeft de functie exact 6 unieke `HexCoord` objecten terug

#### Scenario: Neighbours zijn symmetrisch
- **WHEN** coord B voorkomt in `hexNeighbors(A)`
- **THEN** MOET coord A voorkomen in `hexNeighbors(B)`

### Requirement: Afstand berekenen
De module SHALL een functie `hexDistance(a: HexCoord, b: HexCoord): number` bieden die de minimale stapafstand teruggeeeft.

#### Scenario: Afstand tot zichzelf is nul
- **WHEN** `hexDistance(a, a)` wordt aangeroepen
- **THEN** geeft de functie `0` terug

#### Scenario: Afstand tot directe buur is één
- **WHEN** `hexDistance(a, b)` wordt aangeroepen en b een directe buur van a is
- **THEN** geeft de functie `1` terug

#### Scenario: Afstand is symmetrisch
- **WHEN** `hexDistance(a, b)` wordt berekend
- **THEN** is de waarde gelijk aan `hexDistance(b, a)`

### Requirement: Pixel-conversie (flat-top)
De module SHALL functies `hexToPixel(h: HexCoord, size: number): { x: number; y: number }` en `pixelToHex(x: number, y: number, size: number): HexCoord` bieden voor flat-top hexagonen.

#### Scenario: Oorsprong converteert naar nulpunt
- **WHEN** `hexToPixel({ q: 0, r: 0 }, size)` wordt aangeroepen
- **THEN** geeft de functie `{ x: 0, y: 0 }` terug

#### Scenario: Round-trip pixel → hex → pixel
- **WHEN** een pixel-punt wordt omgezet naar een hex en vervolgens terug naar pixel
- **THEN** ligt de uitkomst binnen 1 pixel van het originele punt
