import { BookingReservation } from '../types/spa';

const RESERVATIONS_STORAGE_KEY = 'awe_spa_reservations_v1';

export const getStoredReservations = (): BookingReservation[] => {
  try {
    const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (!raw) {
      // Seed with initial realistic bookings for demonstration and therapist agenda preview
      const initial: BookingReservation[] = [
        {
          id: 'res-demo-1',
          treatmentId: 'ritual-ancestral-completo',
          treatmentName: 'Ritual Ancestral Completo',
          treatmentNameEn: 'Complete Ancestral Ritual',
          durationMinutes: 180,
          totalPrice: 180,
          depositRequired: 90,
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          timeSlot: '10:00',
          clientName: 'Valeria Mendoza',
          clientEmail: 'valeria.mendoza@example.com',
          clientPhone: '+593 98 442 1102',
          paymentMethod: 'transfer',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          healthAssessment: {
            intakeDate: '2026-10-01',
            fullName: 'Valeria Mendoza',
            idNumber: '1718293041',
            dateOfBirth: '1991-05-14',
            age: '35',
            nationality: 'Ecuatoriana',
            phoneNumber: '+593 98 442 1102',
            emailAddress: 'valeria.mendoza@example.com',
            cityOfResidence: 'Quito',
            occupation: 'Arquitecta',
            emergencyContact: 'Roberto Mendoza',
            emergencyPhoneNumber: '+593 99 883 2211',
            visitReasons: ['Stress', 'Muscle pain', 'Relaxation'],
            otherVisitReason: '',
            expectedOutcome: 'Aliviar contracturas en cuello y desconectar del estrés laboral.',
            medicalChecklist: {
              highBloodPressure: false,
              heartProblems: false,
              diabetes: false,
              circulatoryProblems: false,
              thrombosisVaricose: false,
              epilepsy: false,
              asthma: false,
              respiratoryProblems: false,
              spinalProblems: false,
              recentMuscleInjuries: false,
              recentFractures: false,
              surgeriesLast12Months: false,
              skinConditions: false,
              allergies: true,
              allergiesDetails: 'Aceite de almendras / Nut oils',
              pregnancy: false,
              breastfeeding: false,
              cancerHistory: false,
              currentMedications: false,
              pacemakerDevices: false,
              otherConditions: false,
            },
            hasRestrictions: false,
            restrictionsDetails: '',
            hasSurgeries: false,
            surgeriesDetails: '',
            hasMedicalConditions: false,
            medicalConditionsDetails: '',
            hasAllergies: true,
            allergiesList: ['Aceite de almendras / Nut oils'],
            otherAllergies: '',
            isPregnant: false,
            pregnancyNotes: '',
            focusAreas: ['Cuello y Cervical', 'Espalda Alta y Trapecios'],
            avoidAreas: [],
            pressurePreference: 'firm',
            energyIntention: 'Liberación de dolor físico y contracturas crónicas',
            currentStressLevel: 8,
            specialNotes: 'Mucho dolor en cervicales por trabajo frente a computadora.',
          },
        },
        {
          id: 'res-demo-2',
          treatmentId: 'ritual-bosque-sagrado',
          treatmentName: 'Ritual del Bosque Sagrado',
          treatmentNameEn: 'Sacred Forest Ritual',
          durationMinutes: 135,
          totalPrice: 125,
          depositRequired: 62.5,
          date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          timeSlot: '15:30',
          clientName: 'Carlos Andrade',
          clientEmail: 'carlos.andrade@example.com',
          clientPhone: '+593 99 712 3344',
          paymentMethod: 'card',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          healthAssessment: {
            intakeDate: '2026-10-02',
            fullName: 'Carlos Andrade',
            idNumber: '0921448892',
            dateOfBirth: '1986-11-20',
            age: '40',
            nationality: 'Ecuatoriana',
            phoneNumber: '+593 99 712 3344',
            emailAddress: 'carlos.andrade@example.com',
            cityOfResidence: 'Guayaquil',
            occupation: 'Ingeniero Comercial',
            emergencyContact: 'Ana Lucia Andrade',
            emergencyPhoneNumber: '+593 98 112 4499',
            visitReasons: ['Rest', 'General well-being', 'Traditional experience'],
            otherVisitReason: '',
            expectedOutcome: 'Descompresión física profunda y reconexión energética.',
            medicalChecklist: {
              highBloodPressure: false,
              heartProblems: false,
              diabetes: false,
              circulatoryProblems: false,
              thrombosisVaricose: false,
              epilepsy: false,
              asthma: false,
              respiratoryProblems: false,
              spinalProblems: true,
              recentMuscleInjuries: false,
              recentFractures: false,
              surgeriesLast12Months: true,
              surgeriesDetails: 'Cirugía de menisco en rodilla izquierda (2024)',
              skinConditions: false,
              allergies: false,
              pregnancy: false,
              breastfeeding: false,
              cancerHistory: false,
              currentMedications: false,
              pacemakerDevices: false,
              otherConditions: true,
              otherConditionsDetails: 'Hernia discal L4-L5',
            },
            hasRestrictions: true,
            restrictionsDetails: 'Hernia discal L4-L5 (evitar giros bruscos en lumbar)',
            hasSurgeries: true,
            surgeriesDetails: 'Cirugía de menisco en rodilla izquierda (2024)',
            hasMedicalConditions: false,
            medicalConditionsDetails: '',
            hasAllergies: false,
            allergiesList: [],
            otherAllergies: '',
            isPregnant: false,
            pregnancyNotes: '',
            focusAreas: ['Hombros y Omóplatos', 'Piernas y Muslos'],
            avoidAreas: ['Lumbar baja'],
            pressurePreference: 'medium',
            energyIntention: 'Grounding y descanso mental',
            currentStressLevel: 6,
            specialNotes: 'Preferencia por temperatura moderada en bambuterapia.',
          },
        },
      ];
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveReservation = (reservation: BookingReservation): void => {
  try {
    const list = getStoredReservations();
    const updated = [reservation, ...list.filter((r) => r.id !== reservation.id)];
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save reservation', e);
  }
};

export const updateReservation = (reservation: BookingReservation): void => {
  saveReservation(reservation);
};

export const deleteStoredReservation = (id: string): void => {
  try {
    const list = getStoredReservations();
    const updated = list.filter((r) => r.id !== id);
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete reservation', e);
  }
};
