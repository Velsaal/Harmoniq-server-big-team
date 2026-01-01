import express from "express";
import cors from "cors";
import path from "node:path";

import authRouter from "./routers/authRouters.js";
import usersRouter from "./routers/usersRouters.js";
import articleRouter from "./routers/articleRouters.js";
import creatorsRouter from "./routers/creators.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options(/.*/, cors());

app.use(express.json());

/* ✅ СТАТИКА — НАДЁЖНО */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/articles", articleRouter);
app.use("/api/creators", creatorsRouter);

export default app;





