import { useEffect, useState } from 'react';
import axios from 'axios';
import LineChart from '../components/LineChart';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({ users: 0, movies: 0, reviews: 0, genres: 0 });
  const [movieForm, setMovieForm] = useState({ title: '', description: '', director: '', language: '', country: '', duration: '' });
  const [genreForm, setGenreForm] = useState({ name: '', description: '' });
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState(null);

  const fetchOverview = async () => {
    const token = localStorage.getItem('token');
    const [overviewRes, reportsRes, chartRes] = await Promise.all([
      axios.get('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/reports', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/admin/charts', { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    setOverview(overviewRes.data.overview || { users: 0, movies: 0, reviews: 0, genres: 0 });
    setReports(reportsRes.data.reports || []);
    if (chartRes.data.chartData) {
      setChartData({
        users: { labels: chartRes.data.chartData.labels, datasets: [{ label: 'New Users', data: chartRes.data.chartData.users, borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.5)' }] },
        movies: { labels: chartRes.data.chartData.labels, datasets: [{ label: 'New Movies', data: chartRes.data.chartData.movies, borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.5)' }] },
      });
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('/api/admin/movies', movieForm, { headers: { Authorization: `Bearer ${token}` } });
    setMovieForm({ title: '', description: '', director: '', language: '', country: '', duration: '' });
    fetchOverview(); // Refresh overview
  };

  const handleGenreSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('/api/admin/genres', genreForm, { headers: { Authorization: `Bearer ${token}` } });
    setGenreForm({ name: '', description: '' });
    fetchOverview(); // Refresh overview
  };

  const handleDeleteReport = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/reports/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setReports((prev) => prev.filter((report) => report._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="text-3xl font-semibold text-white">{overview.users}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Movies</p>
          <p className="text-3xl font-semibold text-white">{overview.movies}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Reviews</p>
          <p className="text-3xl font-semibold text-white">{overview.reviews}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Genres</p>
          <p className="text-3xl font-semibold text-white">{overview.genres}</p>
        </div>
      </div>

      {chartData && (
        <div className="grid gap-6 lg:grid-cols-2">
          <LineChart chartData={chartData.users} title="Monthly User Registrations" />
          <LineChart chartData={chartData.movies} title="Monthly Movies Added" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleMovieSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <h2 className="text-2xl font-semibold text-white">Add Movie</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Title" value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} />
            <textarea className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Description" value={movieForm.description} onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })} />
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Director" value={movieForm.director} onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })} />
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Language" value={movieForm.language} onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })} />
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Country" value={movieForm.country} onChange={(e) => setMovieForm({ ...movieForm, country: e.target.value })} />
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Duration" value={movieForm.duration} onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })} />
            <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950" type="submit">Save Movie</button>
          </div>
        </form>

        <form onSubmit={handleGenreSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <h2 className="text-2xl font-semibold text-white">Add Genre</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Genre Name" value={genreForm.name} onChange={(e) => setGenreForm({ ...genreForm, name: e.target.value })} />
            <textarea className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Description" value={genreForm.description} onChange={(e) => setGenreForm({ ...genreForm, description: e.target.value })} />
            <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950" type="submit">Save Genre</button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <h2 className="text-2xl font-semibold text-white">Reported Reviews</h2>
        {reports.length === 0 ? (
          <p className="text-slate-400">No reports to review.</p>
        ) : (
          <div className="space-y-4 pt-4">
            {reports.map((report) => (
              <div key={report._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Reported by {report.user?.name || 'User'} ({report.user?.email})</p>
                <p className="mt-2 text-white">Reason: {report.reason}</p>
                <p className="mt-2 text-slate-300">Review ID: {report.review?._id}</p>
                <p className="mt-1 text-slate-400">Created: {new Date(report.createdAt).toLocaleString()}</p>
                <button
                  className="mt-3 rounded bg-rose-500 px-4 py-2 text-white"
                  onClick={() => handleDeleteReport(report._id)}
                >
                  Dismiss report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
