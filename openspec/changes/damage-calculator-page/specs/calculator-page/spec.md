## ADDED Requirements

### Requirement: Calculator page route
The application SHALL expose a `/calculator` route that renders the damage calculator page. The route SHALL be accessible via the main navigation.

#### Scenario: Navigate to calculator
- **WHEN** the user navigates to `/calculator`
- **THEN** the calculator page is rendered with a defender card and at least one attacker card

### Requirement: Unit selection
Each unit card SHALL allow the user to select a unit type from the available units (Warrior, Archer, Rider). The card SHALL display the selected unit's base stats (ATK, DEF, max HP).

#### Scenario: Change unit type
- **WHEN** the user selects a different unit from the dropdown on a card
- **THEN** the card updates to show the new unit's stats and resets HP to the unit's max HP

### Requirement: HP input with slider and number field
Each unit card SHALL display the unit's current HP using both a range slider and a number input field. Both controls SHALL be kept in sync — changing one immediately updates the other. HP SHALL be constrained to the range [1, maxHP].

#### Scenario: Drag slider to change HP
- **WHEN** the user drags the HP slider on a unit card
- **THEN** the number input updates in real time to match the slider value

#### Scenario: Type HP in number field
- **WHEN** the user types a value in the number input
- **THEN** the slider updates to match; if the value is out of range it is clamped to [1, maxHP]

### Requirement: Bonus toggles per unit
Each unit card SHALL show relevant bonus toggles. The defender card SHALL show: WALL, DEF, POIS. Each attacker card SHALL show: VET, POIS. Toggling any bonus SHALL immediately update the calculated results.

The DEF toggle SHALL only be enabled (clickable) if the selected unit has the `fortify` skill. For the three available units (Warrior, Archer, Rider), all have `fortify`, so it is always enabled.

#### Scenario: Enable WALL on defender
- **WHEN** the user enables the WALL toggle on the defender card
- **THEN** the results update to reflect the ×4.0 defence multiplier

#### Scenario: Enable VET on attacker
- **WHEN** the user enables the VET toggle on an attacker card
- **THEN** the attacker's maxHP increases to 15; current HP is capped if it exceeds the new max

### Requirement: Archer retaliation toggle
When the selected unit on an attacker card is an Archer, the card SHALL display an additional "Retaliation" toggle with two states: **Range** (no retaliation — stiff) and **Melee** (normal retaliation). The toggle SHALL default to Range.

#### Scenario: Archer in range mode
- **WHEN** an Archer attacker has the Retaliation toggle set to Range
- **THEN** the Archer takes 0 damage from the defender in the result

#### Scenario: Archer in melee mode
- **WHEN** an Archer attacker has the Retaliation toggle set to Melee
- **THEN** the Archer takes normal retaliation damage from the defender

#### Scenario: Toggle not shown for non-Archer units
- **WHEN** the selected unit is a Warrior or Rider
- **THEN** no Retaliation toggle is shown on that attacker card

### Requirement: Multiple attackers
The user SHALL be able to add additional attacker cards (up to a reasonable maximum, e.g., 5). Each attacker card SHALL have a remove button (except when only one attacker remains). An "Add attacker" button SHALL append a new default attacker card.

#### Scenario: Add attacker
- **WHEN** the user clicks "Add attacker"
- **THEN** a new attacker card is appended with default unit (Warrior, full HP, no bonuses)

#### Scenario: Remove attacker
- **WHEN** the user clicks the remove button on an attacker card and more than one attacker exists
- **THEN** that attacker card is removed and results recalculate

### Requirement: Drag-to-reorder attack sequence
The attacker cards SHALL be reorderable via drag-and-drop. A drag handle SHALL be visible on each attacker card. Reordering SHALL immediately recalculate the battle results, because attack order affects the outcome.

#### Scenario: Drag attacker to new position
- **WHEN** the user drags an attacker card to a new position in the list
- **THEN** the attack order updates and results recalculate with the new sequence

### Requirement: Live battle results
The page SHALL display the battle results below (or beside) the unit cards. Results SHALL update live whenever any input changes (unit, HP, bonuses, order). For each attacker round, the results SHALL show:
- The attacker name and round number
- HP the defender lost this round
- HP the attacker lost this round
- Defender's remaining HP after this round

A final summary SHALL show the defender's total remaining HP (or "Defeated" if ≤ 0) and whether each attacker survived.

#### Scenario: Results update on HP change
- **WHEN** the user changes the defender's HP slider
- **THEN** all round results immediately recalculate and re-render

#### Scenario: Defender defeated
- **WHEN** the combined attacks reduce the defender to 0 HP or below
- **THEN** the results display "Defeated" for the defender's final state
