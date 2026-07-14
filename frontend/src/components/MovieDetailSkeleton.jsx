const MovieDetailSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="h-80 w-full animate-pulse bg-slate-300 dark:bg-slate-700"></div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="w-3/4 space-y-2">
              <div className="h-8 w-1/2 animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
              <div className="h-5 w-1/3 animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-28 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"></div>
              <div className="h-10 w-28 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
            <div className="h-4 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailSkeleton;