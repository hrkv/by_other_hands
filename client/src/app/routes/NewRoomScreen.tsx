import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/roomsApi";

export function NewRoomScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Введите название комнаты.");
      return;
    }
    const room = createRoom({ name: trimmed, hasPassword });
    navigate(`/rooms/${room.id}`, { replace: true });
  }

  return (
    <div className="screen screen-centered">
      <h1>Новая игра</h1>
      <form onSubmit={handleSubmit} className="panel">
        <label>
          Название комнаты:
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            maxLength={64}
            autoFocus
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={hasPassword}
            onChange={(e) => setHasPassword(e.target.checked)}
          />
          Комната с паролем (поддержка позже)
        </label>

        {error && <div className="error">{error}</div>}

        <div className="actions">
          <button type="button" onClick={() => navigate("/menu")}>
            Назад
          </button>
          <button type="submit">Создать</button>
        </div>
      </form>
    </div>
  );
}

