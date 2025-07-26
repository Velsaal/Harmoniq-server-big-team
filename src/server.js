import authRouter from './routers/authRouters.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino';
import creatorsRouter from './routers/creators.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use('/api/auth', authRouter);

// app.use('/authors');
// app.use('/articles');
app.use('/api/creators', creatorsRouter);


app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

const PORT = process.env.PORT || 3000;

const setupServer = async () => {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      resolve(app);
    });
  });
};

export default setupServer;
