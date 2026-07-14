import { Link } from 'react-router-dom';
import { FiFilm, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-amber-400">
          <FiFilm size={24} /> MovieVerse
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <Link to="/movies" className="hover:text-white">Movies</Link>
          <Link to="/profile" className="hover:text-white">Profile</Link>
          <Link to="/admin" className="hover:text-white">Admin</Link>
          {user ? (
            <button onClick={logout} className="flex items-center gap-1 rounded border border-slate-700 px-3 py-2 hover:bg-slate-800">
              <FiLogOut /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 rounded bg-amber-500 px-3 py-2 font-medium text-slate-950 hover:bg-amber-400">
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="flex items-center gap-1 rounded border border-slate-700 px-3 py-2 hover:bg-slate-800">
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
