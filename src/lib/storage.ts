import * as fs from "fs";
import * as path from "path";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  reason?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: string;
  senderType: "doctor" | "patient" | "system";
  senderEmail?: string;
  senderId?: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  messageType: "general" | "appointment_request" | "appointment_confirmation" | "prescription" | "message";
  recipientId: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  status: "confirmed";
  confirmedAt: string;
}

export interface PatientProfile {
  patientId: string;
  bio: string;
  sex: "Male" | "Female" | "Other";
  birthdate: string; // YYYY-MM-DD
  address: string;
  notes: string;
  barcode: string; // Generated randomly, immutable
  nationality: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const CONSULTATIONS_FILE = path.join(DATA_DIR, "consultations.json");
const PATIENT_PROFILES_FILE = path.join(DATA_DIR, "patient_profiles.json");

// Initialiser le répertoire de données
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ==================== APPOINTMENTS ====================

// Récupérer tous les rendez-vous
export function getAllAppointments(): Appointment[] {
  ensureDataDir();
  
  try {
    if (!fs.existsSync(APPOINTMENTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(APPOINTMENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder un nouveau rendez-vous
export function saveAppointment(appointment: Appointment): Appointment {
  ensureDataDir();
  
  const appointments = getAllAppointments();
  appointments.push(appointment);
  
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));
  return appointment;
}

// Mettre à jour un rendez-vous
export function updateAppointment(appointmentId: string, updates: Partial<Appointment>): Appointment | null {
  ensureDataDir();
  
  const appointments = getAllAppointments();
  const index = appointments.findIndex((apt: Appointment) => apt.id === appointmentId);
  
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));
    return appointments[index];
  }
  
  return null;
}

// Récupérer les rendez-vous d'un docteur
export function getDoctorAppointments(doctorId: string): Appointment[] {
  const appointments = getAllAppointments();
  return appointments.filter((apt: Appointment) => apt.doctorId === doctorId);
}

// Récupérer les rendez-vous d'un patient
export function getPatientAppointments(patientId: string): Appointment[] {
  const appointments = getAllAppointments();
  return appointments.filter((apt: Appointment) => apt.patientId === patientId);
}

// ==================== MESSAGES ====================

// Récupérer tous les messages
export function getAllMessages(): Message[] {
  ensureDataDir();
  
  try {
    if (!fs.existsSync(MESSAGES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(MESSAGES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder un nouveau message
export function saveMessage(message: Message): Message {
  ensureDataDir();
  
  const messages = getAllMessages();
  messages.push(message);
  
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  return message;
}

// Récupérer les messages d'un utilisateur
export function getUserMessages(userId: string): Message[] {
  const messages = getAllMessages();
  return messages.filter((msg: Message) => msg.recipientId === userId);
}

// ==================== CONSULTATIONS ====================

// Récupérer toutes les consultations
export function getAllConsultations(): Consultation[] {
  ensureDataDir();
  
  try {
    if (!fs.existsSync(CONSULTATIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(CONSULTATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder une nouvelle consultation
export function saveConsultation(consultation: Consultation): Consultation {
  ensureDataDir();
  
  const consultations = getAllConsultations();
  consultations.push(consultation);
  
  fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(consultations, null, 2));
  return consultation;
}

// Récupérer les consultations d'un docteur
export function getDoctorConsultations(doctorId: string): Consultation[] {
  const consultations = getAllConsultations();
  return consultations.filter((c: Consultation) => c.doctorId === doctorId);
}

// Récupérer les consultations d'un patient
export function getPatientConsultations(patientId: string): Consultation[] {
  const consultations = getAllConsultations();
  return consultations.filter((c: Consultation) => c.patientId === patientId);
}

// ==================== PATIENT PROFILES ====================

// Générer un code-barres aléatoire
export function generateBarcode(): string {
  const random = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return `#${(timestamp + random).toUpperCase().substring(0, 20)}`;
}

// Récupérer tous les profils patients
export function getAllPatientProfiles(): PatientProfile[] {
  ensureDataDir();
  
  try {
    if (!fs.existsSync(PATIENT_PROFILES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(PATIENT_PROFILES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Obtenir le profil d'un patient
export function getPatientProfile(patientId: string): PatientProfile | null {
  const profiles = getAllPatientProfiles();
  return profiles.find((p: PatientProfile) => p.patientId === patientId) || null;
}

// Créer un nouveau profil patient
export function createPatientProfile(patientId: string, profileImage?: string): PatientProfile {
  ensureDataDir();
  
  const existingProfile = getPatientProfile(patientId);
  if (existingProfile) {
    return existingProfile;
  }

  const newProfile: PatientProfile = {
    patientId,
    bio: "",
    sex: "Other",
    birthdate: "",
    address: "",
    notes: "",
    barcode: generateBarcode(),
    nationality: "",
    profileImage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const profiles = getAllPatientProfiles();
  profiles.push(newProfile);
  
  fs.writeFileSync(PATIENT_PROFILES_FILE, JSON.stringify(profiles, null, 2));
  return newProfile;
}

// Mettre à jour le profil d'un patient (barcode ne peut pas être modifié)
export function updatePatientProfile(patientId: string, updates: Partial<PatientProfile>): PatientProfile | null {
  ensureDataDir();
  
  const profiles = getAllPatientProfiles();
  const index = profiles.findIndex((p: PatientProfile) => p.patientId === patientId);
  
  if (index !== -1) {
    // Ne pas permettre de modifier le barcode
    const { barcode, ...safeUpdates } = updates;
    
    profiles[index] = {
      ...profiles[index],
      ...safeUpdates,
      barcode: profiles[index].barcode, // Garder l'ancien barcode
      updatedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(PATIENT_PROFILES_FILE, JSON.stringify(profiles, null, 2));
    return profiles[index];
  }
  
  return null;
}
