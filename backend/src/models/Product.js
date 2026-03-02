// src/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({

  name: String,
  description: String,

  price: Number,

  stock: Number,

  image: String,
  imagePublicId: String,

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
    enum: ['DISPONIBLE', 'INACTIF'],
    default: 'DISPONIBLE'
  }

}, { timestamps: true });

ProductSchema.virtual('discount', {
  ref: 'Discount',
  localField: '_id',
  foreignField: 'product',
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', ProductSchema);