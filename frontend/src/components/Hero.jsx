import React from 'react';

const Hero = () => {
  return (
    <section className="relative flex min-h-[750px] flex-col items-center justify-center overflow-hidden bg-mesh px-4 pt-10 pb-20 lg:px-20">
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-pink-300/20 blur-[80px]"></div>
      <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-rose-300/20 blur-[100px]"></div>
      
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          Trusted by 10,000+ Patients
        </span>
        
        <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-7xl lg:text-[5rem] max-w-4xl">
          Healthcare made <br/>
          <span className="text-gradient">Simple & Human.</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed font-light">
          Experience a new standard of medical care. Connect with top specialists, understand your symptoms, and take charge of your wellbeing with MediCure.
        </p>
        
        <div className="mt-8 flex w-full max-w-4xl flex-col gap-3 rounded-[2rem] bg-white p-3 shadow-[0_20px_60px_-15px_rgba(236,72,153,0.15)] ring-1 ring-pink-100/50 md:flex-row md:items-center transform transition-all hover:scale-[1.01]">
          <div className="flex flex-1 items-center gap-3 rounded-[1.5rem] bg-gray-50/50 px-6 py-4 md:bg-transparent transition-colors hover:bg-gray-50/80">
            <span className="material-symbols-outlined text-pink-400 text-2xl">search</span>
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Condition or Doctor</label>
              <input 
                className="w-full border-none bg-transparent p-0 text-base font-semibold text-gray-900 placeholder-gray-300 focus:ring-0 focus:outline-none" 
                placeholder="e.g. Cardiologist, Fever..." 
                type="text"
              />
            </div>
          </div>
          
          <div className="hidden h-10 w-px bg-gray-100 md:block"></div>
          
          <div className="flex flex-1 items-center gap-3 rounded-[1.5rem] bg-gray-50/50 px-6 py-4 md:bg-transparent transition-colors hover:bg-gray-50/80">
            <span className="material-symbols-outlined text-pink-400 text-2xl">location_on</span>
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</label>
              <input 
                className="w-full border-none bg-transparent p-0 text-base font-semibold text-gray-900 placeholder-gray-300 focus:ring-0 focus:outline-none" 
                placeholder="e.g. Ahmedabad, India" 
                type="text"
              />
            </div>
          </div>
          
          <button className="h-16 w-full md:w-auto md:min-w-[140px] rounded-[1.5rem] bg-primary px-8 text-lg font-bold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-pink-200 active:scale-95">
            Search
          </button>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
          <span className="font-medium text-gray-400">Popular:</span>
          <a className="rounded-full bg-white px-3 py-1 border border-pink-50 hover:border-pink-200 hover:text-primary transition-colors" href="#">Dermatologist</a>
          <a className="rounded-full bg-white px-3 py-1 border border-pink-50 hover:border-pink-200 hover:text-primary transition-colors" href="#">Pediatrician</a>
          <a className="rounded-full bg-white px-3 py-1 border border-pink-50 hover:border-pink-200 hover:text-primary transition-colors" href="#">Mental Health</a>
          <a className="rounded-full bg-white px-3 py-1 border border-pink-50 hover:border-pink-200 hover:text-primary transition-colors" href="#">Covid-19</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
