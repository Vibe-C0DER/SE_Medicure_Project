import React, { useState } from 'react';
import { createContactMessage } from '../api/contact.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setApiError('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await createContactMessage(formData);
      setSuccessMsg('Your message has been sent successfully. We will get back to you shortly!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-pink-900/5 border border-pink-100/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-pink-600 text-[32px]">mail</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Contact Us</h2>
            <p className="mt-3 text-sm text-slate-500 max-w-sm mx-auto">
              Have a question or need support? Send us a message and our team will be in touch.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-sm text-emerald-800">
                <span className="material-symbols-outlined text-emerald-500 shrink-0">check_circle</span>
                <p>{successMsg}</p>
              </div>
            )}
            
            {apiError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-800">
                <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
                <p>{apiError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} text-sm focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} text-sm focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Subject</label>
              <input
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} text-sm focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all`}
                placeholder="How can we help?"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Message</label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} text-sm focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none`}
                placeholder="Write your message here..."
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-pink-200/50 text-sm font-bold text-white bg-[#db2777] hover:bg-pink-700 hover:shadow-pink-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined mr-2 text-[18px]">send</span>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
