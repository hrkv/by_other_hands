import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type GameSetupForm = {
  boardSize: number;
};

type PlayerId = "player1" | "player2";

type PlayerInfo = {
  name: string;
  color: string;
};

type Coord = {
  x: number;
  y: number;
};

type ModifierType = "sprint" | "wallHorizontal" | "wallVertical" | "timeMachine" | "shuffle";
type ModifierCell = ModifierType | null;

type PendingEffects = {
  wallFor?: {
    player: PlayerId;
    orientation: "horizontal" | "vertical";
  } | null;
  timeMachineFor?: {
    player: PlayerId;
    backTo: Coord;
  } | null;
};

type GameLocationState = GameSetupForm | null;

export function GameScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const initial: GameSetupForm = useMemo(() => {
    const state = (location.state as GameLocationState) || null;
    const fallback: GameSetupForm = {
      boardSize: 7,
    };

    if (!state) return fallback;

    const size = Math.max(3, Math.min(10, state.boardSize || fallback.boardSize));
    return { boardSize: size };
  }, [location.state]);

  const [players] = useState<Record<PlayerId, PlayerInfo>>(() => {
    const baseNames = ["Командир", "Проводник", "Стратег", "Защитник", "Разведчик", "Генерал"];
    const palette = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#5b8cff", "#ff9f1c", "#9b5de5"];

    function pickTwoDistinct<T>(items: T[]): [T, T] {
      const firstIndex = Math.floor(Math.random() * items.length);
      let secondIndex = Math.floor(Math.random() * items.length);
      if (items.length > 1) {
        while (secondIndex === firstIndex) {
          secondIndex = Math.floor(Math.random() * items.length);
        }
      }
      return [items[firstIndex], items[secondIndex]];
    }

    const [name1, name2] = pickTwoDistinct(baseNames);
    const [color1, color2] = pickTwoDistinct(palette);

    return {
      player1: { name: name1, color: color1 },
      player2: { name: name2, color: color2 },
    };
  });

  const [modifiers, setModifiers] = useState<ModifierCell[][]>(() => {
    const size = initial.boardSize;
    const empty: ModifierCell[][] = Array.from({ length: size }, () =>
      Array.from<ModifierCell>({ length: size }).fill(null)
    );

    const allCoords: Coord[] = [];
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const isBase =
          (x === 0 && y === 0) || (x === size - 1 && y === size - 1);
        if (!isBase) {
          allCoords.push({ x, y });
        }
      }
    }

    function shuffleArray<T>(arr: T[]): T[] {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    const pool: ModifierType[] = [];
    if (size >= 4) {
      pool.push("sprint", "sprint");
      pool.push("wallHorizontal", "wallVertical");
      pool.push("timeMachine");
      pool.push("shuffle");
    }

    const coords = shuffleArray(allCoords);
    pool.forEach((mod, index) => {
      if (!coords[index]) return;
      const { x, y } = coords[index];
      empty[y][x] = mod;
    });

    return empty;
  });

  const [effects, setEffects] = useState<PendingEffects>({
    wallFor: null,
    timeMachineFor: null,
  });

  const [positions, setPositions] = useState<{ player1: Coord; player2: Coord }>(() => ({
    player1: { x: 0, y: 0 },
    player2: { x: initial.boardSize - 1, y: initial.boardSize - 1 },
  }));
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>("player1");

  const baseByPlayer: Record<PlayerId, Coord> = useMemo(
    () => ({
      player1: { x: 0, y: 0 },
      player2: { x: initial.boardSize - 1, y: initial.boardSize - 1 },
    }),
    [initial.boardSize]
  );

  const targetByPlayer: Record<PlayerId, Coord> = useMemo(
    () => ({
      player1: baseByPlayer.player2,
      player2: baseByPlayer.player1,
    }),
    [baseByPlayer]
  );

  const directions: Coord[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  function inBounds(coord: Coord): boolean {
    return (
      coord.x >= 0 &&
      coord.y >= 0 &&
      coord.x < initial.boardSize &&
      coord.y < initial.boardSize
    );
  }

  function chebyshevDistance(a: Coord, b: Coord): number {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  const winner: PlayerId | null = useMemo(() => {
    const p1AtTarget =
      positions.player1.x === targetByPlayer.player1.x &&
      positions.player1.y === targetByPlayer.player1.y;
    const p2AtTarget =
      positions.player2.x === targetByPlayer.player2.x &&
      positions.player2.y === targetByPlayer.player2.y;

    if (p1AtTarget) return "player1";
    if (p2AtTarget) return "player2";
    return null;
  }, [positions, targetByPlayer]);

  const currentPlayerName = players[currentPlayer].name;

  function canMoveTo(from: Coord, target: Coord, player: PlayerId): boolean {
    if (!inBounds(target)) return false;
    if (chebyshevDistance(from, target) !== 1) return false;

    const wall = effects.wallFor;
    if (wall && wall.player === player) {
      if (wall.orientation === "horizontal" && target.y !== from.y) {
        return false;
      }
      if (wall.orientation === "vertical" && target.x !== from.x) {
        return false;
      }
    }

    return true;
  }

  function endTurn() {
    setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
  }

  function handleCellClick(target: Coord) {
    if (winner) return;

    const from = positions[currentPlayer];
    if (!canMoveTo(from, target, currentPlayer)) {
      return;
    }

    const cellModifier = modifiers[target.y][target.x];
    const opponent: PlayerId = currentPlayer === "player1" ? "player2" : "player1";

    let finalTarget: Coord = target;
    let consumeWall = false;
    let consumeTimeMachine = false;
    let extraTurn = false;

    if (effects.timeMachineFor && effects.timeMachineFor.player === currentPlayer) {
      finalTarget = effects.timeMachineFor.backTo;
      consumeTimeMachine = true;
    }

    if (cellModifier === "sprint" && !consumeTimeMachine) {
      extraTurn = true;
    }

    if (cellModifier === "wallHorizontal") {
      setEffects((prev) => ({
        ...prev,
        wallFor: {
          player: opponent,
          orientation: "horizontal",
        },
      }));
    } else if (cellModifier === "wallVertical") {
      setEffects((prev) => ({
        ...prev,
        wallFor: {
          player: opponent,
          orientation: "vertical",
        },
      }));
    } else if (cellModifier === "timeMachine") {
      setEffects((prev) => ({
        ...prev,
        timeMachineFor: {
          player: opponent,
          backTo: positions[opponent],
        },
      }));
    }

    setPositions((prev) => ({
      ...prev,
      [currentPlayer]: finalTarget,
    }));

    if (cellModifier) {
      setModifiers((prev) => {
        const size = initial.boardSize;
        const next = prev.map((row) => row.slice());

        // consume picked modifier
        next[target.y][target.x] = null;

        if (cellModifier === "shuffle") {
          const activePositions = {
            player1: finalTarget && currentPlayer === "player1" ? finalTarget : positions.player1,
            player2: finalTarget && currentPlayer === "player2" ? finalTarget : positions.player2,
          };

          const allMods: ModifierType[] = [];
          const coords: Coord[] = [];

          for (let y = 0; y < size; y += 1) {
            for (let x = 0; x < size; x += 1) {
              const mod = next[y][x];
              if (mod) {
                allMods.push(mod);
                next[y][x] = null;
              }
            }
          }

          const forbidden = new Set<string>([
            `${activePositions.player1.x},${activePositions.player1.y}`,
            `${activePositions.player2.x},${activePositions.player2.y}`,
          ]);

          for (let y = 0; y < size; y += 1) {
            for (let x = 0; x < size; x += 1) {
              const key = `${x},${y}`;
              if (!forbidden.has(key)) {
                coords.push({ x, y });
              }
            }
          }

          const shuffledCoords = coords.sort(() => Math.random() - 0.5);
          allMods.forEach((mod, index) => {
            if (!shuffledCoords[index]) return;
            const { x, y } = shuffledCoords[index];
            next[y][x] = mod;
          });
        }

        return next;
      });
    }

    if (consumeTimeMachine || (effects.wallFor && effects.wallFor.player === currentPlayer)) {
      setEffects((prev) => ({
        wallFor:
          prev.wallFor && prev.wallFor.player === currentPlayer ? null : prev.wallFor,
        timeMachineFor:
          prev.timeMachineFor && prev.timeMachineFor.player === currentPlayer
            ? null
            : prev.timeMachineFor,
      }));
    }

    if (!extraTurn) {
      endTurn();
    }
  }

  function handleRestart() {
    navigate("/game/setup", { replace: true });
  }

  function handleBackToMenu() {
    navigate("/menu", { replace: true });
  }

  function renderGrid() {
    const size = initial.boardSize;
    const p1Pos = positions.player1;
    const p2Pos = positions.player2;
    const base1 = baseByPlayer.player1;
    const base2 = baseByPlayer.player2;

    const cells: JSX.Element[] = [];

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const isBase1 = x === base1.x && y === base1.y;
        const isBase2 = x === base2.x && y === base2.y;
        const hasP1 = x === p1Pos.x && y === p1Pos.y;
        const hasP2 = x === p2Pos.x && y === p2Pos.y;

        const isNeighbor =
          !winner && canMoveTo(positions[currentPlayer], { x, y }, currentPlayer);

        const mod = modifiers[y][x];

        const classes = [
          "game-grid-cell",
          isBase1 ? "game-grid-base-1" : "",
          isBase2 ? "game-grid-base-2" : "",
          hasP1 || hasP2 ? "game-grid-cell-with-token" : "",
          isNeighbor ? "game-grid-cell-move" : "",
          mod === "sprint" ? "game-grid-mod-sprint" : "",
          mod === "wallHorizontal" ? "game-grid-mod-wall-h" : "",
          mod === "wallVertical" ? "game-grid-mod-wall-v" : "",
          mod === "timeMachine" ? "game-grid-mod-time" : "",
          mod === "shuffle" ? "game-grid-mod-shuffle" : "",
        ]
          .filter(Boolean)
          .join(" ");

        cells.push(
          <div
            key={`${x}-${y}`}
            className={classes}
            onClick={() => {
              if (!winner && isNeighbor) {
                handleCellClick({ x, y });
              }
            }}
          >
            {mod && (
              <span className="game-mod-label">
                {mod === "sprint" && "⚡️"}
                {mod === "wallHorizontal" && "⬅️➡️"}
                {mod === "wallVertical" && "⬆️⬇️"}
                {mod === "timeMachine" && "⏪"}
                {mod === "shuffle" && "🔀"}
              </span>
            )}
          </div>
        );
      }
    }

    const p1Top = ((p1Pos.y + 0.5) / size) * 100;
    const p1Left = ((p1Pos.x + 0.5) / size) * 100;
    const p2Top = ((p2Pos.y + 0.5) / size) * 100;
    const p2Left = ((p2Pos.x + 0.5) / size) * 100;

    return (
      <div
        className="game-grid"
        style={{ "--board-size": size } as React.CSSProperties}
      >
        {cells}
        <span
          className="game-token"
          style={{
            backgroundColor: players.player1.color,
            top: `${p1Top}%`,
            left: `${p1Left}%`,
          }}
        />
        <span
          className="game-token"
          style={{
            backgroundColor: players.player2.color,
            top: `${p2Top}%`,
            left: `${p2Left}%`,
          }}
        />
      </div>
    );
  }

  const winnerName = winner ? players[winner].name : null;

  const currentPlayerColor = players[currentPlayer].color;

  return (
    <div
      className="screen screen-centered"
      style={{ backgroundColor: currentPlayerColor, transition: "background-color 400ms ease" }}
    >
      <div className="panel">
        {winnerName ? (
          <p>
            Победил: <strong>{winnerName}</strong>!
          </p>
        ) : (
          <p>
            Ходит:{" "}
            <strong style={{ color: players[currentPlayer].color }}>{currentPlayerName}</strong>
          </p>
        )}

        <div className="game-board">
          <div className="game-board-main">{renderGrid()}</div>
          <div className="game-board-legend">
            <div className="legend-title">Модификаторы</div>
            <ul className="legend-list">
              <li>
                <span className="legend-swatch game-grid-mod-sprint" />
                <span className="legend-label">⚡️ Спринт — даёт ещё один ход подряд</span>
              </li>
              <li>
                <span className="legend-swatch game-grid-mod-wall-h" />
                <span className="legend-label">
                  ⬅️➡️ Горизонтальная стена — соперник может ходить только влево/вправо
                </span>
              </li>
              <li>
                <span className="legend-swatch game-grid-mod-wall-v" />
                <span className="legend-label">
                  ⬆️⬇️ Вертикальная стена — соперник может ходить только вверх/вниз
                </span>
              </li>
              <li>
                <span className="legend-swatch game-grid-mod-time" />
                <span className="legend-label">
                  ⏪ Машина времени — соперника отбрасывает на предыдущую клетку
                </span>
              </li>
              <li>
                <span className="legend-swatch game-grid-mod-shuffle" />
                <span className="legend-label">
                  🔀 Шафл — перемешивает все модификаторы на свободных клетках
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="actions">
          <button type="button" onClick={handleBackToMenu}>
            В меню
          </button>
          <button type="button" onClick={handleRestart}>
            Новая партия
          </button>
        </div>
      </div>
    </div>
  );
}

