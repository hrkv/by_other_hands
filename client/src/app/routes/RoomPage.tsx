import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoomById } from "../services/roomsApi";

export function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const room = roomId ? getRoomById(roomId) : null;

  if (!room) {
    return (
      <div className="screen screen-centered">
        <h1>Комната не найдена</h1>
        <div className="panel">
          <p>Возможно, она была удалена или ещё не создана.</p>
          <button type="button" onClick={() => navigate("/rooms")}>
            К списку комнат
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen screen-centered">
      <h1>Комната: {room.name}</h1>
      <div className="panel">
        <p>
          ID комнаты: <code>{room.id}</code>
        </p>
        <p>
          Создана: {new Date(room.createdAt).toLocaleString()}
          {room.hasPassword && " (в будущем: вход по паролю)"}
        </p>
        <p>
          Здесь позже появится состояние комнаты, список игроков и кнопки готовности / старта
          матча.
        </p>
        <div className="actions">
          <button type="button" onClick={() => navigate("/rooms")}>
            К списку комнат
          </button>
          <button type="button" onClick={() => navigate("/menu")}>
            В меню
          </button>
        </div>
      </div>
    </div>
  );
}

