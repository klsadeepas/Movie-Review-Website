import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiBookmark, FiStar } from 'react-icons/fi';
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
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);

  // Ref for the last review element to observe for infinite scroll
  const observer = useRef();
  const lastReviewElementRef = useCallback(node => {
    if (loadingMoreReviews) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && reviewPage < reviewTotalPages) {
        setReviewPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMoreReviews, reviewPage, reviewTotalPages]);

  const fetchMovie = async () => {
    const response = await axios.get(`/api/movies/${id}`);
    setMovie(response.data.movie);
  };

  const fetchReviews = async (pageNumber = 1) => {
    setLoadingMoreReviews(true);
    try {
      const response = await axios.get(`/api/reviews?movie=${id}&page=${pageNumber}&limit=5`); // Fetch 5 reviews at a time
      if (pageNumber === 1) {
        setReviews(response.data.reviews || []);
      } else {
        setReviews(prevReviews => [...prevReviews, ...(response.data.reviews || [])]);
      }
      setReviewTotalPages(response.data.totalPages || 1);
      setReviewPage(response.data.currentPage || 1);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoadingMoreReviews(false);
    }
  };

  const checkUserLists = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    try {
      const [watchlistRes, favoritesRes] = await Promise.all([
        axios.get('/api/watchlist', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/favorites', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setIsInWatchlist(watchlistRes.data.items.some((item) => item.movie._id === id));
      setIsInFavorites(favoritesRes.data.items.some((item) => item.movie._id === id));
    } catch (error) {
      console.error('Failed to fetch user lists', error);
    }
  };

  useEffect(() => {
    fetchMovie();
    fetchReviews(1); // Fetch initial reviews
  }, [id]);

  useEffect(() => {
    checkUserLists();
  }, [id, user]);

  useEffect(() => {
    if (reviewPage > 1) {
      fetchReviews(reviewPage);
    }
  }, [reviewPage]);

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

  const toggleListItem = async (listType) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const endpoint = listType === 'watchlist' ? '/api/watchlist' : '/api/favorites';
    const setter = listType === 'watchlist' ? setIsInWatchlist : setIsInFavorites;

    try {
      // Optimistic update
      setter((prev) => !prev);
      await axios.post(endpoint, { movieId: id }, { headers: { Authorization: `Bearer ${token}` } });
      // No need to re-fetch, the state is already updated.
      // For more robustness, you could re-fetch on success or revert on error.
    } catch (error) {
      console.error(`Failed to toggle ${listType}`, error);
      setter((prev) => !prev); // Revert on error
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
            <div className="flex items-center gap-2">
              {user && (
                <>
                  <button
                    onClick={() => toggleListItem('watchlist')}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-slate-800 ${isInWatchlist ? 'border-sky-500 text-sky-400' : 'border-slate-700 text-slate-300'}`}
                  >
                    <FiBookmark className={isInWatchlist ? 'fill-current' : ''} />
                    <span>{isInWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
                  </button>
                  <button
                    onClick={() => toggleListItem('favorites')}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-slate-800 ${isInFavorites ? 'border-amber-500 text-amber-400' : 'border-slate-700 text-slate-300'}`}
                  >
                    <FiStar className={isInFavorites ? 'fill-current' : ''} />
                    <span>{isInFavorites ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </>
              )}
              <div className="rounded-full bg-amber-500/20 px-3 py-2 text-amber-400">
                <span className="text-base">⭐</span>
                <span className="ml-1 font-semibold">{movie.ratingAverage || 0}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300">{movie.description}</p>
          <div className="flex flex-wrap gap-2">
            {movie.genre?.map((genre) => (
              <span key={genre._id || genre} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">{genre.name || genre}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]" id="reviews-section">
        <div className="space-y-6">
          <ReviewForm movieId={id} onReviewAdded={() => fetchReviews()} />
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">No reviews yet. Be the first to write one.</div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <div ref={reviews.length === index + 1 ? lastReviewElementRef : null} className="flex flex-wrap items-center justify-between gap-4">
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
                      <CommentList reviewId={review._id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loadingMoreReviews && <div className="text-center text-slate-400">Loading more reviews...</div>}
        </div>

        <RatingForm movieId={id} onRated={() => fetchMovie()} />
      </div>
    </div>
  );
};

export default MovieDetail;
