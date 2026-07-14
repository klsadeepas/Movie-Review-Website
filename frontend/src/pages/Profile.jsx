import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadLists = async () => {
      if (!user) return;
      const token = localStorage.getItem('token');
      const [watchlistRes, favoritesRes] = await Promise.all([
        axios.get('/api/watchlist', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/favorites', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setWatchlist(watchlistRes.data.items || []);
      setFavorites(favoritesRes.data.items || []);
    };

    loadLists();
  }, [user]);

  if (!user) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-white">{user.name}</h1>
        <p className="mt-2 text-slate-400">{user.email}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Watchlist</h2>
          {watchlist.length === 0 ? <p className="text-slate-400">No movies saved yet.</p> : watchlist.map((item) => <p key={item._id} className="text-slate-300">• {item.movie?.title}</p>)}
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Favorites</h2>
          {favorites.length === 0 ? <p className="text-slate-400">No favorites yet.</p> : favorites.map((item) => <p key={item._id} className="text-slate-300">• {item.movie?.title}</p>)}
        </div>
      </div>
    </div>
  );
};

export default Profile;
