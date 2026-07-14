import { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ reviewId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments?review=${reviewId}`);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Unable to load comments', error);
      }
    };

    if (reviewId) fetchComments();
  }, [reviewId]);

  return (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-white">Comments</h5>
      {comments.length === 0 ? (
        <p className="text-sm text-slate-400">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
            <p className="text-sm text-slate-200">{comment.text}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">By {comment.user?.name || 'Anonymous'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
