import { Request, Response } from 'express';
import { store } from '../data/dbStore';
import { v4 as uuidv4 } from 'uuid';

export const getReviews = (req: Request, res: Response) => {
  try {
    const reviews = store.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const addReview = (req: Request, res: Response) => {
  try {
    const { productId, customerName, customerEmail, rating, comment } = req.body;
    
    // Find the product to get its name, image, and vendorId
    const product = store.getProducts().find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      productName: product.name,
      productImage: product.image,
      vendorId: product.vendorId,
      customerName,
      customerEmail,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Approved' as const // Auto-approve per user request
    };

    store.addReview(newReview);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
};

export const deleteReview = (req: Request, res: Response) => {
  try {
    const success = store.deleteReview(req.params.id);
    if (success) {
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};
