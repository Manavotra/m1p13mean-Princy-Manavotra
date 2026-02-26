// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  // email: String,
  email: { type: String, required: true, unique: true },
  role: String,
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // 🔥 Nouveau champ image générique
  avatar: String // URL ou chemin fichier

}, { timestamps: true });

export default mongoose.model('User', userSchema);
