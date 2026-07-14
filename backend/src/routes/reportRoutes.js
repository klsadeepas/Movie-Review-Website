import express from 'express';
import { createReport, getReports, deleteReport } from '../controllers/reportController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getReports);
router.post('/', protect, createReport);
router.delete('/:id', protect, adminOnly, deleteReport);

export default router;
