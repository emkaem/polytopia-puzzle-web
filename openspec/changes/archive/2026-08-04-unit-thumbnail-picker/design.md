## Context

The calculator page currently uses a text-based `<select>` dropdown inside each `UnitCard` to choose a unit, and a small "+ Add attacker" button to create new attacker slots. The game has 24 units with distinct sprites already bundled as assets. Users benefit from a visual, thumbnail-based selection surface that is discoverable at a glance.

The existing `UNITS` array in `src/data/units.ts` already carries `image`, `tribe`, and `id` per unit — all the data needed for a thumbnail grid and tribe-based filtering.

## Goals / Non-Goals

**Goals:**
- Replace the "+ Add attacker" ghost button with a visual `UnitPickerPanel` thumbnail grid.
- Render the panel below the calculator grid so it is always visible.
- Clicking a unit thumbnail adds that unit as a new attacker (respects 5-unit cap).
- Include a filter bar (by tribe: Normal, Cymanti, Aquarion, Elyrion, Polaris) that narrows the visible thumbnails.
- Keep the existing per-card `UnitSelect` dropdown so users can still swap a unit's type after adding it.

**Non-Goals:**
- Adding thumbnails to the defender slot via the picker (defender is a single slot, always visible).
- Persisting filter state across sessions.
- A "type" filter beyond tribe grouping (deferred for later).

## Decisions

### New component: `UnitPickerPanel`

A standalone `src/components/calculator/UnitPickerPanel.tsx` receives:
- `onPick(unitId: string): void` — called when a thumbnail is clicked.
- `disabled: boolean` — true when `attackers.length >= MAX_ATTACKERS`.

**Rationale:** Keeping it a dumb, prop-driven component simplifies testing and lets `CalculatorPage` own all state — consistent with the current architecture where `UnitCard` is also stateless/controlled.

### Filter state: local to `UnitPickerPanel`

Tribe filter selection is kept as `useState` inside `UnitPickerPanel`, not lifted to `CalculatorPage`.

**Rationale:** The filter is purely a display concern with no impact on battle simulation state. Lifting it would add noise to `CalculatorPage` with no benefit.

### Layout: full-width panel below the grid

The picker panel renders as a full-width section beneath the `.calc-grid`. Thumbnails use a CSS flex-wrap row with a fixed thumbnail size (≈56 px), so they reflow naturally on narrow screens.

**Rationale:** Placing it below (rather than in a sidebar or modal) keeps the layout simple and doesn't require restructuring the existing 3-column grid.

### Thumbnail images: use existing `unit.image` (attacker sprite)

Reuse the already-imported attacker-facing sprites for the picker.

**Rationale:** Attacker sprites are already bundled; adding a separate set of picker-specific sprites is unnecessary scope creep.

## Risks / Trade-offs

- [Risk] 24 thumbnails may feel cluttered without pagination → Mitigation: tribe filter reduces visible set to ≤8 units typically; further filtering can be added later.
- [Risk] The panel is always visible even when the cap is reached → Mitigation: thumbnails are visually dimmed and clicks are no-ops when `disabled` is true; a short tooltip/label explains the cap.
