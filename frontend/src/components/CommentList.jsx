import { useEffect, useState } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

const Comment = ({ comment, reviewId, onCommentAdded }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-sm text-slate-200">{comment.text}</p>
      <div className="mt-2 flex items-center gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">By {comment.user?.name || 'Anonymous'}</p>
        <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs text-amber-400 hover:underline">
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>
      </div>
      {showReplyForm && (
        <div className="mt-3">
          <CommentForm
            reviewId={reviewId}
            parentId={comment._id}
            onCommentAdded={() => {
              setShowReplyForm(false);
              onCommentAdded();
            }}
            isReply
          />
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-3 space-y-3 border-l-2 border-slate-800 pl-4">
          {comment.replies.map((reply) => (
            <Comment key={reply._id} comment={reply} reviewId={reviewId} onCommentAdded={onCommentAdded} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentList = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [reviewId, refreshKey]);

  return (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-white">Comments</h5>
      {comments.length === 0 ? (
        <p className="text-sm text-slate-400">No comments yet.</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} reviewId={reviewId} onCommentAdded={() => setRefreshKey(k => k + 1)} />
          ))}
        </div>
      )}
      <hr className="border-slate-800" />
      <CommentForm reviewId={reviewId} onCommentAdded={() => setRefreshKey(k => k + 1)} />
    </div>
  );
};

export default CommentList;
