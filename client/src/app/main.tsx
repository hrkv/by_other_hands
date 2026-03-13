import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import "./styles/global.css";

export function mountApp(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </React.StrictMode>
  );
}

