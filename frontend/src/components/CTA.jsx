import React from 'react';

const CTA = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-pink-900/20 to-transparent"></div>
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl tracking-tight mb-6">
          Ready to prioritize <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">your health?</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-400 font-light mb-10">
          Join thousands of others who have found a better way to manage their wellbeing. Simple, secure, and supportive.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto min-w-[160px] rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-pink-900/50 transition-all hover:bg-primary-hover hover:scale-105">
            Get Started Free
          </button>
          <button className="w-full sm:w-auto min-w-[160px] rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/20">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
