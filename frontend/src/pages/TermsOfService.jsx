import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-[#db2777] mb-4">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">Last Updated: April 25, 2026</p>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to MediCure. These Terms of Service govern your use of the MediCure platform, a project designed to provide an AI symptom analyzer and health assistance interface matching you with potential specialists. By accessing or using our service, you agree to be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Services</h2>
              <p className="leading-relaxed mb-4">
                MediCure provides a personal health application that allows you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Input your symptoms for predictive AI analysis.</li>
                <li>Access health-related articles and read general information on various health conditions.</li>
                <li>Use Google Maps API features to identify relevant medical specialists nearby.</li>
                <li>Store generated reports inside your user account profile.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
              <p className="leading-relaxed mb-4">
                As a user, you agree that you are solely responsible for all activities that occur under your account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Provide accurate, and to the best of your knowledge, honest symptomatic data.</li>
                <li>Keep your account credentials secure and private.</li>
                <li>Be over the age of 18 or use this service under constant adult supervision.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Prohibited Activities</h2>
              <p className="leading-relaxed mb-4">
                You may not engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Attempting to bypass or compromise our security and authentication (Zod).</li>
                <li>Using the service for any illegal or unregulated remote-medical purpose.</li>
                <li>Submitting false symptoms in large volumes to distort analysis patterns (spamming).</li>
                <li>Attempting to reverse-engineer our AI interaction layer or backend routes.</li>
              </ul>
            </section>

            <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                5. Medical Disclaimer (Mandatory)
              </h2>
              <p className="leading-relaxed text-red-900 font-medium">
                <strong>MediCure is NOT a replacement for a licensed, professional medical diagnosis.</strong> The symptom analysis provided by our AI API (Gemini) is for informational and educational purposes ONLY. We absolutely do not provide medical advice, diagnosis, or treatment. You should ALWAYS seek the advice of your physician or other qualified health providers with any questions you may have regarding a medical condition. In a medical emergency, immediately call emergency services or visit the nearest hospital.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                Under no circumstances shall MediCure, [Your Company Name], or its developers be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services. You utilize the software, our predictions, and our mapped specialist data at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Termination</h2>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate your account and access to the platform immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms of Service. You may also delete your account and associated data through your profile settings at any point in time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide formal notice directly to your account or via your registered email of any major alterations. Continuing to use our platform afterwards constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at: <br/>
                <strong>Email:</strong> admin@gmail.com<br/>
                <strong><Link to='/contact'>Contact Us</Link></strong>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
