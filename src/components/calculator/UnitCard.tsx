import { useState, useRef, useEffect } from 'react'
import { UNITS, UNIT_MAP } from '../../data/units'
import type { AttackerConfig, DefenderConfig, AttackerBonuses, DefenderBonuses } from '../../lib/battleCalc'

// ── Types ──────────────────────────────────────────────────────────────────

interface DefenderCardProps {
  role: 'defender'
  config: DefenderConfig
  onChange: (config: DefenderConfig) => void
  onDragStart?: never
  onRemove?: never
}

interface AttackerCardProps {
  role: 'attacker'
  config: AttackerConfig
  onChange: (config: AttackerConfig) => void
  onDragStart?: (e: React.DragEvent) => void
  onRemove?: () => void
}

type UnitCardProps = DefenderCardProps | AttackerCardProps

// ── Component ──────────────────────────────────────────────────────────────

export function UnitCard(props: UnitCardProps) {
  const { role, config, onChange } = props
  const onRemove = props.onRemove
  const onDragStart = role === 'attacker' ? props.onDragStart : undefined

  const isDefender = role === 'defender'
  const defenderConfig = isDefender ? (config as DefenderConfig) : null
  const attackerConfig = !isDefender ? (config as AttackerConfig) : null

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleUnitChange(unitId: string) {
    const unit = UNIT_MAP[unitId]
    if (!unit) return
    const newMaxHp = isDefender
      ? unit.maxHealth
      : unit.maxHealth + ((attackerConfig!.bonuses.veteran) ? 5 : 0)
    const newHp = Math.min(config.currentHp, newMaxHp)

    if (isDefender) {
      onChange({
        ...(config as DefenderConfig),
        unitId: unit.id,
        name: unit.name,
        maxHp: unit.maxHealth,
        currentHp: newHp,
        attack: unit.attack,
        defence: unit.defence,
      } as DefenderConfig)
    } else {
      onChange({
        ...(config as AttackerConfig),
        unitId: unit.id,
        name: unit.name,
        maxHp: newMaxHp,
        currentHp: newHp,
        attack: unit.attack,
        defence: unit.defence,
        bonuses: {
          ...(config as AttackerConfig).bonuses,
          stiff: unit.id === 'archer' ? (config as AttackerConfig).bonuses.stiff : false,
        },
      } as AttackerConfig)
    }
  }

  function handleHpChange(raw: number) {
    const hp = Math.max(1, Math.min(config.maxHp, raw))
    if (isDefender) {
      onChange({ ...(config as DefenderConfig), currentHp: hp })
    } else {
      onChange({ ...(config as AttackerConfig), currentHp: hp })
    }
  }

  function handleDefenderBonusChange(key: keyof DefenderBonuses, value: boolean) {
    if (!defenderConfig) return
    const dc = defenderConfig
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(onChange as any)({ ...dc, bonuses: { ...dc.bonuses, [key]: value } })
  }

  function handleAttackerBonusChange(key: keyof AttackerBonuses, value: boolean) {
    if (!attackerConfig) return
    const ac = attackerConfig
    const newBonuses: AttackerBonuses = { ...ac.bonuses, [key]: value }
    let newMaxHp = UNIT_MAP[config.unitId]?.maxHealth ?? config.maxHp
    if (newBonuses.veteran) newMaxHp += 5
    const newHp = Math.min(config.currentHp, newMaxHp)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(onChange as any)({ ...ac, bonuses: newBonuses, maxHp: newMaxHp, currentHp: newHp })
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const unitDef = UNIT_MAP[config.unitId]
  const isArcher = config.unitId === 'archer'

  return (
    <div className={`unit-card unit-card--${role}`}>
      {/* Sprite column — left, stretches to full card height */}
      <div
        className="unit-card__sprite-area"
        draggable={!!onDragStart}
        onDragStart={onDragStart}
        style={onDragStart ? { cursor: 'grab' } : undefined}
      >
        {onDragStart && (
          <span className="unit-card__drag-handle" title="Drag to reorder">⠿</span>
        )}
        {unitDef && (
          <img
            src={isDefender ? unitDef.defenderImage : unitDef.image}
            alt={unitDef.name}
            className={`unit-card__unit-img${isDefender ? ' unit-card__unit-img--flipped' : ''}`}
            draggable={false}
          />
        )}
        {onRemove && (
          <button
            type="button"
            className="unit-card__remove"
            onClick={onRemove}
            onMouseDown={(e) => e.stopPropagation()}
            title="Remove attacker"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controls column — right, stacked vertically */}
      <div className="unit-card__controls">
        {/* Select + stats */}
        <div
          className="unit-card__header"
          draggable={!!onDragStart}
          onDragStart={onDragStart}
          style={onDragStart ? { cursor: 'grab' } : undefined}
        >
          <UnitSelect
            value={config.unitId}
            onChange={handleUnitChange}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <div className="unit-card__stats">
            <span className="unit-card__stat" title="Attack">⚔ {unitDef?.attack ?? config.attack}</span>
            <span className="unit-card__stat" title="Defence">🛡 {unitDef?.defence ?? config.defence}</span>
            <span className="unit-card__stat" title={`Max HP: ${config.maxHp}`}>❤ {config.maxHp}</span>
          </div>
        </div>

        {/* HP row */}
        <div className="unit-card__hp-row">
          <span className="unit-card__hp-label">HP</span>
          <input
            type="range"
            className="unit-card__slider"
            min={1}
            max={config.maxHp}
            value={config.currentHp}
            onChange={(e) => handleHpChange(Number(e.target.value))}
          />
          <input
            type="number"
            className="unit-card__number"
            min={1}
            max={config.maxHp}
            value={config.currentHp}
            onChange={(e) => handleHpChange(Number(e.target.value))}
          />
          <span className="unit-card__hp-max">/ {config.maxHp}</span>
        </div>

        {/* Bonuses */}
        <div className="unit-card__bonuses">
          {isDefender ? (
            <>
              <Toggle label="WALL" title="Behind city wall (×4 defence)"  checked={defenderConfig!.bonuses.wall}     onChange={(v) => handleDefenderBonusChange('wall', v)} />
              <Toggle label="DEF"  title="Fortified (×1.5 defence)"       checked={defenderConfig!.bonuses.def}      onChange={(v) => handleDefenderBonusChange('def', v)} />
              <Toggle label="POIS" title="Poisoned (×0.5 defence)"        checked={defenderConfig!.bonuses.poisoned} onChange={(v) => handleDefenderBonusChange('poisoned', v)} />
            </>
          ) : (
            <>
              <Toggle label="VET"  title="Veteran (+5 max HP)"            checked={attackerConfig!.bonuses.veteran}  onChange={(v) => handleAttackerBonusChange('veteran', v)} />
              <Toggle label="POIS" title="Poisoned (×0.5 own defence)"    checked={attackerConfig!.bonuses.poisoned} onChange={(v) => handleAttackerBonusChange('poisoned', v)} />
              {isArcher && (
                <Toggle
                  label={attackerConfig!.bonuses.stiff ? 'RANGE' : 'MELEE'}
                  title={attackerConfig!.bonuses.stiff ? 'Range — no retaliation' : 'Melee — takes retaliation'}
                  checked={attackerConfig!.bonuses.stiff}
                  onChange={(v) => handleAttackerBonusChange('stiff', v)}
                  activeClass="unit-card__toggle--range"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Custom unit selector with images ──────────────────────────────────────

interface UnitSelectProps {
  value: string
  onChange: (id: string) => void
  onMouseDown?: (e: React.MouseEvent) => void
}

function UnitSelect({ value, onChange, onMouseDown }: UnitSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selected = UNIT_MAP[value]

  return (
    <div
      ref={ref}
      className="unit-select"
      onMouseDown={(e) => { onMouseDown?.(e) }}
    >
      <button
        type="button"
        className="unit-select__trigger"
        onMouseDown={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
      >
        {selected && (
          <img src={selected.image} alt={selected.name} className="unit-select__img" />
        )}
        <span className="unit-select__name">{selected?.name ?? '—'}</span>
        <span className="unit-select__chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="unit-select__dropdown">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`unit-select__option${u.id === value ? ' unit-select__option--active' : ''}`}
              onMouseDown={(e) => {
                e.stopPropagation()
                onChange(u.id)
                setOpen(false)
              }}
            >
              <img src={u.image} alt={u.name} className="unit-select__img" />
              <span>{u.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Toggle sub-component ───────────────────────────────────────────────────

interface ToggleProps {
  label: string
  title: string
  checked: boolean
  onChange: (value: boolean) => void
  activeClass?: string
}

function Toggle({ label, title, checked, onChange, activeClass }: ToggleProps) {
  return (
    <button
      type="button"
      className={`unit-card__toggle${checked ? ` unit-card__toggle--active${activeClass ? ' ' + activeClass : ''}` : ''}`}
      title={title}
      onClick={() => onChange(!checked)}
    >
      {label}
    </button>
  )
}
