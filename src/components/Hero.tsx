import React from 'react';
import { HOSPITAL_INFO } from '../data/mockData';
import { 
  Calendar, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Star, 
  Activity, 
  ArrowRight,
  Sparkles,
  HeartPulse
} from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  onExploreDepartments: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreDepartments }) => {
  return (
    <section id="home" className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subtitle, Badges, Action Buttons */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold w-fit">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>JCI Accredited & National Quality Excellence Award</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              World-Class Healthcare, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Centered Around You.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
              At <strong className="text-slate-900 font-semibold">We Care Hospital</strong>, we unite over 500 board-certified specialists, 15+ modern super-specialty departments, and 24/7 emergency care to deliver compassionate, precise medical excellence for every stage of life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer group"
                id="hero-book-appointment-btn"
              >
                <Calendar className="w-5 h-5" />
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhoneRaw}`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100/90 active:bg-rose-200 shadow-sm transition-all duration-200"
                id="hero-call-emergency-btn"
              >
                <PhoneCall className="w-5 h-5 text-rose-600 animate-pulse" />
                <span>24/7 Emergency Line</span>
              </a>

              <button
                type="button"
                onClick={onExploreDepartments}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 shadow-sm transition-all duration-200 cursor-pointer sm:hidden md:inline-flex"
                id="hero-explore-departments-btn"
              >
                <span>Our Departments</span>
              </button>
            </div>

            {/* Quick trust metrics row */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-xl">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-2xl">
                  <span>500+</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Professional Doctors</span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-4">
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-2xl">
                  <span>24/7</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Emergency Care</span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-4">
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-2xl text-blue-600">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>4.9/5</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Patient Satisfaction</span>
              </div>
            </div>

          </div>

          {/* Right Column: High Quality Hospital Visual & Floating Doctor Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Clinical Hospital Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                  alt="We Care Hospital Medical Team and Modern Healthcare Facility"
                  className="w-full h-[440px] sm:h-[480px] object-cover object-center"
                />
                
                {/* Gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                {/* Image caption card inside */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">Advanced Cardiac & Trauma Wing</h4>
                      <p className="text-xs text-slate-500">Equipped with 3T MRI & Level-1 Triage</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold shrink-0">
                    Active 24/7
                  </span>
                </div>
              </div>

              {/* Floating Top-Left Card: 24/7 Emergency */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 animate-pulse duration-1000">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Zero-Wait Triage</div>
                  <div className="text-[11px] text-slate-500 font-medium">&lt; 2 min response</div>
                </div>
              </div>

              {/* Floating Right Card: Verified Specialists */}
              <div className="absolute top-1/3 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">500+ Professional Doctors</div>
                  <div className="text-[11px] text-slate-500 font-medium">Board Certified</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">24/7 Emergency Care</h4>
              <p className="text-xs text-slate-600 mt-1">Immediate response team ready for critical care round the clock.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Qualified Specialists</h4>
              <p className="text-xs text-slate-600 mt-1">Internationally trained physicians across 15+ departments.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Modern Technology</h4>
              <p className="text-xs text-slate-600 mt-1">3T MRI, 128-slice CT scans, and robotic surgical suites.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Patient-First Care</h4>
              <p className="text-xs text-slate-600 mt-1">Compassionate, personalized treatment with transparent billing.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
