import { useRef, useState } from 'react'
import { UnitCard } from './UnitCard'
import type { AttackerConfig } from '../../lib/battleCalc'
import { UNIT_MAP } from '../../data/units'

const MAX_ATTACKERS = 5

interface AttackerListProps {
  attackers: AttackerConfig[]
  onChange: (attackers: AttackerConfig[]) => void
}

export function AttackerList({ attackers, onChange }: AttackerListProps) {
  const dragIndexRef = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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
    onChange(reordered)
    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  function handleDragEnd() {
    dragIndexRef.current = null
    setDragOverIndex(null)
  }

  function updateAttacker(index: number, config: AttackerConfig) {
    const updated = [...attackers]
    updated[index] = config
    onChange(updated)
  }

  function addAttacker() {
    if (attackers.length >= MAX_ATTACKERS) return
    const unit = UNIT_MAP['warrior']
    onChange([...attackers, {
      id: `attacker-${Date.now()}`,
      unitId: 'warrior',
      name: unit.name,
      currentHp: unit.maxHealth,
      maxHp: unit.maxHealth,
      attack: unit.attack,
      defence: unit.defence,
      bonuses: { veteran: false, poisoned: false, stiff: false },
    }])
  }

  function removeAttacker(index: number) {
    if (attackers.length <= 1) return
    onChange(attackers.filter((_, i) => i !== index))
  }

  return (
    <div className="attacker-list">
      {attackers.map((attacker, index) => (
        <div
          key={attacker.id}
          className={`attacker-list__item${dragOverIndex === index ? ' attacker-list__item--drag-over' : ''}`}
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
            onRemove={attackers.length > 1 ? () => removeAttacker(index) : undefined}
          />
        </div>
      ))}

      {attackers.length < MAX_ATTACKERS && (
        <button type="button" className="btn btn--ghost attacker-list__add" onClick={addAttacker}>
          + Add attacker
        </button>
      )}
    </div>
  )
}
