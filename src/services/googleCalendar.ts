import { BookingReservation, GoogleCalendarEvent } from '../types/spa';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export const listTherapistEvents = async (
  accessToken: string,
  timeMin?: string,
  timeMax?: string
): Promise<GoogleCalendarEvent[]> => {
  const min = timeMin || new Date(Date.now() - 7 * 86400000).toISOString();
  const max = timeMax || new Date(Date.now() + 60 * 86400000).toISOString();

  const url = `${CALENDAR_API_BASE}/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(
    min
  )}&timeMax=${encodeURIComponent(max)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch Google Calendar events: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.items || [];
};

export const createTherapistEvent = async (
  accessToken: string,
  reservation: BookingReservation
): Promise<GoogleCalendarEvent> => {
  const [hours, minutes] = reservation.timeSlot.split(':').map(Number);
  const startDateTime = new Date(`${reservation.date}T${reservation.timeSlot}:00`);
  const endDateTime = new Date(startDateTime.getTime() + reservation.durationMinutes * 60000);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Guayaquil';

  const ha = reservation.healthAssessment;
  const mc = ha.medicalChecklist;
  const healthAlerts: string[] = [];

  // Medical checklist items check
  if (mc) {
    if (mc.highBloodPressure) healthAlerts.push('⚠️ ALERTA: Presión arterial alta / Hipertensión');
    if (mc.heartProblems) healthAlerts.push('⚠️ ALERTA: Problemas cardíacos (precaución circulatoria)');
    if (mc.diabetes) healthAlerts.push('⚠️ ALERTA: Diabetes');
    if (mc.circulatoryProblems) healthAlerts.push('⚠️ ALERTA: Problemas circulatorios');
    if (mc.thrombosisVaricose) healthAlerts.push('⚠️ ALERTA CRÍTICA: Trombosis o várices severas (NO masaje profundo en piernas)');
    if (mc.epilepsy) healthAlerts.push('⚠️ ALERTA: Epilepsia (evitar estímulos luminosos bruscos)');
    if (mc.asthma || mc.respiratoryProblems) healthAlerts.push('⚠️ ALERTA: Asma / Problemas respiratorios (evitar aromas invasivos)');
    if (mc.spinalProblems) healthAlerts.push('⚠️ ALERTA: Problemas en la columna (ajustar posturas y descompresión)');
    if (mc.recentMuscleInjuries) healthAlerts.push('⚠️ ALERTA: Lesiones musculares recientes');
    if (mc.recentFractures) healthAlerts.push('⚠️ ALERTA: Fracturas recientes');
    if (mc.surgeriesLast12Months) healthAlerts.push(`⚠️ ALERTA: Cirugías en los últimos 12 meses (${mc.surgeriesDetails || ha.surgeriesDetails || 'Informada'})`);
    if (mc.skinConditions) healthAlerts.push('⚠️ ALERTA: Afecciones en la piel');
    if (mc.cancerHistory) healthAlerts.push('⚠️ ALERTA: Cáncer o antecedentes recientes de cáncer');
    if (mc.currentMedications) healthAlerts.push(`⚠️ ALERTA: Medicación actual (${mc.medicationsDetails || 'Informada'})`);
    if (mc.pacemakerDevices) healthAlerts.push('⚠️ ALERTA CRÍTICA: Marcapasos u otros dispositivos médicos (NO equipos magnéticos/eléctricos)');
    if (mc.breastfeeding) healthAlerts.push('⚠️ ALERTA: En período de lactancia materna');
    if (mc.otherConditions) healthAlerts.push(`⚠️ OTRAS CONDICIONES: ${mc.otherConditionsDetails || ''}`);
  }

  if (ha.isPregnant || mc?.pregnancy) {
    healthAlerts.push(`⚠️ PREGNANCY ALERT: ${ha.pregnancyWeeks ? `${ha.pregnancyWeeks} weeks` : 'Pregnant'}. Evitar piedras volcánicas directas y posición prona.`);
  }
  if (ha.hasAllergies || mc?.allergies) {
    healthAlerts.push(`⚠️ ALLERGIES: ${ha.allergiesList.join(', ')} ${ha.otherAllergies ? `(${ha.otherAllergies})` : ''} ${mc?.allergiesDetails ? `(${mc.allergiesDetails})` : ''}`);
  }
  if (ha.hasRestrictions) {
    healthAlerts.push(`⚠️ PHYSICAL RESTRICTIONS: ${ha.restrictionsDetails}`);
  }
  if (ha.hasSurgeries && !mc?.surgeriesLast12Months) {
    healthAlerts.push(`⚠️ MEDICAL SURGERIES: ${ha.surgeriesDetails} ${ha.surgeriesDate ? `(Date: ${ha.surgeriesDate})` : ''}`);
  }
  if (ha.hasMedicalConditions) {
    healthAlerts.push(`⚠️ MEDICAL CONDITIONS: ${ha.medicalConditionsDetails}`);
  }

  const description = [
    `✦ AWE SPA — ANCESTRAL WELLNESS EXPERIENCE ✦`,
    `Therapist: Lissett Morante · Ecuador (+593 99 058 7684)`,
    `"Tu cuerpo recuerda lo que tu mente olvidó."`,
    ``,
    `📅 CLIENT APPOINTMENT DETAILS:`,
    `• Client: ${reservation.clientName}`,
    ha.idNumber ? `• ID / Cédula / Pasaporte: ${ha.idNumber}` : null,
    ha.age ? `• Edad: ${ha.age} años | Nacimiento: ${ha.dateOfBirth || 'N/A'} | Nacionalidad: ${ha.nationality || 'N/A'}` : null,
    `• Phone / WhatsApp: ${reservation.clientPhone}`,
    `• Email: ${reservation.clientEmail}`,
    ha.cityOfResidence ? `• Ciudad: ${ha.cityOfResidence} | Ocupación: ${ha.occupation || 'N/A'}` : null,
    ha.emergencyContact ? `• Contacto de Emergencia: ${ha.emergencyContact} (${ha.emergencyPhoneNumber})` : null,
    ``,
    `• Motivo de visita: ${ha.visitReasons && ha.visitReasons.length > 0 ? ha.visitReasons.join(', ') : 'Bienestar'} ${ha.otherVisitReason ? `(${ha.otherVisitReason})` : ''}`,
    ha.expectedOutcome ? `• Expectativa del cliente: "${ha.expectedOutcome}"` : null,
    ``,
    `• Treatment: ${reservation.treatmentName} (${reservation.treatmentNameEn})`,
    `• Duration: ${reservation.durationMinutes} minutes`,
    `• Total Investment: $${reservation.totalPrice} USD`,
    `• 50% Advance Deposit: $${reservation.depositRequired} USD (${reservation.paymentMethod.toUpperCase()})`,
    `• Booking Status: ${reservation.status.toUpperCase()}`,
    ``,
    `🌿 CLINICAL HEALTH & MEDICAL SCREENING (CHECKLIST):`,
    healthAlerts.length > 0 ? healthAlerts.join('\n') : `• Ninguna condición médica de riesgo reportada (Todo NO).`,
    ``,
    `• Target Focus Areas: ${ha.focusAreas.length > 0 ? ha.focusAreas.join(', ') : 'Full body balance'}`,
    ha.avoidAreas.length > 0 ? `• Areas to Avoid: ${ha.avoidAreas.join(', ')}` : null,
    `• Preferred Pressure: ${ha.pressurePreference.toUpperCase()}`,
    ha.energyIntention ? `• Personal & Energy Intention: ${ha.energyIntention}` : null,
    `• Current Stress Level: ${ha.currentStressLevel} / 10`,
    ha.specialNotes ? `• Special Notes: ${ha.specialNotes}` : null,
    ``,
    `Policy Reminders: Llegar 10 min antes, ropa cómoda, cancelación hasta 24h antes.`,
    `Synced via AWE SPA System.`,
  ]
    .filter(Boolean)
    .join('\n');

  const eventPayload = {
    summary: `✦ AWE SPA: ${reservation.treatmentName} - ${reservation.clientName}`,
    description,
    location: 'AWE SPA - Ancestral Wellness Experience, Ecuador',
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone,
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone,
    },
    attendees: reservation.clientEmail ? [{ email: reservation.clientEmail }] : undefined,
    colorId: '2', // Sage / green
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 1440 }, // 1 day before
      ],
    },
  };

  const res = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventPayload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create Google Calendar event: ${res.status} - ${errorText}`);
  }

  return await res.json();
};

export const deleteTherapistEvent = async (
  accessToken: string,
  eventId: string
): Promise<void> => {
  const res = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 404) {
    const errorText = await res.text();
    throw new Error(`Failed to delete Google Calendar event: ${res.status} - ${errorText}`);
  }
};
