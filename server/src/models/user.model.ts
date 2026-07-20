import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  password: {
    type: String,
    required: true,
  },
  securityQuestion: {
    type: String,
    required: true,
    default: 'What is your favorite color?',
  },
  securityAnswer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', userSchema);
