import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../api/auth';
import { logout } from '../../store/authSlice';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try { await signOut(); } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Users', path: '/admin/users', icon: 'group' },
    { name: 'Diseases', path: '/admin/diseases', icon: 'coronavirus' },
    { name: 'Symptoms', path: '/admin/symptoms', icon: 'sick' },
    { name: 'Articles', path: '/admin/articles', icon: 'article' },
    { name: 'Reports', path: '/admin/reports', icon: 'assessment' },
    { name: 'Messages', path: '/admin/messages', icon: 'mail' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 text-[#db2777]">
              <span className="material-symbols-outlined font-bold text-2xl">health_and_safety</span>
              <span className="font-bold text-lg tracking-tight">Admin<span className="text-slate-900">Panel</span></span>
            </div>
          )}
          {!isSidebarOpen && <span className="material-symbols-outlined font-bold text-2xl text-[#db2777] mx-auto">health_and_safety</span>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`${isSidebarOpen ? '' : 'absolute -right-3 top-5 bg-white border border-slate-200 rounded-full h-6 w-6 shadow-sm'} text-slate-400 hover:text-slate-600 flex justify-center items-center`}
          >
            <span className="material-symbols-outlined text-[18px]">{isSidebarOpen ? 'menu_open' : 'chevron_right'}</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-pink-50 text-[#db2777]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                } ${!isSidebarOpen && 'justify-center'}`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div className="h-8 w-8 rounded-full bg-pink-100 text-[#db2777] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800 truncate">{user?.firstName} {user?.lastName}</span>
                <span className="text-[10px] text-slate-500">Administrator</span>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-slate-400 hover:text-red-500 transition-colors" title="Logout">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-[#db2777] hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors border border-pink-100 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            Visit Site
          </button>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
