import app from './app.js';
import pino from 'pino';

const logger = pino();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  logger.error(err);
  process.exit(1);
});

export default server;




