import userRouter from './routers/usersRouters.js';
import authRouter from './routers/authRouters.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino';
import creatorsRouter from './routers/creators.js';
import './models/Article.js';
import articleRouter from './routers/articleRouters.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const app = express();

const allowedOrigins = [
  'http://localhost:5173', 
  'https://big-team.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static('public'));
app.use('/api-docs', swaggerDocs());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use('/api/articles', articleRouter);

app.use('/api/creators', creatorsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

app.use((err, req, res, next) => {

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: "error",
      message: "Image too large. Max size is 1MB.",
    });
  }
     
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
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
