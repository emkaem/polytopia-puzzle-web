/**
 * scenario-format.ts
 *
 * TypeScript types en validatie voor het Polytopia puzzel/scenario JSON-formaat.
 * Versie 1 van het schema.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type UnitData = {
  type: string;
  owner: string;
};

export type TileData = {
  q: number;
  r: number;
  terrain: string;
  unit?: UnitData;
};

export type ObjectiveType = 'capture' | 'survive' | 'reach';

export type Objective = {
  type: ObjectiveType;
  target?: string | { q: number; r: number };
  turns?: number;
};

export type GridShape = 'rhombus' | 'hexagon' | 'rectangle';

export type GridConfig = {
  shape: GridShape;
  size: number;
};

export type Constraints = {
  maxTurns?: number;
  allowedUnits?: string[];
};

export type PuzzleScenario = {
  version: number;
  id: string;
  title: string;
  description?: string;
  grid: GridConfig;
  tiles: TileData[];
  objectives?: Objective[];
  constraints?: Constraints;
};

// ── Validation ────────────────────────────────────────────────────────────────

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function assertField(data: Record<string, unknown>, field: string): void {
  if (data[field] === undefined || data[field] === null) {
    throw new ValidationError(`Missing required field: "${field}"`);
  }
}

const VALID_OBJECTIVE_TYPES: ObjectiveType[] = ['capture', 'survive', 'reach'];
const VALID_GRID_SHAPES: GridShape[] = ['rhombus', 'hexagon', 'rectangle'];

/**
 * Validates raw JSON data against the PuzzleScenario schema.
 * Throws a ValidationError with a descriptive message on failure.
 */
export function validateScenario(data: unknown): PuzzleScenario {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new ValidationError('Scenario must be a JSON object');
  }

  const obj = data as Record<string, unknown>;

  // Required top-level fields
  for (const field of ['version', 'id', 'title', 'grid', 'tiles']) {
    assertField(obj, field);
  }

  if (typeof obj['version'] !== 'number') {
    throw new ValidationError('"version" must be a number');
  }
  if (typeof obj['id'] !== 'string') {
    throw new ValidationError('"id" must be a string');
  }
  if (typeof obj['title'] !== 'string') {
    throw new ValidationError('"title" must be a string');
  }

  // grid
  const grid = obj['grid'] as Record<string, unknown>;
  if (typeof grid !== 'object' || grid === null) {
    throw new ValidationError('"grid" must be an object');
  }
  assertField(grid, 'shape');
  assertField(grid, 'size');
  if (!VALID_GRID_SHAPES.includes(grid['shape'] as GridShape)) {
    throw new ValidationError(
      `"grid.shape" must be one of: ${VALID_GRID_SHAPES.join(', ')}`
    );
  }

  // tiles
  if (!Array.isArray(obj['tiles'])) {
    throw new ValidationError('"tiles" must be an array');
  }
  for (const tile of obj['tiles'] as unknown[]) {
    const t = tile as Record<string, unknown>;
    for (const field of ['q', 'r', 'terrain']) {
      if (t[field] === undefined || t[field] === null) {
        throw new ValidationError(`Tile is missing required field: "${field}"`);
      }
    }
  }

  // objectives (optional)
  if (obj['objectives'] !== undefined) {
    if (!Array.isArray(obj['objectives'])) {
      throw new ValidationError('"objectives" must be an array');
    }
    for (const obj_ of obj['objectives'] as unknown[]) {
      const o = obj_ as Record<string, unknown>;
      if (!VALID_OBJECTIVE_TYPES.includes(o['type'] as ObjectiveType)) {
        throw new ValidationError(
          `Objective "type" must be one of: ${VALID_OBJECTIVE_TYPES.join(', ')}`
        );
      }
    }
  }

  return data as PuzzleScenario;
}
