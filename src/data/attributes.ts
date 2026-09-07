import type { Attribute } from '../types';

export const initialAttributes: Attribute[] = [
  {
    id: 'attr-1',
    name: 'Color',
    slug: 'color',
    values: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Pastel Mint', 'Classic White'],
  },
  {
    id: 'attr-2',
    name: 'Size',
    slug: 'size',
    values: ['XS', 'S', 'M', 'L', 'XL', 'Free Size'],
  },
  {
    id: 'attr-3',
    name: 'Age Group',
    slug: 'age-group',
    values: ['0-12 Months', '1-2 Years', '3-5 Years', '6-8 Years', '8-12 Years', '12+ Years'],
  },
  {
    id: 'attr-4',
    name: 'Material',
    slug: 'material',
    values: ['Organic Cotton', 'Natural Wood', 'ABS Plastic', 'Plush Fleece', 'Silicone (BPA Free)', 'Recycled Cardboard'],
  },
  {
    id: 'attr-5',
    name: 'Brand',
    slug: 'brand',
    values: ['KidsPlay Signature', 'LittleJoy', 'WonderKid', 'EcoCub', 'PlaySpark'],
  },
  {
    id: 'attr-6',
    name: 'Pattern',
    slug: 'pattern',
    values: ['Solid', 'Striped', 'Dinosaur Print', 'Animal Cartoon', 'Floral', 'Polka Dots'],
  },
];
