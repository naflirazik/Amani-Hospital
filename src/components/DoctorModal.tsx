import React from 'react';
import { Doctor } from '../types';
import { 
  X, 
  Calendar, 
  Award, 
  GraduationCap, 
  Languages, 
  Clock, 
  Star, 
  CheckCircle2, 
  PhoneCall, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';

interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with gradient & close button */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close doctor details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white/30 shadow-md shrink-0 bg-slate-200"
            />
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{doctor.departmentName}</span>
              </div>
              <h3 className="text-2xl font-extrabold">{doctor.name}</h3>
              <p className="text-blue-100 text-sm font-medium mt-0.5">{doctor.title}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-blue-50">
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span className="font-bold text-white">{doctor.rating}</span>
                  <span className="text-blue-200">({doctor.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Award className="w-3.5 h-3.5 text-blue-200" />
                  <span>{doctor.experience} Experience</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Fee: {doctor.consultationFee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable details body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Clinical Background & Profile
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Qualifications & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Qualifications</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{doctor.qualification}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Education & Alma Mater</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{doctor.education}</p>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Clinical Sub-Specialties & Procedures
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{spec}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Availability & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">OPD Consultation Hours</div>
                <div className="text-xs text-slate-600">{doctor.availability}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Languages className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">Languages Spoken</div>
                <div className="text-xs text-slate-600">{doctor.languages.join(', ')}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Next available slots open for online booking</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onBookAppointment(doctor);
                onClose();
              }}
              className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
