import React, { useEffect, useState } from 'react';
import { getAdminReports, deleteReport } from '../../api/admin.api';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = reports.filter(r =>
  r.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
  r.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
  r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
  r.topDisease?.name?.toLowerCase().includes(search.toLowerCase())
);

  const fetchReports = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await getAdminReports(p, 10);
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(1); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report permanently?')) return;
    try { await deleteReport(id); setReports(prev => prev.filter(r => r._id !== id)); }
    catch { alert('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Patient Reports</h2>
        <p className="text-sm text-slate-500">All symptom check reports submitted by users</p>
      </div> */}

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
  <div>
    <h2 className="text-xl font-bold text-slate-800">Patient Reports</h2>
    <p className="text-sm text-slate-500">All symptom check reports submitted by users</p>
  </div>

  <div className="relative">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">
      search
    </span>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search reports..."
      className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 w-64 transition-all"
    />
  </div>
</div>
      
      


      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><span className="material-symbols-outlined animate-spin text-3xl text-pink-500">sync</span></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                    <th className="p-4 font-semibold">Patient</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Top Disease</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-800">
                        {r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Unknown User'}
                      </td>
                      <td className="p-4 text-sm text-slate-500">{r.user?.email || '—'}</td>
                      <td className="p-4 text-sm font-semibold text-rose-600 capitalize">{r.topDisease?.name || '—'}</td>
                      <td className="p-4 text-sm text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
  <tr>
    <td colSpan="5" className="p-10 text-center text-slate-400">
      {search ? `No results for "${search}"` : 'No reports found'}
    </td>
  </tr>
)}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t border-slate-100">
                <button disabled={page <= 1} onClick={() => fetchReports(page - 1)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold disabled:opacity-40 hover:bg-slate-200 transition-colors">← Prev</button>
                <span className="px-3 py-1.5 text-sm text-slate-600 font-semibold">Page {page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => fetchReports(page + 1)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold disabled:opacity-40 hover:bg-slate-200 transition-colors">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
