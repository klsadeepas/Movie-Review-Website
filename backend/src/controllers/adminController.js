import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import Genre from '../models/Genre.js';

export const getAdminOverview = async (_req, res, next) => {
  try {
    const [users, movies, reviews, genres] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Review.countDocuments(),
      Genre.countDocuments(),
    ]);

    res.json({ success: true, overview: { users, movies, reviews, genres } });
  } catch (error) {
    next(error);
  }
};

export const createMovieAdmin = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, createdBy: req.user._id, status: 'approved' });
    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

export const deleteMovieAdmin = async (req, res, next) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted' });
  } catch (error) {
    next(error);
  }
};

export const createGenreAdmin = async (req, res, next) => {
  try {
    const genre = await Genre.create(req.body);
    res.status(201).json({ success: true, genre });
  } catch (error) {
    next(error);
  }
};
