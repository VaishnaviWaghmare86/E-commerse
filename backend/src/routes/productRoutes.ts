import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} from '../controllers/productController';

const router = Router();

// Approvals queue routes must be defined before /:id parameter
router.get('/pending', getPendingProducts);
router.put('/:id/approve', approveProduct);
router.put('/:id/reject', rejectProduct);

// General product routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
