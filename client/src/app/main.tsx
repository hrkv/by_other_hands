import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import "./styles/global.css";

export function mountApp(container: HTMLElement) {
  const root = createRoot(container);
  const basename = import.meta.env.BASE_URL || "/";

  root.render(
    <React.StrictMode>
      <BrowserRouter basename={basename}>
        <AppRouter />
      </BrowserRouter>
    </React.StrictMode>
  );
}

