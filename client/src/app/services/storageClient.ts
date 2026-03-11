const isBrowser = typeof window !== "undefined";

export const storageKeys = {
  currentUser: "boh.currentUser",
  rooms: "boh.rooms",
  lastJoinedRoomId: "boh.lastJoinedRoomId",
} as const;

function getItem(key: string): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(key);
}

function setItem(key: string, value: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(key, value);
}

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function readJson<T>(key: string): T | null {
  const raw = getItem(key);
  return safeParseJson<T>(raw);
}

export function writeJson<T>(key: string, value: T): void {
  setItem(key, JSON.stringify(value));
}

