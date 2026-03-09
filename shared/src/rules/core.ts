import type { GameState, PlayerId, CellCoords } from "../types/game";

// Заглушки базовой логики core loop.

export function canMakeMove(state: GameState, byPlayer: PlayerId, target: CellCoords): boolean {
  // TODO: реализовать правило "ходишь за чужую фишку" и проверку допустимых клеток.
  void state;
  void byPlayer;
  void target;
  return false;
}

export function applyMove(state: GameState, byPlayer: PlayerId, target: CellCoords): GameState {
  // TODO: применить ход, сработать эффекты клетки и проверить победу.
  void byPlayer;
  void target;
  return state;
}
