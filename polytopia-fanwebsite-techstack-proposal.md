# OpenSpec Proposal: Polytopia fan-website techstack

**Datum:** 2026-07-25
**Status:** Voorstel / ter review
**Gebaseerd op:** `polytopia-fanwebsite-techstack.md`

---

## Samenvatting

Dit document bevat een kritische review van de voorgestelde techstack voor de Polytopia fan-website, inclusief aanbevelingen, aandachtspunten en voorgestelde aanpassingen.

De gekozen stack is solide en pragmatisch voor de schaal van het project. Er zijn geen fundamentele fouten, wel een aantal verbeterpunten en ontbrekende keuzes die vroeg gemaakt moeten worden.

---

## Review per onderdeel

### 1. SVG vs Canvas

**Oordeel: Correct.**

SVG is de betere keuze bij <200 tegels:

- DOM hit-detection is gratis (geen handmatige x/y → hex omrekening)
- Debuggen in DevTools is eenvoudiger dan Canvas
- Accessibility is mogelijk via `aria-label` op `<polygon>`-elementen
- Re-renders zijn prima te beheren binnen React

**Aandachtspunt:** React re-rendert de hele SVG-boom bij state-wijzigingen. Bij 150+ tegels met animaties kan dit merkbaar worden. Oplossing: `React.memo` op de tegel-component zodat alleen gewijzigde tegels re-renderen.

**Canvas pas relevant als:** vloeiende animaties nodig zijn (bewegende units, explosies, fog-of-war). Voor statische puzzelstates is SVG toereikend.

---

### 2. `honeycomb-grid` library

**Oordeel: Functioneel goed, maar aandachtspunten.**

- **TypeScript types:** v4 heeft verbeterde types t.o.v. v3, maar de generics zijn soms onhandig. Controleer actieve versie via `npm info honeycomb-grid version`.
- **Onderhoud:** kleine community, trage release-cadans. Niet alarmerend voor puzzelschaal, maar wees voorbereid bugs zelf te fixen of omheen te werken.

**Aanbevolen alternatief om te overwegen:** eigen hex-utils op basis van de [redblobgames hex-grid algoritmes](https://www.redblobgames.com/grids/hexagons/). De benodigde functies (neighbors, distance, pathfinding) zijn in ~100 regels TypeScript te schrijven. Voordelen: nul dependency-risico, volledige controle, geen afhankelijkheid van externe onderhoudscadans.

---

### 3. Pointer Events API

**Oordeel: Volledig correct. Geen missende onderdelen.**

Twee aanvullingen:

- **Pointer capture:** gebruik `element.setPointerCapture(e.pointerId)` bij drag-gedrag. Voorkomt dat de pointer "ontsnapt" bij snelle bewegingen buiten het element.
- **iOS Safari:** test expliciet op iOS Safari. `touch-action: none` gedraagt zich daar soms anders dan verwacht, met name bij scroll-containers rondom het spelbord.

---

### 4. State management

**Oordeel: Zustand is een logische stap, maar er is een betere fit voor puzzel-state.**

**Aanbeveling: `useReducer` + `immer`**

Voor puzzels heb je typisch:
- Een enkelvoudige gamestate (board, units, beurt)
- Undo/redo via een history-stack
- Scenario-laden via JSON → state

`useReducer` geeft een command-patroon dat goed aansluit bij undo. `immer` voegt immutable updates toe zonder boilerplate. Dit is lichter dan Zustand en sluit beter aan bij de "puzzel als toestandsmachine"-aanpak.

Zustand wordt pas relevant bij **meerdere losstaande state-slices** (bijv. UI-state, game-state, user-progress) die onafhankelijk moeten re-renderen.

**Save states:** houd de gamestate serialiseerbaar (plain objects, geen class-instances). Dan volstaat `JSON.stringify(state)` naar `localStorage` zonder extra tooling.

---

## Ontbrekende keuzes (nog te maken)

| Onderwerp | Aanbeveling |
|---|---|
| **Testing** | Vitest voor unit-tests op spelmechanica-logica, los van rendering. Spelregels zijn goed unit-testbaar. |
| **Scenario-formaat** | Definieer vroeg hoe puzzels worden opgeslagen (JSON, TypeScript-objecten, etc.). Dit is een architectuurkeuze die later pijn geeft als ze uitgesteld wordt. |
| **Coordinatensysteem** | Kies expliciet tussen axial, offset of cube coordinates en documenteer dit. Voorkomt verwarring bij uitbreiding. |

---

## Voorgestelde aanpassingen t.o.v. originele stack

| Onderdeel | Origineel | Voorstel |
|---|---|---|
| Hex-grid wiskunde | `honeycomb-grid` | Eigen hex-utils (overweging) of `honeycomb-grid` v4 met bewuste keuze |
| State management | `useState`/`useReducer`, evt. Zustand | `useReducer` + `immer` als primaire keuze; Zustand pas bij meerdere slices |
| Drag-input | Pointer Events API | Pointer Events API + expliciete `setPointerCapture` bij drag |

---

## Ongewijzigde keuzes (bevestigd correct)

- **React + TypeScript + Vite** — geen bezwaren
- **SVG voor hex-grid rendering** — correct voor de projectschaal
- **Tailwind CSS** — geen bezwaren
- **Vercel of Cloudflare Pages** — beide prima voor experimenteerfase
- **Geen Phaser/PixiJS** — terecht uitgesloten voor deze schaal
- **PWA als latere overweging** — logische volgorde

---

## Conclusie

De stack is goed doordacht en geschikt voor het doel. De twee meest impactvolle aanpassingen zijn:

1. Overweeg `honeycomb-grid` te vervangen door eigen hex-utils voor minder dependency-risico.
2. Kies bewust voor `useReducer` + `immer` i.p.v. Zustand als undo/history centraal staat.

Maak daarnaast vroeg een beslissing over het scenario-formaat en het coordinatensysteem, zodat die keuzes de architectuur kunnen sturen in plaats van later te beperken.
