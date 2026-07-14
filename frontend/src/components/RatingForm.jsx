import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RatingForm = ({ movieId, onRated }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(8);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please log in to rate this movie.');
      return;
    }

    try {
      await axios.post(
        '/api/ratings',
        { movie: movieId, value: rating },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage('Thanks for rating!');
      onRated?.();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to submit rating.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h3 className="text-xl font-semibold text-white">Rate this movie</h3>
      <p className="mt-2 text-slate-400">Give your rating and help shape the score.</p>
      <div className="mt-4 flex items-center gap-4">
        <input
          type="range"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-amber-400">{rating}/10</span>
      </div>
      <button className="mt-4 rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950" type="submit">
        Submit Rating
      </button>
      {message && <p className="mt-3 text-sm text-amber-400">{message}</p>}
    </form>
  );
};

export default RatingForm;
