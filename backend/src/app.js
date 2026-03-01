// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// CORS (Vercel + Local)
const allowedOrigins = [
  process.env.CORS_ORIGIN,   // ex: https://ton-front.vercel.app
  "http://localhost:4200"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());

// health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.use("/api", routes);

export default app;