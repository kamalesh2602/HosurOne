import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import apiRoutes from './routes/index.js';
import notFoundHandler from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import rateLimiter from './middleware/rateLimiter.middleware.js';

const app = express();

// Configure CORS
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as server-to-server, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || !config.isProduction) {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' not allowed by CORS policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Apply rate limiting (120 requests per minute per IP)
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 120,
    message: 'Too many requests from this IP to HosurOne API. Please try again in a minute.',
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging in development
if (!config.isProduction) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// Mount all API routes under /api
app.use('/api', apiRoutes);

// Root route redirect or basic service discovery
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'HosurOne Backend API',
    tagline: 'Your Region. Your Community. One Portal.',
    health: '/api/health',
    weather: '/api/weather',
    government: '/api/government',
    banks: '/api/banks',
  });
});

// 404 and Error Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
