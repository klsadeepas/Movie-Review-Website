import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies');
        setMovies(response.data.movies || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-8 shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-400">MovieVerse</p>
            <h1 className="text-4xl font-bold text-white md:text-6xl">Discover, review, and rate your next favorite movie.</h1>
            <p className="max-w-xl text-lg text-slate-300">A production-ready movie review platform built with the MERN stack, featuring rich movie discovery, user reviews, and polished UI.</p>
            <div className="flex gap-4">
              <Link to="/movies" className="rounded bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400">Explore Movies</Link>
              <Link to="/register" className="rounded border border-slate-600 px-5 py-3 font-semibold hover:bg-slate-800">Join Community</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Reviews</p>
                <p className="text-3xl font-semibold text-white">1k+</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Users</p>
                <p className="text-3xl font-semibold text-white">500+</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:col-span-2">
                <p className="text-sm text-slate-400">Featured</p>
                <p className="text-2xl font-semibold text-white">Netflix-inspired experience with dark mode and modern UI.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Latest Movies</h2>
          <Link to="/movies" className="text-sm text-amber-400">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {movies.slice(0, 6).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
