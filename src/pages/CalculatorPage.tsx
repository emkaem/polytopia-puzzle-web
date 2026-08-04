import { useState, useMemo, useRef, Fragment } from 'react'
import { UnitCard } from '../components/calculator/UnitCard'
import { RoundStrip } from '../components/calculator/RoundStrip'
import { UnitPickerPanel } from '../components/calculator/UnitPickerPanel'
import { simulateBattle } from '../lib/battleCalc'
import type { DefenderConfig, AttackerConfig } from '../lib/battleCalc'
import { UNIT_MAP } from '../data/units'

const MAX_ATTACKERS = 30

function makeDefaultAttacker(unitId?: string): AttackerConfig {
  const unit = unitId ? (UNIT_MAP[unitId] ?? UNIT_MAP['warrior']) : UNIT_MAP['warrior']
  return {
    id: `attacker-${Date.now()}`,
    unitId: unit.id, name: unit.name,
    currentHp: unit.maxHealth, maxHp: unit.maxHealth,
    attack: unit.attack, defence: unit.defence,
    bonuses: { veteran: false, poisoned: false, stiff: false },
  }
}

export function CalculatorPage() {
  const [defender, setDefender] = useState<DefenderConfig | null>(null)
  const [attackers, setAttackers] = useState<AttackerConfig[]>([])
  const dragIndexRef = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const results = useMemo(
    () => defender ? simulateBattle(attackers, defender) : [],
    [attackers, defender],
  )

  // ── Drag handlers ──────────────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, index: number) {
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault()
    const dragIndex = dragIndexRef.current
    if (dragIndex === null || dragIndex === dropIndex) { setDragOverIndex(null); return }
    const reordered = [...attackers]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    setAttackers(reordered)
    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  function handleDragEnd() {
    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  // ── Attacker mutations ─────────────────────────────────────────────────

  function updateAttacker(index: number, config: AttackerConfig) {
    const updated = [...attackers]
    updated[index] = config
    setAttackers(updated)
  }

  function addAttacker(unitId?: string) {
    if (attackers.length >= MAX_ATTACKERS) return
    setAttackers([...attackers, makeDefaultAttacker(unitId)])
  }

  function removeAttacker(index: number) {
    if (attackers.length <= 1) return
    setAttackers(attackers.filter((_, i) => i !== index))
  }

  // ── Defender mutations ────────────────────────────────────────────────────

  function pickDefender(unitId: string) {
    const unit = UNIT_MAP[unitId]
    if (!unit) return
    setDefender({
      unitId: unit.id, name: unit.name,
      currentHp: unit.maxHealth, maxHp: unit.maxHealth,
      attack: unit.attack, defence: unit.defence,
      bonuses: { wall: false, def: false, poisoned: false },
    })
  }

  // ── Render ────────────────────────────────────────────────────────────

  // Defender spans all attacker rows; at least 1 row so the cell is visible
  const defenderRowSpan = Math.max(attackers.length, 1)

  return (
    <main className="page">
      <div className="section-header">
        <div className="section-header__label">v116</div>
        <h1>Damage Calculator</h1>
        <p className="section-header__desc">
          Simulate Polytopia combat. Add multiple attackers and drag to reorder — attack sequence matters.
        </p>
      </div>

      {/*
        Shared grid: 3 cols × (1 header row + N attacker rows)
        Col 1: attacker cards
        Col 2: round strips (one per attacker row)
        Col 3: defender (spans all content rows)
      */}
      <div
        className="calc-grid"
        style={{ gridTemplateRows: `auto repeat(${Math.max(attackers.length, 1)}, auto)` }}
      >
        {/* ── Row 0: column headers ── */}
        <div className="calc-grid__header">
          Attackers
          <span className="calc-column__hint"> (drag to reorder)</span>
        </div>
        <div className="calc-grid__header">Result</div>
        <div className="calc-grid__header">Defender</div>

        {/* ── Rows 1…N: one attacker + one round-strip per row ── */}
        {attackers.map((attacker, index) => {
          const round = results[index]
          const defAlreadyDead = index > 0 && !!results[index - 1] && results[index - 1].defenderHpAfter <= 0
          const defHpBefore = index === 0 ? (defender?.currentHp ?? 0) : (results[index - 1]?.defenderHpAfter ?? 0)
          const isDragOver = dragOverIndex === index

          return (
            <Fragment key={attacker.id}>
              {/* Attacker card cell */}
              <div
                className={`calc-grid__attacker-cell${isDragOver ? ' calc-grid__attacker-cell--drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="attacker-list__order">{index + 1}</div>
                <UnitCard
                  role="attacker"
                  config={attacker}
                  onChange={(config) => updateAttacker(index, config)}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onRemove={() => removeAttacker(index)}
                />
              </div>

              {/* Round strip cell — same grid row, col 2 */}
              <div className="calc-grid__strip-cell">
                {round && defender && (
                  <RoundStrip
                    round={round}
                    attacker={attacker}
                    defHpBefore={defHpBefore}
                    defenderMaxHp={defender.maxHp}
                    skipped={defAlreadyDead}
                  />
                )}
              </div>
            </Fragment>
          )
        })}

        {/* ── Defender: spans all content rows (col 3, rows 2 … N+1) ── */}
        <div
          className="calc-grid__defender-cell"
          style={{ gridRow: `2 / span ${defenderRowSpan}` }}
        >
          {defender && (
            <UnitCard role="defender" config={defender} onChange={setDefender} />
          )}
        </div>
      </div>

      <UnitPickerPanel
        onPickAttacker={(unitId) => addAttacker(unitId)}
        onPickDefender={pickDefender}
        attackerDisabled={attackers.length >= MAX_ATTACKERS}
      />
    </main>
  )
}
