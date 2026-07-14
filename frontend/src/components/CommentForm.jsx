import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CommentForm = ({ reviewId, onCommentAdded }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to add a comment.');
      return;
    }
    if (!text.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    try {
      await axios.post(
        '/api/comments',
        { review: reviewId, text },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setText('');
      setError('');
      onCommentAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <h4 className="text-sm font-semibold text-white">Add a comment</h4>
      {error && <p className="text-sm text-amber-400">{error}</p>}
      <textarea
        className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        rows={3}
        placeholder="Share your thoughts..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950" type="submit">
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;
