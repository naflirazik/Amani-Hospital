/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Departments } from './components/Departments';
import { Doctors } from './components/Doctors';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { AppointmentBooking } from './components/AppointmentBooking';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getAdminSession, AdminSession } from './lib/adminAuth';
import { Doctor } from './types';
import { HOSPITAL_INFO } from './data/mockData';
import { PhoneCall, Calendar, ArrowUp } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [bookingDeptId, setBookingDeptId] = useState('');
  const [bookingDoctorId, setBookingDoctorId] = useState('');

  // Admin state
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => getAdminSession());
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminDashboardView, setIsAdminDashboardView] = useState(false);

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'departments', 'doctors', 'services', 'why-choose-us', 'appointment', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookClick = () => {
    scrollToSection('#appointment');
  };

  const handleExploreDepartments = () => {
    scrollToSection('#departments');
  };

  const handleSelectDepartmentForBooking = (deptId: string) => {
    setBookingDeptId(deptId);
    setBookingDoctorId(''); // reset doctor to let auto-filter pick first
    scrollToSection('#appointment');
  };

  const handleFilterDoctorsByDept = (deptId: string) => {
    setSelectedDeptFilter(deptId);
    scrollToSection('#doctors');
  };

  const handleBookWithDoctor = (doctor: Doctor) => {
    setBookingDeptId(doctor.departmentId);
    setBookingDoctorId(doctor.id);
    scrollToSection('#appointment');
  };

  const handleOpenAdminPortal = () => {
    if (adminSession) {
      setIsAdminDashboardView(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  // If Admin is in active dashboard view
  if (isAdminDashboardView && adminSession) {
    return (
      <AdminDashboard
        session={adminSession}
        onLogout={() => {
          setAdminSession(null);
          setIsAdminDashboardView(false);
        }}
        onExitToWebsite={() => setIsAdminDashboardView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      
      {/* 1. Sticky Navbar */}
      <Navbar
        onBookClick={handleBookClick}
        activeSection={activeSection}
      />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <Hero
          onBookClick={handleBookClick}
          onExploreDepartments={handleExploreDepartments}
        />

        {/* 3. About Us Section */}
        <About
          onBookClick={handleBookClick}
        />

        {/* 4. Departments Section */}
        <Departments
          onSelectDepartmentForBooking={handleSelectDepartmentForBooking}
          onFilterDoctorsByDept={handleFilterDoctorsByDept}
        />

        {/* 5. Our Doctors Section */}
        <Doctors
          selectedDeptFilter={selectedDeptFilter}
          onSelectDeptFilter={setSelectedDeptFilter}
          onBookWithDoctor={handleBookWithDoctor}
        />

        {/* 6. Our Services Section */}
        <Services
          onBookClick={handleBookClick}
        />

        {/* 9. Why Choose Us / Facilities Section */}
        <WhyChooseUs />

        {/* 7. Appointment Booking Section */}
        <AppointmentBooking
          initialDepartmentId={bookingDeptId}
          initialDoctorId={bookingDoctorId}
        />

        {/* 8. Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* 10. Contact Us Section */}
        <Contact />
      </main>

      {/* 11. Footer with Admin Portal Link */}
      <Footer 
        onNavClick={scrollToSection} 
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* Admin Authentication & Single-Slot Setup Modal */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={(session) => {
          setAdminSession(session);
          setIsAdminDashboardView(true);
          setIsAdminModalOpen(false);
        }}
      />

      {/* Quick Floating Emergency Call Button on Mobile */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5 sm:hidden">
        <a
          href={`tel:${HOSPITAL_INFO.emergencyPhoneRaw}`}
          className="flex items-center justify-center w-13 h-13 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 border-2 border-white"
          aria-label="Call Emergency"
        >
          <PhoneCall className="w-6 h-6 animate-pulse" />
        </a>
        <button
          type="button"
          onClick={handleBookClick}
          className="flex items-center justify-center w-13 h-13 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 border-2 border-white"
          aria-label="Book Appointment"
        >
          <Calendar className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
