import React, { useEffect, useState } from 'react';
import { getAdminDiseases, deleteDisease, createDisease, updateDisease, getAdminSymptoms } from '../../api/admin.api';

const SEVERITIES = ['Low', 'Moderate', 'High'];

const AdminDiseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [symptomsList, setSymptomsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', severity: 'Low', symptoms: [], precautions: '', treatments: '',
  });

  const filtered = diseases.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.severity?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dRes, sRes] = await Promise.all([getAdminDiseases(), getAdminSymptoms()]);
      setDiseases(dRes.data?.data || []);
      setSymptomsList(sRes.data?.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this disease?')) return;
    try { await deleteDisease(id); setDiseases(prev => prev.filter(d => d._id !== id)); }
    catch { alert('Delete failed'); }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', severity: 'mild', symptoms: [], precautions: '', treatments: '' });
    setIsModalOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d._id);
    setFormData({
      name: d.name, description: d.description, severity: d.severity || 'mild',
      symptoms: d.symptoms?.map(s => s._id) || [],
      precautions: d.precautions?.join(', ') || '',
      treatments: d.treatments?.join(', ') || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      precautions: formData.precautions.split(',').map(s => s.trim()).filter(Boolean),
      treatments: formData.treatments.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      editingId ? await updateDisease(editingId, payload) : await createDisease(payload);
      setIsModalOpen(false);
      fetchData();
    } catch (e) { alert(e.response?.data?.message || 'Error saving disease'); }
    finally { setSaving(false); }
  };

  const toggleSymptom = (id) =>
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(id) ? prev.symptoms.filter(x => x !== id) : [...prev.symptoms, id],
    }));

  const severityBadge = (s) => ({
    mild: 'bg-green-50 text-green-700 border-green-200',
    moderate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    severe: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  }[s] || 'bg-slate-50 text-slate-600 border-slate-200');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Diseases Registry</h2>
          <p className="text-sm text-slate-500">Manage all registered diseases and their parameters</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search diseases..."
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 w-52 transition-all"
            />
          </div>
          <button onClick={openAdd} className="bg-[#db2777] hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-pink-200 flex items-center gap-2 text-sm shrink-0">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Disease
          </button>
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
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Severity</th>
                  <th className="p-4 font-semibold">Symptoms</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800 capitalize">{d.name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${severityBadge(d.severity)}`}>
                        {d.severity || '—'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{d.symptoms?.length || 0} linked</td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => openEdit(d)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(d._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="4" className="p-10 text-center text-slate-400">{search ? `No results for "${search}"` : 'No diseases found'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-800">{editingId ? 'Edit Disease' : 'New Disease'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="disease-form" onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 text-sm" placeholder="e.g. Migraine" />
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-pink-400 text-sm" rows={3} placeholder="Short description" />
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Severity</label>
                  <select value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-pink-400 text-sm">
                    {SEVERITIES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
                  <div className="border border-slate-200 rounded-xl p-3 max-h-44 overflow-y-auto bg-slate-50 flex flex-wrap gap-2">
                    {symptomsList.map(s => (
                      <div key={s._id} onClick={() => toggleSymptom(s._id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${formData.symptoms.includes(s._id) ? 'bg-pink-100 border-pink-300 text-pink-700' : 'bg-white border-slate-200 text-slate-600 hover:border-pink-200'}`}>
                        {s.name}
                      </div>
                    ))}
                    {symptomsList.length === 0 && <p className="text-xs text-slate-400">No symptoms available</p>}
                  </div>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Precautions (comma-separated)</label>
                  <input value={formData.precautions} onChange={e => setFormData({ ...formData, precautions: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-pink-400 text-sm" placeholder="e.g. Rest, Stay hydrated" />
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Treatments (comma-separated)</label>
                  <input value={formData.treatments} onChange={e => setFormData({ ...formData, treatments: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-pink-400 text-sm" placeholder="e.g. Paracetamol, Surgery" />
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors text-sm">Cancel</button>
              <button type="submit" form="disease-form" disabled={saving}
                className="px-6 py-2 bg-[#db2777] text-white font-bold rounded-xl shadow-md shadow-pink-200 hover:bg-pink-700 transition-colors text-sm disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Disease'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiseases;
