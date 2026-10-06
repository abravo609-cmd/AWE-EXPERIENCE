export type TreatmentCategory =
  | 'all'
  | 'rituales'
  | 'masajes'
  | 'ancestrales'
  | 'facial'
  | 'conexion';

export interface TreatmentDuration {
  minutes: number;
  price: number;
  savings?: number;
  originalPrice?: number;
}

export interface Treatment {
  id: string;
  category: TreatmentCategory;
  name: string;
  nameEn: string;
  subtitle: string;
  subtitleEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  includes: string[];
  includesEn: string[];
  benefits: string;
  benefitsEn: string;
  durations: TreatmentDuration[];
  badge?: string;
  badgeEn?: string;
  isPopular?: boolean;
  imagePrompt?: string;
  energyType: 'transformation' | 'physical' | 'ancestral' | 'facial' | 'connection';
}

export interface MedicalConditionsChecklist {
  highBloodPressure: boolean | null;
  heartProblems: boolean | null;
  diabetes: boolean | null;
  circulatoryProblems: boolean | null;
  thrombosisVaricose: boolean | null;
  epilepsy: boolean | null;
  asthma: boolean | null;
  respiratoryProblems: boolean | null;
  spinalProblems: boolean | null;
  recentMuscleInjuries: boolean | null;
  recentFractures: boolean | null;
  surgeriesLast12Months: boolean | null;
  skinConditions: boolean | null;
  allergies: boolean | null;
  pregnancy: boolean | null;
  breastfeeding: boolean | null;
  cancerHistory: boolean | null;
  currentMedications: boolean | null;
  pacemakerDevices: boolean | null;
  otherConditions: boolean | null;
  otherConditionsDetails?: string;
  medicationsDetails?: string;
  surgeriesDetails?: string;
  allergiesDetails?: string;
}

export interface HealthAssessment {
  // Form Date & Client Demographics
  intakeDate: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  age: string;
  nationality: string;
  phoneNumber: string;
  emailAddress: string;
  cityOfResidence: string;
  occupation: string;
  emergencyContact: string;
  emergencyPhoneNumber: string;

  // Motivation & Goals
  visitReasons: string[];
  otherVisitReason: string;
  expectedOutcome: string;

  // Medical YES/NO Checklist
  medicalChecklist: MedicalConditionsChecklist;

  // Restrictions & Surgeries (legacy/detailed)
  hasRestrictions: boolean;
  restrictionsDetails: string;
  hasSurgeries: boolean;
  surgeriesDetails: string;
  surgeriesDate?: string;
  hasMedicalConditions: boolean;
  medicalConditionsDetails: string;

  // Allergies
  hasAllergies: boolean;
  allergiesList: string[];
  otherAllergies: string;

  // Pregnancy & Breastfeeding
  isPregnant: boolean;
  pregnancyWeeks?: number;
  pregnancyTrimester?: 'first' | 'second' | 'third';
  pregnancyNotes: string;
  isBreastfeeding?: boolean;

  // Focus & Avoid Body Areas
  focusAreas: string[];
  avoidAreas: string[];
  pressurePreference: 'gentle' | 'medium' | 'firm' | 'deep';

  // Energy & Emotional Intention
  energyIntention: string;
  currentStressLevel: number; // 1 to 10
  specialNotes: string;
}

export interface BookingReservation {
  id: string;
  treatmentId: string;
  treatmentName: string;
  treatmentNameEn: string;
  durationMinutes: number;
  totalPrice: number;
  depositRequired: number; // 50%
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00"
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  paymentMethod: 'cash' | 'transfer' | 'card';
  healthAssessment: HealthAssessment;
  calendarEventId?: string;
  createdAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink?: string;
  location?: string;
}
