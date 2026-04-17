import React, { useEffect, useState } from 'react';
import { getAdminSymptoms, deleteSymptom, createSymptom, updateSymptom } from '../../api/admin.api';

const SYMPTOM_CATEGORIES = ['Respiratory',
  'General',
  'Digestive',
  'Skin',
  'Head & Neck',
  'Cardiovascular',
  'Neurological',
  'Musculoskeletal',
  'Custom',
  'Other',];

const AdminSymptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Respiratory' });

  const filtered = symptoms.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminSymptoms();
      setSymptoms(data.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSymptoms(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this symptom permanently?')) return;
    try { await deleteSymptom(id); setSymptoms(prev => prev.filter(s => s._id !== id)); }
    catch { alert('Failed to delete'); }
  };

  const openAdd = () => { setEditingId(null); setFormData({ name: '', description: '', category: 'general' }); setIsModalOpen(true); };
  const openEdit = (s) => { setEditingId(s._id); setFormData({ name: s.name, description: s.description, category: s.category || 'Respiratory' }); setIsModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editingId ? await updateSymptom(editingId, formData) : await createSymptom(formData);
      setIsModalOpen(false); fetchSymptoms();
    } catch (e) { alert(e.response?.data?.message || 'Error saving symptom'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Symptoms Registry</h2>
          <p className="text-sm text-slate-500">Manage all symptoms and their categories</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search symptoms..."
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 w-52 transition-all"
            />
          </div>
          <button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-amber-200 flex items-center gap-2 text-sm shrink-0">
            <span className="material-symbols-outlined text-[18px]">add</span> Add Symptom
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
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800 capitalize">{s.name}</td>
                    <td className="p-4 text-sm text-slate-500 max-w-sm truncate">{s.description}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">{s.category}</span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => openEdit(s)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-400">{search ? `No results for "${search}"` : 'No symptoms found'}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-800">{editingId ? 'Edit Symptom' : 'New Symptom'}</h3>
              <button onClick={() => setIsModalOpen(false)}><span className="material-symbols-outlined text-slate-400 hover:text-slate-600">close</span></button>
            </div>
            <div className="p-6">
              <form id="symptom-form" onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm" placeholder="e.g. Headache" />
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm" rows={3} placeholder="Short description" />
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm">
                    {SYMPTOM_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl text-sm">Cancel</button>
              <button type="submit" form="symptom-form" disabled={saving}
                className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl shadow-md shadow-amber-200 hover:bg-amber-600 transition-colors text-sm disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Symptom'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSymptoms;
