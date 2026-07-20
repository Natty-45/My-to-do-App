import express from 'express';
import { signIn, signOut, getSecurityQuestion, resetPassword } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/security-question', getSecurityQuestion);
router.post('/reset-password', resetPassword);

export default router;