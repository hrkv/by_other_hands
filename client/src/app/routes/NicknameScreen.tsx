import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, setCurrentUser } from "../services/userApi";

export function NicknameScreen() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = getCurrentUser();
    if (existing?.nickname) {
      navigate("/menu", { replace: true });
    }
  }, [navigate]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = nickname.trim();
    if (!value) {
      setError("Введите ник.");
      return;
    }
    if (value.length > 24) {
      setError("Ник не должен быть длиннее 24 символов.");
      return;
    }
    setCurrentUser(value);
    navigate("/menu", { replace: true });
  }

  return (
    <div className="screen screen-centered">
      <h1>By Other Hands</h1>
      <h2>Добро пожаловать</h2>
      <form onSubmit={handleSubmit} className="panel">
        <label>
          Ник:
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              if (error) {
                setError(null);
              }
            }}
            maxLength={32}
            autoFocus
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Продолжить</button>
      </form>
    </div>
  );
}

