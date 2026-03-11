import React, { ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listRooms } from "../services/roomsApi";
import { Room } from "../services/types";

export function RoomsListScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const rooms: Room[] = useMemo(() => {
    return listRooms({ search });
  }, [search]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  return (
    <div className="screen screen-centered">
      <h1>Доступные комнаты</h1>
      <div className="panel">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Поиск по названию комнаты"
            value={search}
            onChange={handleSearchChange}
          />
          <button type="button" onClick={() => navigate("/menu")}>
            В меню
          </button>
        </div>

        {rooms.length === 0 ? (
          <p>Пока нет комнат. Создайте новую игру.</p>
        ) : (
          <ul className="room-list">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  type="button"
                  className="room-item"
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  <span className="room-name">{room.name}</span>
                  <span className="room-meta">
                    {room.hasPassword && <span className="room-lock">[пароль]</span>}
                    <span className="room-date">
                      {new Date(room.createdAt).toLocaleString()}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

