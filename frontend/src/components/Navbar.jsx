import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#2d1522]/90 backdrop-blur-md border-b border-pink-100 dark:border-pink-900/30 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-pink-400 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200 dark:shadow-none transition-all">
              <span className="material-icons text-white">medical_services</span>
            </div>
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
              Medi<span className="text-primary">Cure</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-pink-50 dark:bg-black/20 px-4 py-2 rounded-full border border-pink-100 dark:border-pink-900/20 w-72 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-icons text-pink-400 text-sm">search</span>
              <input 
                className="bg-transparent border-none text-sm w-full focus:ring-0 text-slate-700 dark:text-slate-200 placeholder-pink-300 dark:placeholder-pink-800/50 ml-2 transition-all" 
                placeholder="Search conditions, doctors..." 
                type="text"
              />
            </div>
            <button className="relative p-2 rounded-full text-pink-400 hover:text-primary hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-white dark:ring-[#2d1522] transition-all"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-pink-100 dark:border-pink-900/30">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Sarah Jenkins</p>
                <p className="text-[10px] text-pink-500">Premium Member</p>
              </div>
              <img 
                alt="User profile picture" 
                className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-200 dark:ring-pink-900 hover:ring-primary transition-all cursor-pointer" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-FnirbVqtEkIp3IXoyFv0a9keIv02gp7lWjcvIit9aR-vmsum5gxC483nn5jnzfb1SJOxN6H3te4a6F9rms2Dg7x_FEYuYMAg5CVaiq4Oc__Osu4nLvi9ru5B9-TqlfFAmdvIReCtlsAu1shT76LT7fGDx-zCvOpRxIG0zTwfxLnef7GSzqgCyI1hNEKO0YJT6Jfeqvw_4OjT-pxPg3QGLLk887TJBmu3vqVe8hBmSYSyLYkzv4VQTyxCHduMGT9kRoRVCp1M60IJ"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
