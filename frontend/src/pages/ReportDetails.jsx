import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById, downloadReportPDF } from '../api/report';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchReportDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const data = await getReportById(id);
      if (data.success) {
        setReport(data.report);
      } else {
        setError('Failed to fetch report details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching report details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
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
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
        <div className="bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 p-8 rounded-xl text-center max-w-md shadow-sm">
          <span className="material-symbols-outlined text-4xl text-rose-500 mb-2">error</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Report Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{error || 'The requested report could not be found or you do not have permission.'}</p>
          <button
            onClick={() => navigate('/reports/me')}
            className="mt-6 w-full bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to My Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display antialiased">
      <Navbar/>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/reports/me')}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Report Details</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Analysis Summary
              </h2>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-50 text-primary hover:bg-pink-100 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">{downloading ? 'sync' : 'picture_as_pdf'}</span>
              {downloading ? 'Preparing...' : 'Download PDF'}
            </button>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Reported Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {report.symptoms.map(sym => (
                  <span key={sym._id} className="inline-flex flex-col px-3 py-1.5 rounded-lg bg-pink-50 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200 border border-pink-100 dark:border-pink-800/50">
                    <span className="text-sm font-bold">{sym.name}</span>
                    {/* Category if available */}
                    {sym.category && <span className="text-[10px] uppercase opacity-70">{sym.category}</span>}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Primary Diagnosis</h3>
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">{report.topDisease?.name || 'Unknown'}</h4>
                    {report.topDisease?.severity && (
                      <span className={`mt-2 inline-block px-2 py-0.5 text-xs font-bold rounded ${
                         report.topDisease.severity === 'High' ? 'bg-rose-100 text-rose-700' :
                         report.topDisease.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                         'bg-emerald-100 text-emerald-700'
                      }`}>
                        Severity: {report.topDisease.severity}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Suggested Specialist</span>
                    <span className="font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-3 py-1 rounded shadow-sm border border-slate-200 dark:border-slate-600 mt-1">
                      {report.topDisease?.specialist || 'General Physician'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">All Potential Matches</h3>
              <div className="space-y-3">
                {report.predictions.map((pred, index) => (
                  <div key={pred.disease?._id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white mr-2">{index + 1}.</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{pred.disease?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${pred.matchPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-12 text-right">{pred.matchPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportDetails;
