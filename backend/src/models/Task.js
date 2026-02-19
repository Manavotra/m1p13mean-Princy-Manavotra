// models/Task.js
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ['Todo', 'Doing', 'Done'],
    default: 'Todo'
  }
});

export default mongoose.model('Task', TaskSchema);
