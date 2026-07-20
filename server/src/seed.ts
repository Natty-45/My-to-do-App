import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from './config/db';
import User from './models/user.model';

dotenv.config();

const createUser = async () => {
  try {
    await connectDB();

    const rawPassword = process.env.USER_PASS || '1234';
    const securityQuestion = 'What is your favorite color?';
    const rawAnswer = 'blue'; // default answer

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    const hashedAnswer = await bcrypt.hash(rawAnswer.toLowerCase(), salt);

    const existingUser = await User.findOne();
    if (existingUser) {
      console.log('User already exists. Updating missing security fields if needed...');
      if (!existingUser.securityQuestion || !existingUser.securityAnswer) {
        existingUser.securityQuestion = securityQuestion;
        existingUser.securityAnswer = hashedAnswer;
        await existingUser.save();
        console.log('Updated existing user with security question/answer.');
      }
      return process.exit(0);
    }

    const user = new User({ 
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer
    });
    
    await user.save();

    console.log('User created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create user:', err);
    process.exit(1);
  }
};

createUser();
