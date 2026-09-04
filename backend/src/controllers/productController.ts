import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { isFeatured, categoryId, search, onSale } = req.query;

    const whereCondition: any = {};
    if (isFeatured === 'true') {
      whereCondition.isFeatured = true;
    }
    if (categoryId) {
      whereCondition.categoryId = String(categoryId);
    }
    if (search) {
      whereCondition.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } }
      ];
    }
    if (onSale === 'true') {
      whereCondition.salePrice = { not: null };
    }

    const products = await prisma.product.findMany({
      where: whereCondition,
      include: {
        category: true,
        images: true,
        variants: { include: { values: { include: { attribute: true } } } },
        attributes: { include: { attribute: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: { include: { values: { include: { attribute: true } } } },
        attributes: { include: { attribute: true } }
      }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, categoryId, basePrice, salePrice, isFeatured } = req.body;
    const product = await prisma.product.create({
      data: { name, slug, description, categoryId, basePrice, salePrice, isFeatured }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};
