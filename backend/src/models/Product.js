// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  label: String,
  price: Number,
  stock: Number
});

export default mongoose.model('Product', productSchema);
