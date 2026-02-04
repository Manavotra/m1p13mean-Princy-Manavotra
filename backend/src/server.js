// src/server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/database.js';

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});
