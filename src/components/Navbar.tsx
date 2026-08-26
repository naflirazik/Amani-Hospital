import React, { useState, useEffect } from 'react';
import { HOSPITAL_INFO } from '../data/mockData';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  ChevronRight,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookClick, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Departments', href: '#departments' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Services', href: '#services' },
    { label: 'Why Choose Us', href: '#why-choose-us' },
    { label: 'Book Appointment', href: '#appointment' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Top emergency and operational bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>742 Healthcare Blvd, Metro Medical District, NY</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>24/7 Emergency Care | OPD: Mon - Sat 8AM - 8PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-blue-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>JCI & NABH Accredited</span>
            </div>
            <a 
              href={`tel:${HOSPITAL_INFO.emergencyPhoneRaw}`} 
              className="flex items-center gap-1.5 text-rose-300 hover:text-rose-200 font-semibold transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>24/7 Emergency: {HOSPITAL_INFO.emergencyPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky navigation bar */}
      <nav className={`w-full bg-white transition-shadow duration-200 ${
        isScrolled ? 'shadow-md shadow-slate-200/60 border-b border-slate-200' : 'border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="flex items-center gap-3 group focus:outline-none"
              id="hospital-logo"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <div className="relative flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-white/20" />
                  <span className="absolute text-[11px] font-black text-white">+</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  We Care <span className="text-blue-600">Hospital</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                  Multi-Specialty & Trauma Care
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`px-3 py-2 rounded-lg transition-colors duration-150 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50 font-semibold' 
                        : 'hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhoneRaw}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                title="Call Emergency Ambulance & Trauma Team"
                id="header-emergency-call"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Emergency: 800-923-CARE</span>
              </a>

              <button
                type="button"
                onClick={onBookClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-500/25 transition-all duration-150 cursor-pointer"
                id="header-book-appointment-btn"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhoneRaw}`}
                className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200"
                aria-label="Call Emergency"
              >
                <Phone className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
                id="mobile-menu-toggle-btn"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1 pt-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-blue-600 font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                id="mobile-drawer-book-btn"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </button>

              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-rose-700 bg-rose-50 border border-rose-200 font-semibold text-sm hover:bg-rose-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-rose-600" />
                <span>Emergency Care: {HOSPITAL_INFO.emergencyPhone}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
