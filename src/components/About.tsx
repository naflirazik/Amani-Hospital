import React from 'react';
import { HOSPITAL_STATS, HOSPITAL_INFO } from '../data/mockData';
import { DynamicIcon } from './DynamicIcon';
import { 
  ShieldCheck, 
  Award, 
  Heart, 
  Clock, 
  Users, 
  CheckCircle2, 
  Building,
  Target
} from 'lucide-react';

interface AboutProps {
  onBookClick: () => void;
}

export const About: React.FC<AboutProps> = ({ onBookClick }) => {
  const currentYear = 2026;
  const yearsOfService = currentYear - HOSPITAL_INFO.establishedYear;

  const corePillars = [
    {
      title: 'Compassionate Patient-First Philosophy',
      desc: 'Treating each patient as family with empathy, transparent communication, and individualized care paths.',
    },
    {
      title: 'Pioneering Medical Technology',
      desc: 'Equipped with robotic surgical platforms, advanced 3T MRI imaging, and digital paperless medical health records.',
    },
    {
      title: 'Zero-Wait Emergency & Trauma Protocol',
      desc: 'Immediate triage with board-certified emergency physicians ready 24/7 for acute trauma and cardiac events.',
    },
    {
      title: 'Highest Global Accreditation (JCI & NABH)',
      desc: 'Adhering to rigorous international safety, clinical hygiene, and pharmaceutical stewardship standards.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Tag */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-blue-600 fill-blue-600/20" />
            <span>About We Care Hospital</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            28+ Years of Medical Excellence & Compassion
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl font-normal leading-relaxed">
            Founded with an unwavering mission to bring world-class healthcare within reach of every family, We Care Hospital has grown into one of the nation's premier tertiary and quaternary healthcare institutions.
          </p>
        </div>

        {/* 4 Key Stat Cards (Step 3 mandate: 500+ Doctors, 50,000+ Patients Treated, 24/7 Emergency Care, 15+ Departments) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {HOSPITAL_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <DynamicIcon name={stat.icon} className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Verified Stat
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {stat.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Narrative & Image / Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800"
                alt="We Care Hospital Operating Room and Diagnostics Facility"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold uppercase tracking-wider text-amber-300">National Healthcare Gold Medal</span>
                </div>
                <p className="text-xs text-slate-200">Recognized for Clinical Outcomes, Patient Safety, and Zero Infection Standards.</p>
              </div>
            </div>

            {/* Experience Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white rounded-2xl p-5 shadow-xl border-2 border-white hidden sm:block">
              <div className="text-3xl font-black">{yearsOfService}+</div>
              <div className="text-xs font-medium text-blue-100">Years of Healing</div>
            </div>
          </div>

          {/* Right Column: Mission and Core Pillars */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Our Mission & Healthcare Vision
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                At We Care Hospital, our clinical mission is built on three pillars: clinical excellence, empathetic patient communication, and continuous innovation. We combine world-class medical talent with state-of-the-art robotic and diagnostic facilities to deliver personalized care.
              </p>
            </div>

            {/* Pillars list */}
            <div className="space-y-3.5 pt-2">
              {corePillars.map((pillar, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{pillar.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={onBookClick}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm cursor-pointer"
                id="about-schedule-consultation-btn"
              >
                Schedule a Consultation
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Confidential & Secure Records</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
