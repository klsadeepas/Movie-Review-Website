import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubmitMovie = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    director: '',
    poster: '',
    banner: '',
    trailer: '',
    releaseDate: '',
    duration: '',
    language: '',
    country: '',
    genres: [],
  });
  const [allGenres, setAllGenres] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/genres');
        setAllGenres(response.data.genres || []);
      } catch (err) {
        console.error('Failed to fetch genres', err);
      }
    };
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setForm({ ...form, genres: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/movies', { ...form, genre: form.genres }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Movie submitted successfully! It will be reviewed by an admin shortly.');
      setTimeout(() => navigate('/movies'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit movie.');
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Submit a Movie</h1>
        <p className="mt-2 text-slate-400">Contribute to MovieVerse by adding a new movie. Your submission will be reviewed by our team.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {error && <p className="text-amber-400 md:col-span-2">{error}</p>}
        {message && <p className="text-emerald-400 md:col-span-2">{message}</p>}
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <input name="director" value={form.director} onChange={handleChange} placeholder="Director" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="min-h-28 rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" />
        <input name="poster" value={form.poster} onChange={handleChange} placeholder="Poster Image URL" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <input name="banner" value={form.banner} onChange={handleChange} placeholder="Banner Image URL" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <input name="trailer" value={form.trailer} onChange={handleChange} placeholder="Trailer Video URL (e.g., YouTube)" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" />
        <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} placeholder="Release Date" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duration (minutes)" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <input name="language" value={form.language} onChange={handleChange} placeholder="Language" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
        <select multiple name="genres" value={form.genres} onChange={handleGenreChange} className="min-h-28 rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2">
          <option disabled>Select Genres (Ctrl/Cmd + Click for multiple)</option>
          {allGenres.map((genre) => (<option key={genre._id} value={genre._id}>{genre.name}</option>))}
        </select>
        <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 md:col-span-2" type="submit">Submit for Review</button>
      </form>
    </div>
  );
};

export default SubmitMovie;