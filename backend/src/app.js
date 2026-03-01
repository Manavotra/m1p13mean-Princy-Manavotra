import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import session from "express-session";

const app = express();

// CORS - allow all origins
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
app.use(
  session({
    secret: "superSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true in HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use("/api", routes);

export default app;