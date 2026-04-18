import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { getMe, updateMe } from '../api/user';
import { setCredentials } from '../store/authSlice';
import { validateProfile } from '../utils/validation/profile.validation';

const Profile = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((s) => s.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  const derivedFullname = useMemo(() => {
    const first = authUser?.firstName || '';
    const last = authUser?.lastName || '';
    const full = `${first} ${last}`.trim();
    return full || authUser?.email || 'User';
  }, [authUser]);

  const [formData, setFormData] = useState({
    fullname: derivedFullname,
    age: authUser?.age ?? 18,
    gender: authUser?.gender ?? 'male',
    location: authUser?.location ?? 'India',
    bio: authUser?.bio ?? 'Add your bio here',
  });

  const avatarSrc =
    authUser?.avatar ||
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullname: derivedFullname,
      age: authUser?.age ?? prev.age,
      gender: authUser?.gender ?? prev.gender,
      location: authUser?.location ?? prev.location,
      bio: authUser?.bio ?? prev.bio,
    }));
  }, [derivedFullname, authUser?.age, authUser?.gender, authUser?.location, authUser?.bio]);

  useEffect(() => {
    const load = async () => {
      setError('');
      setSuccess('');
      setLoadingProfile(true);
      try {
        const res = await getMe();
        const me = res?.data;
        if (me) {
          dispatch(setCredentials({ user: me }));
        }
      } catch (err) {
        // If backend is down, keep whatever we have from auth state.
        if (err.response?.data?.message) setError(err.response.data.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    load();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccess('');
    setFieldErrors((prev) => {
      if (!prev?.[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Image upload is not configured. Please contact support.');
      return;
    }

    setError('');
    setSuccess('');
    setAvatarUploading(true);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        const msg = json.error?.message || 'Failed to upload image to Cloudinary.';
        throw new Error(msg);
      }

      const imageUrl = json.secure_url;
      const apiRes = await updateMe({ avatar: imageUrl });
      const updated = apiRes?.data;
      if (updated) {
        dispatch(setCredentials({ user: updated }));
        setSuccess('Avatar updated successfully.');
      }
    } catch (err) {
      const msg = err.message || 'Failed to update avatar. Please try again.';
      setError(msg);
    } finally {
      setAvatarUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSave = () => {
    const run = async () => {
      setError('');
      setSuccess('');

      // Client-side validation for inline errors using Zod
      const validation = validateProfile(formData);
      if (!validation.success) {
        setFieldErrors(validation.errors);
        return;
      }

      setSaving(true);
      try {
        const [firstName = '', ...rest] = String(formData.fullname || '').trim().split(' ');
        const lastName = rest.join(' ').trim();

        const res = await updateMe({
          firstName: firstName || authUser?.firstName,
          lastName: lastName || authUser?.lastName,
          age: Number(formData.age) || 18,
          gender: formData.gender,
          location: formData.location,
          bio: formData.bio,
        });
        const updated = res?.data;
        if (updated) dispatch(setCredentials({ user: updated }));
        setIsEditing(false);
        setFieldErrors({});
        setSuccess('Profile updated successfully.');
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to save profile. Please try again.';

        // Try to map backend message to a specific field
        const m = String(msg || '');
        const mapped = {};
        if (/first name/i.test(m)) mapped.firstName = m;
        if (/last name/i.test(m)) mapped.lastName = m;
        if (/full name/i.test(m) || /name/i.test(m)) mapped.fullname = m;
        if (/age/i.test(m)) mapped.age = m;
        if (/gender/i.test(m)) mapped.gender = m;
        if (/location/i.test(m)) mapped.location = m;
        if (/bio/i.test(m)) mapped.bio = m;
        if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
        else setError(msg);
      } finally {
        setSaving(false);
      }
    };

    run();
  };

  const handleDiscard = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setFormData({
      fullname: derivedFullname,
      age: authUser?.age ?? 18,
      gender: authUser?.gender ?? 'male',
      location: authUser?.location ?? 'India',
      bio: authUser?.bio ?? 'Add your bio here',
    });
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
                  to="/reports/me" 
                  className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                >
                  <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">monitor_heart</span>
                  Health Records
                </Link>
                {/* <Link 
                  to="#" 
                  className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                >
                  <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">calendar_month</span>
                  Appointments
                </Link> */}
                {/* <Link 
                  to="#" 
                  className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-primary dark:hover:text-primary-light font-medium rounded-xl transition-all group"
                >
                  <span className="material-icons mr-3 text-[20px] text-slate-400 group-hover:text-pink-400 transition-colors">favorite_border</span>
                  Favorites
                </Link> */}
                {/* <div className="pt-4 mt-4 border-t border-pink-50 dark:border-pink-900/20">
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
                </div> */}
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
            {(error || loadingProfile) && (
              <div className="bg-white dark:bg-[#2d1522] rounded-2xl shadow-soft border border-pink-100 dark:border-pink-900/20 p-4 transition-all">
                {loadingProfile ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">Loading profile…</p>
                ) : (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
              </div>
            )}
            {/* Profile Header */}
            <div className="bg-white dark:bg-[#2d1522] rounded-2xl shadow-soft border border-pink-100 dark:border-pink-900/20 p-8 relative overflow-hidden transition-all">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-[#2d1522] transition-all"></div>
              <div className="relative flex flex-col sm:flex-row items-end sm:items-end gap-6 pt-10">
                <div className="relative group mx-auto sm:mx-0">
                  <div className="p-1 bg-white dark:bg-[#2d1522] rounded-full transition-all">
                    <img 
                      alt="Profile Avatar" 
                      className="h-32 w-32 rounded-full object-cover ring-4 ring-pink-50 dark:ring-pink-900 transition-all" 
                      src={avatarSrc}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-pink-600 hover:scale-105 transition-all ring-4 ring-white dark:ring-[#2d1522] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="material-icons text-sm block">
                      {avatarUploading ? 'hourglass_empty' : 'edit'}
                    </span>
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">
                    {formData.fullname}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1 transition-colors">
                    <span className="material-icons text-sm text-pink-400">email</span>
                    {authUser?.email || '—'}
                  </p>
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
                {success && (
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    {success}
                  </p>
                )}
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
                    {fieldErrors.fullname && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">{fieldErrors.fullname}</p>
                    )}
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
                    {fieldErrors.age && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">{fieldErrors.age}</p>
                    )}
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
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="material-icons absolute right-3 top-3 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                    {fieldErrors.gender && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">{fieldErrors.gender}</p>
                    )}
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
                    {fieldErrors.location && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">{fieldErrors.location}</p>
                    )}
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
                    {fieldErrors.bio && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">{fieldErrors.bio}</p>
                    )}
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
                    disabled={saving}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-dark focus:ring-4 focus:ring-primary/30 transition-all shadow-md shadow-pink-200 dark:shadow-none flex items-center gap-2"
                  >
                    <span className="material-icons text-sm">save</span>
                    {saving ? 'Saving…' : 'Save Changes'}
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
