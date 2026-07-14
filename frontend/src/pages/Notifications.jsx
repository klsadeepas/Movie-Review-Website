import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadNotifications();
  }, [user]);

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, read: true } : item)));
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">Please log in to view your notifications.</div>;
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Notifications</h1>
        <p className="mt-2 text-slate-400">Stay up to date with review flags and account updates.</p>
      </div>
      {notifications.length === 0 ? (
        <p className="text-slate-400">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification._id} className={`rounded-2xl border ${notification.read ? 'border-slate-700 bg-slate-950/70' : 'border-amber-500 bg-amber-500/10'} p-4`}>
              <p className="text-slate-200">{notification.message}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
                {!notification.read && (
                  <button onClick={() => markRead(notification._id)} className="rounded bg-amber-500 px-3 py-1 text-slate-950">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
