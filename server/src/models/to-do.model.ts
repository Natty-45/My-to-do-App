import mongoose, { Schema, Document } from 'mongoose';


const statusEnum = ['pending', 'completed'] as const;

export interface ITodo extends Document {
  title: string;
  description: string;
  status: (typeof statusEnum)[number];
  createdAt: Date;
}

const toDoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: true,
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

export default mongoose.model<ITodo>('Todo', toDoSchema);
