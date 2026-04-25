import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-[#db2777] mb-4">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">Last Updated: April 25, 2026</p>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                At MediCure, your privacy and security are incredibly important to us. This Privacy Policy details how [Your Company Name] collects, uses, protects, and handles your personal information when you use our website, mobile application, and related services to check your medical symptoms and manage your reports.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <p className="leading-relaxed mb-4">
                To provide you with personalized healthcare assistance, we securely collect the following data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Account Information:</strong> Name, age, gender, email address, password (hashed reliably), and general location data when you register.</li>
                <li><strong>Health-Related Data:</strong> The exact physical or mental symptoms you submit, specific biological conditions, historical symptom reports, and prediction outcomes saved via our Report Management system.</li>
                <li><strong>Location Information:</strong> Precise or approximate location data through Google Maps or your browser location APIs to help locate nearby specialists.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Information</h2>
              <p className="leading-relaxed mb-4">
                We utilize your collected data solely for operating, improving, and customizing your experience:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>To feed symptom inputs to the AI (Gemini) to generate probabilistic diseases and matching medical specialists.</li>
                <li>To format and send personalized Weekly Email Digests detailing your checkup habits and relevant health articles.</li>
                <li>To enable your seamless map routing using your current coordinates to nearby emergency rooms or hospital branches.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Storage and Security</h2>
              <p className="leading-relaxed">
                We adopt strong fundamental practices mirroring core GDPR-style concepts to protect your personal and predictive datasets. Communication between your browser and our servers is strictly encrypted. Your health-related records are stored securely in our database and are not visible to other general users. 
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Services</h2>
              <p className="leading-relaxed mb-4">
                MediCure acts as an intermediary integrating diverse services to elevate your medical experience. By using us, your data may be processed securely through:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Google Maps API:</strong> We query your location metadata against Google to render nearby spatial maps of relevant specialists and emergency facilities. </li>
                <li><strong>AI Partner APIs (Gemini):</strong> We anonymously transmit your raw symptom vectors to external generative AI services specifically to generate analyses and draft health articles. We strip identifiable patient names before doing so.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. User Rights</h2>
              <p className="leading-relaxed">
                You retain ultimate ownership over your personal and symptomatic information. Through our platform profiles and account controls, you maintain the right to view, download (PDF reports), directly update, or wholly delete your submitted biological data records permanently from MediCure at any time of your choosing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Retention</h2>
              <p className="leading-relaxed">
                We retain your account and health activity logs only for as long as your account remains active. If you elect to permanently wipe your account, or if the administrative backend clears it down due to extended inactivity, we expunge the data from our operational datastores according to automated intervals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Information</h2>
              <p className="leading-relaxed">
                If you have concerns related to data privacy, data processing, or updating your records, contact us directly:<br/>
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

export default PrivacyPolicy;
