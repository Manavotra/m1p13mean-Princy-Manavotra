// src/server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 API listening on port ${PORT}`);
  });
} catch (err) {
  console.error("❌ Startup failed:", err);
  process.exit(1);
}