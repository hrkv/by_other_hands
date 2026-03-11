import { Room } from "./types";
import { readJson, storageKeys, writeJson } from "./storageClient";

function readRooms(): Room[] {
  const parsed = readJson<Room[]>(storageKeys.rooms);
  if (!parsed || !Array.isArray(parsed)) {
    return [];
  }
  return parsed;
}

function writeRooms(rooms: Room[]): void {
  writeJson(storageKeys.rooms, rooms);
}

export function listRooms(filter?: { search?: string }): Room[] {
  const all = readRooms();
  if (!filter?.search) {
    return all;
  }
  const query = filter.search.trim().toLowerCase();
  if (!query) return all;
  return all.filter((room) => room.name.toLowerCase().includes(query));
}

export function createRoom(params: { name: string; hasPassword?: boolean }): Room {
  const now = Date.now();
  const rooms = readRooms();

  const room: Room = {
    id: `room_${now}_${Math.random().toString(36).slice(2, 8)}`,
    name: params.name.trim(),
    createdAt: now,
    hasPassword: !!params.hasPassword,
  };

  const nextRooms = [...rooms, room];
  writeRooms(nextRooms);

  return room;
}

export function getRoomById(id: string): Room | null {
  const rooms = readRooms();
  return rooms.find((room) => room.id === id) ?? null;
}

export function joinRoom(roomId: string): void {
  writeJson(storageKeys.lastJoinedRoomId, roomId);
}

