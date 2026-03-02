// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import session from "express-session";

const app = express();
const isDev = process.env.NODE_ENV !== "production";

// CORS
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// SESSION CONFIG
// En production (Render/HTTPS) : secure=true, sameSite='none'
// En développement (localhost/HTTP) : secure=false, sameSite='lax'
if (!isDev) {
  app.set("trust proxy", 1); // obligatoire derrière un proxy HTTPS (Render, Heroku...)
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: !isDev,              // false en dev (http), true en prod (https)
      httpOnly: true,
      sameSite: isDev ? "lax" : "none",  // 'none' requis uniquement en cross-site HTTPS
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use('/uploads', express.static('uploads'));

app.use("/api", routes);

export default app;