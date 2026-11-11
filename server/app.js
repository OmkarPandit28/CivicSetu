import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiResponse } from './utils/apiResponse.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

import './models/index.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Trust one reverse proxy hop on Render
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// API Root Route
app.get('/', (req, res) => {
  return apiResponse(res, 200, 'Welcome to CivicSetu Municipal Grievance API', {
    status: 'UP',
    service: 'CivicSetu Backend',
    version: '1.0.0',
    healthCheck: '/api/health',
    publicStats: '/api/public/stats'
  });
});