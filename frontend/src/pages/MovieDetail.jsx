import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiHeart } from 'react-icons/fi';
import ReviewForm from '../components/ReviewForm';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import RatingForm from '../components/RatingForm';
import ReportButton from '../components/ReportButton';
import { useAuth } from '../context/AuthContext';

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [commentRefresh, setCommentRefresh] = useState(0);

  const fetchMovie = async () => {
    const response = await axios.get(`/api/movies/${id}`);
    setMovie(response.data.movie);
  };

  const fetchReviews = async () => {
    const response = await axios.get(`/api/reviews?movie=${id}`);
    setReviews(response.data.reviews || []);
  };

  useEffect(() => {
    fetchMovie();
    fetchReviews();
  }, [id]);

  const handleLike = async (reviewId) => {
    if (!user) return; // Or show a message to login
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/likes/reviews/${reviewId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });

      setReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review._id === reviewId) {
            const isLiked = review.likes.includes(user._id);
            return { ...review, likes: isLiked ? review.likes.filter((id) => id !== user._id) : [...review.likes, user._id] };
          }
          return review;
        })
      );
    } catch (error) {
      console.error('Failed to like review', error);
    }
  };

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
            <div className="rounded-full bg-amber-500/20 px-3 py-2 text-amber-400">⭐ {movie.ratingAverage || 0}</div>
          </div>
          <p className="text-slate-300">{movie.description}</p>
          <div className="flex flex-wrap gap-2">
            {movie.genre?.map((genre) => (
              <span key={genre._id || genre} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">{genre.name || genre}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <ReviewForm movieId={id} onReviewAdded={() => fetchReviews()} />
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">No reviews yet. Be the first to write one.</div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{review.title}</h3>
                    <p className="mt-2 text-slate-400">{review.review}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">By {review.user?.name || 'Anonymous'}</p>
                  </div>
                  <div className="rounded-full bg-amber-500/20 px-3 py-2 text-amber-400">★ {review.rating}/10</div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(review._id)}
                      className={`flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-slate-800 ${
                        user && review.likes.includes(user._id)
                          ? 'border-rose-500 text-rose-400'
                          : 'border-slate-700 text-slate-300'
                      }`}
                    >
                      <FiHeart className={`${user && review.likes.includes(user._id) ? 'fill-current' : ''}`} />
                      <span>{review.likes.length}</span>
                    </button>
                    <ReportButton reviewId={review._id} onReportSuccess={() => {}} />
                  </div>
                  <button
                    className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    onClick={() => setActiveReviewId(activeReviewId === review._id ? null : review._id)}
                  >
                    {activeReviewId === review._id ? 'Hide' : 'Show'} comments
                  </button>
                  {activeReviewId === review._id && (
                    <div className="space-y-4">
                      <CommentList reviewId={review._id} refreshKey={commentRefresh} />
                      <CommentForm reviewId={review._id} onCommentAdded={() => setCommentRefresh((prev) => prev + 1)} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <RatingForm movieId={id} onRated={() => fetchMovie()} />
      </div>
    </div>
  );
};

export default MovieDetail;
