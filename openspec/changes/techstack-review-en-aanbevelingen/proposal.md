## Why

De initiële techstack voor de Polytopia fan-website is informeel opgesteld. Voor een duurzame basis — met name rond state management, hex-grid wiskunde en cross-device input — moeten een aantal keuzes worden herzien en ontbrekende beslissingen worden gemaakt voordat de implementatie start.

## What Changes

- Vervang of beperk de afhankelijkheid van `honeycomb-grid` door gebruik te maken van eigen hex-utils gebaseerd op de redblobgames-formules
- Vervang Zustand als primaire state-optie door `useReducer` + `immer` als betere fit voor puzzel-state met undo/history
- Voeg `React.memo` toe als standaard op de tegel-component om onnodige SVG-herrendering te voorkomen
- Voeg expliciet `setPointerCapture` toe aan de drag-implementatie
- Definieer het scenario/puzzle-formaat vroeg (JSON-structuur)
- Leg het coordinatensysteem (axial/offset/cube) expliciet vast
- Voeg Vitest toe als test-tooling voor spelmechanica-logica

## Capabilities

### New Capabilities
- `hex-grid-utils`: Eigen implementatie van hex-grid wiskunde (neighbors, distance, pathfinding) op basis van axial coordinates, zonder externe library-afhankelijkheid
- `puzzle-state-machine`: State management voor puzzels via `useReducer` + `immer`, inclusief undo/redo via history-stack en serialiseerbare state voor `localStorage`
- `scenario-format`: Gedefinieerd JSON-formaat voor het beschrijven van puzzels en scenario's (startopstelling, doelcondities, beperkingen)
- `pointer-input`: Cross-device input via Pointer Events API met `setPointerCapture` voor drag-gedrag en expliciete iOS Safari-compatibiliteit

### Modified Capabilities

## Impact

- **Afhankelijkheden:** `honeycomb-grid` mogelijk verwijderd of scope beperkt; `immer` toegevoegd; Zustand niet toegevoegd als primaire keuze
- **Architectuur:** Coordinatensysteem (axial) en scenario-formaat worden vroeg vastgelegd en zijn leidend voor verdere implementatie
- **Testing:** Vitest wordt opgezet voor unit-tests op spelmechanica-logica, los van rendering
- **Rendering:** `React.memo` op tegel-component als standaard patroon
- **Geen breaking changes:** project bevindt zich nog in experimenteerfase, er is nog geen bestaande codebase
