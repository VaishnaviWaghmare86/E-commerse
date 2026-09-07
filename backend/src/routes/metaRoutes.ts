import { Router, Request, Response } from 'express';
import { dbStore } from '../data/dbStore';

export const brandRouter = Router();
brandRouter.get('/', (req: Request, res: Response) => {
  try {
    res.json(dbStore.getBrands());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

export const ageGroupRouter = Router();
ageGroupRouter.get('/', (req: Request, res: Response) => {
  try {
    res.json(dbStore.getAgeGroups());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch age groups' });
  }
});

export const offerRouter = Router();
offerRouter.get('/', (req: Request, res: Response) => {
  try {
    res.json(dbStore.getOffers());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});
