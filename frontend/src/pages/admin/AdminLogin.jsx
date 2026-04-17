import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signin } from '../../api/auth';
import { setCredentials } from '../../store/authSlice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await signin({ email, password });
      const user = res?.data?.data?.user;
      if (!user) throw new Error('Invalid response from server');
      if (user.role !== 'admin') {
        setError('Access denied. This portal is for administrators only.');
        return;
      }
      dispatch(setCredentials({ user }));
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-gray-950 to-gray-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-900/50 mb-4">
            <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Medi<span className="text-[#db2777]">Cure</span> Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1">Restricted access — administrators only</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h2 className="text-xl font-bold text-white mb-6">Sign In to Admin Panel</h2>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-950/60 border border-red-800/60 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-400 text-[18px] mt-0.5 shrink-0">error</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[20px]">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@medicure.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[20px]">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#db2777] to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-pink-900/40 hover:from-pink-600 hover:to-rose-500 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  Sign in as Admin
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600 text-xs">
            Not an admin?{' '}
            <Link to="/login" className="text-[#db2777] hover:text-pink-400 font-semibold transition-colors">
              User Login →
            </Link>
          </p>
          <p className="text-gray-700 text-xs">
            Unauthorized access attempts are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
