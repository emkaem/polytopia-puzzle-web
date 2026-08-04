## ADDED Requirements

### Requirement: Unit picker panel is visible below the calculator grid
The calculator page SHALL display a `UnitPickerPanel` component below the attacker/defender grid at all times.

#### Scenario: Panel renders on page load
- **WHEN** the user navigates to the calculator page
- **THEN** the unit picker panel is visible below the grid with thumbnails for all available units

---

### Requirement: Clicking a unit thumbnail adds it as an attacker
The system SHALL add a new attacker with the clicked unit's stats when the user clicks a thumbnail in the picker panel.

#### Scenario: Add attacker via thumbnail click
- **WHEN** fewer than 5 attackers exist AND the user clicks a unit thumbnail in the picker panel
- **THEN** a new attacker card is appended to the attacker column with that unit pre-selected

#### Scenario: Thumbnail disabled at cap
- **WHEN** 5 attackers already exist
- **THEN** all thumbnails in the picker panel SHALL appear visually dimmed and clicks SHALL have no effect

---

### Requirement: Tribe filter narrows visible thumbnails
The picker panel SHALL include a filter bar with one button per tribe (All, Normal, Cymanti, Aquarion, Elyrion, Polaris). Selecting a tribe shows only units belonging to that tribe.

#### Scenario: Default state shows all units
- **WHEN** the picker panel first renders
- **THEN** the "All" filter is active and all 24 unit thumbnails are visible

#### Scenario: Selecting a tribe filter
- **WHEN** the user clicks a tribe filter button
- **THEN** only units whose `tribe` matches the selected tribe are shown in the thumbnail grid

#### Scenario: Returning to All
- **WHEN** the user clicks the "All" filter button after a tribe filter was active
- **THEN** all unit thumbnails are visible again

---

### Requirement: Add attacker button is removed
The "+ Add attacker" ghost button below the attacker column SHALL be removed.

#### Scenario: Button is gone
- **WHEN** the user views the calculator page
- **THEN** no "+ Add attacker" button is rendered anywhere on the page
