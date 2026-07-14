import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('/api/auth/register', form);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
      <h1 className="mb-2 text-3xl font-semibold text-white">Create Account</h1>
      <p className="mb-6 text-slate-400">Join MovieVerse to write reviews and build your watchlist.</p>
      {message ? (
        <p className="text-emerald-400">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-amber-400">{error}</p>}
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="w-full rounded bg-amber-500 px-4 py-3 font-semibold text-slate-950" type="submit">Register</button>
        </form>
      )}
      <p className="mt-4 text-sm text-slate-400">Already have an account? <Link className="text-amber-400" to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
