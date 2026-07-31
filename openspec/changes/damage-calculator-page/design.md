## Context

The project is a React 19 + TypeScript + Vite fan site for Battle for Polytopia. It has two existing pages (Home, Puzzles) with a shared nav/footer shell. We're adding a third page: a damage calculator.

The Polytopia v116 damage formula is a known, stable algorithm extracted from the existing third-party calculator. The key insight is that **order matters** in multi-attacker scenarios: each attacker sees the defender's HP as modified by all previous attacks in the sequence.

## Goals / Non-Goals

**Goals:**
- Pure TypeScript damage formula that can be tested in isolation
- Card-based UI: one defender card, one or more attacker cards
- HP controlled via both a number input and a range slider (synced)
- Bonus toggles per unit: WALL / DEF / POIS for defender; VET / POIS for attackers
- Archer-specific toggle: does the Archer retaliate (range = no retaliation = `stiff` flag on) or melee (retaliate normally)?
- Attack order managed via drag-to-reorder attacker list; results update live as order changes
- Results shown per-attacker (damage dealt, damage taken, surviving HP) and final defender HP

**Non-Goals:**
- Units beyond Warrior, Archer, Rider
- Game versions other than v116
- Multiple defenders
- Mobile/touch drag-and-drop optimisation (desktop first)
- Saving/sharing calculator state via URL

## Decisions

### 1. Formula as pure functions in `src/lib/battleCalc.ts`

**Decision:** Extract the formula into stateless pure functions with no React dependency.

**Rationale:** Easy to unit test, easy to reason about. The formula is the most critical and nuanced part — isolating it means the UI layer never needs to know game logic details.

**Alternatives considered:** Inline logic in the page component — rejected because it makes testing hard and couples game logic to rendering.

### 2. Immutable sequential simulation

**Decision:** Model multi-attacker as a `simulateBattle(attackers[], defender)` function that returns an array of `RoundResult` objects. Each round uses the defender's HP from the previous round's output.

**Rationale:** This makes the order dependency explicit and pure. Re-ordering attackers = re-running the same pure function with a different array order.

```
simulateBattle([warrior, archer], defender)
  round 1: warrior vs defender(10hp) → defenderHP after = 6
  round 2: archer vs defender(6hp)  → defenderHP after = 2
```

**Data flow:**
```
[AttackerConfig]  DefenderConfig
        │                │
        └────────┬────────┘
                 ▼
        simulateBattle()
                 ▼
        RoundResult[]
          ├─ round 1: dmgToDefender, dmgToAttacker, defenderHpAfter
          ├─ round 2: dmgToDefender, dmgToAttacker, defenderHpAfter
          └─ ...
```

### 3. Component structure

```
src/
  lib/
    battleCalc.ts        ← pure formula functions
  data/
    units.ts             ← v116 unit stats (Warrior, Archer, Rider)
  components/
    calculator/
      UnitCard.tsx        ← reusable card for attacker or defender
      AttackerList.tsx    ← ordered list of attacker cards with drag-to-reorder
      ResultDisplay.tsx   ← shows per-round and final results
  pages/
    CalculatorPage.tsx    ← top-level page, owns all state
```

**Rationale:** Keeps the page thin (just wires state), and components focused. `UnitCard` is used for both attacker and defender slots, configured via props.

### 4. HP input: controlled dual input (number + slider)

**Decision:** A single `hp` state value drives both a `<input type="number">` and an `<input type="range">`. Either input updates the shared state.

**Rationale:** No special library needed. Works natively. The range slider gives the "drag" feel; the number input gives precision.

### 5. Drag-to-reorder via HTML5 drag-and-drop

**Decision:** Use native HTML5 `draggable` attribute with `onDragStart`/`onDragOver`/`onDrop` handlers to reorder the attacker array.

**Rationale:** No additional dependency. The attacker list is short (2-5 units typically), so performance is not a concern. A drag handle icon makes it discoverable.

**Alternatives considered:** `@dnd-kit/core` — more polished but adds a dependency for a simple list reorder.

### 6. Archer retaliation toggle

**Decision:** Archer unit card shows a "Retaliation" toggle (Range / Melee). When set to Range, the Archer is treated as `stiff` (no retaliation damage back to attacker). When set to Melee, normal retaliation applies.

**Rationale:** This is the key game mechanic that differs from other units — Archers normally can't counter-attack in melee range. Making it explicit lets the user model both scenarios.

## Risks / Trade-offs

- **Floating point in formula** → The original calculator uses `Math.round(x + 1e-10)` to avoid drift. We replicate this exactly. Risk is low.
- **Drag-and-drop feel on mobile** → Native HTML5 DnD has poor touch support. Accepted as a known limitation (desktop first).
- **Formula divergence** → If the game updates again, unit stats in `units.ts` need manual updating. Mitigated by keeping stats in a single, well-commented data file.
