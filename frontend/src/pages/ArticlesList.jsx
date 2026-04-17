import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllArticles } from '../api/articles.api';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getAllArticles();
        setArticles(data);
      } catch (err) {
        console.error('Failed to load articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background-light font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Health Articles</h1>
            <p className="text-slate-500 font-medium text-sm">Explore our collection of comprehensive medical literature.</p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-pink-500 gap-4">
              <span className="material-symbols-outlined text-[48px] animate-bounce">
                article
              </span>
              <p className="font-semibold text-lg animate-pulse text-center">
                Loading articles...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-red-500 gap-4 bg-white rounded-2xl p-10 border border-red-100 shadow-sm">
              <span className="material-symbols-outlined text-[48px]">error</span>
              <p className="font-semibold text-lg">{error}</p>
              <button 
                 onClick={() => window.location.reload()}
                 className="mt-4 px-6 py-2 bg-red-50 text-red-600 rounded-full font-bold hover:bg-red-100 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500 gap-4 bg-white rounded-2xl p-10 border border-slate-200 shadow-sm">
              <span className="material-symbols-outlined text-[48px]">assignment</span>
              <p className="font-semibold text-lg">No articles available</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article._id} className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden flex flex-col group hover:shadow-card transition-shadow">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-pink-50 text-[#db2777] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {article.category || 'Medical'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                         {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#db2777] transition-colors line-clamp-2">
                       {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">
                       {article.description || article.summary || 'Click to read more about this condition.'}
                    </p>
                    <Link 
                       to={`/articles/${article._id}`}
                       className="mt-auto w-full text-center bg-pink-50 hover:bg-[#db2777] hover:text-white text-[#db2777] font-bold py-2.5 rounded-xl text-sm transition-colors border border-pink-100 hover:border-transparent"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArticlesList;
