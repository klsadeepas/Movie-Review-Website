import express from 'express';
import { getComments, createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getComments);
router.post('/', protect, createComment);

export default router;
