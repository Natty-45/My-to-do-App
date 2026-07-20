import mongoose, { Schema, Document } from 'mongoose';

export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITodo extends Document {
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const toDoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    category: {
      type: String,
      trim: true,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITodo>('Todo', toDoSchema);
