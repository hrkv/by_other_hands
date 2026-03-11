import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getCurrentUser } from "../services/userApi";
import { NicknameScreen } from "./NicknameScreen";
import { MainMenuScreen } from "./MainMenuScreen";
import { NewRoomScreen } from "./NewRoomScreen";
import { RoomsListScreen } from "./RoomsListScreen";
import { RoomPage } from "./RoomPage";

function useHasUser(): boolean {
  const user = getCurrentUser();
  return !!user;
}

function RootRedirect() {
  const hasUser = useHasUser();
  return hasUser ? <Navigate to="/menu" replace /> : <Navigate to="/nickname" replace />;
}

type RequireUserProps = {
  children: React.ReactElement;
};

function RequireUser({ children }: RequireUserProps) {
  const hasUser = useHasUser();
  if (!hasUser) {
    return <Navigate to="/nickname" replace />;
  }
  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/nickname" element={<NicknameScreen />} />

      <Route
        path="/menu"
        element={
          <RequireUser>
            <MainMenuScreen />
          </RequireUser>
        }
      />

      <Route
        path="/rooms/new"
        element={
          <RequireUser>
            <NewRoomScreen />
          </RequireUser>
        }
      />

      <Route
        path="/rooms"
        element={
          <RequireUser>
            <RoomsListScreen />
          </RequireUser>
        }
      />

      <Route
        path="/rooms/:roomId"
        element={
          <RequireUser>
            <RoomPage />
          </RequireUser>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

