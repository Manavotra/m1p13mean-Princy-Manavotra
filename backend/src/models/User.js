// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  // email: String,
  email: { type: String, required: true, unique: true },
  role: String
});

export default mongoose.model('User', userSchema);
