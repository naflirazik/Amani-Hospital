import React, { useState } from 'react';
import { HOSPITAL_INFO } from '../data/mockData';
import { ContactFormData } from '../types';
import { saveContactMessageToSupabase } from '../lib/supabase';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Car, 
  ShieldCheck,
  Building,
  PhoneCall
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'General Medical Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) errs.email = 'Please enter your email.';
    if (!formData.message.trim()) errs.message = 'Please enter your message or inquiry.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    await saveContactMessageToSupabase({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject,
      message: formData.message.trim(),
    });
    setIsSending(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Medical Inquiry',
      message: '',
    });
    setErrors({});
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Connect with Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact & Hospital Location
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            Our medical staff and reception help desks are available 24/7. Reach out for consultations, second opinions, billing queries, or emergency ambulance dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Hospital Contact Details & Map Card */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                Hospital Information
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Hospital Address</div>
                    <div className="text-slate-600 text-xs mt-0.5">{HOSPITAL_INFO.address}</div>
                    <div className="text-[11px] text-blue-600 mt-0.5">Opposite Central Medical Park, Gate 1 & 2</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">24/7 Emergency & Trauma Hotline</div>
                    <a href={`tel:${HOSPITAL_INFO.emergencyPhoneRaw}`} className="text-rose-600 font-bold hover:underline">
                      {HOSPITAL_INFO.emergencyPhone}
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Ambulance & Critical Response</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">General OPD Appointments & Queries</div>
                    <a href={`tel:${HOSPITAL_INFO.generalPhone}`} className="text-blue-600 font-semibold hover:underline">
                      {HOSPITAL_INFO.generalPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Email Inquiries</div>
                    <a href={`mailto:${HOSPITAL_INFO.email}`} className="text-slate-600 hover:text-blue-600 text-xs">
                      {HOSPITAL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Operating Hours</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      <span className="font-semibold text-emerald-600">Emergency & ICU:</span> 24 Hours / 7 Days
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Outpatient (OPD):</span> Mon - Sat: 8:00 AM - 8:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Graphic & Parking info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Campus Map & Directions</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Free Valet Parking
                </span>
              </div>

              {/* Map visual canvas placeholder */}
              <div className="relative h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center group">
                {/* Visual grid styling */}
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                
                {/* Hospital Marker */}
                <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 shadow">
                    We Care Hospital
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-slate-700 font-medium border border-slate-200">
                  Metro Medical District • 742 Healthcare Blvd
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" />
                  500+ Dedicated Parking Spaces
                </span>
                <span className="text-blue-600 font-semibold">Get GPS Route →</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Patient Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm h-full flex flex-col justify-between">
              
              {isSubmitted ? (
                <div className="my-auto text-center py-10 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Message Received!</h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                    Thank you for reaching out to We Care Hospital. Our patient relations coordinator will review your message and reply within 2 to 4 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      Send a Message or Inquiry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below and our medical administration team will respond promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +1 555 000 1234"
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Subject / Department
                      </label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="General Medical Inquiry">General Medical Inquiry</option>
                        <option value="Billing & Insurance Assistance">Billing & Insurance Assistance</option>
                        <option value="Health Checkup Packages">Health Checkup Packages</option>
                        <option value="Doctor Consultation Feedback">Doctor Consultation Feedback</option>
                        <option value="Medical Records & Reports">Medical Records & Reports</option>
                        <option value="International Patient Services">International Patient Services</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message or Question <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe how we can assist you..."
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>We respect your patient confidentiality.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 shadow-md transition-colors cursor-pointer"
                      id="submit-contact-btn"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
