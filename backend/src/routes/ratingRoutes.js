import express from 'express';
import { getRatings, createOrUpdateRating } from '../controllers/ratingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getRatings);
router.post('/', protect, createOrUpdateRating);

export default router;
