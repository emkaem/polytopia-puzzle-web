## ADDED Requirements

### Requirement: Pointer Events voor drag
De drag-implementatie SHALL uitsluitend Pointer Events gebruiken (`onPointerDown`, `onPointerMove`, `onPointerUp`) en GEEN aparte Touch Events of Mouse Events implementeren.

#### Scenario: Drag start op pointer down
- **WHEN** de gebruiker een pointer-down event activeert op een element
- **THEN** start de drag-state en wordt `setPointerCapture` aangeroepen met het bijbehorende `pointerId`

#### Scenario: Pointer move buiten element volgt drag
- **WHEN** de pointer na dragstart buiten het originele element beweegt
- **THEN** blijft het element `pointermove` events ontvangen dankzij pointer capture

### Requirement: setPointerCapture bij dragstart
De implementatie SHALL `element.setPointerCapture(event.pointerId)` aanroepen in de `onPointerDown`-handler wanneer een drag-interactie begint.

#### Scenario: Pointer capture is actief na dragstart
- **WHEN** `onPointerDown` wordt geactiveerd en drag begint
- **THEN** is `element.hasPointerCapture(pointerId)` `true`

### Requirement: touch-action none op grid-element
Het grid-element SHALL `touch-action: none` als CSS-property hebben om browser-scroll tijdens drag te voorkomen op mobiel.

#### Scenario: Geen scroll tijdens drag op touch-scherm
- **WHEN** de gebruiker op een touch-scherm een drag-beweging maakt op het grid
- **THEN** scrolt de pagina niet mee tijdens de drag

### Requirement: Drag eindigt op pointer up of cancel
De drag-state SHALL worden beëindigd bij zowel `onPointerUp` als `onPointerCancel`.

#### Scenario: Drag stopt op pointer up
- **WHEN** de gebruiker de pointer loslaat
- **THEN** eindigt de drag-state en wordt pointer capture vrijgegeven

#### Scenario: Drag stopt op pointer cancel
- **WHEN** een `pointercancel` event optreedt (bijv. door een OS-interrupt)
- **THEN** eindigt de drag-state schoon zonder actieve capture
