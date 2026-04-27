import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyReports, downloadReportPDF } from '../api/report';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      if (data.success) {
        setReports(data.reports);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      console.log('reports error :', err.message);
      setError(err.response?.data?.message || 'Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const blob = await downloadReportPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF. Please try again later.');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display antialiased">
      {/* Header handled by App layout, but ensuring consistent main styling */}
      <Navbar/>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary/80 text-sm font-medium">
              <span className="material-symbols-outlined text-lg">verified_user</span>
              <span>Secure Health Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Symptom History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base">
              Review your past assessments, track your symptom timeline, and manage your PDF reports for doctor consultations.
            </p>
          </div>
          <button
            onClick={() => navigate('/symptoms')}
            className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary hover:bg-primary-dark text-white shadow-lg shadow-pink-500/20 transition-all font-bold text-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            New Assessment
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-lg font-medium">{error}</div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">inbox</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Reports Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">You haven't generated any symptom reports yet.</p>
            <button
              onClick={() => navigate('/symptoms')}
              className="mt-6 bg-pink-50 text-primary font-bold px-6 py-2 rounded-lg hover:bg-pink-100 transition-colors"
            >
              Start Symptom Check
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Symptoms Reported</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Analysis Result</th>
                      
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    {reports.map((report) => (
                      <tr key={report._id} className="hover:bg-pink-50/60 dark:hover:bg-pink-900/10 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex flex-wrap gap-2">
                          {report.symptoms.map(sym => (
                            <span key={sym._id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border border-pink-100 dark:border-pink-800">
                              {sym.name}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {report.topDisease?.name || 'Unknown'}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Analysed
                          </span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3 opacity-90 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleDownloadPDF(report._id)}
                              className="text-rose-icon hover:text-rose-600 transition-colors flex items-center gap-1 group/btn" 
                              title="Download PDF"
                            >
                              <span className="material-symbols-outlined group-hover/btn:scale-110 transition-transform">picture_as_pdf</span>
                              <span className="text-xs font-semibold hidden lg:inline">PDF</span>
                            </button>
                            <button 
                              onClick={() => navigate(`/reports/${report._id}`)}
                              className="text-primary hover:text-primary-dark font-bold text-sm bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-md hover:bg-pink-100 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyReports;
