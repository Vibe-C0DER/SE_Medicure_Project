import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-[#db2777] mb-4">Cookie Policy</h1>
          <p className="text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">Last Updated: April 25, 2026</p>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                This Cookie Policy explains how MediCure and [Your Company Name] use cookies and similar tracking technologies when you use our services. It explains what these technologies are and why we use them, as well as your rights to control our utilization of them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. What Are Cookies</h2>
              <p className="leading-relaxed">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by service providers to ensure their platforms operate accurately, keep you securely authenticated across sessions, or trace generic user navigation. We might also utilize local web storage strategies (like Redux Local Storage or session tokens) that act mathematically identical to functional footprint cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Types of Cookies Used</h2>
              <p className="leading-relaxed mb-4">Our platform currently categorizes its tracking into the following segments:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Essential / Strictly Necessary Cookies:</strong> Required so you can successfully log in, traverse through your portal seamlessly, and fetch sensitive health reports. These cannot be disabled reliably.</li>
                <li><strong>Functional / Persistence Local Storage:</strong> Used to keep your selected UI choices (such as keeping recent symptom lists preserved across a page refresh via Redux-Persist).</li>
                <li><strong>Analytics Cookies:</strong> Optional aggregated logs to review macro-engagement with our articles and system checks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How We Use Cookies</h2>
              <p className="leading-relaxed">
                The primary purpose we rely on these files is to maintain authentication integrity (e.g., verifying you are truly the logged-in user viewing private lab outcomes or prediction outputs). Furthermore, tracking helps us remember your user settings, cache recent external AI analysis locally to avoid redundant API charges, and smoothly load the heavy mapping scripts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Managing Cookies</h2>
              <p className="leading-relaxed">
                You have the right to decide whether to accept or strictly reject our cookies. You can set or amend your web browser controls manually to either reject automatically or prompt a warning. If you choose to reject strictly necessary cookies, you may still use portions of our general article dashboard, but all authenticated access to secure endpoints will be permanently locked out until you re-allow them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Information</h2>
              <p className="leading-relaxed">
                If you have questions specifically revolving around cookies and our tracing implementations, please connect with us at:<br/>
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

export default CookiePolicy;
