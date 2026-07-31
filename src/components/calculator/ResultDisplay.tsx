import type { RoundResult, AttackerConfig, DefenderConfig } from '../../lib/battleCalc'

interface ResultDisplayProps {
  results: RoundResult[]
  attackers: AttackerConfig[]
  defender: DefenderConfig
}

function HpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  const color = pct > 50 ? 'var(--color-accent)' : pct > 25 ? 'var(--color-accent-warm)' : '#e05555'
  return (
    <div className="result-hp-bar">
      <div className="result-hp-bar__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function ResultDisplay({ results, attackers, defender }: ResultDisplayProps) {
  if (results.length === 0) return null

  const finalDefenderHp = results[results.length - 1].defenderHpAfter
  const defenderDefeated = finalDefenderHp <= 0

  return (
    <div className="result-display">
      <div className="result-display__title">Final State</div>

      <div className="result-summary">
        {/* Defender */}
        <div className="result-summary__unit">
          <div className="result-summary__unit-header">
            <span className="result-summary__unit-name">{defender.name} (Defender)</span>
            {defenderDefeated ? (
              <span className="result-summary__status result-summary__status--defeated">Defeated</span>
            ) : (
              <span className="result-summary__status result-summary__status--alive">
                {finalDefenderHp}/{defender.maxHp} HP
              </span>
            )}
          </div>
          {!defenderDefeated && <HpBar current={finalDefenderHp} max={defender.maxHp} />}
        </div>

        {/* Attackers */}
        {results.map((round, i) => {
          const attacker = attackers[i]
          const defeated = round.attackerHpAfter <= 0
          return (
            <div key={attacker.id} className="result-summary__unit">
              <div className="result-summary__unit-header">
                <span className="result-summary__unit-name">{attacker.name} #{i + 1}</span>
                {defeated ? (
                  <span className="result-summary__status result-summary__status--defeated">Defeated</span>
                ) : (
                  <span className="result-summary__status result-summary__status--alive">
                    {round.attackerHpAfter}/{attacker.maxHp} HP
                  </span>
                )}
              </div>
              {!defeated && <HpBar current={round.attackerHpAfter} max={attacker.maxHp} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
