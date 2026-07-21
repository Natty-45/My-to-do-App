import mongoose, { Schema, Document } from 'mongoose';

export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ISubtask {
  text: string;
  completed: boolean;
}

export interface IRecurring {
  interval: 'daily' | 'weekly' | 'monthly' | 'none';
  nextDate?: Date;
}

export interface ITodo extends Document {
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  category?: string;
  tags: string[];
  subtasks: ISubtask[];
  recurring: IRecurring;
  collectionId?: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const subtaskSchema = new Schema<ISubtask>(
  {
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

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
    tags: {
      type: [String],
      default: [],
    },
    subtasks: {
      type: [subtaskSchema],
      default: [],
    },
    recurring: {
      type: {
        interval: { type: String, enum: ['daily', 'weekly', 'monthly', 'none'], default: 'none' },
        nextDate: { type: Date },
      },
      default: { interval: 'none' },
    },
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Collection',
      required: false,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
toDoSchema.index({ collectionId: 1, order: 1 });

export default mongoose.model<ITodo>('Todo', toDoSchema);
