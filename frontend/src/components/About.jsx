import React from 'react';

const About = () => {
  const features = [
    {
      icon: 'verified',
      title: 'Verified Professionals',
      description: 'Rigorous screening process for every specialist on our platform.'
    },
    {
      icon: 'shield',
      title: 'Data Privacy First',
      description: 'Bank-level encryption to keep your health data secure and private.'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-primary-soft py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
              <div className="absolute -top-10 -right-10 z-0 h-64 w-64 rounded-full bg-pink-300/30 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 z-0 h-64 w-64 rounded-full bg-purple-300/30 blur-3xl"></div>
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-pink-900/10">
                <div 
                  className="h-[500px] w-full bg-cover bg-center transition-transform duration-700 hover:scale-105" 
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZSqo5KsBmNuIkm7f1s1U3XVLxpCufQfzhcNI31EgeiXl71gxwoV5W_pYE06xyZoGHphHJzPrCjL52x21z4y_SXGQy59wY-6Ts760wd6bH894QRIZagixd2NMsyS42m_XJjBunB9gJ7vKQicGwka8AJekqLpnnbnpvpBygKFn-jQqeksEFUyzgYvcQ6KpVvQ9Xs7mN3SeX51kzt9B5TzTbbw64EYWC5l_7ue64GzxapuSLHfnDbV5nb1EA1s-BYJ1-qHPQSML7rq6j")'}}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-primary font-bold text-lg">98%</div>
                        <div>
                          <p className="font-bold text-gray-900">Patient Satisfaction</p>
                          <p className="text-sm text-gray-500">Based on 15,000+ reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 flex flex-col gap-8 lg:order-2">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              About Us
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
              Compassion meets <br/><span className="text-gradient">Innovation.</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 font-light">
              At MediCure, we believe healthcare should be a dialogue, not a monologue. We bridge the gap between complex medical data and human empathy. Our platform is built to guide you through your health journey with clarity, confidence, and care.
            </p>
            
            <div className="flex flex-col gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                      <span className="material-symbols-outlined text-xl">{feature.icon}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button className="inline-flex items-center justify-center rounded-full border-2 border-gray-900 bg-transparent px-8 py-3 text-base font-bold text-gray-900 transition-all hover:bg-gray-900 hover:text-white">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
