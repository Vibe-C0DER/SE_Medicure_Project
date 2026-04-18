import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { forgotPassword } from '../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccess(res?.data?.message || 'Reset link sent to your email.');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Something went wrong. Please try again.'
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password? 🔒</h2>
          <p className="text-gray-500">No worries, we'll send you reset instructions. Please enter the email registered with your account.</p>
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
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-medicure-pink hover:bg-medicure-pink-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medicure-pink transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Sending link...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
