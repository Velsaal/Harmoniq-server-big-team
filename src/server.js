/* global process */
import express from "express";
import pino from "pino";

import userRouter from "./routers/usersRouters.js";
import authRouter from "./routers/authRouters.js";
import creatorsRouter from "./routers/creators.js";
import articleRouter from "./routers/articleRouters.js";
import "./models/Article.js";
import { UPLOAD_DIR } from "./constants/index.js";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

const app = express();
const logger = pino({ transport: { target: "pino-pretty" } });

// ===== TEST ROUTE =====
app.get("/api/__test", (req, res) => res.json({ ok: true }));

// ===== CORS =====
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5176",
    "https://big-team.vercel.app",
    "http://95.217.129.211",
  ];

  if (!req.headers.origin || allowedOrigins.includes(req.headers.origin)) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ===== MIDDLEWARES =====
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/api-docs", swaggerDocs());

// ===== ROUTES =====
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/creators", creatorsRouter);

// ===== 404 =====
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// ===== ERROR HANDLER =====
app.use((err, req, res) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ status: "error", message: "Image too large. Max size is 1MB." });
  }
  res
    .status(err.status || 500)
    .json({ status: "error", message: err.message || "Server error" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

export default app;








