import Review from '../models/Review.js';
import { createNotification } from './notificationController.js';

export const toggleLike = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const likeIndex = review.likes.findIndex((id) => id.equals(userId));

    if (likeIndex > -1) {
      review.likes.splice(likeIndex, 1); // Unlike
    } else {
      review.likes.push(userId); // Like
      // Don't notify user for their own action
      if (review.user.toString() !== userId.toString()) {
        const message = `${req.user.name} liked your review: "${review.title}"`;
        createNotification(review.user, message, `/movies/${review.movie}`);
      }
    }

    await review.save();
    res.json({ success: true, likes: review.likes.length });
  } catch (error) {
    next(error);
  }
};