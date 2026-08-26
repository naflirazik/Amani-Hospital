import React from 'react';
import { WHY_CHOOSE_US } from '../data/mockData';
import { DynamicIcon } from './DynamicIcon';
import { 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Why Trust We Care</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Setting the Benchmark in Patient Care
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            We combine world-class clinical expertise, cutting-edge medical technologies, and deeply compassionate patient support to ensure the highest standard of healing.
          </p>
        </div>

        {/* 6 Core Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((facility) => (
            <div
              key={facility.id}
              className="bg-slate-50/60 rounded-3xl p-8 border border-slate-200/80 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <DynamicIcon name={facility.iconName} className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
                    {facility.metric}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {facility.title}
                </h3>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                  {facility.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Quality Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Assurance Strip */}
        <div className="mt-16 bg-blue-50/80 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                International Patient Safety Goals (IPSG) Compliant
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Zero medication error protocols, double-identifier verification, and 100% sterilized air handlers.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-blue-700 bg-white px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
            <span>Audit Score: 99.8%</span>
          </div>
        </div>

      </div>
    </section>
  );
};
