const MovieCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="h-72 w-full animate-pulse bg-slate-300 dark:bg-slate-700"></div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-3/4 animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
          <div className="h-6 w-12 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;