import { Router } from 'express';
import {
  getAll,
  getLocalDirectory,
  getPlaces,
  getHospitals,
  getAtms,
  getContacts,
} from './directory.controller.js';

const router = Router();

// GET /api/directory and /api/directory/all
router.get('/', getAll);
router.get('/all', getAll);
router.get('/local', getLocalDirectory);

// GET /api/directory/places OR mounted directly
router.get('/places', getPlaces);
router.get('/hospitals', getHospitals);
router.get('/atms', getAtms);
router.get('/contacts', getContacts);

export default router;
