import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-pink-600">{icon}</span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepComponent = ({ number, title }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
      {number}
    </div>
    <p className="font-semibold text-slate-800 mt-2">{title}</p>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-slate-50 py-16 md:py-24 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              About <span className="text-[#db2777]">MediCure</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              MediCure is a healthcare platform designed to help users understand symptoms, explore medical information, and find relevant specialists.
            </p>
          </div>
        </section>

        {/* What This Project Does */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Platform Does</h2>
          <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
            <p className="text-slate-700 leading-relaxed">
              MediCure allows you to enter your current symptoms and receive AI-suggested possible conditions. You can then explore detailed medical articles about those conditions and seamlessly search the map for relevant specialists nearby to seek further treatment.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-rose-600 bg-rose-50 px-4 py-2.5 rounded-lg border border-rose-100">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <p>Disclaimer: MediCure provides general guidance and is not a replacement for professional medical advice or formal diagnosis.</p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-slate-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon="stethoscope" 
                title="Symptom Analysis" 
                description="Users describe symptoms and get possible conditions." 
              />
              <FeatureCard 
                icon="map" 
                title="Specialist Finder" 
                description="Find nearby doctors using your location." 
              />
              <FeatureCard 
                icon="library_books" 
                title="Medical Articles" 
                description="Read basic, structured health-related information." 
              />
              <FeatureCard 
                icon="folder_managed" 
                title="Report Management" 
                description="Save and track previous symptom reports." 
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <StepComponent number="1" title="Enter your symptoms" />
            <StepComponent number="2" title="Get possible conditions" />
            <StepComponent number="3" title="Explore details or articles" />
            <StepComponent number="4" title="Find nearby specialists" />
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-20 bg-slate-900 text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to check your symptoms?</h2>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#db2777] hover:bg-pink-500 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Start Exploring
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
