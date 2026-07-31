## Why

The site needs a Battle for Polytopia damage calculator page where players can simulate combat outcomes before making in-game decisions. The existing third-party calculator (polytopia-damage-calculator.firebaseapp.com) is functional but has limited UX — plain number inputs, no visual feedback, and no clear ordering for multi-attacker scenarios.

## What Changes

- Add a new `/calculator` route and page to the existing React app
- Implement the Polytopia v116 damage formula as a pure TypeScript utility
- Build a card-based UI with unit selection (Warrior, Archer, Rider), HP input (number field + drag slider), and toggle bonuses
- Support multiple attackers attacking a single defender in sequence — order matters because each attacker sees the defender's updated HP
- Allow drag-to-reorder attackers to change the attack sequence
- Add an Archer-specific toggle: whether the Archer retaliates in melee (range vs. no retaliation)

## Capabilities

### New Capabilities

- `battle-formula`: Core damage calculation engine — pure functions implementing the v116 Polytopia formula (attackForce, defenceForce, attackResult, defenceResult) with support for defence multipliers (WALL ×4, DEF ×1.5, POIS ×0.5) and the stiff/surprise skill flags
- `calculator-page`: The `/calculator` route and page — unit cards for attacker(s) and defender, HP slider+input, bonus toggles, attack order management, and live result display

### Modified Capabilities

_(none)_

## Impact

- New route added to `src/pages/` and registered in the router
- New components added under `src/components/calculator/`
- New data file `src/data/units.ts` with v116 stats for Warrior, Archer, Rider
- New utility `src/lib/battleCalc.ts` with pure calculation functions
- No existing pages or components modified
- No new dependencies required (React + TypeScript already available)
