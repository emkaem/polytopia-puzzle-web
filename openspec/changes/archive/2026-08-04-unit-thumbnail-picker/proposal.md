## Why

Selecting a unit via the current dropdown in each `UnitCard` is slow and low-visibility — users must open a small select control and scan a text list. Replacing the "+ Add attacker" button with a visual thumbnail grid makes unit selection faster and more intuitive, matching the visual style of the game.

## What Changes

- Remove the "+ Add attacker" ghost button from the calculator page.
- Add a **Unit Picker Panel** below the attacker/defender columns that displays all unit thumbnails as clickable tiles.
- Clicking a thumbnail adds that unit as a new attacker (up to the existing 5-attacker cap).
- The panel is also displayed below the chosen units (attacker list) so users can see available units in context.
- A **filter bar** is included in the panel (tribe / type filters) — UI is built now, filter logic wired in the same change.

## Capabilities

### New Capabilities

- `unit-thumbnail-picker`: A visual panel showing all unit thumbnails that the user can click to add an attacker; includes a filter bar to narrow units by tribe or type.

### Modified Capabilities

- (none — the `UnitCard` unit-select dropdown for changing an already-added unit's type is kept as-is)

## Impact

- `src/pages/CalculatorPage.tsx` — remove add-attacker button, add `UnitPickerPanel` component below the grid.
- New component `src/components/calculator/UnitPickerPanel.tsx`.
- `src/data/units.ts` — no changes needed; `UNITS` array and `tribe` field already available.
- No API or routing changes.
