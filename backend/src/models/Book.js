// models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});

export default mongoose.model('Book', BookSchema);
