import express from 'express';
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  bulkDelete,
} from '../controllers/todo.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All todo routes are protected
router.use(protect);

// GET all todos (supports ?status=&priority=&search=&sortBy=&order=)
router.get('/', getAllTodos);

// GET single todo
router.get('/:id', getTodo);

// CREATE a new todo
router.post('/create', createTodo);

// UPDATE a todo
router.put('/update/:id', updateTodo);

// DELETE a todo
router.delete('/delete/:id', deleteTodo);

// BULK DELETE todos
router.delete('/bulk/delete', bulkDelete);

export default router;
