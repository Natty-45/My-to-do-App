import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from './config/db';
import User from './models/user.model';

dotenv.config();

const createUser = async () => {
  try {
    await connectDB();

    const rawPassword = process.env.USER_PASS || '1234';

    const existingUser = await User.findOne(); // Only one user allowed for now
    if (existingUser) {
      console.log(' User already exists');
      return process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const user = new User({ password: hashedPassword });
    await user.save();

    console.log(' User created successfully');
    process.exit(0);
  } catch (err) {
    console.error(' Failed to create user:', err);
    process.exit(1);
  }
};

createUser();
