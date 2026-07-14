import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset instructions');
      setMessage('');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
      <h1 className="mb-2 text-3xl font-semibold text-white">Forgot Password</h1>
      <p className="mb-6 text-slate-400">Enter your email and we’ll send a reset link if your account exists.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full rounded bg-amber-500 px-4 py-3 font-semibold text-slate-950" type="submit">
          Send reset link
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-4 text-sm text-amber-400">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
