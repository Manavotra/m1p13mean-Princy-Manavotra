// models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  unitPrice: Number
}, { _id: false });

const ShippingAddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zipCode: String,
  country: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered']
  },

  shippingAddress: ShippingAddressSchema,

  notes: [String],

  products: [OrderItemSchema]

}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
