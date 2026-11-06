import { Router } from 'express';
import { getAllOffices, getOfficeById } from './government.controller.js';

const router = Router();

// GET /api/government
router.get('/', getAllOffices);

// GET /api/government/:id
router.get('/:id', getOfficeById);

export default router;
