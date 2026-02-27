// src/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({

  name: String,
  description: String,

  price: Number,

  stock: Number,

  image: String, //url

  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  status: {
    type: String,
    enum: ['ACTIF', 'INACTIF'],
    default: 'ACTIF'
  }

}, { timestamps: true });

ProductSchema.virtual('discount', {
  ref: 'Discount',
  localField: '_id',
  foreignField: 'product',
  justOne: true
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', ProductSchema);