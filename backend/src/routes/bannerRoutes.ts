import { Router, Request, Response } from 'express';
import { dbStore } from '../data/dbStore';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const banners = dbStore.getBanners();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

export default router;
