import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingLatest(true);
      try {
        // Fetch only a few movies for the homepage
        const response = await axios.get('/api/movies?limit=6');
        setMovies(response.data.movies || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingLatest(false);
      }
    };

    const fetchTrendingMovies = async () => {
      setLoadingTrending(true);
      try {
        const response = await axios.get('/api/movies/trending');
        setTrendingMovies(response.data.movies || []);
      } catch (error) {
        console.error('Failed to fetch trending movies', error);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchMovies();
    fetchTrendingMovies();
  }, []);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 dark:shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-400">MovieVerse</p>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-6xl">Discover, review, and rate your next favorite movie.</h1>
            <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">A production-ready movie review platform built with the MERN stack, featuring rich movie discovery, user reviews, and polished UI.</p>
            <div className="flex gap-4">
              <Link to="/movies" className="rounded bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400">Explore Movies</Link>
              <Link to="/register" className="rounded border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">Join Community</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 dark:border-slate-700 dark:bg-slate-900/70">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">Reviews</p>
                <p className="text-3xl font-semibold text-slate-900 dark:text-white">1k+</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">Users</p>
                <p className="text-3xl font-semibold text-slate-900 dark:text-white">500+</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 sm:col-span-2 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">Featured</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">Netflix-inspired experience with dark mode and modern UI.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Latest Movies</h2>
          <Link to="/movies" className="text-sm text-amber-400">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loadingLatest
            ? Array.from({ length: 6 }).map((_, index) => <MovieCardSkeleton key={index} />)
            : movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
          }
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Trending This Week</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loadingTrending
            ? Array.from({ length: 6 }).map((_, index) => <MovieCardSkeleton key={index} />)
            : trendingMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
          }
        </div>
      </section>
    </div>
  );
};

export default Home;
