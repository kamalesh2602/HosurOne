import { Router } from 'express';
import config from '../config/env.js';
import { getDbStatus } from '../config/db.js';
import weatherRoutes from '../modules/weather/weather.routes.js';
import governmentRoutes from '../modules/government/government.routes.js';
import bankRoutes from '../modules/banks/bank.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import submissionRoutes from '../modules/submissions/submission.routes.js';
import adminRoutes from '../modules/submissions/admin.routes.js';
import directoryRoutes from '../modules/directory/directory.routes.js';
import {
  getPlaces,
  getHospitals,
  getAtms,
  getContacts,
} from '../modules/directory/directory.controller.js';

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

// Authentication routes
router.use('/auth', authRoutes);

// Community Contribution & Submissions routes
router.use('/submissions', submissionRoutes);

// Admin Moderation & Privileges routes
router.use('/admin', adminRoutes);

// Weather API routes
router.use('/weather', weatherRoutes);

// Government & Public Services API routes
router.use('/government', governmentRoutes);

// Bank Branch Finder API routes
router.use('/banks', bankRoutes);

// Directory API routes
router.use('/directory', directoryRoutes);

// Direct alias endpoints for public directory resources
router.get('/places', getPlaces);
router.get('/hospitals', getHospitals);
router.get('/atms', getAtms);
router.get('/contacts', getContacts);

export default router;
