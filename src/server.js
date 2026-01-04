import app from './app.js';
import pino from 'pino';
console.log("🔥 REAL APP.JS LOADED 🔥", import.meta.url);
const logger = pino();
const PORT = process.env.PORT || 3000;

/**
 * Запускает HTTP-сервер и возвращает промис с инстансом.
 * Используем промис, чтобы `await` в index.js ждал старт сервера.
 */
const startServer = () =>
  new Promise((resolve, reject) => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`);
      resolve(server);
    });

    server.on('error', (err) => {
      logger.error(err);
      reject(err);
    });
  });

export default startServer;




