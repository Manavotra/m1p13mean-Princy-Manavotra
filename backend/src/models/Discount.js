// src/models/Discount.js
import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    // ref: 'Product',
    // unique: true
  },

  type: {
    type: String,
    enum: ['POURCENTAGE', 'MONTANT_FIXE']
  },

  value: Number,

  status: {
    type: String,
    enum: ['EFFECTIVE', 'INACTIVE'],
    default: 'EFFECTIVE'
  }

}, { timestamps: true });

export default mongoose.model('Discount', DiscountSchema);