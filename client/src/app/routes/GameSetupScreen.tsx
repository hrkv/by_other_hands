import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

type GameSetupForm = {
  boardSize: number;
};

export function GameSetupScreen() {
  const navigate = useNavigate();
  const [trackLength, setTrackLength] = useState(7);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const length = Math.max(3, Math.min(10, trackLength || 7));

    const payload: GameSetupForm = {
      boardSize: length,
    };

    navigate("/game", {
      replace: true,
      state: payload,
    });
  }

  return (
    <div className="screen screen-centered">
      <h1>Новая партия</h1>
      <form onSubmit={handleSubmit} className="panel">
        <label>
          Размер поля (3–10 клеток по стороне):
          <input
            type="number"
            value={trackLength}
            min={3}
            max={15}
            onChange={(e) => {
              const next = Number(e.target.value);
              setTrackLength(Number.isFinite(next) ? next : 7);
            }}
            autoFocus
          />
        </label>

        {error && <div className="error">{error}</div>}

        <div className="actions">
          <button type="button" onClick={() => navigate("/menu")}>
            Назад
          </button>
          <button type="submit">Начать</button>
        </div>
      </form>
    </div>
  );
}

