import React from 'react';

const Services = () => {
  const services = [
    {
      icon: 'vital_signs',
      title: 'AI Symptom Checker',
      description: 'Not feeling well? Input your symptoms and get an instant, AI-powered preliminary assessment before visiting a doctor.',
      linkText: 'Start Assessment',
      linkColor: 'text-primary',
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
      iconHoverBg: 'group-hover:bg-pink-500',
      iconHoverColor: 'group-hover:text-white'
    },
    {
      icon: 'stethoscope',
      title: 'Specialist Finder',
      description: 'Browse our curated list of top-rated specialists. Filter by location, insurance, and real patient reviews to find your perfect match.',
      linkText: 'Find a Doctor',
      linkColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      iconHoverBg: 'group-hover:bg-rose-500',
      iconHoverColor: 'group-hover:text-white'
    },
    {
      icon: 'library_books',
      title: 'Knowledge Hub',
      description: 'Empower yourself with medically reviewed articles, wellness guides, and health tips written by experts in plain language.',
      linkText: 'Explore Library',
      linkColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      iconHoverBg: 'group-hover:bg-purple-500',
      iconHoverColor: 'group-hover:text-white'
    }
  ];

  return (
    <section className="bg-white px-4 py-24 lg:px-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-pink-50/50 to-transparent"></div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900 mb-4">Holistic Health Ecosystem</h2>
            <p className="text-lg text-gray-500 font-light">We've built a suite of tools designed to make healthcare accessible, understandable, and less intimidating for everyone.</p>
          </div>
          <a className="group flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors" href="#">
            View all services 
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_right_alt</span>
          </a>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="group relative flex flex-col justify-between rounded-[2rem] bg-neutral-light p-1 transition-all duration-300 hover:-translate-y-2 hover:shadow-soft">
              <div className="bg-white rounded-[1.8rem] p-8 h-full flex flex-col border border-gray-100 group-hover:border-pink-100 transition-colors">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${service.iconBg} ${service.iconColor} ${service.iconHoverBg} ${service.iconHoverColor} transition-colors duration-300`}>
                  <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{service.description}</p>
                <div className="mt-auto pt-6 border-t border-gray-50">
                  <span className={`text-sm font-bold ${service.linkColor} group-hover:underline decoration-2 underline-offset-4`}>{service.linkText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
