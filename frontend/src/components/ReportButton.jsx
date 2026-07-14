import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReportButton = ({ reviewId, onReportSuccess }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleReport = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please log in to report reviews.');
      return;
    }
    if (!reason.trim()) {
      setMessage('Please provide a reason.');
      return;
    }

    try {
      await axios.post(
        '/api/reports',
        { review: reviewId, reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage('Report submitted successfully.');
      setReason('');
      setOpen(false);
      onReportSuccess?.();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to submit report');
    }
  };

  return (
    <div className="space-y-2 pt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded border border-rose-500 px-3 py-1 text-sm text-rose-400 hover:bg-rose-500/10"
      >
        {open ? 'Cancel report' : 'Report review'}
      </button>
      {open && (
        <form onSubmit={handleReport} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <textarea
            className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            rows={3}
            placeholder="Why is this review inappropriate?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button className="rounded bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950" type="submit">
            Submit Report
          </button>
        </form>
      )}
      {message && <p className="text-sm text-amber-400">{message}</p>}
    </div>
  );
};

export default ReportButton;
