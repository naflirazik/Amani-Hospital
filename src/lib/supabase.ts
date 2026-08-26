import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uzklokdsckwfslordqkk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qD_w9MenlDxZ2VpWhnGVvw_hKcdCJg1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AppointmentRecord {
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
  status: string;
  created_at?: string;
}

/**
 * Saves appointment details directly into the Supabase database.
 */
export async function saveAppointmentToSupabase(record: AppointmentRecord) {
  try {
    // Attempt insert into 'appointments' table
    const { data, error } = await supabase
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
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase insert warning (check table schema & RLS policies):', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data };
  } catch (err: any) {
    console.error('Unexpected error saving to Supabase:', err);
    return { success: false, error: err?.message || 'Network error', data: null };
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
    const { data, error } = await supabase
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
      ])
      .select();

    if (error) {
      console.warn('Supabase contact message insert warning:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data };
  } catch (err: any) {
    console.error('Unexpected error saving message to Supabase:', err);
    return { success: false, error: err?.message || 'Network error', data: null };
  }
}
