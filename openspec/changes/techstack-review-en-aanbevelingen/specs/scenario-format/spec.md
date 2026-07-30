## ADDED Requirements

### Requirement: Puzzel JSON-schema
Elk puzzel-bestand SHALL een geldig JSON-object zijn dat voldoet aan het gedefinieerde schema met verplichte velden: `id`, `title`, `version`, `grid`, `tiles`.

#### Scenario: Geldig puzzel-bestand laden
- **WHEN** een JSON-bestand met alle verplichte velden wordt ingelezen
- **THEN** slaagt validatie zonder fouten

#### Scenario: Ontbrekend verplicht veld geeft fout
- **WHEN** een JSON-bestand zonder het `id`-veld wordt gevalideerd
- **THEN** geeft validatie een beschrijvende foutmelding terug

### Requirement: Tile-structuur
Elke tile in `tiles` SHALL minimaal de velden `q: number`, `r: number` en `terrain: string` bevatten. Het veld `unit` is optioneel.

#### Scenario: Tile zonder unit is geldig
- **WHEN** een tile `{ q: 0, r: 0, terrain: "forest" }` aanwezig is
- **THEN** slaagt validatie voor die tile

#### Scenario: Tile met unit is geldig
- **WHEN** een tile `{ q: 0, r: 0, terrain: "plains", unit: { type: "warrior", owner: "player1" } }` aanwezig is
- **THEN** slaagt validatie voor die tile

### Requirement: Versieveld
Elk puzzel-bestand SHALL een `version: number` veld bevatten, te beginnen bij `1`, zodat toekomstige migraties mogelijk zijn.

#### Scenario: Bestand zonder versieveld is ongeldig
- **WHEN** een JSON-bestand zonder `version` wordt gevalideerd
- **THEN** geeft validatie een fout die het ontbrekende veld noemt

### Requirement: Objectives zijn optioneel maar gestructureerd
Het veld `objectives` is optioneel. Als het aanwezig is, SHALL elk objective minimaal `type` bevatten met een van de waarden `"capture"`, `"survive"` of `"reach"`.

#### Scenario: Onbekend objective-type is ongeldig
- **WHEN** een objective met `type: "unknown"` aanwezig is
- **THEN** geeft validatie een fout
