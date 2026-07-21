import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  color: string;
  icon: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    color: {
      type: String,
      default: '#7c3aed',
    },
    icon: {
      type: String,
      default: 'folder',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICollection>('Collection', collectionSchema);
