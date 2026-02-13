// models/Invoice.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  price: Number
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  customer: String,
  items: [ItemSchema]
}, { timestamps: true });

export default mongoose.model('Invoice', InvoiceSchema);
