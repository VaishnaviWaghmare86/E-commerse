import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';

const router = Router();

router.get('/', getCategories);
router.post('/', createCategory); // Add auth middleware later

export default router;
