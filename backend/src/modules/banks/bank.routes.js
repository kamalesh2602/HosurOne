import { Router } from 'express';
import { getAllBanks, getBankById } from './bank.controller.js';

const router = Router();

// GET /api/banks
router.get('/', getAllBanks);

// GET /api/banks/:id
router.get('/:id', getBankById);

export default router;

