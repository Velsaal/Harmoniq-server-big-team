import dotenv from 'dotenv';
import './server.js';
import InitMongoConnection from './db/InitMongoConnection.js';

dotenv.config();

InitMongoConnection().catch(err => {
  console.error('Mongo error:', err);
  process.exit(1);
});


