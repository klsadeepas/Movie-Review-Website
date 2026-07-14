import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie._id}`} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:border-amber-500">
      <img src={movie.poster || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'} alt={movie.title} className="h-72 w-full object-cover" />
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
          <span className="rounded-full bg-amber-500/20 px-2 py-1 text-sm text-amber-400">★ {movie.ratingAverage || 8.4}</span>
        </div>
        <p className="text-sm text-slate-400">{movie.description?.slice(0, 90)}...</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {movie.genre?.map((genre) => (
            <span key={genre._id || genre} className="rounded-full border border-slate-700 px-2 py-1">{genre.name || genre}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
