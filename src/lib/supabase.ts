import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uzklokdsckwfslordqkk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qD_w9MenlDxZ2VpWhnGVvw_hKcdCJg1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_STORAGE_APPOINTMENTS_KEY = 'wch_appointments_cache_v1';

export interface AppointmentRecord {
  id?: string;
  appointment_ref: string;
  full_name: string;
  phone: string;
  email: string;
  department_id: string;
  department_name: string;
  doctor_id: string;
  doctor_name: string;
  preferred_date: string;
  preferred_time: string;
  visit_type: string;
  symptoms?: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | string;
  created_at?: string;
}

// Initial demo seed data to populate dashboard immediately if database is empty
export const SAMPLE_INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    appointment_ref: 'WCH-782194',
    full_name: 'Eleanor Vance',
    phone: '+1 (555) 234-8901',
    email: 'eleanor.v@healthmail.com',
    department_id: 'cardiology',
    department_name: 'Cardiology & Heart Center',
    doctor_id: 'doc-cardio-2',
    doctor_name: 'Dr. Nafli Razik',
    preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time: '10:00 AM - 10:30 AM',
    visit_type: 'In-Person Consultation',
    symptoms: 'Post-operative cardiac evaluation and routine echocardiogram follow-up.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    appointment_ref: 'WCH-651039',
    full_name: 'Marcus Sterling',
    phone: '+1 (555) 876-5432',
    email: 'marcus.sterling@enterprise.net',
    department_id: 'neurology',
    department_name: 'Neurology & Brain Sciences',
    doctor_id: 'doc-neuro-1',
    doctor_name: 'Dr. Sarah Jenkins',
    preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferred_time: '02:00 PM - 02:30 PM',
    visit_type: 'Video Teleconsult',
    symptoms: 'Recurrent severe migraines and tension cluster headaches in the morning.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    appointment_ref: 'WCH-918420',
    full_name: 'Sophia Patel',
    phone: '+1 (555) 432-1098',
    email: 'sophia.patel@academics.edu',
    department_id: 'pediatrics',
    department_name: 'Pediatrics & Neonatal Care',
    doctor_id: 'doc-ped-1',
    doctor_name: 'Dr. Anita Desai',
    preferred_date: new Date().toISOString().split('T')[0],
    preferred_time: '11:30 AM - 12:00 PM',
    visit_type: 'In-Person Consultation',
    symptoms: 'Seasonal respiratory allergies and annual developmental immunization review.',
    status: 'in-progress',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    appointment_ref: 'WCH-449102',
    full_name: 'David Chen',
    phone: '+1 (555) 901-2345',
    email: 'david.chen@technova.io',
    department_id: 'orthopedics',
    department_name: 'Orthopedics & Joint Reconstruction',
    doctor_id: 'doc-ortho-1',
    doctor_name: 'Dr. Michael Chang',
    preferred_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    preferred_time: '03:30 PM - 04:00 PM',
    visit_type: 'In-Person Consultation',
    symptoms: 'Sports injury right knee ACL rehabilitation and mobility assessment.',
    status: 'completed',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    appointment_ref: 'WCH-332915',
    full_name: 'Hannah Abbott',
    phone: '+1 (555) 678-9012',
    email: 'hannah.abbott@starlight.org',
    department_id: 'oncology',
    department_name: 'Oncology & Cancer Center',
    doctor_id: 'doc-onco-1',
    doctor_name: 'Dr. Elena Rostova',
    preferred_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    preferred_time: '09:00 AM - 09:30 AM',
    visit_type: 'In-Person Consultation',
    symptoms: 'Second opinion consultation regarding biomarker immunotherapy screening.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

/**
 * Helper to get locally cached appointments
 */
export function getLocalCachedAppointments(): AppointmentRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_APPOINTMENTS_KEY);
    if (!raw) {
      // Seed with initial demo appointments
      localStorage.setItem(LOCAL_STORAGE_APPOINTMENTS_KEY, JSON.stringify(SAMPLE_INITIAL_APPOINTMENTS));
      return SAMPLE_INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_INITIAL_APPOINTMENTS;
  }
}

/**
 * Helper to save an appointment locally
 */
export function saveLocalCachedAppointment(record: AppointmentRecord): void {
  try {
    const existing = getLocalCachedAppointments();
    const updated = [record, ...existing.filter((item) => item.appointment_ref !== record.appointment_ref)];
    localStorage.setItem(LOCAL_STORAGE_APPOINTMENTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to local cache:', err);
  }
}

/**
 * Saves appointment details directly into Supabase database & local cache.
 */
export async function saveAppointmentToSupabase(record: AppointmentRecord) {
  // Always cache locally so Admin has instantaneous access
  saveLocalCachedAppointment(record);

  try {
    // Direct insert into 'appointments' table
    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          appointment_ref: record.appointment_ref,
          full_name: record.full_name,
          phone: record.phone,
          email: record.email,
          department_id: record.department_id,
          department_name: record.department_name,
          doctor_id: record.doctor_id,
          doctor_name: record.doctor_name,
          preferred_date: record.preferred_date,
          preferred_time: record.preferred_time,
          visit_type: record.visit_type,
          symptoms: record.symptoms || '',
          status: record.status || 'confirmed',
          created_at: record.created_at || new Date().toISOString(),
        },
      ]);

    if (error) {
      console.warn('Supabase insert warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error saving to Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Fetches all appointments from Supabase (merging with local cache for total resilience).
 */
export async function fetchAllAppointments(): Promise<{
  data: AppointmentRecord[];
  fromSupabaseCount: number;
  error: string | null;
}> {
  const localList = getLocalCachedAppointments();
  let supabaseRecords: AppointmentRecord[] = [];
  let fetchError: string | null = null;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      fetchError = error.message;
    } else if (data && data.length > 0) {
      supabaseRecords = data as AppointmentRecord[];
    }
  } catch (err: any) {
    fetchError = err?.message || 'Network request failed';
  }

  // Merge unique by appointment_ref
  const map = new Map<string, AppointmentRecord>();

  // 1. Add supabase records first
  supabaseRecords.forEach((rec) => {
    if (rec.appointment_ref) {
      map.set(rec.appointment_ref, rec);
    }
  });

  // 2. Add local cached records (keeping any newer changes)
  localList.forEach((rec) => {
    if (rec.appointment_ref && !map.has(rec.appointment_ref)) {
      map.set(rec.appointment_ref, rec);
    }
  });

  const merged = Array.from(map.values()).sort((a, b) => {
    const dateA = new Date(a.created_at || a.preferred_date).getTime();
    const dateB = new Date(b.created_at || b.preferred_date).getTime();
    return dateB - dateA;
  });

  return {
    data: merged,
    fromSupabaseCount: supabaseRecords.length,
    error: fetchError,
  };
}

/**
 * Updates an appointment's status in Supabase and local cache
 */
export async function updateAppointmentStatus(appointmentRef: string, newStatus: string): Promise<boolean> {
  // Update local cache
  const existing = getLocalCachedAppointments();
  const updated = existing.map((item) =>
    item.appointment_ref === appointmentRef ? { ...item, status: newStatus } : item
  );
  localStorage.setItem(LOCAL_STORAGE_APPOINTMENTS_KEY, JSON.stringify(updated));

  // Attempt Supabase update
  try {
    await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('appointment_ref', appointmentRef);
    return true;
  } catch (err) {
    console.warn('Could not update status in remote Supabase:', err);
    return true; // Still true locally
  }
}

/**
 * Deletes an appointment
 */
export async function deleteAppointmentRecord(appointmentRef: string): Promise<boolean> {
  const existing = getLocalCachedAppointments();
  const filtered = existing.filter((item) => item.appointment_ref !== appointmentRef);
  localStorage.setItem(LOCAL_STORAGE_APPOINTMENTS_KEY, JSON.stringify(filtered));

  try {
    await supabase
      .from('appointments')
      .delete()
      .eq('appointment_ref', appointmentRef);
    return true;
  } catch {
    return true;
  }
}

export interface ContactMessageRecord {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at?: string;
}

/**
 * Saves contact form inquiries into the Supabase database.
 */
export async function saveContactMessageToSupabase(record: ContactMessageRecord) {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: record.name,
          email: record.email,
          phone: record.phone || '',
          subject: record.subject,
          message: record.message,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.warn('Supabase contact message insert warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error saving message to Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
