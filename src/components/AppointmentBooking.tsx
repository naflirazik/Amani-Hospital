import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS, HOSPITAL_INFO } from '../data/mockData';
import { AppointmentFormData, BookedConfirmation } from '../types';
import { saveAppointmentToSupabase } from '../lib/supabase';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Stethoscope, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  RefreshCw, 
  ShieldCheck,
  Video,
  Building,
  Sparkles,
  PhoneCall,
  Database
} from 'lucide-react';

interface AppointmentBookingProps {
  initialDepartmentId?: string;
  initialDoctorId?: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  initialDepartmentId = '',
  initialDoctorId = '',
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: '',
    phone: '',
    email: '',
    departmentId: initialDepartmentId || (DEPARTMENTS[0]?.id ?? 'cardiology'),
    doctorId: initialDoctorId || '',
    preferredDate: '',
    preferredTime: TIME_SLOTS[0],
    visitType: 'in-person',
    symptoms: '',
    isUrgent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookedConfirmation | null>(null);
  const [supabaseSaved, setSupabaseSaved] = useState<boolean | null>(null);

  // Sync props when user selects doctor/department from other sections
  useEffect(() => {
    if (initialDepartmentId) {
      setFormData((prev) => ({
        ...prev,
        departmentId: initialDepartmentId,
      }));
    }
  }, [initialDepartmentId]);

  useEffect(() => {
    if (initialDoctorId) {
      const doc = DOCTORS.find((d) => d.id === initialDoctorId);
      if (doc) {
        setFormData((prev) => ({
          ...prev,
          departmentId: doc.departmentId,
          doctorId: doc.id,
        }));
      }
    }
  }, [initialDoctorId]);

  // Filter doctors based on currently selected department
  const availableDoctors = DOCTORS.filter((doc) => doc.departmentId === formData.departmentId);

  // Set default doctor if selected doctor is not in new department
  useEffect(() => {
    if (availableDoctors.length > 0) {
      const isDocValid = availableDoctors.some((d) => d.id === formData.doctorId);
      if (!isDocValid && !formData.doctorId) {
        setFormData((prev) => ({ ...prev, doctorId: availableDoctors[0].id }));
      }
    }
  }, [formData.departmentId, availableDoctors, formData.doctorId]);

  // Set minimum date to tomorrow
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full legal name (at least 2 characters).';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for appointment confirmation.';
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (e.g. +1 555 123 4567).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required for digital confirmation slip.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Please select a hospital department.';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a preferred doctor or specialist.';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please choose a preferred consultation date.';
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for that field on edit
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value;
    const docsInDept = DOCTORS.filter((d) => d.departmentId === newDeptId);
    setFormData((prev) => ({
      ...prev,
      departmentId: newDeptId,
      doctorId: docsInDept.length > 0 ? docsInDept[0].id : '',
    }));
    if (errors.departmentId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.departmentId;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSupabaseSaved(null);

    const selectedDoc = DOCTORS.find((d) => d.id === formData.doctorId);
    const selectedDept = DEPARTMENTS.find((d) => d.id === formData.departmentId);
    const randomRef = 'WCH-' + Math.floor(100000 + Math.random() * 900000);

    const docName = selectedDoc ? selectedDoc.name : 'Attending Specialist';
    const deptName = selectedDept ? selectedDept.name : 'General Care';

    // Save directly to Supabase table
    const result = await saveAppointmentToSupabase({
      appointment_ref: randomRef,
      full_name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      department_id: formData.departmentId,
      department_name: deptName,
      doctor_id: formData.doctorId,
      doctor_name: docName,
      preferred_date: formData.preferredDate,
      preferred_time: formData.preferredTime,
      visit_type: formData.visitType,
      symptoms: formData.symptoms || '',
      status: 'confirmed',
    });

    setSupabaseSaved(result.success);

    const confirmation: BookedConfirmation = {
      appointmentId: randomRef,
      data: { ...formData },
      doctorName: docName,
      departmentName: deptName,
      bookingTimestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setConfirmedBooking(confirmation);
    setIsSubmitting(false);
  };

  const handleResetForm = () => {
    setConfirmedBooking(null);
    setSupabaseSaved(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      departmentId: DEPARTMENTS[0]?.id ?? 'cardiology',
      doctorId: DOCTORS.filter((d) => d.departmentId === (DEPARTMENTS[0]?.id ?? 'cardiology'))[0]?.id || '',
      preferredDate: '',
      preferredTime: TIME_SLOTS[0],
      visitType: 'in-person',
      symptoms: '',
      isUrgent: false,
    });
    setErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="appointment" className="py-20 bg-gradient-to-b from-blue-50/50 to-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant Online Scheduling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Book an Appointment
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            Select your preferred specialist and choose a convenient consultation slot. Instant digital confirmation with zero pre-payment required.
          </p>
        </div>

        {/* Confirmation State View */}
        {confirmedBooking ? (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xl animate-in zoom-in-95 duration-200">
            {/* Top Success Badge */}
            <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Appointment Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Thank You, {confirmedBooking.data.fullName}!
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md">
                Your consultation slot has been reserved. A confirmation SMS and digital entry pass have been dispatched to your contact details.
              </p>
              
              {/* Reference ID Pill & Cloud Sync Badge */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300/80 px-4 py-2 rounded-xl text-slate-800 text-sm font-mono font-bold">
                  <span>Appointment Ref:</span>
                  <span className="text-blue-600">{confirmedBooking.appointmentId}</span>
                </div>
                {supabaseSaved !== null && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
                    supabaseSaved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    <Database className="w-3.5 h-3.5" />
                    <span>{supabaseSaved ? 'Saved to Supabase Backend' : 'Saved Locally (Syncing)'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase">Consulting Specialist</div>
                <div className="text-base font-bold text-slate-900 mt-1">{confirmedBooking.doctorName}</div>
                <div className="text-xs font-medium text-blue-600">{confirmedBooking.departmentName}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase">Date & Scheduled Time</div>
                <div className="text-base font-bold text-slate-900 mt-1">{confirmedBooking.data.preferredDate}</div>
                <div className="text-xs font-medium text-slate-600">{confirmedBooking.data.preferredTime}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase">Patient Contact Details</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{confirmedBooking.data.fullName}</div>
                <div className="text-xs text-slate-600">{confirmedBooking.data.phone} • {confirmedBooking.data.email}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase">Consultation Mode</div>
                <div className="text-sm font-semibold text-slate-900 mt-1 capitalize">
                  {confirmedBooking.data.visitType === 'teleconsult' ? '🌐 HD Video Teleconsultation' : '🏥 Hospital In-Person Visit'}
                </div>
                <div className="text-xs text-slate-500">
                  {confirmedBooking.data.visitType === 'teleconsult'
                    ? 'A video link will be sent 15 mins prior to call.'
                    : 'Please report to OPD Reception Wing A.'}
                </div>
              </div>
            </div>

            {/* Symptoms notes if any */}
            {confirmedBooking.data.symptoms && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-6">
                <span className="font-bold text-slate-900">Reported Symptoms / Clinical Reason:</span> {confirmedBooking.data.symptoms}
              </div>
            )}

            {/* Visit Guidelines */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1 mb-8">
              <div className="font-bold flex items-center gap-1.5 text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Patient Arrival Guidelines:</span>
              </div>
              <p>• Please arrive 15 minutes before your scheduled slot with a photo ID and insurance card.</p>
              <p>• For queries or rescheduling, call hospital reception at {HOSPITAL_INFO.generalPhone}.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Appointment Slip</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Book Another Appointment</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Appointment Form */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative">
            
            {/* Consultation Mode Selector */}
            <div className="mb-8 p-1.5 bg-slate-100 rounded-2xl flex items-center max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, visitType: 'in-person' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  formData.visitType === 'in-person'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>In-Person Hospital OPD</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, visitType: 'teleconsult' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  formData.visitType === 'teleconsult'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Teleconsultation</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Row 1: Patient Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Patient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Eleanor Vance"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.fullName ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 234-5678"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.phone ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Email & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. eleanor.vance@example.com"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="departmentId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Hospital Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleDepartmentChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.departmentId ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'
                      }`}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.departmentId && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.departmentId}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Preferred Doctor & Preferred Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="doctorId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Preferred Doctor / Specialist <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      id="doctorId"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.doctorId ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'
                      }`}
                    >
                      {availableDoctors.length > 0 ? (
                        availableDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} — {doc.title} ({doc.experience})
                          </option>
                        ))
                      ) : (
                        <option value="">No specialists found for department</option>
                      )}
                    </select>
                  </div>
                  {errors.doctorId && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.doctorId}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="preferredDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      min={getTomorrowDateString()}
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.preferredDate ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.preferredDate && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.preferredDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Preferred Time Slot */}
              <div>
                <label htmlFor="preferredTime" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Preferred Time Slot <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = formData.preferredTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, preferredTime: slot }));
                          if (errors.preferredTime) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.preferredTime;
                              return next;
                            });
                          }
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.preferredTime && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.preferredTime}</span>
                  </p>
                )}
              </div>

              {/* Row 5: Symptoms & Message */}
              <div>
                <label htmlFor="symptoms" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Reason for Visit / Symptoms or Medical Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    rows={3}
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your symptoms, duration, or if you need a follow-up or second opinion..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA & Privacy Guarantee */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>HIPAA-Compliant data encryption. No advance fees required.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer"
                  id="submit-appointment-btn"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Confirming Slot...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
