import { useState } from 'react'
import { UNITS } from '../../data/units'
import type { Tribe } from '../../data/units'

interface UnitPickerPanelProps {
  onPickAttacker: (unitId: string) => void
  onPickDefender: (unitId: string) => void
  attackerDisabled: boolean
}

type FilterOption = 'all' | Tribe

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'normal', label: 'Normal' },
  { value: 'cymanti', label: 'Cymanti' },
  { value: 'aquarion', label: 'Aquarion' },
  { value: 'elyrion', label: 'Elyrion' },
  { value: 'polaris', label: 'Polaris' },
]

interface UnitGridProps {
  onPick: (unitId: string) => void
  disabled: boolean
  useDefenderImage?: boolean
}

function UnitGrid({ onPick, disabled, useDefenderImage }: UnitGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')

  const visibleUnits =
    activeFilter === 'all' ? UNITS : UNITS.filter((u) => u.tribe === activeFilter)

  return (
    <>
      <div className="unit-picker__filters">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`unit-picker__filter-btn${activeFilter === opt.value ? ' unit-picker__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="unit-picker__grid">
        {visibleUnits.map((unit) => (
          <button
            key={unit.id}
            type="button"
            className={`unit-picker__tile${disabled ? ' unit-picker__tile--disabled' : ''}`}
            onClick={() => !disabled && onPick(unit.id)}
            title={unit.name}
            aria-label={`Pick ${unit.name}`}
            disabled={disabled}
          >
            <img
              src={useDefenderImage ? unit.defenderImage : unit.image}
              alt={unit.name}
              className={`unit-picker__tile-img${useDefenderImage ? ' unit-picker__tile-img--flipped' : ''}`}
            />
            <span className="unit-picker__tile-name">{unit.name}</span>
          </button>
        ))}
      </div>
    </>
  )
}

export function UnitPickerPanel({ onPickAttacker, onPickDefender, attackerDisabled }: UnitPickerPanelProps) {
  return (
    <div className="unit-picker">
      <div className="unit-picker__columns">
        {/* Attacker column — matches calc-grid col 1+2 width */}
        <div className="unit-picker__col unit-picker__col--attacker">
          <div className="unit-picker__col-header">
            <span className="unit-picker__label">Add attacker</span>
            {attackerDisabled && (
              <span className="unit-picker__cap-hint">Maximum reached ({30})</span>
            )}
          </div>
          <UnitGrid onPick={onPickAttacker} disabled={attackerDisabled} />
        </div>

        {/* Divider */}
        <div className="unit-picker__divider" />

        {/* Defender column — matches calc-grid col 3 width */}
        <div className="unit-picker__col unit-picker__col--defender">
          <div className="unit-picker__col-header">
            <span className="unit-picker__label">Set defender</span>
          </div>
          <UnitGrid onPick={onPickDefender} disabled={false} useDefenderImage />
        </div>
      </div>
    </div>
  )
}
