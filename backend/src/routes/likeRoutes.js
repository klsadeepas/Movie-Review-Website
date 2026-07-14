import express from 'express';
import { toggleLike } from '../controllers/likeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/reviews/:reviewId/like', protect, toggleLike);

export default router;