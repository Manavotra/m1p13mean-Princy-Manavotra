import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema({
  name: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
});

export default mongoose.model('SubCategory', SubCategorySchema);


