import React from 'react';
import Header from '../Header';

const AUTH_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoplcboiDPvjEfs7n9mgh0c2cpulE0pdPtuKLrxkJkl1AbqdnW8Yvz53XrULLgQKwOU4UpSTZm7x7uA-h_TAMsOPqcousVDPcCoed4TmOmRDBKLBVU9RAPPhdlUvUmiCEyyQZbU1Hz0oHPFhSheKklsRYd_JDOpIW-iH6JSYq7dvx_67jOvlDlUpwzO-sz7xD0pidB_hb5zio3ij8_3QEScLT9opmaz_ikUAVmB_5f45h8rSn3GJht2LGyknEbnwdW_Q3gzRpNOa2r';

const AuthLayout = ({ children }) => {
  return (
    <div className="font-poppins bg-medicure-bg min-h-screen">
      <Header />
      <div className="pt-20 min-h-screen flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-[1280px] min-h-[850px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative ring-1 ring-black/5">
        {/* Left panel - branding */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-pink-500 via-pink-400 to-rose-400 relative flex-col justify-between p-16 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-3xl"></div>
            <svg className="absolute top-20 right-20 w-24 h-24 text-white/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white text-medicure-pink rounded-xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-2xl">cardiology</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">MediCure</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Empowering Your <br />
                <span className="text-pink-100">Health Journey</span>
              </h1>
              <p className="text-pink-50 text-lg max-w-md font-light leading-relaxed">
                Access world-class healthcare recommendations, connect with top specialists, and manage your medical history all in one secure place.
              </p>
            </div>
          </div>
          <div className="relative z-10 flex-grow flex items-center justify-center my-8">
            <div className="w-full max-w-md relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl transform rotate-3 scale-95 transition-transform duration-500 hover:rotate-6"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl overflow-hidden group">
                <img
                  alt="Medical professional analyzing digital health data on a tablet"
                  className="w-full h-64 object-cover rounded-lg shadow-md transform transition-transform duration-700 group-hover:scale-105"
                  src={AUTH_IMAGE}
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Dr. Sarah Mitchell</p>
                    <p className="text-xs text-pink-100">Senior Cardiologist</p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-pink-200 border-2 border-pink-500 flex items-center justify-center text-xs text-pink-700 font-bold">+5k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-6 text-sm font-medium text-pink-50/80">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">workspace_premium</span>
                Top Rated
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="w-full lg:w-1/2 flex flex-col relative z-20 bg-white">
          <div className="lg:hidden p-6 flex items-center justify-center border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-medicure-pink rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">cardiology</span>
              </div>
              <span className="text-xl font-bold text-gray-800">MediCure</span>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto px-8 py-10 sm:px-12 lg:px-20 flex flex-col justify-center">
            {children}
          </div>
          <div className="mt-12 text-center pb-8">
            <p className="text-xs text-gray-400">© 2023 MediCure Health Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AuthLayout;
