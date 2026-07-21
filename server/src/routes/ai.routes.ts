import express from 'express';
import { generateTodos } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/generate', generateTodos);

export default router;
