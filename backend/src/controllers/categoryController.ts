import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true },
      where: { parentId: null } // Get top-level categories by default
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, parentId } = req.body;
    const category = await prisma.category.create({
      data: { name, slug, description, parentId }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};
