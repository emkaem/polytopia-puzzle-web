import { describe, it, expect } from 'vitest';
import { puzzleReducer, createInitialState, toKey, type PuzzleAction } from './puzzle-state';

const warrior = { type: 'warrior', owner: 'player1' };
const coord = { q: 1, r: 0 };

describe('puzzleReducer – PLACE_UNIT', () => {
  it('places a unit on the board', () => {
    const state = createInitialState();
    const next = puzzleReducer(state, { type: 'PLACE_UNIT', coord, unit: warrior });
    expect(next.board[toKey(coord)]?.unit).toEqual(warrior);
  });

  it('increments turn', () => {
    const state = createInitialState();
    const next = puzzleReducer(state, { type: 'PLACE_UNIT', coord, unit: warrior });
    expect(next.turn).toBe(1);
  });

  it('clears future on new action', () => {
    let state = createInitialState();
    state = puzzleReducer(state, { type: 'PLACE_UNIT', coord, unit: warrior });
    state = puzzleReducer(state, { type: 'UNDO' });
    state = puzzleReducer(state, { type: 'PLACE_UNIT', coord: { q: 2, r: 0 }, unit: warrior });
    expect(state.future).toHaveLength(0);
  });
});

describe('puzzleReducer – UNDO', () => {
  it('restores previous state after an action', () => {
    const initial = createInitialState();
    const afterPlace = puzzleReducer(initial, { type: 'PLACE_UNIT', coord, unit: warrior });
    const afterUndo = puzzleReducer(afterPlace, { type: 'UNDO' });
    expect(afterUndo.board).toEqual(initial.board);
    expect(afterUndo.turn).toBe(initial.turn);
  });

  it('moves snapshot to future on undo', () => {
    const state = createInitialState();
    const afterPlace = puzzleReducer(state, { type: 'PLACE_UNIT', coord, unit: warrior });
    const afterUndo = puzzleReducer(afterPlace, { type: 'UNDO' });
    expect(afterUndo.future).toHaveLength(1);
  });

  it('does nothing when past is empty', () => {
    const state = createInitialState();
    const result = puzzleReducer(state, { type: 'UNDO' });
    expect(result).toBe(state);
  });
});

describe('puzzleReducer – REDO', () => {
  it('re-applies an undone action', () => {
    let state = createInitialState();
    state = puzzleReducer(state, { type: 'PLACE_UNIT', coord, unit: warrior });
    const afterPlace = state;
    state = puzzleReducer(state, { type: 'UNDO' });
    state = puzzleReducer(state, { type: 'REDO' });
    expect(state.board).toEqual(afterPlace.board);
    expect(state.turn).toBe(afterPlace.turn);
  });

  it('does nothing when future is empty', () => {
    const state = createInitialState();
    const result = puzzleReducer(state, { type: 'REDO' });
    expect(result).toBe(state);
  });
});

describe('puzzleReducer – RESET', () => {
  it('resets board and clears history', () => {
    let state = createInitialState();
    state = puzzleReducer(state, { type: 'PLACE_UNIT', coord, unit: warrior });
    const reset = puzzleReducer(state, {
      type: 'RESET',
      initialState: { board: {}, turn: 0 },
    });
    expect(reset.board).toEqual({});
    expect(reset.past).toHaveLength(0);
    expect(reset.future).toHaveLength(0);
    expect(reset.turn).toBe(0);
  });
});

describe('puzzleReducer – history cap', () => {
  it('past does not exceed 50 entries', () => {
    let state = createInitialState();
    for (let i = 0; i < 60; i++) {
      const action: PuzzleAction = {
        type: 'PLACE_UNIT',
        coord: { q: i, r: 0 },
        unit: warrior,
      };
      state = puzzleReducer(state, action);
    }
    expect(state.past.length).toBeLessThanOrEqual(50);
  });
});

describe('puzzleReducer – unknown action', () => {
  it('returns state unchanged for unknown action type', () => {
    const state = createInitialState();
    // @ts-expect-error testing unknown action
    const result = puzzleReducer(state, { type: 'UNKNOWN' });
    expect(result).toBe(state);
  });
});
