import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFilm, FiUser, FiLogIn, FiLogOut, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/notifications/unread-count', { headers: { Authorization: `Bearer ${token}` } });
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch unread count', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-amber-400">
          <FiFilm size={24} /> MovieVerse
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <button onClick={toggleTheme} className="hover:text-slate-900 dark:hover:text-white">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <Link to="/movies" className="hover:text-slate-900 dark:hover:text-white">Movies</Link>
          {user && <Link to="/submit-movie" className="hover:text-slate-900 dark:hover:text-white">Submit Movie</Link>}
          {user && <Link to="/profile" className="hover:text-slate-900 dark:hover:text-white">Profile</Link>}
          {user && (
            <Link to="/notifications" className="relative hover:text-slate-900 dark:hover:text-white">
              <FiBell />
              {unreadCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">{unreadCount}</span>}
            </Link>
          )}
          {user?.role === 'admin' && <Link to="/admin" className="hover:text-slate-900 dark:hover:text-white">Admin</Link>}
          {user ? (
            <button onClick={logout} className="flex items-center gap-1 rounded border border-slate-300 px-3 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
              <FiLogOut /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 rounded bg-amber-500 px-3 py-2 font-medium text-slate-950 hover:bg-amber-400">
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="flex items-center gap-1 rounded border border-slate-300 px-3 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                <FiUser /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
