import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { resetPassword } from '../api/auth';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, { password });
      setSuccess(res?.data?.message || 'Password updated successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Invalid or expired token. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="fade-in max-w-md w-full mx-auto pb-4">
        <div className="mb-8">
          <Link to="/login" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-medicure-pink transition-colors mb-6 group">
            <span className="material-symbols-outlined text-[20px] mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to login
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Set New Password ✨</h2>
          <p className="text-gray-500">Your new password must be securely formed with at least eight characters.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start text-emerald-700 text-sm">
              <span className="material-symbols-outlined mr-2">check_circle</span>
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">New Password</label>
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-medicure-pink transition-colors">lock</span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200"
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full py-3.5 px-4 bg-medicure-pink hover:bg-medicure-pink-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medicure-pink transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
