const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="text-3xl font-semibold text-white">0</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Movies</p>
          <p className="text-3xl font-semibold text-white">0</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Reviews</p>
          <p className="text-3xl font-semibold text-white">0</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Reports</p>
          <p className="text-3xl font-semibold text-white">0</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <h2 className="text-2xl font-semibold text-white">Admin Tools</h2>
        <p className="mt-3 text-slate-400">Movie approval, genre management, user moderation, featured listings, and analytics can be added here in the full production rollout.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
