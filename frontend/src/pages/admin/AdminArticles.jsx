import React, { useEffect, useState } from 'react';
import { getAdminArticles, deleteArticle } from '../../api/admin.api';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const filtered = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminArticles();
      setArticles(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this article?')) return;
    try { await deleteArticle(id); setArticles(prev => prev.filter(a => a._id !== id)); }
    catch { alert('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Articles Management</h2>
          <p className="text-sm text-slate-500">AI-generated &amp; manual medical articles</p>
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><span className="material-symbols-outlined animate-spin text-3xl text-pink-500">sync</span></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Created</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{a.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 uppercase">{a.category || 'general'}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(a._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-400">{search ? `No results for "${search}"` : 'No articles found'}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;
