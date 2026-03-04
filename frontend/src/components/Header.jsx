import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email || 'Profile';

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/50 bg-white/70 px-6 py-4 backdrop-blur-xl lg:px-24 transition-all duration-300">
      <Link to="/" className="flex items-center gap-3 group cursor-pointer">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-200 transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-2xl">local_hospital</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900">MediCure</h2>
      </Link>
      
      <nav className="hidden items-center gap-10 md:flex">
        <Link to="/" className="relative text-sm font-semibold text-gray-600 transition hover:text-primary group">
          Home
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
        </Link>
        <Link to="/" className="relative text-sm font-semibold text-gray-600 transition hover:text-primary group">
          Find Doctors
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
        </Link>
        <Link to="/" className="relative text-sm font-semibold text-gray-600 transition hover:text-primary group">
          Services
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
        </Link>
        <Link to="/" className="relative text-sm font-semibold text-gray-600 transition hover:text-primary group">
          Articles
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Link
            to="/profile"
            className="group flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-primary hover:shadow-pink-200 active:scale-95"
          >
            {displayName}
            <span className="material-symbols-outlined ml-1 text-sm transition-transform group-hover:translate-x-1">
              person
            </span>
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="hidden text-sm font-bold text-gray-500 transition hover:text-primary lg:block"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="group flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-primary hover:shadow-pink-200 active:scale-95"
            >
              Get Started
              <span className="material-symbols-outlined ml-1 text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
