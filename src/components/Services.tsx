import React from 'react';
import { SERVICES } from '../data/mockData';
import { DynamicIcon } from './DynamicIcon';
import { 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ServicesProps {
  onBookClick: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onBookClick }) => {
  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>Comprehensive Hospital Facilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Healthcare Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            From 24/7 emergency critical care and advanced robotic surgeries to accredited automated laboratory testing and home pharmacy delivery.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
              id={`service-card-${service.id}`}
            >
              <div>
                {/* Top icon and badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-sm">
                    <DynamicIcon name={service.iconName} className="w-6 h-6" />
                  </div>
                  {service.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Feature checklist */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service bottom action */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBookClick}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Inquire or Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Callout Card inside Services */}
        <div className="mt-12 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20">
              <PhoneCall className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-extrabold">Need Immediate Medical Assistance or Ambulance?</h4>
              <p className="text-sm text-blue-100 mt-1 max-w-xl">
                Our 24/7 emergency dispatch team is on standby with GPS-enabled mobile ICUs and rapid cardiac response.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="tel:8009232273"
              className="px-6 py-3.5 rounded-xl bg-white text-blue-700 font-extrabold text-sm hover:bg-blue-50 shadow-md transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Call +1 (800) 923-CARE</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
