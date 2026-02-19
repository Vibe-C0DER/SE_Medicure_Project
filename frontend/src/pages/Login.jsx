import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { signin } from '../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signin({ email, password });
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
          <Link
            to="/login"
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl shadow-sm bg-white text-medicure-pink transition-all duration-300 ring-1 ring-gray-100 text-center"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-gray-500 hover:text-medicure-pink transition-all duration-300 hover:bg-white/50 text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="fade-in max-w-md w-full mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h2>
          <p className="text-gray-500">Enter your credentials to access your personalized health dashboard.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-medicure-pink transition-colors">mail</span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200"
                id="email"
                placeholder="hello@medicure.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              <Link to="#" className="text-xs font-semibold text-medicure-pink hover:text-medicure-pink-dark hover:underline transition-colors">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-medicure-pink transition-colors">lock</span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer custom-checkbox relative select-none">
              <input
                type="checkbox"
                className="sr-only"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
              <div className="custom-checkbox-box w-5 h-5 border border-gray-300 rounded bg-white flex items-center justify-center transition-all duration-200 hover:border-medicure-pink">
                <svg className="w-3.5 h-3.5 text-white hidden pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-3 text-sm text-gray-600">Keep me logged in</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-medicure-pink hover:bg-medicure-pink-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medicure-pink transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
              <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXcCRae48RhEGVFswX6lLkx_iTf-FyBc-fFtSaRp1MTN1c106lRNBeXjEfAF0fR-m7KweR3iEWlWbOZC3dKo_aIrs3BgkveDtCqc88D9Fzc7plJVvfruzRYJS8ORes35bZLF6w0a6EBx_xmNyc4P7nyrSPhMT1G3XfMIkw17U3e6cnfkV0tmh6SeXh0OwJHb5K8xomYOlKgIBb6-tJqd3DVl178r6-b9GzYHJrRwf9lwr_gkEK3eW7zy8SG2Uug95UKSxpPv_0zLmW" />
              <span className="text-sm font-medium text-gray-600">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
              <img alt="Apple Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5-UvrLY0scUrb8T5wLH8rlUQg7pkXSlqQuddj7SwbmSU5b0p_jARM_eNUma4QfoHOTkxE2dsSh1IMI9z1f7UiPs8fqxVXwXx1632WOOLytzG9HjM6jEsip-jxxkDDjQfeVmDnA-fjTGP5ka1UUwX3N3rPNt8V8ZaX-EKAoA_Axys8ph0YzRhJTpXWdyY0EZkRp49Lj8xOa4tFKT0nxRN9STjecgEkaRX74WEfFTv3G5Zo21XMMMIJsb74V9w6tD8EBl6Ajdh5AWM-" />
              <span className="text-sm font-medium text-gray-600">Apple</span>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
