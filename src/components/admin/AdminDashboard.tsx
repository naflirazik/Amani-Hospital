import React, { useState, useEffect, useMemo } from 'react';
import { 
  AppointmentRecord, 
  fetchAllAppointments, 
  updateAppointmentStatus, 
  deleteAppointmentRecord,
  saveAppointmentToSupabase,
  supabase
} from '../../lib/supabase';
import { AdminSession, logoutAdmin, changeAdminPassword } from '../../lib/adminAuth';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS, HOSPITAL_INFO } from '../../data/mockData';
import {
  Hospital,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Download,
  Printer,
  Plus,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Video,
  Building,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Database,
  ExternalLink,
  ChevronDown,
  Sparkles,
  KeyRound,
  Lock,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  session: AdminSession;
  onLogout: () => void;
  onExitToWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  session,
  onLogout,
  onExitToWebsite,
}) => {
  // State
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [supabaseCount, setSupabaseCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [visitTypeFilter, setVisitTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');

  // Active Modals
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Manual Add Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDepartmentId, setNewDepartmentId] = useState(DEPARTMENTS[0].id);
  const [newDoctorId, setNewDoctorId] = useState(DOCTORS[0].id);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState(TIME_SLOTS[0]);
  const [newVisitType, setNewVisitType] = useState('In-Person Consultation');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  // Password change state in Account modal
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwFeedback, setPwFeedback] = useState<{ success?: string; error?: string }>({});

  // Load appointments
  const loadAppointments = async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const result = await fetchAllAppointments();
      setAppointments(result.data);
      setSupabaseCount(result.fromSupabaseCount);
      setFetchError(result.error);
    } catch (err: any) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppointments(true);
  }, []);

  // Update Status handler
  const handleStatusChange = async (appointmentRef: string, newStatus: string) => {
    // Optimistic UI update
    setAppointments((prev) =>
      prev.map((item) =>
        item.appointment_ref === appointmentRef ? { ...item, status: newStatus } : item
      )
    );
    if (selectedAppointment && selectedAppointment.appointment_ref === appointmentRef) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await updateAppointmentStatus(appointmentRef, newStatus);
  };

  // Delete handler
  const handleDeleteAppointment = async (appointmentRef: string) => {
    if (!window.confirm(`Are you sure you want to delete appointment ${appointmentRef}?`)) return;
    setAppointments((prev) => prev.filter((item) => item.appointment_ref !== appointmentRef));
    if (selectedAppointment?.appointment_ref === appointmentRef) {
      setSelectedAppointment(null);
    }
    await deleteAppointmentRecord(appointmentRef);
  };

  // Handle Manual Appointment Create
  const handleManualCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newEmail) return;

    setIsSavingManual(true);
    const selectedDoc = DOCTORS.find((d) => d.id === newDoctorId) || DOCTORS[0];
    const selectedDept = DEPARTMENTS.find((d) => d.id === newDepartmentId) || DEPARTMENTS[0];
    const randomRef = 'WCH-' + Math.floor(100000 + Math.random() * 900000);

    const record: AppointmentRecord = {
      appointment_ref: randomRef,
      full_name: newFullName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      department_id: selectedDept.id,
      department_name: selectedDept.name,
      doctor_id: selectedDoc.id,
      doctor_name: selectedDoc.name,
      preferred_date: newDate,
      preferred_time: newTime,
      visit_type: newVisitType,
      symptoms: newSymptoms.trim() || 'Direct OPD walk-in / staff scheduled booking',
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    await saveAppointmentToSupabase(record);
    setIsSavingManual(false);
    setIsAddModalOpen(false);

    // Reset fields
    setNewFullName('');
    setNewPhone('');
    setNewEmail('');
    setNewSymptoms('');

    // Reload
    loadAppointments();
  };

  // Handle Password Change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwFeedback({});
    const res = await changeAdminPassword(currentPw, newPw);
    if (res.success) {
      setPwFeedback({ success: 'Admin master password updated successfully.' });
      setCurrentPw('');
      setNewPw('');
    } else {
      setPwFeedback({ error: res.error || 'Failed to update password.' });
    }
  };

  // Filtered Appointments calculation
  const filteredAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return appointments.filter((app) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesRef = (app.appointment_ref || '').toLowerCase().includes(q);
        const matchesName = (app.full_name || '').toLowerCase().includes(q);
        const matchesPhone = (app.phone || '').toLowerCase().includes(q);
        const matchesEmail = (app.email || '').toLowerCase().includes(q);
        const matchesDoctor = (app.doctor_name || '').toLowerCase().includes(q);
        const matchesDept = (app.department_name || '').toLowerCase().includes(q);

        if (!matchesRef && !matchesName && !matchesPhone && !matchesEmail && !matchesDoctor && !matchesDept) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all' && (app.status || 'confirmed') !== statusFilter) {
        return false;
      }

      // 3. Department Filter
      if (departmentFilter !== 'all' && app.department_id !== departmentFilter) {
        return false;
      }

      // 4. Visit Type Filter
      if (visitTypeFilter !== 'all') {
        const isVideo = (app.visit_type || '').toLowerCase().includes('teleconsult') || (app.visit_type || '').toLowerCase().includes('video');
        if (visitTypeFilter === 'video' && !isVideo) return false;
        if (visitTypeFilter === 'in-person' && isVideo) return false;
      }

      // 5. Date Filter
      if (dateFilter !== 'all' && app.preferred_date) {
        if (dateFilter === 'today' && app.preferred_date !== todayStr) return false;
        if (dateFilter === 'upcoming' && app.preferred_date <= todayStr) return false;
        if (dateFilter === 'past' && app.preferred_date >= todayStr) return false;
      }

      return true;
    });
  }, [appointments, searchQuery, statusFilter, departmentFilter, visitTypeFilter, dateFilter]);

  // Key Metrics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = appointments.length;
    const todayCount = appointments.filter((a) => a.preferred_date === todayStr).length;
    const confirmedCount = appointments.filter((a) => (a.status || 'confirmed') === 'confirmed').length;
    const inProgressCount = appointments.filter((a) => a.status === 'in-progress').length;
    const completedCount = appointments.filter((a) => a.status === 'completed').length;
    const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

    return {
      total,
      todayCount,
      confirmedCount,
      inProgressCount,
      completedCount,
      cancelledCount,
    };
  }, [appointments]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Appointment Ref',
      'Patient Name',
      'Phone',
      'Email',
      'Department',
      'Doctor',
      'Date',
      'Time Slot',
      'Visit Type',
      'Status',
      'Created At',
      'Symptoms',
    ];

    const rows = filteredAppointments.map((app) => [
      `"${app.appointment_ref || ''}"`,
      `"${app.full_name || ''}"`,
      `"${app.phone || ''}"`,
      `"${app.email || ''}"`,
      `"${app.department_name || ''}"`,
      `"${app.doctor_name || ''}"`,
      `"${app.preferred_date || ''}"`,
      `"${app.preferred_time || ''}"`,
      `"${app.visit_type || ''}"`,
      `"${app.status || 'confirmed'}"`,
      `"${app.created_at || ''}"`,
      `"${(app.symptoms || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wecare_hospital_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print View
  const handlePrintSchedule = () => {
    window.print();
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock3 className="w-3 h-3 animate-spin" />
            <span>In Consultation</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased" id="admin-dashboard-container">
      
      {/* 1. TOP MASTER ADMIN BAR */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand and Admin Badge */}
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Hospital className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-white tracking-tight">
                    We Care <span className="text-blue-400">Hospital</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Appointments & Patient Operations Center
                </p>
              </div>
            </div>

            {/* Center: Live Supabase Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Supabase Connected:</span>
              <span className="text-emerald-300 font-mono font-bold text-[11px]">uzklokdsckwfslordqkk</span>
            </div>

            {/* Right: Admin Session Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                title="Admin Account Settings"
                id="admin-profile-btn"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                  {session.admin.fullName.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-semibold text-white leading-tight">{session.admin.fullName}</span>
                  <span className="text-[10px] text-slate-400">Master Admin</span>
                </div>
              </button>

              <button
                type="button"
                onClick={onExitToWebsite}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Return to public hospital website"
                id="admin-exit-btn"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Public Site</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition-colors cursor-pointer"
                title="Sign out of Admin Session"
                id="admin-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN ADMIN DASHBOARD BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Title & Main Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Hospital Appointment Bookings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review, filter, update consultation statuses, and manage patient appointments in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadAppointments()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              id="admin-refresh-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all cursor-pointer"
              id="admin-export-csv-btn"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrintSchedule}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all cursor-pointer"
              id="admin-print-btn"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Schedule</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              id="admin-add-booking-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Walk-In Booking</span>
            </button>
          </div>
        </div>

        {/* Supabase connection banner notice */}
        {fetchError && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Database Synchronization Status:</span>
              <p className="text-[11px] text-amber-700">
                Displaying combined verified local and live Supabase appointments. To enable full direct public SELECT queries on Supabase, ensure Row-Level Security allows reading appointments or run the SQL query from your account settings.
              </p>
            </div>
          </div>
        )}

        {/* 3. METRICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Appointments</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              All records in database
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Today's Consultations</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {stats.todayCount}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Scheduled for today
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Confirmed & Pending</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">
              {stats.confirmedCount + stats.inProgressCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.inProgressCount} currently in-consultation
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Completed Visits</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {stats.completedCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.cancelledCount} cancelled sessions
            </div>
          </div>

        </div>

        {/* 4. SEARCH & FILTER TOOLBAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Patient Name, Phone, Email, Doctor, Ref ID (e.g. WCH-782194)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                id="admin-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="w-full md:w-56">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                id="admin-dept-filter"
              >
                <option value="all">All Departments ({DEPARTMENTS.length})</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                id="admin-status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Consultation</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Secondary Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Date:
              </span>
              {(['all', 'today', 'upcoming', 'past'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setDateFilter(filterKey)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors capitalize ${
                    dateFilter === filterKey
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filterKey}
                </button>
              ))}

              <span className="text-slate-300 mx-1">|</span>

              <span className="text-slate-400 font-medium">Type:</span>
              <button
                type="button"
                onClick={() => setVisitTypeFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  visitTypeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setVisitTypeFilter('in-person')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  visitTypeFilter === 'in-person'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                In-Person
              </button>
              <button
                type="button"
                onClick={() => setVisitTypeFilter('video')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  visitTypeFilter === 'video'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Video Teleconsult
              </button>
            </div>

            <div className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredAppointments.length}</strong> of {appointments.length} bookings
            </div>
          </div>

        </div>

        {/* 5. APPOINTMENTS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="admin-appointments-table-card">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Ref Code</th>
                  <th className="py-3.5 px-4">Patient Information</th>
                  <th className="py-3.5 px-4">Department & Doctor</th>
                  <th className="py-3.5 px-4">Date & Slot</th>
                  <th className="py-3.5 px-4">Visit Mode</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="inline-flex flex-col items-center gap-2">
                        <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                        <span className="text-xs font-semibold">Loading appointments from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">No matching appointments found</h4>
                        <p className="text-xs text-slate-400">
                          Try adjusting your search query or reset active filters to see all patient bookings.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setDepartmentFilter('all');
                            setVisitTypeFilter('all');
                            setDateFilter('all');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => {
                    const isVideo = (app.visit_type || '').toLowerCase().includes('teleconsult') || (app.visit_type || '').toLowerCase().includes('video');

                    return (
                      <tr key={app.appointment_ref} className="hover:bg-slate-50/70 transition-colors group">
                        
                        {/* Ref Code */}
                        <td className="py-4 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                          {app.appointment_ref}
                        </td>

                        {/* Patient Information */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 text-sm">
                            {app.full_name}
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {app.phone}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {app.email}
                            </span>
                          </div>
                        </td>

                        {/* Department & Doctor */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">
                            {app.doctor_name}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {app.department_name}
                          </div>
                        </td>

                        {/* Date & Slot */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            <span>{app.preferred_date}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{app.preferred_time}</span>
                          </div>
                        </td>

                        {/* Visit Mode */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            isVideo 
                              ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {isVideo ? <Video className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                            <span>{isVideo ? 'Video' : 'In-Person'}</span>
                          </span>
                        </td>

                        {/* Status + Dropdown changer */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(app.status)}
                            <select
                              value={app.status || 'confirmed'}
                              onChange={(e) => handleStatusChange(app.appointment_ref, e.target.value)}
                              className="text-[11px] py-1 px-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                              title="Update Status"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="in-progress">In Consultation</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedAppointment(app)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View Complete Patient Sheet"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAppointment(app.appointment_ref)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer of table */}
          <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div>
              Active Filter: <span className="font-semibold text-slate-700 capitalize">{statusFilter}</span> Status • <span className="font-semibold text-slate-700 capitalize">{dateFilter}</span> Dates
            </div>
            <div className="text-[11px] text-slate-400">
              Supabase Project: <span className="font-mono">uzklokdsckwfslordqkk</span> • Local Cache Synchronized
            </div>
          </div>

        </div>

      </main>

      {/* 6. MODAL: APPOINTMENT DETAILS VIEW */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
          id="admin-appointment-detail-modal"
        >
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Hospital className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Patient Appointment Sheet</h3>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    Ref Code: {selectedAppointment.appointment_ref}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              
              {/* Patient Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Contact Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="text-slate-400 text-[11px]">Full Name</div>
                    <div className="text-sm font-bold text-slate-900">{selectedAppointment.full_name}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Phone Number</div>
                    <div className="text-sm font-bold text-slate-900">{selectedAppointment.phone}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Email Address</div>
                    <div className="text-sm font-bold text-slate-900">{selectedAppointment.email}</div>
                  </div>
                </div>
              </div>

              {/* Consultation Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Consultation Schedule & Physician
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-400 text-[11px]">Assigned Doctor</div>
                    <div className="text-sm font-bold text-slate-900">{selectedAppointment.doctor_name}</div>
                    <div className="text-slate-500 text-[11px]">{selectedAppointment.department_name}</div>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[11px]">Slot & Mode</div>
                    <div className="text-sm font-bold text-slate-900">
                      {selectedAppointment.preferred_date} • {selectedAppointment.preferred_time}
                    </div>
                    <div className="text-slate-500 text-[11px]">{selectedAppointment.visit_type}</div>
                  </div>
                </div>
              </div>

              {/* Symptoms / Clinical Notes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Symptoms & Visit Reason
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-normal bg-white p-3 rounded-xl border border-slate-200">
                  {selectedAppointment.symptoms || 'No specific symptoms entered by patient.'}
                </p>
              </div>

              {/* Status Update Quick Bar */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Update Status:</span>
                  <select
                    value={selectedAppointment.status || 'confirmed'}
                    onChange={(e) => handleStatusChange(selectedAppointment.appointment_ref, e.target.value)}
                    className="py-1.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Consultation</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 7. MODAL: ADD MANUAL / WALK-IN BOOKING */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
          id="admin-add-booking-modal"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Manual / Walk-In Appointment</h3>
              </div>
              <p className="text-xs text-slate-300">
                Directly schedule a patient into the hospital database
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleManualCreateSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Johnathan Smith"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="patient@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newDepartmentId}
                    onChange={(e) => {
                      setNewDepartmentId(e.target.value);
                      const matchingDocs = DOCTORS.filter((doc) => doc.departmentId === e.target.value);
                      if (matchingDocs.length > 0) setNewDoctorId(matchingDocs[0].id);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consulting Doctor</label>
                  <select
                    value={newDoctorId}
                    onChange={(e) => setNewDoctorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  >
                    {DOCTORS.filter((d) => d.departmentId === newDepartmentId).map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visit Type</label>
                  <select
                    value={newVisitType}
                    onChange={(e) => setNewVisitType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  >
                    <option value="In-Person Consultation">In-Person</option>
                    <option value="Video Teleconsult">Video Consult</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Symptoms / Notes</label>
                <textarea
                  rows={2}
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  placeholder="Primary complaint, notes or referral information..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingManual}
                  className="flex-1 py-2.5 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSavingManual ? 'Saving...' : 'Confirm Booking'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 8. MODAL: ADMIN ACCOUNT & SECURITY SETTINGS */}
      {isAccountModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
          id="admin-account-settings-modal"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Master Admin Security</h3>
              </div>
              <p className="text-xs text-slate-300">
                Single Registered Master Administrator Profile
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              
              {/* Account Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Administrator Info
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Slot 1 of 1 Claimed
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900">{session.admin.fullName}</div>
                <div className="text-slate-500 font-mono text-[11px]">Username: @{session.admin.username}</div>
                <div className="text-slate-500 font-mono text-[11px]">Email: {session.admin.email}</div>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handleChangePasswordSubmit} className="space-y-3 pt-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>Update Master Password</span>
                </div>

                {pwFeedback.success && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                    {pwFeedback.success}
                  </div>
                )}
                {pwFeedback.error && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                    {pwFeedback.error}
                  </div>
                )}

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">New Password (min 6 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </form>

              {/* Database status details */}
              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700">Supabase Backend Info:</div>
                <div>Project ID: <span className="font-mono text-slate-800">uzklokdsckwfslordqkk</span></div>
                <div>Appointments Table: <span className="font-mono text-slate-800">public.appointments</span></div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
