// Точка входа клиентского приложения.
// Здесь монтируем React-приложение в DOM.

import { mountApp } from "./main";

export function bootstrapClient() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("[client] Root element #root not found.");
    return;
  }

  mountApp(rootElement);
}
