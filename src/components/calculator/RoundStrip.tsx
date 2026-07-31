import type { RoundResult, AttackerConfig } from '../../lib/battleCalc'

interface RoundStripProps {
  round: RoundResult
  attacker: AttackerConfig
  defenderName?: string
  defHpBefore: number
  defenderMaxHp: number
  skipped: boolean
}

export function RoundStrip({ round, attacker, defHpBefore, defenderMaxHp, skipped }: RoundStripProps) {
  if (skipped) {
    return (
      <div className="round-strip round-strip--skipped">
        <span className="round-strip__label">Defender already defeated</span>
      </div>
    )
  }

  const defDefeated = round.defenderHpAfter <= 0
  const atkDefeated = round.attackerHpAfter <= 0
  const defPct = Math.max(0, (round.defenderHpAfter / defenderMaxHp) * 100)
  const atkPct = Math.max(0, (round.attackerHpAfter / attacker.maxHp) * 100)

  function barColor(pct: number) {
    return pct > 50 ? 'var(--color-accent)' : pct > 25 ? 'var(--color-accent-warm)' : '#e05555'
  }

  return (
    <div className="round-strip">
      {/* Attacker side (left) */}
      <div className="round-strip__side round-strip__side--attacker">
        <span className={`round-strip__hp${atkDefeated ? ' round-strip__hp--dead' : ''}`}>
          {attacker.bonuses.stiff ? '—' : atkDefeated ? '✕' : `${round.attackerHpAfter}/${attacker.maxHp}`}
        </span>
        {!attacker.bonuses.stiff && (
          <div className="round-strip__bar-wrap round-strip__bar-wrap--rtl">
            <div className="round-strip__bar-before" style={{ width: `${(attacker.currentHp / attacker.maxHp) * 100}%` }} />
            <div className="round-strip__bar-after" style={{ width: `${atkPct}%`, background: barColor(atkPct) }} />
          </div>
        )}
        <span className="round-strip__dmg round-strip__dmg--retaliation">
          {attacker.bonuses.stiff ? 'range' : `−${round.dmgToAttacker}`}
        </span>
      </div>

      {/* Center arrow */}
      <div className="round-strip__arrow">⇄</div>

      {/* Defender side (right) */}
      <div className="round-strip__side round-strip__side--defender">
        <span className="round-strip__dmg round-strip__dmg--hit">−{round.dmgToDefender}</span>
        <div className="round-strip__bar-wrap">
          <div className="round-strip__bar-before" style={{ width: `${(defHpBefore / defenderMaxHp) * 100}%` }} />
          <div className="round-strip__bar-after" style={{ width: `${defPct}%`, background: barColor(defPct) }} />
        </div>
        <span className={`round-strip__hp${defDefeated ? ' round-strip__hp--dead' : ''}`}>
          {defDefeated ? '✕' : `${round.defenderHpAfter}/${defenderMaxHp}`}
        </span>
      </div>
    </div>
  )
}
