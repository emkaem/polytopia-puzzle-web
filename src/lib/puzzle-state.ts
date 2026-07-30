/**
 * puzzle-state.ts
 *
 * State machine voor puzzel-state via useReducer + immer.
 * Ondersteunt undo/redo via een history-stack (max 50 entries).
 */

import { produce } from 'immer';
import type { HexCoord } from './hex-grid-utils';

const HISTORY_CAP = 50;

// ── Types ─────────────────────────────────────────────────────────────────────

export type Unit = {
  type: string;
  owner: string;
};

export type Tile = {
  terrain: string;
  unit?: Unit;
};

/** De board-sleutel is "q,r" */
export type BoardKey = string;

export function toKey(coord: HexCoord): BoardKey {
  return `${coord.q},${coord.r}`;
}

export type PuzzleState = {
  board: Record<BoardKey, Tile>;
  turn: number;
  past: Omit<PuzzleState, 'past' | 'future'>[];
  future: Omit<PuzzleState, 'past' | 'future'>[];
};

// ── Actions ───────────────────────────────────────────────────────────────────

export type PuzzleAction =
  | { type: 'PLACE_UNIT'; coord: HexCoord; unit: Unit }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; initialState: Pick<PuzzleState, 'board' | 'turn'> };

// ── Initial state ─────────────────────────────────────────────────────────────

export function createInitialState(
  board: Record<BoardKey, Tile> = {},
  turn = 0,
): PuzzleState {
  return { board, turn, past: [], future: [] };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type Snapshot = Pick<PuzzleState, 'board' | 'turn'>;

function snapshot(state: PuzzleState): Snapshot {
  return { board: state.board, turn: state.turn };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

export function puzzleReducer(state: PuzzleState, action: PuzzleAction): PuzzleState {
  switch (action.type) {
    case 'PLACE_UNIT':
      return produce(state, (draft) => {
        const key = toKey(action.coord);
        if (!draft.board[key]) {
          draft.board[key] = { terrain: 'plains' };
        }
        draft.board[key].unit = action.unit;
        draft.past = [...draft.past.slice(-(HISTORY_CAP - 1)), snapshot(state)];
        draft.future = [];
        draft.turn += 1;
      });

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return produce(state, (draft) => {
        draft.past = draft.past.slice(0, -1);
        draft.future = [snapshot(state), ...draft.future];
        draft.board = previous.board as typeof draft.board;
        draft.turn = previous.turn;
      });
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return produce(state, (draft) => {
        draft.future = draft.future.slice(1);
        draft.past = [...draft.past.slice(-(HISTORY_CAP - 1)), snapshot(state)];
        draft.board = next.board as typeof draft.board;
        draft.turn = next.turn;
      });
    }

    case 'RESET':
      return {
        board: action.initialState.board,
        turn: action.initialState.turn,
        past: [],
        future: [],
      };

    default:
      return state;
  }
}
