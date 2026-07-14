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

export const getChartData = async (_req, res, next) => {
  try {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      };
    }).reverse();

    const getMonthlyData = async (model) => {
      const data = await model.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) },
          },
        },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
      ]);

      return months.map((m) => {
        const found = data.find((d) => d._id.year === m.year && d._id.month === m.month);
        return found ? found.count : 0;
      });
    };

    const [users, movies] = await Promise.all([
      getMonthlyData(User),
      getMonthlyData(Movie),
    ]);

    const labels = months.map((m) => m.name);
    res.json({ success: true, chartData: { labels, users, movies } });
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
