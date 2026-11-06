import { Router } from 'express';
import {
  getAll,
  getPlaces,
  getHospitals,
  getAtms,
  getContacts,
} from './directory.controller.js';

const router = Router();

// GET /api/directory/all
router.get('/all', getAll);

// GET /api/directory/places OR mounted directly
router.get('/places', getPlaces);
router.get('/hospitals', getHospitals);
router.get('/atms', getAtms);
router.get('/contacts', getContacts);

export default router;
