/**
 * Polytopia v116 damage formula — pure TypeScript, no React dependency.
 *
 * Formula reference (extracted from v116 "Splash Rework"):
 *   attackForce  = (currentHP / maxHP) × attackStat
 *   defenceForce = (currentHP / maxHP) × defenceStat × defMultiplier
 *   totalDamage  = attackForce + defenceForce
 *   defenderLoss = round((attackForce  / totalDamage) × attackStat  × 4.5)
 *   attackerLoss = round((defenceForce / totalDamage) × defenceStat × 4.5)
 *
 * Where round(x) = Math.round(x + 1e-10) to avoid floating-point drift.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface DefenderBonuses {
  /** Behind a city wall — defMultiplier × 4.0 */
  wall: boolean
  /** Fortified in city or used Fortify — defMultiplier × 1.5 (requires fortify skill) */
  def: boolean
  /** Poisoned — defMultiplier × 0.5 */
  poisoned: boolean
}

export interface AttackerBonuses {
  /** Veteran — maxHP +5 */
  veteran: boolean
  /** Poisoned — own defMultiplier × 0.5 (affects retaliation taken) */
  poisoned: boolean
  /**
   * Stiff — attacker does NOT take retaliation damage.
   * Used for Archer in Range mode (archers can't counter melee attacks).
   */
  stiff: boolean
}

export interface DefenderConfig {
  unitId: string
  /** Display name */
  name: string
  currentHp: number
  maxHp: number
  attack: number
  defence: number
  bonuses: DefenderBonuses
}

export interface AttackerConfig {
  id: string
  unitId: string
  /** Display name */
  name: string
  currentHp: number
  maxHp: number
  attack: number
  defence: number
  bonuses: AttackerBonuses
}

export interface RoundResult {
  /** Damage dealt to the defender this round */
  dmgToDefender: number
  /** Damage taken by the attacker this round (retaliation) */
  dmgToAttacker: number
  /** Defender HP remaining after this round (clamped to ≥ 0) */
  defenderHpAfter: number
  /** Attacker HP remaining after this round (clamped to ≥ 0) */
  attackerHpAfter: number
}

// ── Internal helpers ───────────────────────────────────────────────────────

/** Polytopia-safe rounding: avoids floating-point drift seen in the original. */
function polyRound(x: number): number {
  return Math.round(x + 1e-10)
}

// ── Exported formula functions ─────────────────────────────────────────────

/**
 * Calculate the effective defence multiplier for a unit.
 * WALL takes priority over DEF. POISON halves whatever multiplier is active.
 */
export function calcDefMultiplier(bonuses: DefenderBonuses | AttackerBonuses): number {
  const isDefender = 'wall' in bonuses
  let multiplier = 1.0

  if (isDefender) {
    const db = bonuses as DefenderBonuses
    if (db.wall) multiplier = 4.0
    else if (db.def) multiplier = 1.5
  }

  if (bonuses.poisoned) multiplier *= 0.5

  return multiplier
}

/**
 * Calculate a single combat round between one attacker and one defender.
 *
 * @param attackerHp   Current HP of the attacker entering this round
 * @param defender     Full defender config (bonuses etc.)
 * @param attacker     Full attacker config (bonuses etc.)
 * @returns            { dmgToDefender, dmgToAttacker }
 */
export function calcRound(
  attackerCurrentHp: number,
  attacker: Pick<AttackerConfig, 'attack' | 'defence' | 'maxHp' | 'bonuses'>,
  defenderCurrentHp: number,
  defender: Pick<DefenderConfig, 'attack' | 'defence' | 'maxHp' | 'bonuses'>,
): { dmgToDefender: number; dmgToAttacker: number } {
  // If defender is already dead, no combat
  if (defenderCurrentHp <= 0) {
    return { dmgToDefender: 0, dmgToAttacker: 0 }
  }

  const defMultiplier = calcDefMultiplier(defender.bonuses)

  const attackForce = (attackerCurrentHp / attacker.maxHp) * attacker.attack
  const defenceForce = (defenderCurrentHp / defender.maxHp) * defender.defence * defMultiplier
  const totalDamage = attackForce + defenceForce

  const dmgToDefender = polyRound((attackForce / totalDamage) * attacker.attack * 4.5)

  let dmgToAttacker = 0
  if (!attacker.bonuses.stiff) {
    // Attacker's own defence multiplier (for retaliation damage calculation)
    const atkDefMultiplier = calcDefMultiplier(attacker.bonuses)
    const atkDefenceForce = (attackerCurrentHp / attacker.maxHp) * attacker.defence * atkDefMultiplier
    const atkAttackForce = (defenderCurrentHp / defender.maxHp) * defender.attack
    const atkTotalDamage = atkAttackForce + atkDefenceForce
    dmgToAttacker = polyRound((atkAttackForce / atkTotalDamage) * defender.attack * 4.5)
  }

  return { dmgToDefender, dmgToAttacker }
}

/**
 * Simulate a full battle: multiple attackers attacking a single defender in sequence.
 * Each attacker sees the defender's updated HP from previous rounds.
 *
 * @param attackers  Ordered list of attacker configs
 * @param defender   Defender config
 * @returns          Array of RoundResult, one per attacker
 */
export function simulateBattle(
  attackers: AttackerConfig[],
  defender: DefenderConfig,
): RoundResult[] {
  let defenderHp = defender.currentHp

  return attackers.map((attacker) => {
    if (defenderHp <= 0) {
      // Defender already dead — no combat, no damage in either direction
      return {
        dmgToDefender: 0,
        dmgToAttacker: 0,
        defenderHpAfter: 0,
        attackerHpAfter: attacker.currentHp,
      }
    }

    const { dmgToDefender, dmgToAttacker } = calcRound(
      attacker.currentHp,
      attacker,
      defenderHp,
      defender,
    )

    defenderHp = Math.max(0, defenderHp - dmgToDefender)
    const attackerHpAfter = Math.max(0, attacker.currentHp - dmgToAttacker)

    return {
      dmgToDefender,
      dmgToAttacker,
      defenderHpAfter: defenderHp,
      attackerHpAfter,
    }
  })
}
