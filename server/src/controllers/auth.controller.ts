import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please seed the database first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_change_in_prod';
    const token = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: '7d' });

    return res.status(200).json({
      authenticated: true,
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error('SignIn error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signOut = async (_req: Request, res: Response): Promise<any> => {
  try {
    // Client is responsible for discarding the token
    return res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSecurityQuestion = async (_req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // We only return the question text, not the answer
    const question = user.securityQuestion || 'What is your favorite color?';
    return res.status(200).json({ question });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { answer, newPassword } = req.body;
    
    if (!answer || !newPassword) {
      return res.status(400).json({ message: 'Answer and new password are required' });
    }

    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if answer is correct
    // (Assume answers might have been typed with different casing by user, so we compare lowercased if we seeded lowercased.
    // The seed script hashes the lowercased answer)
    let isAnswerMatch = false;

    if (!user.securityAnswer) {
      // Fallback if the user hasn't run the seed script since the update
      isAnswerMatch = answer.toLowerCase().trim() === 'blue';
    } else {
      isAnswerMatch = await bcrypt.compare(answer.toLowerCase().trim(), user.securityAnswer);
    }
    
    if (!isAnswerMatch) {
      return res.status(401).json({ message: 'Incorrect answer to the security question' });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
