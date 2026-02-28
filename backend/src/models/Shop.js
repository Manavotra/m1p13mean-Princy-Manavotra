// src/models/Shop.js
import mongoose from 'mongoose';

const ShopSchema = new mongoose.Schema({

  name: String,
  logo: String, //URL image
  description: String,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    enum: ['EN_ATTENTE', 'APPROUVE', 'BANNI'],
    default: 'EN_ATTENTE'
  }

}, { timestamps: true });

export default mongoose.model('Shop', ShopSchema);