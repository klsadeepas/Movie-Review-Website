import Rating from '../models/Rating.js';
import Movie from '../models/Movie.js';

const updateMovieStats = async (movieId) => {
  const ratings = await Rating.find({ movie: movieId });
  const totalRatings = ratings.length;
  const ratingAverage = totalRatings ? ratings.reduce((sum, item) => sum + item.value, 0) / totalRatings : 0;
  await Movie.findByIdAndUpdate(movieId, { ratingAverage: Number(ratingAverage.toFixed(1)), totalRatings }, { new: true });
};

export const getRatings = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.movie) query.movie = req.query.movie;

    const ratings = await Rating.find(query).populate('user', 'name').sort({ createdAt: -1 });
    res.json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateRating = async (req, res, next) => {
  try {
    const { movie, value } = req.body;
    if (!movie || !value) return res.status(400).json({ success: false, message: 'Movie and rating value are required' });

    const rating = await Rating.findOneAndUpdate(
      { movie, user: req.user._id },
      { value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await updateMovieStats(movie);
    res.status(201).json({ success: true, rating });
  } catch (error) {
    next(error);
  }
};