import React from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/userApi";

export function MainMenuScreen() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div className="screen screen-centered">
      <h1>Главное меню</h1>
      {user && <p className="subtitle">Привет, {user.nickname}!</p>}
      <div className="panel menu-buttons">
        <button type="button" onClick={() => navigate("/rooms/new")}>
          Новая игра
        </button>
        <button type="button" onClick={() => navigate("/rooms")}>
          Присоединиться
        </button>
      </div>
    </div>
  );
}

