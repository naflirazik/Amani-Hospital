import React, { useState } from 'react';
import { DEPARTMENTS } from '../data/mockData';
import { Department } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { 
  Building2, 
  ArrowRight, 
  Users, 
  Calendar, 
  Search, 
  BedDouble, 
  Clock,
  Sparkles
} from 'lucide-react';

interface DepartmentsProps {
  onSelectDepartmentForBooking: (deptId: string) => void;
  onFilterDoctorsByDept: (deptId: string) => void;
}

export const Departments: React.FC<DepartmentsProps> = ({
  onSelectDepartmentForBooking,
  onFilterDoctorsByDept,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptDetail, setSelectedDeptDetail] = useState<Department | null>(null);

  const filteredDepartments = DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.features.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section id="departments" className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Specialized Clinical Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Medical Departments
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            From routine checkups to complex tertiary surgeries, our specialized departments are equipped with leading clinical experts and high-precision medical technology.
          </p>

          {/* Quick Search Input */}
          <div className="mt-6 w-full max-w-md relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search departments or clinical conditions (e.g. Heart, Skin, Surgery)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              id="department-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
              id={`dept-card-${dept.id}`}
            >
              <div>
                {/* Top Icon & Bed Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-sm">
                    <DynamicIcon name={dept.iconName} className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dept.bedCount}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {dept.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {dept.shortDesc}
                </p>

                {/* Key Features / Clinical Highlights */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {dept.features.slice(0, 3).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {feat}
                    </span>
                  ))}
                  {dept.features.length > 3 && (
                    <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                      +{dept.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* OPD Schedule hint */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>OPD: {dept.opdDays}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onFilterDoctorsByDept(dept.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  title="View Doctors in this department"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Doctors</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectDepartmentForBooking(dept.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                  title="Book an appointment for this department"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 font-medium">No departments matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              Show All Departments
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
