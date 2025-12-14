/* global process */
import express from "express";
import pino from "pino";
import http from "http";

import userRouter from "./routers/usersRouters.js";
import authRouter from "./routers/authRouters.js";
import creatorsRouter from "./routers/creators.js";
import articleRouter from "./routers/articleRouters.js";
import "./models/Article.js";
import { UPLOAD_DIR } from "./constants/index.js";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const app = express();

/* ------------------------------------------------------------------
 *              🔥 ЖЁСТКИЙ GLOBAL CORS + PREFLIGHT FIX
 * ------------------------------------------------------------------ */

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ------------------------------------------------------------------
 *                     СТАНДАРТНЫЕ МИДДЛВАРЫ
 * ------------------------------------------------------------------ */

app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/api-docs", swaggerDocs());

/* ------------------------------------------------------------------
 *                             ROUTES
 * ------------------------------------------------------------------ */

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/creators", creatorsRouter);

/* ------------------------------------------------------------------
 *                               404
 * ------------------------------------------------------------------ */

app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

/* ------------------------------------------------------------------
 *                         ERROR HANDLER
 * ------------------------------------------------------------------ */

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      status: "error",
      message: "Image too large. Max size is 1MB.",
    });
  }

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Server error",
  });
});

/* ------------------------------------------------------------------
 *                              SERVER
 * ------------------------------------------------------------------ */

const PORT = process.env.PORT || 4000;

const setupServer = async () => {
  return new Promise((resolve) => {
    const server = http.createServer(app);

    server.listen(
      {
        host: "0.0.0.0",
        port: PORT,
        family: 4,
      },
      () => {
        logger.info(`🚀 Server running on port ${PORT}`);
        resolve(app);
      }
    );
  });
};

export default setupServer;






