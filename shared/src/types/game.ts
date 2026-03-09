// Базовые типы для игры "By Other Hands".

export type PlayerId = "playerA" | "playerB";

export interface CellCoords {
  x: number;
  y: number;
}

export type CellKind = "empty" | "homeA" | "homeB" | "boost";

export interface Cell {
  position: CellCoords;
  kind: CellKind;
  boostId?: string;
}

export interface Token {
  id: string;
  owner: PlayerId;
  position: CellCoords;
}

export interface GameState {
  id: string;
  currentPlayer: PlayerId;
  board: Cell[][];
  tokens: Token[];
  winner?: PlayerId;
}
