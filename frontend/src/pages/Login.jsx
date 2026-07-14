import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
      <h1 className="mb-2 text-3xl font-semibold text-white">Login</h1>
      <p className="mb-6 text-slate-400">Access your account and continue reviewing movies.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded bg-amber-500 px-4 py-3 font-semibold text-slate-950" type="submit">Login</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">Need an account? <Link className="text-amber-400" to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
