import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getAdminUsers, updateUserRole, updateUserStatus, deleteUser } from '../../api/admin.api';

const ROLE_OPTIONS = ['user', 'admin'];

const RoleBadge = ({ role }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
    role === 'admin'
      ? 'bg-violet-100 text-violet-700 border-violet-200'
      : 'bg-slate-100 text-slate-600 border-slate-200'
  }`}>
    {role}
  </span>
);

const AdminUsers = () => {
  const currentUser = useSelector(s => s.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async (p = page, s = debouncedSearch) => {
    setLoading(true); setError('');
    try {
      const { data } = await getAdminUsers(p, s);
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || 0);
      setPage(p);
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchUsers(page, debouncedSearch); }, [page, debouncedSearch]);

  const handleRoleChange = async (id, role) => {
    setUpdatingId(id);
    try {
      const { data } = await updateUserRole(id, role);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: data.data.role } : u));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update role');
    } finally { setUpdatingId(null); }
  };

  const handleStatusToggle = async (id, isActive) => {
    setUpdatingId(id);
    try {
      const { data } = await updateUserStatus(id, !isActive);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.data.isActive } : u));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update status');
    } finally { setUpdatingId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      setTotalUsers(t => t - 1);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">{totalUsers} registered users — manage roles and access</p>
        </div>
        {/* Search */}
        <div className="relative sm:w-72">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-3xl text-violet-500">progress_activity</span>
            <p className="text-slate-400 text-sm">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isSelf = u._id === currentUser?._id || u._id === currentUser?.id;
                  const isUpdating = updatingId === u._id;
                  return (
                    <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      {/* User */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-violet-100 text-violet-600 font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                            {u.firstName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{u.firstName} {u.lastName}</p>
                            {isSelf && <span className="text-[10px] text-violet-500 font-bold">You</span>}
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="p-4 text-sm text-slate-500">{u.email}</td>
                      {/* Role */}
                      <td className="p-4">
                        <select
                          disabled={isSelf || isUpdating}
                          value={u.role}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white cursor-pointer hover:border-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      {/* Status Toggle */}
                      <td className="p-4">
                        <button
                          disabled={isSelf || isUpdating}
                          onClick={() => handleStatusToggle(u._id, u.isActive)}
                          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            u.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          }`}
                         >
                          <div className={`h-2 w-2 rounded-full ${u.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      {/* Joined */}
                      <td className="p-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      {/* Actions */}
                      <td className="p-4 text-right">
                        <button
                          disabled={isSelf}
                          onClick={() => handleDelete(u._id)}
                          title="Delete user"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[18px]">person_remove</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr><td colSpan="6" className="p-10 text-center text-slate-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-slate-100">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold disabled:opacity-40 hover:bg-slate-200 transition-colors">← Prev</button>
            <span className="text-sm text-slate-600 font-semibold">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold disabled:opacity-40 hover:bg-slate-200 transition-colors">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
