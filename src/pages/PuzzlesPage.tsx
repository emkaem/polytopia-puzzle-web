import { useReducer, useState, useCallback } from 'react'
import { HexTile } from '../components/HexTile'
import { puzzleReducer, createInitialState, toKey } from '../lib/puzzle-state'
import { validateScenario } from '../lib/scenario-format'
import type { PuzzleScenario } from '../lib/scenario-format'
import exampleRaw from '../data/example-puzzle.json'

// ── Data ───────────────────────────────────────────────────────────────────

const SCENARIOS: PuzzleScenario[] = [
  validateScenario(exampleRaw),
]

// ── Helpers ────────────────────────────────────────────────────────────────

function scenarioToBoard(scenario: PuzzleScenario) {
  return Object.fromEntries(
    scenario.tiles.map((t) => [
      `${t.q},${t.r}`,
      { terrain: t.terrain, ...(t.unit ? { unit: t.unit } : {}) },
    ])
  )
}

/** Compute a viewBox that neatly fits all tiles */
function computeViewBox(scenario: PuzzleScenario, size: number): string {
  const HEX_W = size * 1.5
  const HEX_H = size * Math.sqrt(3)

  const xs = scenario.tiles.map((t) => t.q * HEX_W)
  const ys = scenario.tiles.map((t) => t.r * HEX_H + t.q * (HEX_H / 2))

  const minX = Math.min(...xs) - size
  const maxX = Math.max(...xs) + size
  const minY = Math.min(...ys) - size
  const maxY = Math.max(...ys) + size

  const pad = size * 0.5
  return `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`
}

const TERRAIN_COLORS: Record<string, string> = {
  plains:   '#c8e6a0',
  forest:   '#4a7c3f',
  water:    '#5b9bd5',
  mountain: '#9e9e9e',
  city:     '#f5c842',
}

const TERRAIN_LABEL: Record<string, string> = {
  plains:   'Plains',
  forest:   'Forest',
  water:    'Water',
  mountain: 'Mountain',
  city:     'City',
}

const TILE_SIZE = 44

// ── Puzzle view ────────────────────────────────────────────────────────────

function PuzzleView({ scenario }: { scenario: PuzzleScenario }) {
  const [state, dispatch] = useReducer(
    puzzleReducer,
    createInitialState(scenarioToBoard(scenario))
  )
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = useCallback((q: number, r: number) => {
    const key = toKey({ q, r })
    if (selected === key) {
      setSelected(null)
      return
    }
    // If a tile with a unit was selected, move the unit to the clicked tile
    if (selected) {
      const fromTile = state.board[selected]
      if (fromTile?.unit) {
        dispatch({
          type: 'PLACE_UNIT',
          coord: { q, r },
          unit: fromTile.unit,
        })
        setSelected(null)
        return
      }
    }
    setSelected(key)
  }, [selected, state.board, dispatch])

  const handleReset = () => {
    dispatch({ type: 'RESET', initialState: { board: scenarioToBoard(scenario), turn: 0 } })
    setSelected(null)
  }

  const viewBox = computeViewBox(scenario, TILE_SIZE)
  const uniqueTerrains = [...new Set(scenario.tiles.map((t) => t.terrain))]
  const canUndo = state.past.length > 0

  const objective = scenario.objectives?.[0]
  const objectiveText = objective
    ? objective.type === 'capture'
      ? `Capture the city at position ${objective.target}`
      : objective.type === 'reach'
      ? `Reach position ${objective.target}`
      : 'Survive the given number of turns'
    : null

  return (
    <div className="puzzle-view">
      {/* Grid */}
      <div className="puzzle-view__canvas">
        <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
          {scenario.tiles.map((tile) => {
            const key = `${tile.q},${tile.r}`
            const boardTile = state.board[key]
            return (
              <HexTile
                key={key}
                q={tile.q}
                r={tile.r}
                terrain={boardTile?.terrain ?? tile.terrain}
                size={TILE_SIZE}
                selected={selected === key}
                onClick={handleClick}
              />
            )
          })}
          {/* Unit icons rendered on top */}
          {scenario.tiles.map((tile) => {
            const key = `${tile.q},${tile.r}`
            const boardTile = state.board[key]
            if (!boardTile?.unit) return null
            const cx = TILE_SIZE * 1.5 * tile.q
            const cy = TILE_SIZE * (Math.sqrt(3) / 2 * tile.q + Math.sqrt(3) * tile.r)
            return (
              <text
                key={`unit-${key}`}
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={TILE_SIZE * 0.45}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                ⚔️
              </text>
            )
          })}
        </svg>
      </div>

      {/* Sidebar */}
      <div className="puzzle-view__sidebar">
        {/* Info */}
        <div className="puzzle-info">
          <div className="puzzle-info__title">{scenario.title}</div>
          {scenario.description && (
            <p className="puzzle-info__desc">{scenario.description}</p>
          )}
          {objectiveText && (
            <div className="puzzle-info__stat">
              <span>Objective</span>
              <span>{objectiveText}</span>
            </div>
          )}
          {scenario.constraints?.maxTurns && (
            <div className="puzzle-info__stat">
              <span>Max turns</span>
              <span>{scenario.constraints.maxTurns}</span>
            </div>
          )}
          <div className="puzzle-info__stat">
            <span>Current turn</span>
            <span>{state.turn}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="puzzle-controls">
          <div className="puzzle-controls__title">Actions</div>
          <button
            className="btn btn--ghost"
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
          >
            ↩ Undo
          </button>
          <button className="btn btn--ghost" onClick={handleReset}>
            ↺ Reset puzzle
          </button>
        </div>

        {/* Legend */}
        <div className="puzzle-info">
          <div className="puzzle-controls__title" style={{ marginBottom: '10px' }}>Legend</div>
          <div className="legend">
            {uniqueTerrains.map((terrain) => (
              <div key={terrain} className="legend__item">
                <div
                  className="legend__swatch"
                  style={{ background: TERRAIN_COLORS[terrain] ?? '#e0e0e0' }}
                />
                {TERRAIN_LABEL[terrain] ?? terrain}
              </div>
            ))}
            <div className="legend__item">
              <span style={{ fontSize: '0.85rem' }}>⚔️</span>
              Warrior
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Puzzles page ───────────────────────────────────────────────────────────

export function PuzzlesPage() {
  const [activePuzzle, setActivePuzzle] = useState<PuzzleScenario>(SCENARIOS[0])

  return (
    <main className="page">
      <div className="section-header">
        <div className="section-header__label">Puzzles</div>
        <h1 style={{ fontSize: '1.75rem', margin: '0 0 8px' }}>Tactical scenarios</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Select a puzzle and solve the scenario. Click a tile to select it,
          then click another tile to move the unit.
        </p>
      </div>

      {/* Puzzle list */}
      <div className="puzzle-list">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            className={`puzzle-card${activePuzzle.id === scenario.id ? ' active' : ''}`}
            onClick={() => setActivePuzzle(scenario)}
            style={{ background: 'none', border: undefined, font: 'inherit' }}
          >
            <div className="puzzle-card__title">{scenario.title}</div>
            <div className="puzzle-card__meta">
              {scenario.tiles.length} tiles
              {scenario.constraints?.maxTurns ? ` · max. ${scenario.constraints.maxTurns} turns` : ''}
            </div>
            {scenario.description && (
              <p className="puzzle-card__desc">{scenario.description}</p>
            )}
            <div style={{ marginTop: '12px' }}>
              <span className="badge badge--green">
                {scenario.objectives?.[0]?.type ?? 'free'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Active puzzle */}
      <PuzzleView key={activePuzzle.id} scenario={activePuzzle} />
    </main>
  )
}
