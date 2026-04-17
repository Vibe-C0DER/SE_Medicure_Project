import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats, getRecentActivity } from '../../api/admin.api';

const StatCard = ({ title, value, icon, colorClass, bgClass, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${colorClass} ${bgClass}`}>{trend}</span>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-800">{value ?? '—'}</h3>
      <p className="text-sm font-medium text-slate-500 mt-0.5">{title}</p>
    </div>
  </div>
);

const QuickAction = ({ label, icon, to, color }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${color} hover:shadow-md transition-all group`}
    >
      <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-xs font-bold text-center leading-tight">{label}</span>
    </button>
  );
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data.data))
      .catch(() => setStatsError(true))
      .finally(() => setStatsLoading(false));

    getRecentActivity()
      .then(r => setRecent(r.data.data))
      .catch(() => {})
      .finally(() => setRecentLoading(false));
  }, []);

  const statCards = stats ? [
    { title: 'Total Users', value: stats.totalUsers, icon: 'group', colorClass: 'text-violet-600', bgClass: 'bg-violet-100', trend: 'Active' },
    { title: 'Total Diseases', value: stats.totalDiseases, icon: 'coronavirus', colorClass: 'text-rose-500', bgClass: 'bg-rose-100', trend: 'Tracked' },
    { title: 'Total Symptoms', value: stats.totalSymptoms, icon: 'sick', colorClass: 'text-amber-500', bgClass: 'bg-amber-100', trend: 'Mapped' },
    { title: 'Medical Articles', value: stats.totalArticles, icon: 'article', colorClass: 'text-blue-500', bgClass: 'bg-blue-100', trend: 'Published' },
    { title: 'Patient Reports', value: stats.totalReports, icon: 'assessment', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-100', trend: 'Submitted' },
  ] : [];

  const chartData = stats?.reportsLast7Days?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
    Reports: d.count,
  })) || [];

  const articlesChartData = stats?.articlesLast7Days?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
    Articles: d.count,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Real-time insights into your MediCure platform.</p>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 border border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" /><div className="h-8 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : statsError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm font-medium">Failed to load stats. Please refresh.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction label="Manage Diseases" icon="coronavirus" to="/admin/diseases" color="border-rose-200 text-rose-500 hover:bg-rose-50" />
          <QuickAction label="Manage Symptoms" icon="sick" to="/admin/symptoms" color="border-amber-200 text-amber-500 hover:bg-amber-50" />
          <QuickAction label="View Articles" icon="article" to="/admin/articles" color="border-blue-200 text-blue-500 hover:bg-blue-50" />
          <QuickAction label="Manage Users" icon="group" to="/admin/users" color="border-violet-200 text-violet-500 hover:bg-violet-50" />
        </div>
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        {/* <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Reports This Week</h3>
              <p className="text-xs text-slate-400 mt-0.5">New symptom reports submitted in the last 7 days</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded-full">Live</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#db2777" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }} />
                <Area type="monotone" dataKey="Reports" stroke="#db2777" strokeWidth={2.5} fill="url(#reportGrad)" dot={{ r: 4, fill: '#db2777', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No report data available</div>
          )}
        </div> */}

        {/* Articles Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Articles This Week</h3>
              <p className="text-xs text-slate-400 mt-0.5">Medical articles generated in the last 7 days</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-600 rounded-full">AI Generated</span>
          </div>
          {articlesChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350} >
              <AreaChart data={articlesChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="articleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }} />
                <Area type="monotone" dataKey="Articles" stroke="#3b82f6" strokeWidth={2.5} fill="url(#articleGrad)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No article data available</div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Reports This Week</h3>
              <p className="text-xs text-slate-400 mt-0.5">New symptom reports submitted in the last 7 days</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded-full">Live</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#db2777" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }} />
                <Area type="monotone" dataKey="Reports" stroke="#db2777" strokeWidth={2.5} fill="url(#reportGrad)" dot={{ r: 4, fill: '#db2777', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No report data available</div>
          )}
        </div>

        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
          {recentLoading ? (
            <div className="space-y-3 flex-1">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : !recent ? (
            <p className="text-slate-400 text-sm">Could not load activity.</p>
          ) : (
            <div className="space-y-1 flex-1 overflow-y-auto">
              {recent.recentReports.map(r => (
                <div key={r._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">assessment</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {r.user ? `${r.user.firstName} ${r.user.lastName}` : 'User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{r.topDisease?.name || 'Report submitted'}</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">{timeAgo(r.createdAt)}</span>
                </div>
              ))}
              {recent.recentDiseases.map(d => (
                <div key={d._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-rose-500 text-[16px]">coronavirus</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 capitalize truncate">{d.name}</p>
                    <p className="text-xs text-slate-400">Disease added</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">{timeAgo(d.createdAt)}</span>
                </div>
              ))}
              {recent.recentArticles.map(a => (
                <div key={a._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-[16px]">article</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">Article created</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">{timeAgo(a.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">System Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'API Server', status: 'Operational', icon: 'cloud_done', color: 'text-emerald-600 bg-emerald-100' },
            { name: 'Database (MongoDB)', status: 'Connected', icon: 'database', color: 'text-emerald-600 bg-emerald-100' },
            { name: 'AI Service (Gemini)', status: 'Available', icon: 'auto_awesome', color: 'text-blue-600 bg-blue-100' },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">{s.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-600">{s.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
