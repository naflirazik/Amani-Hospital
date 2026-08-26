import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { 
  HeartHandshake, 
  Star, 
  Quote, 
  CheckCircle2, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
            <span>Patient Stories & Recovery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Over 50,000+ Patients
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            Read firsthand experiences from patients and families who received life-changing clinical care, empathetic nursing, and successful surgical treatments at We Care Hospital.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/80 hover:bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
              id={`testimonial-card-${test.id}`}
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-blue-200 group-hover:text-blue-500 transition-colors" />
                </div>

                {/* Treatment Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-bold mb-3">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>{test.treatment}</span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Patient Profile */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <img
                  src={test.avatarUrl}
                  alt={test.patientName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0 bg-slate-200"
                />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {test.patientName}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{test.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Review Score Banner */}
        <div className="mt-14 max-w-2xl mx-auto rounded-2xl bg-blue-50/70 border border-blue-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {TESTIMONIALS.map((t, idx) => (
                <img
                  key={idx}
                  src={t.avatarUrl}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">4.92 / 5.0 Overall Patient Experience</div>
              <div className="text-[11px] text-slate-500">Based on 14,200+ verified post-discharge reviews</div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-blue-700">
            <span>Verified by Independent Healthcare Audit</span>
          </div>
        </div>

      </div>
    </section>
  );
};
