// models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  tags: [String]
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
