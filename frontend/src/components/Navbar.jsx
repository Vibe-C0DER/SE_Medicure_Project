import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../api/auth';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email || 'Guest';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // Ignore network failures; still clear client auth state.
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

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
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-[10px] text-pink-500">
                  {isAuthenticated ? 'Member' : 'Not logged in'}
                </p>
              </div>
              <img 
                alt="User profile picture" 
                className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-200 dark:ring-pink-900 hover:ring-primary transition-all cursor-pointer" 
                src={user?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              />
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="ml-2 hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-200 hover:text-primary hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-full transition-all"
                >
                  <span className="material-icons text-[18px]">logout</span>
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="ml-2 hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-200 hover:text-primary hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-full transition-all"
                >
                  <span className="material-icons text-[18px]">login</span>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
