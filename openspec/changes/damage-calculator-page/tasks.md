## 1. Data & Formula

- [x] 1.1 Create `src/data/units.ts` with v116 stats for Warrior, Archer, Rider (name, maxHealth, attack, defence, skills array)
- [x] 1.2 Create `src/lib/battleCalc.ts` with types: `UnitConfig`, `AttackerConfig`, `DefenderConfig`, `RoundResult`
- [x] 1.3 Implement `calcDefMultiplier(config)` — returns 4.0 / 1.5 / 1.0 based on wall/def/poison toggles
- [x] 1.4 Implement `calcRound(attacker, defender)` — single-round formula returning `{ dmgToDefender, dmgToAttacker }`
- [x] 1.5 Implement `simulateBattle(attackers[], defender)` — sequential simulation returning `RoundResult[]`
- [x] 1.6 Write unit tests for battleCalc.ts covering: equal units full HP, weakened attacker, WALL bonus, stiff/no-retaliation, sequential HP carry-over, defender dying mid-sequence

## 2. Route & Page Shell

- [x] 2.1 Create `src/pages/CalculatorPage.tsx` as an empty placeholder that renders "Calculator"
- [x] 2.2 Add `/calculator` route to `src/App.tsx`
- [x] 2.3 Add "Calculator" nav link to the `Nav` component in `src/App.tsx`

## 3. UnitCard Component

- [x] 3.1 Create `src/components/calculator/UnitCard.tsx` — accepts props: `unit`, `hp`, `maxHp`, `bonuses`, `onUnitChange`, `onHpChange`, `onBonusChange`, `role` (attacker | defender)
- [x] 3.2 Add unit selector dropdown (Warrior / Archer / Rider) that resets HP on change
- [x] 3.3 Add HP range slider and number input, kept in sync, clamped to [1, maxHp]
- [x] 3.4 Add defender bonus toggles: WALL, DEF, POIS
- [x] 3.5 Add attacker bonus toggles: VET (updates maxHp + clamps HP), POIS
- [x] 3.6 Add Archer-only Retaliation toggle (Range / Melee) on attacker cards
- [x] 3.7 Add drag handle element (render only on attacker cards)

## 4. AttackerList Component

- [x] 4.1 Create `src/components/calculator/AttackerList.tsx` — renders an ordered list of `UnitCard` components for attackers
- [x] 4.2 Implement HTML5 drag-and-drop reorder: `draggable`, `onDragStart`, `onDragOver`, `onDrop` on each card
- [x] 4.3 Add "Add attacker" button — appends a new default attacker (Warrior, full HP, no bonuses); cap at 5 attackers
- [x] 4.4 Add remove button per attacker card — hidden when only one attacker exists

## 5. ResultDisplay Component

- [x] 5.1 Create `src/components/calculator/ResultDisplay.tsx` — accepts `RoundResult[]` and attacker/defender configs
- [x] 5.2 Render a row per round: round number, attacker name, damage to defender, damage to attacker, defender HP after
- [x] 5.3 Render final summary: defender total remaining HP or "Defeated"; each attacker's surviving HP or "Defeated"

## 6. Wire CalculatorPage

- [x] 6.1 Add state to `CalculatorPage.tsx`: `defender` config, `attackers` array
- [x] 6.2 Call `simulateBattle` on every state change, pass results to `ResultDisplay`
- [x] 6.3 Render `UnitCard` for defender and `AttackerList` for attackers side-by-side (or stacked on narrow screens)
- [x] 6.4 Apply basic layout and styling consistent with the existing site design
