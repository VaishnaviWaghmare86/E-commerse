import express from 'express';
import { getReviews, addReview, deleteReview } from '../controllers/reviewController';

const router = express.Router();

router.get('/', getReviews);
router.post('/', addReview);
router.delete('/:id', deleteReview);

export default router;
