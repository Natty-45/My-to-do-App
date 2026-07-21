import { Response, Request } from 'express';
import Todo from '../models/to-do.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const createTodo = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, description, status, priority, dueDate, category, tags, subtasks, recurring, collectionId } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    // Get the highest order for the collection (or overall) to append to the end
    const filter: Record<string, any> = {};
    if (collectionId) filter.collectionId = collectionId;
    const lastTodo = await Todo.findOne(filter).sort({ order: -1 });
    const nextOrder = (lastTodo?.order ?? -1) + 1;

    const newTodo = await Todo.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      category: category || undefined,
      tags: tags || [],
      subtasks: subtasks || [],
      recurring: recurring || { interval: 'none' },
      collectionId: collectionId || null,
      order: nextOrder,
    });

    return res.status(201).json({ message: 'Todo created successfully', data: newTodo });
  } catch (error: any) {
    console.error('Error creating todo:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A todo with this title already exists.' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllTodos = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status, priority, category, search, sortBy, order, collectionId, tag } = req.query;

    // Build filter object
    const filter: Record<string, any> = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (collectionId) filter.collectionId = collectionId;
    if (collectionId === 'none') filter.collectionId = null;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sortField = (sortBy as string) || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: Record<string, any> = { [sortField]: sortOrder };

    const todos = await Todo.find(filter).sort(sortOptions);

    return res.status(200).json({
      message: 'Todos fetched successfully',
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTodo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    return res.status(200).json({ message: 'Todo fetched successfully', data: todo });
  } catch (error) {
    console.error('Error fetching todo:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, category, tags, subtasks, recurring, collectionId, order } = req.body;

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (subtasks !== undefined) updateData.subtasks = subtasks;
    if (recurring !== undefined) updateData.recurring = recurring;
    if (collectionId !== undefined) updateData.collectionId = collectionId || null;
    if (order !== undefined) updateData.order = order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'At least one field must be provided to update.' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: 'Todo updated successfully', data: updatedTodo });
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const bulkDelete = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'An array of IDs is required.' });
    }

    const result = await Todo.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ message: `${result.deletedCount} todos deleted.` });
  } catch (error) {
    console.error('Error bulk deleting todos:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const reorderTodos = async (req: Request, res: Response): Promise<any> => {
  try {
    const { items } = req.body;
    // items: Array<{ _id: string, order: number }>
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'An array of items with _id and order is required.' });
    }

    const operations = items.map((item: { _id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    await Todo.bulkWrite(operations);

    return res.status(200).json({ message: 'Todos reordered successfully.' });
  } catch (error) {
    console.error('Error reordering todos:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
