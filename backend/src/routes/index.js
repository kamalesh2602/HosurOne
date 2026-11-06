import { Router } from 'express';
import config from '../config/env.js';
import { getDbStatus } from '../config/db.js';
import weatherRoutes from '../modules/weather/weather.routes.js';
import governmentRoutes from '../modules/government/government.routes.js';
import bankRoutes from '../modules/banks/bank.routes.js';

const router = Router();

/**
 * Health check endpoint: GET /api/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'HosurOne API Backend',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: getDbStatus(),
      weatherProvider: config.weather.provider,
    },
  });
});

// Weather API routes
router.use('/weather', weatherRoutes);

// Government & Public Services API routes
router.use('/government', governmentRoutes);

// Bank Branch Finder API routes
router.use('/banks', bankRoutes);

export default router;
