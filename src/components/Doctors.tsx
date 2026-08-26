import React, { useState, useMemo } from 'react';
import { DOCTORS, DEPARTMENTS } from '../data/mockData';
import { Doctor } from '../types';
import { DoctorModal } from './DoctorModal';
import { 
  Users, 
  Search, 
  Star, 
  Award, 
  Clock, 
  Calendar, 
  Info, 
  Filter,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface DoctorsProps {
  selectedDeptFilter: string;
  onSelectDeptFilter: (deptId: string) => void;
  onBookWithDoctor: (doctor: Doctor) => void;
}

export const Doctors: React.FC<DoctorsProps> = ({
  selectedDeptFilter,
  onSelectDeptFilter,
  onBookWithDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoctorForModal, setActiveDoctorForModal] = useState<Doctor | null>(null);

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDept && matchesSearch;
    });
  }, [selectedDeptFilter, searchQuery]);

  return (
    <section id="doctors" className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Expert Medical Faculty</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Specialist Doctors
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            Our team of internationally trained medical specialists, professors, and surgeons bring decades of clinical excellence to deliver the highest quality care.
          </p>

          {/* Search bar */}
          <div className="mt-6 w-full max-w-md relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors by name, specialty, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              id="doctor-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start lg:justify-center">
          <button
            type="button"
            onClick={() => onSelectDeptFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDeptFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Departments ({DOCTORS.length})
          </button>
          {DEPARTMENTS.map((dept) => {
            const count = DOCTORS.filter((d) => d.departmentId === dept.id).length;
            const isSelected = selectedDeptFilter === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => onSelectDeptFilter(dept.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name.split('&')[0].trim()} ({count})
              </button>
            );
          })}
        </div>

        {/* Doctors Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
              id={`doctor-card-${doctor.id}`}
            >
              <div>
                {/* Doctor Photo & Top Badges */}
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {/* Department Tag */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold shadow-sm">
                      {doctor.departmentName.split('&')[0].trim()}
                    </span>
                  </div>

                  {/* Rating Tag */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating}</span>
                    </span>
                  </div>

                  {/* Experience overlay */}
                  <div className="absolute bottom-3.5 left-3.5 text-white">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200">
                      <Award className="w-3.5 h-3.5 text-blue-300" />
                      <span>{doctor.experience} Experience</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">
                    {doctor.title}
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <div className="font-semibold text-slate-800">Qualification:</div>
                    <div className="truncate">{doctor.qualification}</div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {doctor.specialties.slice(0, 2).map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                    {doctor.specialties.length > 2 && (
                      <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                        +{doctor.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* OPD Availability */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{doctor.availability}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDoctorForModal(doctor)}
                  className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="View clinical background"
                >
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => onBookWithDoctor(doctor)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors cursor-pointer"
                  title={`Book appointment with ${doctor.name}`}
                  id={`book-doc-btn-${doctor.id}`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <p className="text-slate-600 font-medium">No doctors found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectDeptFilter('all');
              }}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Doctor Modal Details */}
      <DoctorModal
        doctor={activeDoctorForModal}
        onClose={() => setActiveDoctorForModal(null)}
        onBookAppointment={(doc) => onBookWithDoctor(doc)}
      />
    </section>
  );
};
