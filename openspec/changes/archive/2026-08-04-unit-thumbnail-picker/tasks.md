## 1. New Component: UnitPickerPanel

- [x] 1.1 Create `src/components/calculator/UnitPickerPanel.tsx` with props `onPick(unitId: string)` and `disabled: boolean`
- [x] 1.2 Render a tribe filter bar with buttons: All, Normal, Cymanti, Aquarion, Elyrion, Polaris
- [x] 1.3 Add local `useState` for active tribe filter (default: `'all'`)
- [x] 1.4 Render filtered unit thumbnails as clickable tiles using `unit.image` sprites
- [x] 1.5 Apply dimmed/disabled styling and block click handler when `disabled` is true
- [x] 1.6 Add CSS styles for the panel, filter bar, and thumbnail tiles (in the existing calculator stylesheet or a co-located CSS module)

## 2. Calculator Page Integration

- [x] 2.1 Import and render `<UnitPickerPanel>` below the `.calc-grid` in `CalculatorPage.tsx`
- [x] 2.2 Wire `onPick` to call `addAttacker` pre-seeded with the chosen unit's id
- [x] 2.3 Pass `disabled={attackers.length >= MAX_ATTACKERS}` to the panel
- [x] 2.4 Remove the "+ Add attacker" ghost button (and its conditional render) from `CalculatorPage.tsx`

## 3. Extend addAttacker to Accept a Unit Id

- [x] 3.1 Update `makeDefaultAttacker` (or create an overload) to accept an optional `unitId` parameter so the new attacker starts with the selected unit instead of always defaulting to Warrior
- [x] 3.2 Update `addAttacker` in `CalculatorPage.tsx` to forward the `unitId` from `onPick`
