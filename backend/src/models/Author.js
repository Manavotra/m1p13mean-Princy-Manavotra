// models/Author.js
import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({
  name: String
}, { timestamps: true });

AuthorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author'
});

AuthorSchema.set('toJSON', { virtuals: true });
AuthorSchema.set('toObject', { virtuals: true });

export default mongoose.model('Author', AuthorSchema);
