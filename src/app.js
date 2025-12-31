import express from 'express';
import cors from 'cors';

import authRouter from './routers/authRouters.js';
import usersRouter from './routers/usersRouters.js';
import articleRouter from './routers/articleRouters.js';
import creatorsRouter from './routers/creators.js';

const app = express();

/* 🔥 ЖЕЛЕЗНЫЙ CORS (без условий) */
app.use(
  cors({
    origin: true,          // 👈 ОТРАЖАЕТ origin запроса
    credentials: true,     // 👈 для cookies / auth
  })
);

app.options('*', cors()); // 👈 ОБЯЗАТЕЛЬНО

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/articles', articleRouter);
app.use('/api/creators', creatorsRouter);

export default app;





