import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { apiResponse } from './utils/apiResponse.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// Register Models
import './models/index.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import officerRoutes from './routes/officerRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

// Initialize Express
const app = express();

// ==========================================
// FIX: Render Reverse Proxy Configuration
// ==========================================

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ==========================================
// Security HTTP Headers
// ==========================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// ==========================================
// CORS Configuration
// ==========================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://civic-setu-theta.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// ==========================================
// Request Logging
// ==========================================

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ==========================================
// Body Parsers
// ==========================================

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ==========================================
// API Root Route
// ==========================================

app.get('/', (req, res) => {
  return apiResponse(
    res,
    200,
    'Welcome to CivicSetu Municipal Grievance API',
    {
      status: 'UP',
      service: 'CivicSetu Backend',
      version: '1.0.0',
      healthCheck: '/api/health',
      publicStats: '/api/public/stats',
    }
  );
});

// ==========================================
// Health Check Route
// ==========================================

app.get('/api/health', (req, res) => {
  return apiResponse(
    res,
    200,
    'CivicSetu Municipal Grievance API is operational',
    {
      status: 'UP',
      version: '1.0.0',
      service: 'CivicSetu Backend',
      timestamp: new Date().toISOString(),
      aiEngine: process.env.AI_PROVIDER || 'rule',
    }
  );
});

// ==========================================
// Static Uploads Directory
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ==========================================
// API Routes
// ==========================================

app.use('/api/public', publicRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/grievances', grievanceRoutes);

app.use('/api/officer', officerRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/notifications', notificationRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use(notFound);

// ==========================================
// Centralized Error Handler
// ==========================================

app.use(errorHandler);

// ==========================================
// IMPORTANT: Export Express Application
// ==========================================

export default app;