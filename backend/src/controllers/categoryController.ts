import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { dbStore } from '../data/dbStore';

export const getCategories = async (req: Request, res: Response) => {
  try {
    try {
      const categories = await prisma.category.findMany({
        include: {
          children: true,
          products: true
        }
      });
      if (categories && categories.length > 0) {
        return res.json(categories);
      }
    } catch (dbErr) {
      // Fallback
    }

    const categories = dbStore.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, parentId, status, featured, image } = req.body;
    try {
      const category = await prisma.category.create({
        data: { name, slug, description, parentId }
      });
      return res.status(201).json(category);
    } catch (dbErr) {
      // Fallback
    }

    const category = dbStore.createCategory({ name, slug, description, parentId, status, featured, image });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updates = req.body;
    try {
      const updated = await prisma.category.update({
        where: { id },
        data: updates
      });
      if (updated) return res.json(updated);
    } catch (dbErr) {
      // Fallback
    }

    const updated = dbStore.updateCategory(id, updates);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    try {
      await prisma.category.delete({ where: { id } });
      return res.json({ success: true, message: 'Category deleted' });
    } catch (dbErr) {
      // Fallback
    }

    const deleted = dbStore.deleteCategory(id);
    res.json({ success: deleted, message: deleted ? 'Category deleted' : 'Category not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
