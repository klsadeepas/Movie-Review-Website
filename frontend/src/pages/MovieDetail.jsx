import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchMovie = async () => {
    const response = await axios.get(`/api/movies/${id}`);
    setMovie(response.data.movie);
  };

  const fetchReviews = async () => {
    const response = await axios.get('/api/reviews');
    setReviews(response.data.reviews.filter((review) => review.movie?._id === id || review.movie === id));
  };

  useEffect(() => {
    fetchMovie();
    fetchReviews();
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

      <ReviewForm movieId={id} onReviewAdded={() => fetchReviews()} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Recent Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-slate-400">No reviews yet. Be the first to write one.</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{review.title}</h3>
                  <span className="text-amber-400">★ {review.rating}/10</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{review.review}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">By {review.user?.name || 'Anonymous'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
