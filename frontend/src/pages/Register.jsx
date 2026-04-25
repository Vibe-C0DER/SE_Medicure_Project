import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import AuthLayout from '../components/auth/AuthLayout';
import { signin, signup, googleSignIn } from '../api/auth';
import { setCredentials } from '../store/authSlice';
import { validateRegister } from '../utils/validation/auth.validation';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors((prev) => {
      const err = { ...prev };
      delete err[name];
      return err;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agreeTerms) return;
    
    setError('');
    
    const validation = validateRegister(form);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "Passwords must match" }));
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      // Auto-login after successful registration
      const res = await signin({ email: form.email, password: form.password });
      const data = res?.data || {};
      dispatch(setCredentials({ user: data }));
      navigate('/');
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        setError(
          'Cannot reach the server. Make sure the backend is running and connected to MongoDB (it must start successfully on port 5000).'
        );
      } else {
        const message =
          err.response?.data?.message || err.message || 'Registration failed. Please try again.';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      setError('');
      const res = await googleSignIn({ access_token: tokenResponse.access_token });
      const payload = res?.data || {};
      const { data } = payload;
      if (data?.user) {
        dispatch(setCredentials({ user: data.user }));
      }
      navigate('/');
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        setError('Cannot reach the server. Make sure the backend is running.');
      } else {
        const message = err.response?.data?.message || err.message || 'Google login failed.';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google authentication failed')
  });

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
          <Link
            to="/login"
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-gray-500 hover:text-medicure-pink transition-all duration-300 hover:bg-white/50 text-center"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl shadow-sm bg-white text-medicure-pink transition-all duration-300 ring-1 ring-gray-100 text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="fade-in max-w-md w-full mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500">Join MediCure to start your health journey today.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="fname">First Name</label>
              <input
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200"
                id="fname"
                name="firstName"
                placeholder="Jane"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lname">Last Name</label>
              <input
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200"
                id="lname"
                name="lastName"
                placeholder="Doe"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-email">Email Address</label>
            <input
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200"
              id="reg-email"
              name="email"
              placeholder="name@example.com"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-password">Password</label>
            <input
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200"
              id="reg-password"
              name="password"
              placeholder="Create a password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Must be at least 8 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-confirmPassword">Confirm Password</label>
            <input
              className={`block w-full px-4 py-3 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medicure-pink/20 focus:border-medicure-pink focus:bg-white transition-all duration-200`}
              id="reg-confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
          </div>
          <div className="pt-2">
            <label className="flex items-start cursor-pointer custom-checkbox relative select-none">
              <input
                type="checkbox"
                className="sr-only"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <div className="custom-checkbox-box w-5 h-5 mt-0.5 border border-gray-300 rounded bg-white flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:border-medicure-pink">
                <svg className="w-3.5 h-3.5 text-white hidden pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-3 text-xs text-gray-600 leading-relaxed">
                I agree to the <Link to="/terms" className="text-medicure-pink hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-medicure-pink hover:underline font-medium">Privacy Policy</Link>.
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={!form.agreeTerms || loading}
            className="w-full py-3.5 px-4 mt-2 bg-medicure-pink hover:bg-medicure-pink-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medicure-pink transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creating account...' : 'Create Account'}
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
          <div className="mt-6">
            <button 
              type="button" 
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 w-full transition-all duration-200 shadow-sm"
            >
              <img alt="Google" className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
              <span className="text-sm font-semibold text-gray-700">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
