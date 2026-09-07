import { Request, Response } from 'express';
import { dbStore } from '../data/dbStore';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      category,
      brand,
      ageGroup,
      search,
      onSale,
      minPrice,
      maxPrice,
      inStock,
      vendorId,
      isFeatured,
      isNewArrival,
      isBestSeller,
      sortBy,
      allStatus,
      status,
    } = req.query;

    const filter: any = {};
    if (categoryId) filter.categoryId = String(categoryId);
    if (category) filter.category = String(category);
    if (brand) filter.brand = String(brand);
    if (ageGroup) filter.ageGroup = String(ageGroup);
    if (search) filter.search = String(search);
    if (vendorId) filter.vendorId = String(vendorId);
    if (status) filter.status = String(status);
    if (allStatus === 'true') filter.allStatus = true;
    if (onSale === 'true') filter.onSale = true;
    if (inStock === 'true') filter.inStock = true;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isNewArrival !== undefined) filter.isNewArrival = isNewArrival === 'true';
    if (isBestSeller !== undefined) filter.isBestSeller = isBestSeller === 'true';
    if (minPrice) filter.minPrice = Number(minPrice);
    if (maxPrice) filter.maxPrice = Number(maxPrice);
    if (sortBy) filter.sortBy = String(sortBy);

    const products = dbStore.getProducts(filter);
    res.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const product = dbStore.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const created = dbStore.createProduct(data);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updates = req.body;
    const updated = dbStore.updateProduct(id, updates);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = dbStore.deleteProduct(id);
    res.json({ success: deleted, message: deleted ? 'Product deleted successfully' : 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Admin Queue endpoints
export const getPendingProducts = async (req: Request, res: Response) => {
  try {
    const pending = dbStore.getPendingProducts();
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending products' });
  }
};

export const approveProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const approved = dbStore.approveProduct(id);
    if (!approved) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product approved and published to storefront', product: approved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve product' });
  }
};

export const rejectProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { reason } = req.body;
    const rejected = dbStore.rejectProduct(id, reason);
    if (!rejected) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product rejected', product: rejected });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject product' });
  }
};
