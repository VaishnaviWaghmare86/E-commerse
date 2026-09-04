import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Kids E-Commerce API is running!' });
});

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Start Server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
