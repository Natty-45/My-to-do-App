import { Response, Request } from 'express';
import Collection from '../models/collection.model';
import Todo from '../models/to-do.model';

export const createCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, color, icon, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Collection name is required.' });
    }

    const existing = await Collection.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'A collection with this name already exists.' });
    }

    const collection = await Collection.create({
      name: name.trim(),
      color: color || '#7c3aed',
      icon: icon || 'folder',
      description: description?.trim(),
    });

    return res.status(201).json({ message: 'Collection created successfully', data: collection });
  } catch (error: any) {
    console.error('Error creating collection:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A collection with this name already exists.' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllCollections = async (_req: Request, res: Response): Promise<any> => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });

    // Get todo counts for each collection
    const collectionsWithCounts = await Promise.all(
      collections.map(async (col) => {
        const todoCount = await Todo.countDocuments({ collectionId: col._id });
        return {
          ...col.toObject(),
          todoCount,
        };
      })
    );

    return res.status(200).json({
      message: 'Collections fetched successfully',
      count: collectionsWithCounts.length,
      data: collectionsWithCounts,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    const todoCount = await Todo.countDocuments({ collectionId: id });

    return res.status(200).json({
      message: 'Collection fetched successfully',
      data: { ...collection.toObject(), todoCount },
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, color, icon, description } = req.body;

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (description !== undefined) updateData.description = description?.trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'At least one field must be provided to update.' });
    }

    const updated = await Collection.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: 'Collection updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating collection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    // Unset collectionId from all todos in this collection
    await Todo.updateMany({ collectionId: id }, { $unset: { collectionId: '' } });

    return res.status(200).json({ message: 'Collection deleted successfully.' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
