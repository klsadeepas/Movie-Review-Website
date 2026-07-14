const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 px-4 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© 2026 MovieVerse. Discover, review, and share your favorite films.</p>
        <div className="flex gap-4">
          <span>Trending</span>
          <span>Reviews</span>
          <span>Watchlist</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
