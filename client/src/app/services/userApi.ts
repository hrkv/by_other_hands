import { User } from "./types";
import { readJson, storageKeys, writeJson } from "./storageClient";

export function getCurrentUser(): User | null {
  const parsed = readJson<User>(storageKeys.currentUser);
  return parsed && parsed.nickname ? parsed : null;
}

export function setCurrentUser(nickname: string): void {
  const value: User = { nickname: nickname.trim() };
  writeJson(storageKeys.currentUser, value);
}

