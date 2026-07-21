import express from 'express';
import {
  createCollection,
  deleteCollection,
  getAllCollections,
  getCollection,
  updateCollection,
} from '../controllers/collection.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getAllCollections);
router.get('/:id', getCollection);
router.post('/create', createCollection);
router.put('/update/:id', updateCollection);
router.delete('/delete/:id', deleteCollection);

export default router;
