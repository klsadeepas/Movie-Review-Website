import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(`/api/auth/verify/${token}`);
        setMessage(response.data.message);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to verify email');
        setMessage('');
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
      <h1 className="mb-2 text-3xl font-semibold text-white">Email Verification</h1>
      {message && <p className="text-slate-400">{message}</p>}
      {error && <p className="text-amber-400">{error}</p>}
      <div className="mt-6">
        <Link to="/login" className="rounded bg-amber-500 px-4 py-3 text-slate-950">
          Continue to login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
