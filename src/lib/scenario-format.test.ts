import { describe, it, expect } from 'vitest';
import { validateScenario } from './scenario-format';
import examplePuzzle from '../data/example-puzzle.json';

const validBase = {
  version: 1,
  id: 'test-001',
  title: 'Test Puzzle',
  grid: { shape: 'rhombus', size: 4 },
  tiles: [{ q: 0, r: 0, terrain: 'plains' }],
};

describe('validateScenario – valid input', () => {
  it('accepts a minimal valid scenario', () => {
    const result = validateScenario(validBase);
    expect(result.id).toBe('test-001');
  });

  it('accepts the example puzzle JSON', () => {
    const result = validateScenario(examplePuzzle);
    expect(result.id).toBe('example-001');
  });

  it('accepts a tile with a unit', () => {
    const data = {
      ...validBase,
      tiles: [{ q: 0, r: 0, terrain: 'plains', unit: { type: 'warrior', owner: 'player1' } }],
    };
    expect(() => validateScenario(data)).not.toThrow();
  });
});

describe('validateScenario – missing required fields', () => {
  it('throws when "id" is missing', () => {
    const { id: _id, ...withoutId } = validBase;
    expect(() => validateScenario(withoutId)).toThrow(/id/);
  });

  it('throws when "version" is missing', () => {
    const { version: _v, ...withoutVersion } = validBase;
    expect(() => validateScenario(withoutVersion)).toThrow(/version/);
  });

  it('throws when "title" is missing', () => {
    const { title: _t, ...withoutTitle } = validBase;
    expect(() => validateScenario(withoutTitle)).toThrow(/title/);
  });

  it('throws when "grid" is missing', () => {
    const { grid: _g, ...withoutGrid } = validBase;
    expect(() => validateScenario(withoutGrid)).toThrow(/grid/);
  });

  it('throws when "tiles" is missing', () => {
    const { tiles: _t, ...withoutTiles } = validBase;
    expect(() => validateScenario(withoutTiles)).toThrow(/tiles/);
  });
});

describe('validateScenario – invalid objective type', () => {
  it('throws on unknown objective type', () => {
    const data = {
      ...validBase,
      objectives: [{ type: 'unknown' }],
    };
    expect(() => validateScenario(data)).toThrow(/objective/i);
  });

  it('accepts valid objective types', () => {
    for (const type of ['capture', 'survive', 'reach']) {
      const data = { ...validBase, objectives: [{ type }] };
      expect(() => validateScenario(data)).not.toThrow();
    }
  });
});

describe('validateScenario – invalid grid shape', () => {
  it('throws on unknown grid shape', () => {
    const data = { ...validBase, grid: { shape: 'triangle', size: 4 } };
    expect(() => validateScenario(data)).toThrow(/shape/);
  });
});
