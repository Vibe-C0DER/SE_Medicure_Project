import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    services: [
      { label: 'Find Doctors', href: '/' },
      { label: 'Symptom Checker', href: '/symptoms' },
      
      { label: 'Articles', href: '/articles' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/articles' },
      { label: 'Contact', href: '/contact' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' }
    ]
  };

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white">
                <span className="material-symbols-outlined text-xl">local_hospital</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">MediCure</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              Making healthcare human-centric. We connect you with the right care at the right time, with kindness and precision.
            </p>
            
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Services</h4>
              <ul className="space-y-4">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link className="text-sm text-gray-500 hover:text-primary transition-colors" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link className="text-sm text-gray-500 hover:text-primary transition-colors" to={link.href} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Legal</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link className="text-sm text-gray-500 hover:text-primary transition-colors" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 MediCure Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-gray-400">English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
