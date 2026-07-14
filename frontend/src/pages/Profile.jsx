import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: '', bio: '', country: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadLists = async () => {
      if (!user) return;
      setProfileForm({ name: user.name || '', bio: user.bio || '', country: user.country || '' });
      const token = localStorage.getItem('token');
      const [watchlistRes, favoritesRes, reviewsRes] = await Promise.all([
        axios.get('/api/watchlist', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/favorites', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/users/reviews', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setWatchlist(watchlistRes.data.items || []);
      setFavorites(favoritesRes.data.items || []);
      setReviews(reviewsRes.data.reviews || []);
    };

    loadLists();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', profileForm, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/password', passwordForm, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password.');
    }
  };

  if (!user) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0f172a&color=fff`} alt={user.name} className="h-24 w-24 rounded-full border-2 border-slate-700" />
        <div>
          <h1 className="text-3xl font-semibold text-white">{user.name}</h1>
          <p className="mt-1 text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="border-b border-slate-800">
        <nav className="-mb-px flex space-x-6">
          <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'profile' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>Edit Profile</button>
          <button onClick={() => setActiveTab('password')} className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'password' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>Change Password</button>
          <button onClick={() => setActiveTab('reviews')} className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'reviews' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>My Reviews</button>
          <button onClick={() => setActiveTab('watchlist')} className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'watchlist' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>Watchlist</button>
          <button onClick={() => setActiveTab('favorites')} className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'favorites' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>Favorites</button>
        </nav>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        {message && <p className="mb-4 rounded-lg bg-slate-800 p-3 text-center text-sm text-amber-400">{message}</p>}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
            <textarea className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Bio" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} />
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Country" value={profileForm.country} onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })} />
            <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950" type="submit">Save Changes</button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" type="password" placeholder="Current Password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
            <input className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white" type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
            <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950" type="submit">Change Password</button>
          </form>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">My Reviews</h2>
            {reviews.length === 0 ? <p className="text-slate-400">You haven't written any reviews yet.</p> : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <Link to={`/movies/${review.movie._id}`} className="font-semibold text-amber-400 hover:underline">{review.movie.title}</Link>
                    <p className="mt-1 text-sm text-slate-300">{review.review}</p>
                    <p className="mt-2 text-xs text-slate-500">Rated: {review.rating}/10</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Watchlist</h2>
            {watchlist.length === 0 ? <p className="text-slate-400">No movies saved yet.</p> : watchlist.map((item) => <p key={item._id} className="text-slate-300">• {item.movie?.title}</p>)}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Favorites</h2>
            {favorites.length === 0 ? <p className="text-slate-400">No favorites yet.</p> : favorites.map((item) => <p key={item._id} className="text-slate-300">• {item.movie?.title}</p>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
