import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-2xl">
      <h1 className="mb-2 text-3xl font-semibold text-slate-900 dark:text-white">Login</h1>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Access your account and continue reviewing movies.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-amber-400">{error}</p>}
        <input className="w-full rounded border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded bg-amber-500 px-4 py-3 font-semibold text-slate-950" type="submit">Login</button>
      </form>
      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link className="text-amber-400 hover:text-amber-200" to="/forgot-password">Forgot password?</Link>
        <p>Need an account? <Link className="text-amber-400 hover:text-amber-200" to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
