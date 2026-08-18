import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import scholarshipRoutes from './routes/scholarshipRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai-advisor', aiRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };

  res.json({
    status: 'ok',
    database: statusMap[dbState] || 'unknown',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
