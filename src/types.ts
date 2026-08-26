export interface Department {
  id: string;
  name: string;
  iconName: string;
  shortDesc: string;
  longDesc: string;
  headDoctor: string;
  bedCount: string;
  features: string[];
  opdDays: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  experience: string; // e.g. "15+ Years"
  yearsOfExpNumber: number;
  rating: number;
  reviewsCount: number;
  consultationFee: string;
  availability: string; // e.g. "Mon - Fri (09:00 AM - 04:00 PM)"
  avatarUrl: string;
  bio: string;
  specialties: string[];
  education: string;
  languages: string[];
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  shortDesc: string;
  detailedDesc: string;
  badge?: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  age: number;
  location: string;
  department: string;
  treatment: string;
  rating: number;
  quote: string;
  date: string;
  avatarUrl: string;
}

export interface Facility {
  id: string;
  title: string;
  iconName: string;
  description: string;
  metric: string;
}

export interface AppointmentFormData {
  fullName: string;
  phone: string;
  email: string;
  departmentId: string;
  doctorId: string;
  preferredDate: string;
  preferredTime: string;
  visitType: 'in-person' | 'teleconsult';
  symptoms: string;
  isUrgent: boolean;
}

export interface BookedConfirmation {
  appointmentId: string;
  data: AppointmentFormData;
  doctorName: string;
  departmentName: string;
  bookingTimestamp: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
