import express from 'express';
const router = express.Router();

// GET all todos
router.get('/', (req, res) => {
  res.send('To-do list');
});

// GET single todo
router.get('/:id', (req, res) => {
  res.send('To-do details');
});

// CREATE a new todo
router.post('/create', (req, res) => {
  res.send('To-do created');
});

// UPDATE a todo
router.put('/:id', (req, res) => {
  res.send('To-do updated');
});

// DELETE a todo
router.delete('/:id', (req, res) => {
  res.send('To-do deleted');
});

export default router;
