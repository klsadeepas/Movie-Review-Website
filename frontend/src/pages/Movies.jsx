import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [sort, setSort] = useState('latest');
  const sortOptions = ['latest', 'oldest', 'highest-rated', 'lowest-rated', 'alphabetical'];

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get('/api/genres');
      setGenres(response.data.genres || []);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (genre) params.set('genre', genre);
        if (year) params.set('year', year);
        if (language) params.set('language', language);
        if (country) params.set('country', country);
        params.set('sort', sort);
        params.set('page', page);

        const response = await axios.get(`/api/movies?${params.toString()}`);
        setMovies(response.data.movies || []);
        setTotalPages(response.data.totalPages || 1);
        setPage(response.data.currentPage || 1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, [search, genre, year, language, country, sort, page]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-white">Browse Movies</h1>
          <p className="text-slate-400">Search by title, director, actor, year, language, or country.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search movies" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
            <option value="">All Genres</option>
            {genres.map((item) => <option key={item._id} value={item.name}>{item.name}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
            {sortOptions.map((option) => (
              <option key={option} value={option} className="capitalize">{option.replace('-', ' ')}</option>
            ))}
          </select>
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
          <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
          <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
        </div>
      </div>

      {movies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-400">No movies found matching your criteria.</div>
      )}

      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50">Previous</button>
        <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="rounded border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Movies;
