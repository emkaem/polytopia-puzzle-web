## ADDED Requirements

### Requirement: Core damage formula
The system SHALL implement the Polytopia v116 damage formula as pure TypeScript functions. Given an attacker and defender configuration (stats, current HP, max HP, bonuses), the formula SHALL produce the HP lost by the defender and the HP lost by the attacker (retaliation).

The formula is:
- `attackForce = (currentHP / maxHP) × attackStat`
- `defenceForce = (currentHP / maxHP) × defenceStat × defMultiplier`
- `totalDamage = attackForce + defenceForce`
- `defenderLoss = round((attackForce / totalDamage) × attackStat × 4.5)`
- `attackerLoss = round((defenceForce / totalDamage) × defenceStat × 4.5)`

Where `round(x) = Math.round(x + 1e-10)` to avoid floating point drift.

#### Scenario: Standard hit between equal units at full health
- **WHEN** a Warrior (ATK 2, DEF 2, HP 10/10) attacks a Warrior (ATK 2, DEF 2, HP 10/10) with no bonuses
- **THEN** the defender loses 5 HP and the attacker loses 5 HP

#### Scenario: Weakened attacker deals less damage
- **WHEN** a Warrior at 5/10 HP attacks a full-health Warrior (10/10 HP) with no bonuses
- **THEN** the defender loses less HP than in the full-health scenario, because attackForce is halved

#### Scenario: Defender behind a wall takes less damage
- **WHEN** a Warrior attacks a Warrior that has the WALL bonus (defMultiplier = 4.0)
- **THEN** the defender loses significantly fewer HP than without the wall bonus

### Requirement: Defence multipliers
The formula SHALL support three mutually exclusive defence states for a unit. The `defMultiplier` value SHALL be:
- `4.0` when the unit has the WALL bonus
- `1.5` when the unit has the DEF (fortify) bonus and no WALL
- `1.0` when no bonus is active

Additionally, a POISON modifier SHALL halve the effective `defMultiplier` (× 0.5 applied on top of the base multiplier).

#### Scenario: WALL overrides DEF
- **WHEN** a unit has both WALL and DEF toggled (edge case)
- **THEN** WALL takes priority and defMultiplier is 4.0

#### Scenario: Poison halves defence multiplier
- **WHEN** a unit is poisoned and has the DEF bonus (base defMultiplier = 1.5)
- **THEN** the effective defMultiplier used in the formula is 0.75 (1.5 × 0.5)

### Requirement: Stiff flag suppresses retaliation
When an attacker has the `stiff` flag set (e.g., Archer in range mode), the formula SHALL return 0 for `attackerLoss` — the attacker takes no retaliation damage.

#### Scenario: Archer in range mode takes no retaliation
- **WHEN** an Archer with the stiff flag attacks a Warrior
- **THEN** the defender loses HP as normal, but the Archer (attacker) loses 0 HP

### Requirement: Sequential multi-attacker simulation
The system SHALL provide a `simulateBattle` function that accepts an ordered list of attacker configurations and a single defender configuration. It SHALL simulate each attacker engaging the defender in sequence. Each subsequent attacker SHALL see the defender's HP as reduced by all previous attacks.

The function SHALL return an array of `RoundResult` objects, one per attacker, each containing:
- `dmgToDefender`: HP the defender lost this round
- `dmgToAttacker`: HP this attacker lost this round
- `defenderHpAfter`: defender's HP remaining after this round (minimum 0)

#### Scenario: Two attackers in sequence
- **WHEN** a Warrior (full HP) and then an Archer (full HP) attack a Warrior defender (full HP) in sequence
- **THEN** the second attacker's round uses the defender HP remaining after the first attacker's damage, not the original HP

#### Scenario: Defender dies mid-sequence
- **WHEN** the first attacker reduces the defender to 0 HP
- **THEN** subsequent rounds SHALL show 0 damage to the defender (already dead) and 0 retaliation to the attacker

### Requirement: Veteran bonus
The system SHALL support a Veteran (VET) toggle per unit that increases the unit's max HP by 5. The current HP SHALL be capped to the new max HP if it would otherwise exceed it.

#### Scenario: Veteran increases max HP
- **WHEN** a Warrior has the VET toggle enabled
- **THEN** the warrior's maxHP is 15 instead of 10
