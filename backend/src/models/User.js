// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    enum: ['ADMIN', 'VENDEUR', 'ACHETEUR'],
    default: 'ACHETEUR'
  },

  avatar: String, //url

  status: {
    type: String,
    enum: ['ACTIF', 'INACTIF'],
    default: 'ACTIF'
  }

}, { timestamps: true });

export default mongoose.model('User', UserSchema);