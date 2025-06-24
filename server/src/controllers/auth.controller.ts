import { Application, Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';


export const signIn = async (
  req: Request,
  res: Response
): Promise<Application | any > => {
  try {
    const {password}  = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });``
    }

    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ authenticated: true, userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error 2333' });
  }
};
