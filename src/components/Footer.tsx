import React from 'react';
import { HOSPITAL_INFO, DEPARTMENTS } from '../data/mockData';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowUp,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

interface FooterProps {
  onNavClick: (href: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand, Mission, Accreditations */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  We Care <span className="text-blue-400">Hospital</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Excellence in Healthcare
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We Care Hospital is dedicated to providing compassionate, cutting-edge multi-specialty medical care. Equipped with over 500 specialist doctors, 15+ departments, and 24/7 Level-1 emergency services.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>JCI Accredited & NABH Certified Hospital</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Operating Continuously Since 1998</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#home'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home & Overview
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#about'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  About Our Hospital
                </a>
              </li>
              <li>
                <a 
                  href="#departments" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#departments'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Medical Departments
                </a>
              </li>
              <li>
                <a 
                  href="#doctors" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#doctors'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Find a Doctor
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#services'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Hospital Services
                </a>
              </li>
              <li>
                <a 
                  href="#appointment" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#appointment'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Book Appointment
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#testimonials'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Patient Testimonials
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); onNavClick('#contact'); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact & Location
                </a>
              </li>
              <li className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                  id="footer-admin-link-nav"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin Sign In / Setup</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Department Specialties */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Specialized Clinics
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-xs text-slate-400">
              {DEPARTMENTS.slice(0, 7).map((dept) => (
                <li key={dept.id}>
                  <a
                    href="#departments"
                    onClick={(e) => { e.preventDefault(); onNavClick('#departments'); }}
                    className="hover:text-blue-400 transition-colors flex items-center justify-between"
                  >
                    <span>{dept.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Location */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              24/7 Emergency Hub
            </h4>
            
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 space-y-1">
              <div className="font-bold text-rose-300 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Emergency Ambulance Desk</span>
              </div>
              <div className="text-base font-extrabold text-white">
                {HOSPITAL_INFO.emergencyPhone}
              </div>
              <div className="text-[11px] text-rose-300">Zero wait triage response</div>
            </div>

            <div className="text-xs space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{HOSPITAL_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{HOSPITAL_INFO.generalPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{HOSPITAL_INFO.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Compliance, Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} We Care Hospital. All rights reserved. Registered Healthcare Provider.</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Privacy Policy • Patient Rights Charter • Non-Discrimination Policy • Bio-Medical Waste Compliance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-blue-300 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
              id="footer-admin-portal-button"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Staff & Admin Portal</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
