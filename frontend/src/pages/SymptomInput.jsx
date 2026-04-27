import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSymptom, removeSymptom } from '../store/symptomSlice.js';
import { fetchSymptoms } from '../api/symptoms.js';
import { predictDiseases } from '../api/prediction.js';
import { aiApi } from '../api/ai.js';
import { validateSymptomSelection, validateSymptomSearch } from '../utils/validation/symptom.validation.js';
import { validateAiInput } from '../utils/validation/ai.validation.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const FALLBACK_SYMPTOMS = [
  {
    id: 'high-fever',
    name: 'High Fever',
    description: 'Body temp > 38°C',
    group: 'Most Common',
    chip: 'General',
    icon: 'thermometer',
  },
  {
    id: 'nausea',
    name: 'Nausea',
    description: 'Feeling of sickness',
    group: 'Most Common',
    chip: 'Digestive',
    icon: 'sick',
  },
  {
    id: 'headache',
    name: 'Headache',
    description: 'Persistent pain in head',
    group: 'Most Common',
    chip: 'Head & Neck',
    icon: 'neurology',
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    description: 'Extreme tiredness',
    group: 'Most Common',
    chip: 'General',
    icon: 'sentiment_very_dissatisfied',
  },
  {
    id: 'shortness-of-breath',
    name: 'Shortness of Breath',
    description: 'Difficulty breathing',
    group: 'Respiratory',
    chip: 'Respiratory',
    icon: 'pulmonology',
  },
  {
    id: 'dry-cough',
    name: 'Dry Cough',
    description: 'Cough without phlegm',
    group: 'Respiratory',
    chip: 'Respiratory',
    icon: 'masks',
  },
];

const CHIPS = [
  'All Symptoms',
  'Head & Neck',
  'Respiratory',
  'Digestive',
  'Skin',
  'General',
];

const SymptomCard = ({ symptom, checked, onToggle }) => {
  return (
    <label className="group relative flex items-start p-6 cursor-pointer bg-white dark:bg-gray-800 border border-pink-100/70 dark:border-gray-700 rounded-2xl hover:border-primary/60 hover:shadow-xl hover:shadow-pink-100/50 dark:hover:shadow-none transition-all duration-300">
      <input
        className="peer sr-only"
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(symptom.id)}
      />
      <div className="size-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mr-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
        <span className="material-symbols-outlined text-3xl">{symptom.icon}</span>
      </div>
      <div className="flex-1 mt-1">
        <div className="flex justify-between items-start gap-3">
          <span className="block text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {symptom.name}
          </span>
          <div className="size-6 rounded-full border-2 border-pink-100 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors shrink-0">
            <span className="material-symbols-outlined text-white text-sm opacity-0 peer-checked:opacity-100 font-bold">
              check
            </span>
          </div>
        </div>
        <span className="block text-sm text-slate-500 dark:text-gray-300 mt-1">
          {symptom.description}
        </span>
      </div>
      <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity shadow-[0_0_20px_rgba(225,29,72,0.1)]" />
    </label>
  );
};

const SymptomInput = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All Symptoms');
  const [allSymptoms, setAllSymptoms] = useState(() => FALLBACK_SYMPTOMS);
  const dispatch = useDispatch();
  const selectedIds = useSelector((state) => state.symptoms.selectedIds || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const [aiText, setAiText] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchSymptoms();
        const payload = res?.data || {};
        const list = Array.isArray(payload.data) ? payload.data : payload.data?.symptoms || [];
        if (Array.isArray(list) && list.length) {
          const mapped = list.map((s) => ({
            id: s._id,
            name: s.name,
            description: s.description,
            group: s.category,
            chip: s.category,
            icon: s.category === 'Respiratory'
              ? 'pulmonology'
              : s.category === 'Head & Neck'
              ? 'neurology'
              : s.category === 'Digestive'
              ? 'stethoscope'
              : s.category === 'Skin'
              ? 'medication_liquid'
              : 'local_hospital',
          }));
          setAllSymptoms(mapped);
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to load symptoms. Using fallback list.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    // Load symptoms from the server; fall back list is always available.
      load();
    
  }, []);

  const filteredSymptoms = useMemo(() => {
    const valSearch = validateSymptomSearch(query);
    const q = valSearch.success ? valSearch.data.toLowerCase() : '';
    return allSymptoms.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      const matchesChip = activeChip === 'All Symptoms' ? true : s.chip === activeChip;
      return matchesQuery && matchesChip;
    });
  }, [query, activeChip, allSymptoms]);

  const symptomsByGroup = useMemo(() => {
    const map = new Map();
    for (const s of filteredSymptoms) {
      if (!map.has(s.group)) map.set(s.group, []);
      map.get(s.group).push(s);
    }
    return map;
  }, [filteredSymptoms]);

  const orderedGroups = useMemo(() => {
    const preferred = ['Most Common', 'Respiratory', 'Custom'];
    const keys = Array.from(symptomsByGroup.keys());
    const remaining = keys.filter((k) => !preferred.includes(k)).sort((a, b) => a.localeCompare(b));
    return [...preferred.filter((k) => symptomsByGroup.has(k)), ...remaining];
  }, [symptomsByGroup]);

  const selectedSymptoms = useMemo(() => {
    const byId = new Map(allSymptoms.map((s) => [s.id, s]));
    return selectedIds.map((id) => byId.get(id)).filter(Boolean);
  }, [selectedIds, allSymptoms]);

  const handleToggleSymptom = (id) => {
    dispatch(toggleSymptom(id));
  };

  const handleRemoveSelected = (id) => {
    dispatch(removeSymptom(id));
  };

  const progressPercent = useMemo(() => {
    const denom = Math.max(1, allSymptoms.length);
    return Math.min(100, Math.round((selectedSymptoms.length / denom) * 100));
  }, [selectedSymptoms.length, allSymptoms.length]);

  const handleAnalyze = async () => {
    // Only send IDs that exist in the loaded DB symptoms array
    const validSelectedIds = selectedSymptoms.map(s => s.id);
    
    console.log('validSelectedIds', validSelectedIds);
    const validation = validateSymptomSelection(validSelectedIds);
    if (!validation.success) {
      setSaveError(validation.errors.selectedIds);
      return;
    }

    try {
      setSaveError('');
      setAnalyzing(true);
      // The backend expects symptom MongoDB IDs.
      const predictionResponse = await predictDiseases(validSelectedIds);
      console.log(selectedIds);
      console.log('predictionResponse', predictionResponse);
      const predictionPayload = predictionResponse?.data || {};

      navigate('/prediction-result', {
        state: { predictionData: predictionPayload },
      });

      // No need to set local "submitted" state since we redirect.
    } catch (err) {
      const isNetworkError = !err?.status;
      console.log("prediction error",err.message)
      if (isNetworkError) {
        setSaveError('Unable to connect to server');
      } else {
        setSaveError('Prediction failed. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAiAnalyze = async () => {
    const validation = validateAiInput(aiText);
    if (!validation.success) {
      setAiError(validation.errors.text);
      return;
    }
    try {
      setAiError('');
      setAiLoading(true);
      const res = await aiApi.analyzeText(aiText);
      const data = res?.data;

      if (data && data.diseases && data.diseases.length > 0) {
        navigate('/prediction-result', {
          state: { predictionData: { predictions: data.diseases, topDisease: data.topDisease } },
        });
      } else {
         setAiError('No recognizable symptoms found.');
      }
    } catch (err) {
      setAiError('AI analysis failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-700 dark:text-gray-200 font-display antialiased min-h-screen flex flex-col">
      {/* <header className="bg-white dark:bg-gray-900 border-b border-pink-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 text-primary flex items-center justify-center bg-primary-light/50 rounded-xl">
              <span className="material-symbols-outlined text-3xl">monitor_heart</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              MediCure
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-8 text-sm font-medium text-slate-500 dark:text-gray-400">
              <Link className="hover:text-primary transition-colors" to="/">
                Home
              </Link>
              <Link className="hover:text-primary transition-colors text-primary" to="/symptoms">
                Symptom Checker
              </Link>
              <a className="hover:text-primary transition-colors" href="#">
                Diseases
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Specialists
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Analysis Progress
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-primary">{progressPercent}%</span>
              </div>
            </div>

            <Link
              to="/profile"
              className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-primary/20 hover:bg-primary hover:text-white transition-all"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined text-xl">person</span>
            </Link>
          </div>
        </div>
      </header> */}
      <Navbar/>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Tell us about your symptoms
            </h1>
            <p className="text-slate-500 dark:text-gray-300 text-lg max-w-2xl leading-relaxed">
              Select all the symptoms you are experiencing to help our AI engine analyze your
              condition accurately, or simply describe them below!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-pink-100/80 dark:border-gray-700 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              Describe your symptoms
            </h3>
            <textarea
              value={aiText}
              onChange={(e) => {
                  setAiText(e.target.value);
                  setAiError('');
              }}
              placeholder="Describe your symptoms (e.g. I have had a high fever and headache since last night...)"
              className={`w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-base rounded-xl p-4 border ${aiError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] resize-y`}
            ></textarea>
            
            {aiError && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{aiError}</p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAiAnalyze}
                disabled={aiLoading}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                {aiLoading ? 'Analyzing...' : 'Analyze with AI'}
              </button>
            </div>
          </div>

          {loading && (
            <p className="text-sm text-slate-500 dark:text-gray-300 mt-1">
              Loading symptoms from server...
            </p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
          )}

          {/* <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-2xl">
                search
              </span>
            </div>
            <input
              className="block w-full pl-14 pr-4 py-5 bg-white dark:bg-gray-800 border border-pink-100/80 dark:border-gray-700 rounded-2xl text-lg shadow-sm placeholder:text-slate-400/80 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
              placeholder="Search symptoms (e.g., headache, fever, fatigue)..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (normalizedQuery) addCustomSymptom(normalizedQuery);
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-primary transition-colors"
                aria-label="Voice input"
              >
                <span className="material-symbols-outlined">mic</span>
              </button>
            </div>
          </div> */}
          <div className="w-full">
  <div className="
    flex items-center
    h-14
    bg-white dark:bg-gray-800
    border border-pink-100/80 dark:border-gray-700
    rounded-2xl
    shadow-sm
    px-4
    focus-within:ring-4 focus-within:ring-primary/10
    focus-within:border-primary
    transition-all
  ">
    
    {/* Search Icon */}
    <span className="material-symbols-outlined text-slate-400 text-xl mr-3">
      search
    </span>

    {/* Input */}
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search symptoms (e.g., headache, fever, fatigue)..."
      className="
        flex-1
        bg-transparent
        text-base
        placeholder:text-slate-400
        outline-none
      "
    />

    {/* Mic Button */}
    <button
      type="button"
      className="ml-3 text-slate-400 hover:text-primary transition-colors"
      aria-label="Voice input"
    >
      <span className="material-symbols-outlined text-xl">
        mic
      </span>
    </button>

  </div>
</div>

          <div className="flex flex-wrap gap-3 pb-2 border-b border-pink-100/70">
            {CHIPS.map((chip) => {
              const active = chip === activeChip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveChip(chip)}
                  className={
                    active
                      ? 'bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/25 transition-transform active:scale-95 hover:bg-primary-dark'
                      : 'bg-white dark:bg-gray-800 border border-pink-100/80 dark:border-gray-700 text-slate-700 dark:text-gray-200 hover:border-primary/50 hover:text-primary hover:bg-primary-soft px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm'
                  }
                >
                  {chip}
                </button>
              );
            })}
          </div>

          <div className="space-y-8">
            {orderedGroups.map((group) => {
              const items = symptomsByGroup.get(group) || [];
              return (
              <div key={group} className="space-y-0">
                <h3 className="text-sm font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-primary/30"></span>
                  {group}
                  <span className="flex-1 h-[1px] bg-pink-100/70"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {items.map((symptom) => (
                    <SymptomCard
                      key={symptom.id}
                      symptom={symptom}
                      checked={selectedSet.has(symptom.id)}
                      onToggle={handleToggleSymptom}
                    />
                  ))}
                </div>
              </div>
            )})}

            {/* <button
              type="button"
              className="w-full py-5 text-base font-bold text-primary hover:text-white hover:bg-primary rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">
                add
              </span>
              Load More Symptoms
            </button> */}
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-pink-100/50 dark:shadow-black/20 border border-pink-100/80 dark:border-gray-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-pink-100/80 dark:border-gray-800 bg-pink-50/50 dark:bg-gray-800/50 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    playlist_add_check
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Selected</h3>
                </div>
                <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                  {selectedSymptoms.length}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-300">
                Symptoms added to your analysis list.
              </p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto max-h-[500px] min-h-[300px]">
              <div className="flex flex-col gap-3">
                {selectedSymptoms.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-gray-300 border border-dashed border-pink-100 rounded-xl p-5">
                    No symptoms selected yet.
                  </div>
                ) : (
                  selectedSymptoms.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-pink-100/80 dark:border-gray-700 rounded-xl group hover:border-primary/40 hover:shadow-lg hover:shadow-pink-50/80 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary-light dark:bg-pink-900/20 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">{s.icon}</span>
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-gray-900 dark:text-white">
                            {s.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-gray-300">
                            {s.group === 'Most Common' ? 'Common' : s.group}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelected(s.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all p-2 rounded-lg"
                        title="Remove symptom"
                        aria-label={`Remove ${s.name}`}
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 border-t border-pink-100/80 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={selectedSymptoms.length === 0 || analyzing}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-3 group transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-2xl">medical_services</span>
                  <span className="text-lg">
                    {analyzing ? 'Analyzing...' : 'Analyze Symptoms'}
                  </span>
                </button>

                {saveError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {saveError}
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5 shrink-0">
                    verified_user
                  </span>
                  <p className="text-xs text-slate-500 dark:text-gray-300 leading-relaxed">
                    Your data is encrypted and secure. We respect your privacy according to HIPAA
                    guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <footer className="mt-auto border-t border-pink-100/70 bg-white dark:bg-gray-900 py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">monitor_heart</span>
            <p>© 2026 Medicure Inc.</p>
          </div>
          <div className="flex gap-8 font-medium">
            <a className="hover:text-primary transition-colors" href="#">
              Privacy
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Terms
            </a>
            
          </div>
        </div>
      </footer> */}
      <Footer/>
    </div>
  );
};

export default SymptomInput;

