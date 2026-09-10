import { Request, Response } from 'express';
import { dbStore, ReviewItem } from '../data/dbStore';

export const getReviews = (req: Request, res: Response) => {
  try {
    const reviews = dbStore.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const addReview = (req: Request, res: Response) => {
  try {
    const { productId, customerName, customerEmail, rating, comment } = req.body;
    
    // Find the product to get its name, image, and vendorId
    const product = dbStore.getProducts().find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview: ReviewItem = {
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
      status: 'Approved' // Auto-approve per user request
    };

    dbStore.addReview(newReview);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
};

export const deleteReview = (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const success = dbStore.deleteReview(id);
    if (success) {
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};
