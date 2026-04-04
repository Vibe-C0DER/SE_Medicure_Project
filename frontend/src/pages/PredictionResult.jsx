import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DISEASE_THEMES = {
  'Migraine': {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQw2xRnCnwxkvAjesDi6dQ7KwT1h39wR4F5MwvlcWbERggHtU4KxVr9VM41U11PHUMDIxfMJSX92dxFBx81QsAAPmIwz8CByu7zoDUfR6zpv1sA-eAP-5KqliAYsBwoBuRLkFVZnkT8hmI6yW_G9TuMLrzbCDXx67Mi3DiPayEX0A6Qld4vr3q64FdonvtfOTOSj9Cj7LbJreoYOA4G-9xLU7d0d_YXPDgQAR_q0WKh2rE1jb0x1FFJE_HnA3_2oeWwB_xfnwmfWcs',
    accentBg: 'bg-pink-100',
    accentGradient: 'from-pink-900/20',
    matchBadgeBg: 'bg-[#db2777]',
    severityPill: 'bg-rose-100 text-rose-700',
    severityLabel: 'High Severity',
    description:
      'A neurological condition frequently characterized by intense, debilitating headaches. Symptoms often include nausea, vomiting, and sensitivity to light and sound.',
    tags: [
      { icon: 'groups', label: 'Common in adults', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
      { icon: 'schedule', label: 'Chronic', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
    ],
  },
  'Tension Headache': {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlkGQdlQSt_d2Ev-V3NI1y6W4WMDiK5XBRz_wnpWZ9eYmCJ3WrpKFI29BgPH9ucsNsDp3gq4enkzQySoA9GxlaUC5auVQnPJ0grDlkGqsbjyPeBcXSegFffMzx8h_xpxG709K8zhyzgMheyAu9lSl-48GE7CtMkMEDmpKZ2LHzZGgPaAZaVDr5rWDateyV8SDV6YH_MsRYYFDtSkZL6tmdOGNYyCysrRSjYaKH7zJq7YR1_zGfRHXyWL11W_fW-iEfq2LFAEu4wNwe',
    accentBg: 'bg-orange-50',
    accentGradient: 'from-orange-900/10',
    matchBadgeBg: 'bg-orange-500',
    severityPill: 'bg-orange-50 text-orange-600',
    severityLabel: 'Moderate',
    description:
      'The most common type of headache causing mild, moderate, or intense pain in your head, neck, and behind your eyes. Often described as a tight band.',
    tags: [
      { icon: 'public', label: 'Very Common', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
      { icon: 'healing', label: 'Treatable', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
    ],
  },
  'Sinusitis': {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZFmbAvR14Nrrq4CD3TSxLspmS_BxWiEnyCSVLcZN29ab4bcIDxxQ-hyAILJftVCUnt3b70zn0wWVCxPmcmgOqK-ZITDWjQaPR7-YPmUjWCnit3j7GnoAFgHZpvra02BUVTXIZ-L41n9VXxMGhioHAKhxzWuLrZBiBKQ3BmWQOyaDec4ioKPRkYCQu1Z1xDR4FS-2L47JrvXMDogQ2z4-XEzTIz1Mkk-eY2kMxoSBglKyh7A-FcGVZX0-q86mN8cnAAuduKD2TPprx',
    accentBg: 'bg-green-50',
    accentGradient: 'from-green-900/10',
    matchBadgeBg: 'bg-slate-500',
    severityPill: 'bg-green-50 text-green-600',
    severityLabel: 'Low Severity',
    description:
      'Inflammation or swelling of the tissue lining the sinuses. Blocked sinuses filled with fluid can grow germs and cause infection.',
    tags: [
      { icon: 'update', label: 'Acute/Chronic', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
      { icon: 'medication', label: 'OTC Meds', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
    ],
  },
};

const FALLBACK_THEME = {
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDQw2xRnCnwxkvAjesDi6dQ7KwT1h39wR4F5MwvlcWbERggHtU4KxVr9VM41U11PHUMDIxfMJSX92dxFBx81QsAAPmIwz8CByu7zoDUfR6zpv1sA-eAP-5KqliAYsBwoBuRLkFVZnkT8hmI6yW_G9TuMLrzbCDXx67Mi3DiPayEX0A6Qld4vr3q64FdonvtfOTOSj9Cj7LbJreoYOA4G-9xLU7d0d_YXPDgQAR_q0WKh2rE1jb0x1FFJE_HnA3_2oeWwB_xfnwmfWcs',
  accentBg: 'bg-pink-100',
  accentGradient: 'from-pink-900/20',
  matchBadgeBg: 'bg-[#db2777]',
  severityPill: 'bg-rose-100 text-rose-700',
  severityLabel: 'Severity',
  description:
    'Based on your selected symptoms, here are potential conditions. This is informational and not a medical diagnosis.',
  tags: [
    { icon: 'groups', label: 'Info', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
    { icon: 'schedule', label: 'More', bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-pink-400' },
  ],
};

const getTheme = (diseaseName) => DISEASE_THEMES[diseaseName] || FALLBACK_THEME;

const getSeverityUI = (severity) => {
  const s = String(severity || '').trim().toLowerCase();
  if (s === 'high') return { label: 'High Severity', pillClass: 'bg-rose-100 text-rose-700' };
  if (s === 'moderate') return { label: 'Moderate', pillClass: 'bg-orange-50 text-orange-600' };
  if (s === 'low') return { label: 'Low Severity', pillClass: 'bg-green-50 text-green-600' };
  return { label: '', pillClass: '' };
};

const RecommendedSidebar = ({ topDisease, topMatchPercentage, onFindNearby, isLocating }) => {
  const topDiseaseName = topDisease?.name || '';
  // Keep sidebar close to html prototype for now (hardcoded to match the UX demo content).
  const list =
    topDiseaseName === 'Migraine'
      ? [
          {
            icon: 'neurology',
            title: 'Neurologist',
            badge: 'Top Match',
            description:
              'Experts in nervous system disorders, best suited for recurring migraines.',
          },
          {
            icon: 'clinical_notes',
            title: 'General Practitioner',
            badge: null,
            description:
              'Primary care physician for initial diagnosis and referrals.',
          },
          {
            icon: 'ophthalmology',
            title: 'Ophthalmologist',
            badge: null,
            description:
              'Eye care specialist, relevant if vision issues accompany headaches.',
          },
        ]
      : [
          {
            icon: 'local_hospital',
            title: 'Specialist',
            badge: 'Top Match',
            description: 'Recommended specialist based on your results.',
          },
          {
            icon: 'clinical_notes',
            title: 'General Practitioner',
            badge: null,
            description: 'Primary care physician for initial assessment and referrals.',
          },
          {
            icon: 'medical_services',
            title: 'Care Provider',
            badge: null,
            description: 'Further care based on your condition and symptoms.',
          },
        ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-card border border-pink-200 overflow-hidden ring-4 ring-pink-50">
        <div className="p-6 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white relative">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <span className="material-symbols-outlined text-[80px] text-[#db2777]">stethoscope</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#db2777]/10 p-2 rounded-lg text-[#db2777]">
                <span className="material-symbols-outlined text-[24px]">medical_services</span>
              </div>
              <h3 className="text-lg font-bold text-secondary">Recommended Specialists</h3>
            </div>
            <p className="text-xs text-pink-500 font-medium ml-1">
              Based on "{topDiseaseName || 'your selection'}"{typeof topMatchPercentage === 'number' ? ` (${topMatchPercentage}% match)` : ' (match)'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-pink-50">
          {list.map((s, idx) => (
            <div key={s.title} className="p-5 hover:bg-pink-50/50 transition-colors cursor-pointer group relative">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-[#db2777] shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#db2777] transition-colors">
                        {s.title}
                      </h4>
                      {idx === 0 && topDisease?.specialist ? (
                        <p className="text-[10px] font-bold text-gray-500 mt-1">
                          Specialist: {topDisease.specialist}
                        </p>
                      ) : null}
                    </div>
                    {s.badge ? (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                        {s.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-500 leading-snug mt-1.5 mb-2">{s.description}</p>
                    <div className="flex flex-col gap-2 w-full mt-3">
                    <button 
                        onClick={(e) => { e.preventDefault(); onFindNearby?.(); }}
                        disabled={isLocating}
                        className="w-max text-xs font-semibold text-[#db2777] bg-[#db2777]/5 px-3 py-1.5 rounded-lg hover:bg-[#db2777]/10 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLocating ? 'Finding your location...' : (
                          <>
                            Find Specialist Near Me{' '}
                            <span className="material-symbols-outlined text-[14px]">near_me</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <div className="p-4 bg-pink-50 border-t border-pink-100">
          <button className="w-full bg-[#db2777] hover:bg-[#be123c] text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200 hover:shadow-pink-300 transform hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-[18px]">map</span>
            Locate All Specialists on Map
          </button>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-red-700">
          <div className="bg-red-100 p-2 rounded-lg">
            <span className="material-symbols-outlined text-[24px]">emergency</span>
          </div>
          <h3 className="font-bold text-sm uppercase tracking-wide">Emergency Warning</h3>
        </div>
        <p className="text-xs font-medium text-red-600/80 leading-relaxed">
          If you are experiencing severe symptoms like chest pain, difficulty breathing, or severe
          bleeding, call emergency services immediately.
        </p>
        <button className="text-white bg-red-600 hover:bg-red-700 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-md transition-colors text-center w-full">
          Find Nearest Emergency Room
        </button>
      </div>
    </>
  );
};

const PredictionResult = () => {
  const location = useLocation();
  const passedPredictionData = location.state?.predictionData;

  const [predictionData] = useState(passedPredictionData || null);

  const predictions = useMemo(() => {
    const list = predictionData?.predictions;
    if (!Array.isArray(list)) return [];
    // Defensive: backend already returns sorted, but refresh/from-storage might not.
    return [...list].sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [predictionData]);

  const topDisease = predictionData?.topDisease || null;
  const topDiseaseName = topDisease?.name || '';
  const resultCount = Math.min(3, predictions.length);
  const topMatchPercentage = predictions.find((p) => p.diseaseName === topDiseaseName)?.matchPercentage;

  const specialist = predictionData?.topDisease?.specialist;
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const handleFindNearby = () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationError('Your browser does not support location services.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        navigate('/specialists', {
          state: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            specialist: specialist
          }
        });
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location access denied. Please allow location to find nearby specialists.');
        } else {
          setLocationError('Unable to get your location. Please try again.');
        }
      }
    );
  };

  if (!predictionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-xl p-6 bg-white dark:bg-gray-900 border border-pink-100/80 dark:border-gray-800 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No prediction found
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-6">
            Please go back and run prediction again.
          </p>
          <Link
            to="/symptoms"
            className="inline-flex items-center justify-center w-full bg-[#db2777] text-white font-bold py-3 px-5 rounded-2xl hover:bg-[#be123c] transition-colors"
          >
            Back to Symptom Checker
          </Link>
        </div>
      </div>
    );
  }

  if (!topDisease?.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-xl p-6 bg-white dark:bg-gray-900 border border-pink-100/80 dark:border-gray-800 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No prediction available
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-6">
            Please go back and run prediction again.
          </p>
          <Link
            to="/symptoms"
            className="inline-flex items-center justify-center w-full bg-[#db2777] text-white font-bold py-3 px-5 rounded-2xl hover:bg-[#be123c] transition-colors"
          >
            Back to Symptom Checker
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#0e121b] font-sans antialiased overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      <div className="relative flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-pink-200/60 bg-white/80 backdrop-blur-md px-10 py-4 shadow-sm">
          <div className="flex items-center gap-3 text-[#0e121b]">
            <div className="flex items-center justify-center size-10 rounded-xl bg-pink-100 text-[#db2777] shadow-sm">
              <span className="material-symbols-outlined text-[28px]">medical_services</span>
            </div>
            <h2 className="text-secondary text-xl font-bold leading-tight tracking-tight">MediCure</h2>
          </div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <label className="hidden md:flex flex-col min-w-64 !h-11 max-w-sm relative group">
              <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-pink-50 border border-pink-100 group-focus-within:border-pink-300 group-focus-within:ring-4 group-focus-within:ring-pink-100 transition-all shadow-sm">
                <div className="text-pink-400 flex border-none items-center justify-center pl-4">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full text-secondary focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-pink-300 px-3 text-sm font-medium"
                  placeholder="Search symptoms or specialists..."
                  value=""
                  readOnly
                />
              </div>
            </label>
            <button className="flex items-center justify-center rounded-full size-10 bg-pink-50 hover:bg-pink-100 text-[#db2777] transition-colors border border-pink-100">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-pink-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-pink-200 transition-all"
              data-alt="User profile picture"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNpNUrsIYtr-4gMyLpDGQa7MeGISafb-1shJfpa7u5m1zXCtKjD9aVj29ccAVYJj8CqwZ_fbAar9eoHetVpiCZER4PlJ9xTcg7k2iSzGcmZN21jsKGd6RVF_8DOWWFl0Fx_syQ8b_B4u7pw_kpq2ZuBDc6oWngBqETKmh7zP1i5WdQHcPmpNaGGSCYUbvjYS9WAOYoTDypjhW0p_TtGbjyonDc8_Svh3hLJOpcs6lWlJODWLl4orXyjkU2XsBwCidu944PxCP2NnA0")',
              }}
            />
          </div>
        </header>

        <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-[1280px] gap-8 flex-col lg:flex-row">
            <main className="flex-1 flex flex-col gap-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 to-rose-700 p-8 shadow-card text-white">
                <div className="absolute right-0 top-0 h-full w-2/3 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-pink-100 mb-1">
                    <span className="bg-white/20 p-1 rounded-md backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[18px]">info</span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-100">
                      Disclaimer
                    </span>
                  </div>
                  <h1 className="text-white text-3xl font-bold leading-tight tracking-tight">
                    Your Health Analysis
                  </h1>
                  <p className="text-pink-50 text-base font-medium leading-relaxed max-w-2xl opacity-90">
                    The results below are based on statistical matches from your input symptoms.
                    MediCure is an informational tool and does not provide medical diagnosis. Please
                    consult the recommended specialists.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
                <h2 className="text-secondary text-2xl font-bold leading-tight flex items-center gap-2">
                  Potential Conditions
                  <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-bold">
                    {resultCount} Results
                  </span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  <button className="group flex h-10 items-center justify-center gap-x-2 rounded-full bg-white border border-pink-200 px-5 hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm">
                    <span className="text-secondary text-sm font-semibold">Sort by Match %</span>
                    <span className="material-symbols-outlined text-[20px] text-pink-400 group-hover:text-[#db2777] transition-transform group-hover:rotate-180">
                      keyboard_arrow_down
                    </span>
                  </button>
                  <button className="group flex h-10 items-center justify-center gap-x-2 rounded-full bg-white border border-pink-200 px-5 hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px] text-pink-400">filter_list</span>
                    <span className="text-secondary text-sm font-semibold">Filters</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {predictions.length === 0 ? (
                  <div className="p-5 rounded-2xl border border-dashed border-pink-100/80 bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-300">
                    No results to display.
                  </div>
                ) : (
                  predictions.slice(0, resultCount).map((p) => {
                    const theme = getTheme(p.diseaseName);
                    const { label: severityLabel, pillClass: severityPillClass } = getSeverityUI(
                      p.severity
                    );
                    const resolvedSeverityLabel = severityLabel || theme.severityLabel;
                    const resolvedSeverityPillClass =
                      severityPillClass || theme.severityPill;

                    return (
                      <div
                        key={p.diseaseName}
                        className="group flex flex-col sm:flex-row bg-white rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 border border-pink-100 overflow-hidden relative"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center text-pink-400 hover:text-[#db2777] hover:bg-pink-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">bookmark</span>
                          </button>
                        </div>

                        <div
                          className={`sm:w-56 h-48 sm:h-auto ${theme.accentBg} relative shrink-0 overflow-hidden`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-t ${theme.accentGradient} to-transparent z-10`}></div>
                          <img
                            alt={p.diseaseName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={theme.image}
                          />
                          <div className="absolute bottom-3 left-3 z-20">
                            <div
                              className={`${theme.matchBadgeBg} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md bg-opacity-90`}
                            >
                              <span className="material-symbols-outlined text-[16px] fill-current">
                                percent
                              </span>
                              {p.matchPercentage}% Match
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-6 bg-gradient-to-br from-white via-white to-pink-50/30">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#db2777] transition-colors">
                                  {p.diseaseName}
                                </h3>
                                {p.specialist ? (
                                  <p className="text-xs font-medium text-gray-500">
                                    Specialist: {p.specialist}
                                  </p>
                                ) : null}
                              </div>
                              <span
                                className={`${resolvedSeverityPillClass} text-xs font-bold px-3 py-1 rounded-full border border-pink-200 uppercase tracking-wide`}
                              >
                                {resolvedSeverityLabel}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-5 font-medium">
                              {p.description || theme.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-5 border-t border-pink-100/60">
                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-100">
                                <span className="material-symbols-outlined text-[16px] text-pink-400">
                                  groups
                                </span>
                                {p.matchedSymptoms} matched
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-100">
                                <span className="material-symbols-outlined text-[16px] text-pink-400">
                                  schedule
                                </span>
                                {p.totalSymptoms} total symptoms
                              </div>
                            </div>
                            <button
                              className="flex items-center gap-1 text-[#db2777] text-sm font-bold hover:gap-2 transition-all"
                              type="button"
                            >
                              Details{' '}
                              <span className="material-symbols-outlined text-[18px]">
                                arrow_right_alt
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </main>

            <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6">
              <RecommendedSidebar 
                topDisease={topDisease} 
                topMatchPercentage={topMatchPercentage} 
                onFindNearby={handleFindNearby}
                isLocating={isLocating}
              />
              {locationError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                  <p>{locationError}</p>
                </div>
              )}
            </aside>
          </div>
        </div>

        <footer className="bg-white border-t border-pink-100 mt-auto">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[24px] text-[#db2777]">
                  medical_services
                </span>
                <span className="font-bold text-lg tracking-tight">MediCure</span>
              </div>
              <p className="text-xs text-pink-400">Trusted health guidance since 2024</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500">
              <a className="hover:text-[#db2777] transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-[#db2777] transition-colors" href="#">
                Terms of Service
              </a>
              <a className="hover:text-[#db2777] transition-colors" href="#">
                Medical Disclaimer
              </a>
              <a className="hover:text-[#db2777] transition-colors" href="#">
                About Us
              </a>
            </div>
            <p className="text-xs text-pink-300 font-medium">© 2024 MediCure Inc. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PredictionResult;

