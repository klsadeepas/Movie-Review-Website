import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', review: '', rating: 8 });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to leave a review.');
      return;
    }

    try {
      await axios.post('/api/reviews', { movie: movieId, ...form }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setForm({ title: '', review: '', rating: 8 });
      setError('');
      onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to post review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <h3 className="text-xl font-semibold text-white">Write a review</h3>
      {error && <p className="text-sm text-amber-400">{error}</p>}
      <input
        className="w-full rounded border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        placeholder="Review title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="min-h-28 w-full rounded border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        placeholder="Share your thoughts about this movie..."
        value={form.review}
        onChange={(e) => setForm({ ...form, review: e.target.value })}
      />
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-400">Rating</label>
        <input
          type="range"
          min="1"
          max="10"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          className="w-40"
        />
        <span className="text-amber-400">{form.rating}/10</span>
      </div>
      <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950" type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
