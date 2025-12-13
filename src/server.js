/* global process */
import express from "express";
import pino from "pino";
import http from "http"; // <-- ДОБАВЛЕНО

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
 *                    ГАРАНТИРОВАННО РАБОТАЮЩИЙ CORS
 * ------------------------------------------------------------------ */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5176",
  "http://localhost:5178",
  "https://big-team.vercel.app",
  "http://95.217.129.211:3000",
];

// ДОЛЖЕН СТОЯТЬ ПЕРВЫМ МИДДЛВАРОМ!
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

/* ------------------------------------------------------------------
 *                   СТАНДАРТНЫЕ МИДДЛВАРЫ
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
 *                              404
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
 *                             SERVER (IPv4 FIX)
 * ------------------------------------------------------------------ */

const PORT = process.env.PORT || 3000;

const setupServer = async () => {
  return new Promise((resolve) => {
    const server = http.createServer(app);

    server.listen(
      {
        host: "0.0.0.0",
        port: PORT,
        family: 4, // <-- ПРИНУДИТЕЛЬНО IPv4
      },
      () => {
        logger.info(`🚀 Server running on IPv4 at port ${PORT}`);
        resolve(app);
      }
    );
  });
};

export default setupServer;





