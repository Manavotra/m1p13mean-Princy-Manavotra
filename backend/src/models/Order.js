// src/models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  quantity: Number,
  unitPrice: Number
}, { _id: false });

const LieuSchema = new mongoose.Schema({
  lieu: String,
  repere_adress: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    enum: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'],
    default: 'NOUVELLE'
  },

  lieuLivraison: LieuSchema,

  items: [OrderItemSchema],

  totalAmount: Number

}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);