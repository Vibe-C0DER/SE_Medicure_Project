import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: 'Sarah Jenkins',
    age: 32,
    gender: 'female',
    location: 'San Francisco, CA',
    bio: 'Interested in holistic nutrition and preventive cardiology. Currently following a Mediterranean diet plan.'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  const handleDiscard = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen text-slate-800 dark:text-slate-100 selection:bg-primary/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex mb-8 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">Profile Settings</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-[#2d1522] rounded-2xl shadow-soft p-4 border border-pink-100 dark:border-pink-900/20 sticky top-24 transition-all">
              <nav className="space-y-1">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-3 bg-pink-50 dark:bg-pink-900/20 text-primary font-semibold rounded-xl transition-all"
                >
                  <span className="material-icons mr-3 text-[20px]">person</span>
                  Profile
                </Link>
                <Link 
                  to="#" 
                  className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                >
                  <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">monitor_heart</span>
                  Health Records
                </Link>
                <Link 
                  to="#" 
                  className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                >
                  <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">calendar_month</span>
                  Appointments
                </Link>
                <Link 
                  to="#" 
                  className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                >
                  <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">favorite_border</span>
                  Favorites
                </Link>
                <div className="pt-4 mt-4 border-t border-pink-50 dark:border-pink-900/20">
                  <Link 
                    to="#" 
                    className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                  >
                    <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">settings</span>
                    Settings
                  </Link>
                  <Link 
                    to="#" 
                    className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                  >
                    <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">lock</span>
                    Privacy
                  </Link>
                </div>
              </nav>
            </div>
            
            {/* <div className="mt-6 bg-gradient-to-br from-primary to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-pink-300/50 dark:shadow-none transition-all">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 opacity-20 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-yellow-300">verified</span>
                  <h3 className="font-bold text-lg">MediCure Plus</h3>
                </div>
                <p className="text-pink-50 text-sm mb-5 leading-relaxed">
                  Upgrade for 24/7 specialist chat and advanced health analytics.
                </p>
                <button className="bg-white/95 text-primary hover:bg-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all w-full flex items-center justify-center gap-2">
                  View Plans <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>
            </div> */}
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-[#2d1522] rounded-2xl shadow-soft border border-pink-100 dark:border-pink-900/20 p-8 relative overflow-hidden transition-all">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-[#2d1522] transition-all"></div>
              <div className="relative flex flex-col sm:flex-row items-end sm:items-end gap-6 pt-10">
                <div className="relative group mx-auto sm:mx-0">
                  <div className="p-1 bg-white dark:bg-[#2d1522] rounded-full transition-all">
                    <img 
                      alt="Profile Avatar" 
                      className="h-32 w-32 rounded-full object-cover ring-4 ring-pink-50 dark:ring-pink-900 transition-all" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm8x5elOsxUzZ7ZaKOT_i2PBdErMFJuQw3hgXI5pT4uPTVdtHXLqHrOc43XbQHwPlO1L3xbGqB8fWEfIULGugbBitnQwcWfoK9MAYTWcUwLXNgJik9QRMkrNMTjd9pwEabidSiN5-S9hunjNJER0DVDk_YS-MrgkildQO6yXG-el2HXeEiMXRmXhZixxmgpS1fqBNu2Gyyyoi8yDISS1fjIkNERRAQVEJr8EMu-pOTNzPUCo33vGeZuyndZygH4aTZonlFhO5DUb-K"
                    />
                  </div>
                  <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-pink-600 hover:scale-105 transition-all ring-4 ring-white dark:ring-[#2d1522]">
                    <span className="material-icons text-sm block">edit</span>
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">
                    {formData.fullname}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1 transition-colors">
                    <span className="material-icons text-sm text-pink-400">email</span>
                    sarah.jenkins@example.com
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto mb-2 justify-center sm:justify-end">
                  <button className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                    <span className="material-icons text-sm">visibility</span>
                    Public View
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="bg-white dark:bg-[#2d1522] rounded-2xl shadow-soft border border-pink-100 dark:border-pink-900/20 transition-all">
              <div className="px-8 py-6 border-b border-pink-50 dark:border-pink-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Personal Information</h2>
                  <p className="text-sm text-slate-500 mt-1">Update your personal details and bio here.</p>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary text-sm font-medium hover:text-pink-700 transition-colors"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Information'}
                </button>
              </div>
              
              <div className="p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors" htmlFor="fullname">
                      Full Name
                    </label>
                    <input 
                      className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all placeholder:text-slate-400 px-4 py-2.5" 
                      id="fullname" 
                      name="fullname"
                      type="text" 
                      value={formData.fullname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors" htmlFor="age">
                      Age
                    </label>
                    <input 
                      className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all px-4 py-2.5" 
                      id="age" 
                      name="age"
                      type="number" 
                      value={formData.age}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors" htmlFor="gender">
                      Gender
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all appearance-none px-4 py-2.5 pr-10" 
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                      <span className="material-icons absolute right-3 top-3 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors" htmlFor="location">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons text-pink-400 text-lg">location_on</span>
                      </div>
                      <input 
                        className="pl-10 w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all px-4 py-2.5" 
                        id="location" 
                        name="location"
                        type="text" 
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors" htmlFor="bio">
                      Health Interests & Bio
                    </label>
                    <textarea 
                      className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all p-3 resize-none" 
                      id="bio" 
                      name="bio"
                      placeholder="Share any specific health interests or conditions..." 
                      rows="4"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    ></textarea>
                    <p className="mt-2 text-xs text-slate-400 flex items-center gap-1 transition-colors">
                      <span className="material-icons text-[14px]">info</span>
                      Used to personalize your daily feed recommendations.
                    </p>
                  </div>
                </form>
              </div>
              
              {isEditing && (
                <div className="px-8 py-4 bg-slate-50 dark:bg-black/20 border-t border-pink-50 dark:border-pink-900/20 flex justify-end gap-3 rounded-b-2xl transition-all">
                  <button 
                    onClick={handleDiscard}
                    className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-dark focus:ring-4 focus:ring-primary/30 transition-all shadow-md shadow-pink-200 dark:shadow-none flex items-center gap-2"
                  >
                    <span className="material-icons text-sm">save</span>
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Delete Account Section */}
            <div className="bg-red-50/50 dark:bg-red-900/5 rounded-2xl border border-red-100 dark:border-red-900/20 overflow-hidden transition-all">
              <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1 transition-colors">Delete Account</h3>
                  <p className="text-sm text-red-600/70 dark:text-red-300/60 max-w-xl leading-relaxed">
                    This action cannot be undone. All your personal data, medical history, appointments, and saved specialists will be permanently removed from MediCure servers.
                  </p>
                </div>
                <button className="shrink-0 px-5 py-2.5 bg-white dark:bg-red-950 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/40 transition-all shadow-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
