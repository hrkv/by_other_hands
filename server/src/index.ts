// Точка входа игрового сервера.
// Здесь в будущем поднимется HTTP/WebSocket‑сервер и логика матчмейкинга.

export function startServer() {
  // TODO: инициализировать транспорт, настроить обработчики подключений и матчей.
  console.log("[server] startServer() is not implemented yet.");
}

if (require.main === module) {
  // Временный запуск по прямому вызову `node server/src/index.ts` (после настройки сборки).
  startServer();
}
