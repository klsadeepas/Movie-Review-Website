import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data.movie);
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        <img src={movie.banner || movie.poster} alt={movie.title} className="h-80 w-full object-cover" />
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">{movie.title}</h1>
              <p className="text-slate-400">{movie.director} • {movie.language}</p>
            </div>
            <div className="rounded-full bg-amber-500/20 px-3 py-2 text-amber-400">⭐ {movie.ratingAverage || 8.4}</div>
          </div>
          <p className="text-slate-300">{movie.description}</p>
          <div className="flex flex-wrap gap-2">
            {movie.genre?.map((genre) => (
              <span key={genre._id || genre} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">{genre.name || genre}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">Reviews</h2>
        <p className="text-slate-400">Review posting, likes, comments, and ratings will be added in the next phase of the build.</p>
      </div>
    </div>
  );
};

export default MovieDetail;
