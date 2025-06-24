import express from 'express';
import { createTodo, deleteTodo, getAllTodos, getTodo, updateTodo } from '../controllers/todo.controller';
const router = express.Router();

// GET all todos
router.get('/', getAllTodos);

// GET single todo
router.get('/:id', getTodo);

// CREATE a new todo
router.post('/create', createTodo);

// UPDATE a todo
router.put('/update/:id', updateTodo);

// DELETE a todo
router.delete('/delete/:id', deleteTodo);

export default router;
