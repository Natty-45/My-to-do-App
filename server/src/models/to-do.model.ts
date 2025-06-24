import mongoose, { Schema, Document } from 'mongoose';


const statusEnum = ['pending', 'completed'] as const;



const toDoSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: statusEnum,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Todo', toDoSchema);
