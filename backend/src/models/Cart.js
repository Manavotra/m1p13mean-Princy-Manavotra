// src/models/Cart.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number
}, { _id: false });

const CartSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  items: [CartItemSchema]

}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);