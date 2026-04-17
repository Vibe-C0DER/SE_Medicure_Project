import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import { getArticleById } from '../api/articles.api';

const MarkdownComponents = {
  h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold mt-8 mb-4 text-gray-900" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800 border-b border-pink-100 pb-2" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-5 mb-2 text-gray-800" {...props} />,
  p: ({node, ...props}) => <p className="text-gray-600 text-base leading-relaxed mb-4" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc mb-4 text-gray-600 space-y-2 pl-5" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal mb-4 text-gray-600 space-y-2 pl-5" {...props} />,
  li: ({node, ...props}) => <li className="pl-1" {...props} />,
  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
  a: ({node, ...props}) => <a className="text-[#db2777] hover:underline font-medium" {...props} />,
  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-pink-300 pl-4 italic text-gray-500 my-4 bg-pink-50/30 py-2 pr-2" {...props} />
};

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSection, setActiveSection] = useState('overview');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const getArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error('Failed to load article:', err);
        if (err.response && err.response.status === 404) {
             setError('Article not available');
        } else {
             setError('Failed to load article');
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getArticle();
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'symptoms', 'risk-factors', 'prevention'];
      let current = 'overview';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

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
            specialist: article?.disease?.specialist
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

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // account for possibly sticky navbars
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const tocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'risk-factors', label: 'Risk Factors' },
    { id: 'prevention', label: 'Prevention' }
  ];

  return (
    <div className="min-h-screen bg-background-light font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-card border border-pink-100 flex flex-col items-center justify-center min-h-[400px] text-pink-500 gap-4 p-10">
            <span className="material-symbols-outlined text-[48px] animate-bounce">
              article
            </span>
            <p className="font-semibold text-lg animate-pulse text-center">
              Fetching medical literature... <br/>
              <span className="text-sm font-normal text-pink-400">If this is the first time, our AI is synthesizing a comprehensive article for you.</span>
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-card border border-pink-100 flex flex-col items-center justify-center min-h-[400px] text-red-500 gap-4 p-10">
            <span className="material-symbols-outlined text-[48px]">error</span>
            <p className="font-semibold text-lg">{error}</p>
            <Link to="/prediction-result" className="mt-4 px-6 py-2 bg-pink-100 text-[#db2777] rounded-full font-bold hover:bg-pink-200 transition-colors">
              Go Back
            </Link>
          </div>
        )}

        {!loading && !error && article && (
          <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left/Main Column */}
            <article className="flex-1 bg-white rounded-2xl shadow-card border border-pink-100 overflow-hidden relative min-w-0">
              {/* Header section */}
              <div className="bg-gradient-to-r from-pink-50 to-white p-8 border-b border-pink-100 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-[100px] text-[#db2777]">local_library</span>
                </div>
                
                <Link to={-1} className="inline-flex items-center gap-1 text-sm font-semibold text-pink-500 hover:text-[#db2777] transition-colors mb-6 relative z-10">
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back to Results
                </Link>

                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 bg-white border border-pink-200 text-pink-600 font-bold text-xs rounded-full uppercase tracking-wider mb-4 shadow-sm">
                    {article.category || 'Medical Reference'}
                  </div>
                  <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                    {article.title}
                  </h1>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
                    {article.description}
                  </p>
                </div>
              </div>

              {/* Content sections */}
              <div className="p-8 md:p-10 bg-white">
                <div className="max-w-none">
                  {article.content && (
                    <section id="overview" className="mb-10 block scroll-mt-24">
                      <ReactMarkdown components={MarkdownComponents}>
                        {article.content}
                      </ReactMarkdown>
                    </section>
                  )}

                  <hr className="border-pink-100 my-10" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {article.symptoms && (
                      <section id="symptoms" className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50 scroll-mt-24">
                        <div className="flex items-center gap-2 mb-4 text-orange-600">
                          <span className="material-symbols-outlined text-[24px]">coronavirus</span>
                          <h2 className="text-xl font-bold">Key Symptoms</h2>
                        </div>
                        <ReactMarkdown components={MarkdownComponents}>
                          {article.symptoms}
                        </ReactMarkdown>
                      </section>
                    )}

                    {article.riskFactors && (
                      <section id="risk-factors" className="bg-red-50/50 p-6 rounded-2xl border border-red-100/50 scroll-mt-24">
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                          <span className="material-symbols-outlined text-[24px]">warning</span>
                          <h2 className="text-xl font-bold">Risk Factors</h2>
                        </div>
                        <ReactMarkdown components={MarkdownComponents}>
                          {article.riskFactors}
                        </ReactMarkdown>
                      </section>
                    )}
                  </div>

                  {article.prevention && (
                    <section id="prevention" className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50 mt-8 scroll-mt-24">
                      <div className="flex items-center gap-2 mb-4 text-green-700">
                        <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
                        <h2 className="text-xl font-bold">Prevention & Care</h2>
                      </div>
                      <ReactMarkdown components={MarkdownComponents}>
                        {article.prevention}
                      </ReactMarkdown>
                    </section>
                  )}

                  {/* <div className="mt-12 p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                     <p className="text-sm text-slate-500 font-medium">
                        <strong className="text-slate-700">Disclaimer:</strong> This article is machine-generated for educational purposes only. It should not be used as a substitute for professional medical diagnosis or treatment. Always consult a certified healthcare provider.
                     </p>
                  </div> */}
                </div>
              </div>
            </article>

            {/* Right Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 sticky top-24">
              
              {/* Table of Contents Card */}
              <div className="bg-white rounded-2xl shadow-card border border-pink-100 p-6 flex flex-col">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  Table of Contents
                </h3>
                <nav className="flex flex-col gap-2">
                  {tocItems.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all font-semibold ${
                        activeSection === item.id
                          ? 'bg-pink-50 text-[#db2777]'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      {activeSection === item.id ? (
                        <div className="size-2 rounded-full bg-[#db2777]" />
                      ) : (
                        <div className="size-2 rounded-full bg-slate-200" />
                      )}
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Find a Specialist Card */}
              <div className="bg-white rounded-2xl shadow-card border border-pink-100 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                   <div className="size-32 bg-pink-100 rounded-full blur-2xl absolute -top-10 -right-10"></div>
                </div>
                
                <div className="relative z-10 flex flex-col gap-4 text-center items-center">
                  <div className="size-14 bg-[#db2777] rounded-full flex items-center justify-center text-white shadow-md shadow-pink-200 mb-2 group-hover:-translate-y-1 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">search</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900">
                    Find a Specialist
                  </h3>
                  
                  <p className="text-sm text-slate-500 font-medium mb-2 leading-relaxed">
                    Connect with top {article?.disease?.specialist ? <span className="font-bold text-slate-700">{article.disease.specialist}s</span> : "specialists"} near you for personalized {article?.disease?.name?.toLowerCase() || 'health'} care.
                  </p>

                  <button
                    onClick={handleFindNearby}
                    disabled={isLocating}
                    className="w-full bg-[#db2777] hover:bg-[#be123c] text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                  >
                    {isLocating ? 'Locating...' : 'Find Doctors'}
                    {!isLocating && <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>}
                  </button>

                  {locationError && (
                    <p className="text-xs text-red-500 mt-2">{locationError}</p>
                  )}
                </div>
              </div>

            </aside>

          </div>
        )}
      </main>
    </div>
  );
};

export default Article;
