import dotenv from 'dotenv';
import setupServer from './server.js';
import InitMongoConnection from './db/InitMongoConnection.js';

dotenv.config();

const startServer = async () => {
  try {
    await InitMongoConnection();
    await setupServer(); // сначала подключение к БД, потом старт сервера
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

startServer();
