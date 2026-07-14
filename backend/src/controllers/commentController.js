import Comment from '../models/Comment.js';
import Review from '../models/Review.js';

export const getComments = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.review) query.review = req.query.review;

    const comments = await Comment.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { review, text } = req.body;
    const existingReview = await Review.findById(review);
    if (!existingReview) return res.status(404).json({ success: false, message: 'Review not found' });

    const comment = await Comment.create({ review, user: req.user._id, text });
    existingReview.comments.push(comment._id);
    await existingReview.save();

    await comment.populate('user', 'name');

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};