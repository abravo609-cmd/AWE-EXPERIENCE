import React, { useState } from 'react';
import { BookingReservation, GoogleCalendarEvent } from '../types/spa';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ShieldAlert,
  Baby,
  Activity,
  Heart,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface CalendarManagerViewProps {
  lang: 'es' | 'en';
  reservations: BookingReservation[];
  calendarEvents: GoogleCalendarEvent[];
  hasGoogleSync: boolean;
  onRefreshCalendar: () => Promise<void>;
  isRefreshing: boolean;
  onCancelReservation: (reservation: BookingReservation) => Promise<void>;
  onNewBookingClick: () => void;
}

export const CalendarManagerView: React.FC<CalendarManagerViewProps> = ({
  lang,
  reservations,
  calendarEvents,
  hasGoogleSync,
  onRefreshCalendar,
  isRefreshing,
  onCancelReservation,
  onNewBookingClick,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reservationToDelete, setReservationToDelete] = useState<BookingReservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterDate, setFilterDate] = useState<string>('all');

  // Handle destructive cancellation with confirmation modal
  const handleConfirmCancel = async () => {
    if (!reservationToDelete) return;
    setIsDeleting(true);
    try {
      await onCancelReservation(reservationToDelete);
      setReservationToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Sort reservations by date and time
  const sortedReservations = [...reservations].sort((a, b) => {
    const da = `${a.date}T${a.timeSlot}`;
    const db = `${b.date}T${b.timeSlot}`;
    return da.localeCompare(db);
  });

  const filteredReservations = sortedReservations.filter((r) => {
    if (filterDate === 'all') return true;
    return r.date === filterDate;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#38483b] via-[#415344] to-[#4e6252] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 text-[#ebd8b1] text-xs font-semibold tracking-wider uppercase mb-2 border border-[#c5a059]/30">
              <span>✦ Agenda de la Terapeuta</span> · <span>Lissett Morante</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {lang === 'es' ? 'Gestión de Citas & Fichas Clínicas' : 'Therapist Calendar & Health Cards'}
            </h2>
            <p className="text-xs sm:text-sm text-[#d8dfd7] mt-1 max-w-2xl font-light">
              {lang === 'es'
                ? 'Monitorea las reservas en tiempo real, sincroniza con Google Calendar y consulta las restricciones, alergias y zonas de enfoque antes de cada sesión.'
                : 'Monitor reservations in real-time, synchronize with Google Calendar, and review medical restrictions, allergies, and target focus areas before sessions.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshCalendar}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{lang === 'es' ? 'Sincronizar' : 'Refresh Sync'}</span>
            </button>

            <button
              onClick={onNewBookingClick}
              className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#b5924d] text-[#1e1c1a] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>+ {lang === 'es' ? 'Nueva Cita' : 'New Booking'}</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasGoogleSync ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[#ebd8b1] font-medium">
              {hasGoogleSync
                ? lang === 'es'
                  ? 'Sincronización activa con Google Calendar de Lissett Morante'
                  : 'Active real-time synchronization with Google Calendar'
                : lang === 'es'
                ? 'Modo local (Inicia sesión con Google para sincronizar en tiempo real)'
                : 'Local mode (Sign in with Google for cloud calendar sync)'}
            </span>
          </div>

          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#ebd8b1] hover:text-white underline font-medium"
          >
            <span>Google Calendar Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2d7c5] shadow-xs">
          <span className="text-xs text-[#7d7468] uppercase font-semibold tracking-wider">
            {lang === 'es' ? 'Total Reservas Registradas' : 'Total Bookings'}
          </span>
          <p className="text-3xl font-serif font-bold text-[#2d2a26] mt-1">
            {reservations.length}
          </p>
          <span className="text-[11px] text-[#415344] font-medium">
            {reservations.filter((r) => r.status === 'confirmed').length} {lang === 'es' ? 'confirmadas' : 'confirmed'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2d7c5] shadow-xs">
          <span className="text-xs text-[#7d7468] uppercase font-semibold tracking-wider">
            {lang === 'es' ? 'Eventos en Google Calendar' : 'Google Calendar Events'}
          </span>
          <p className="text-3xl font-serif font-bold text-[#415344] mt-1">
            {calendarEvents.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">
            {hasGoogleSync ? 'Sincronizado' : 'Sin conexión a Google'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2d7c5] shadow-xs">
          <span className="text-xs text-[#7d7468] uppercase font-semibold tracking-wider">
            {lang === 'es' ? 'Total Abonos Requeridos (50%)' : '50% Total Deposits'}
          </span>
          <p className="text-3xl font-serif font-bold text-[#8e5d43] mt-1">
            ${reservations.reduce((acc, r) => acc + (r.status !== 'cancelled' ? r.depositRequired : 0), 0)} <span className="text-xs font-normal text-[#7d7468]">USD</span>
          </p>
          <span className="text-[11px] text-[#7d7468]">
            {lang === 'es' ? 'Abono para confirmación previa' : 'Advance confirmation value'}
          </span>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-[#2d2a26]">
            {lang === 'es' ? 'Citas Programadas & Fichas de Pacientes' : 'Scheduled Appointments & Client Cards'}
          </h3>
          <span className="text-xs text-[#7d7468]">
            {filteredReservations.length} {lang === 'es' ? 'citas listadas' : 'bookings listed'}
          </span>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#e2d7c5] shadow-xs">
            <Calendar className="w-10 h-10 text-[#c5a059] mx-auto mb-3" />
            <h4 className="text-base font-serif font-bold text-[#2d2a26]">
              {lang === 'es' ? 'No hay citas registradas' : 'No appointments yet'}
            </h4>
            <p className="text-xs text-[#7d7468] mt-1 max-w-md mx-auto">
              {lang === 'es'
                ? 'Las reservas creadas por los clientes aparecerán aquí con su respectiva ficha de salud y se sincronizarán con Google Calendar.'
                : 'Appointments booked by clients will appear here with clinical health assessments and live calendar synchronization.'}
            </p>
            <button
              onClick={onNewBookingClick}
              className="mt-4 px-5 py-2.5 bg-[#415344] text-white text-xs font-semibold rounded-xl"
            >
              {lang === 'es' ? 'Crear primera reserva de prueba' : 'Create a booking'}
            </button>
          </div>
        ) : (
          filteredReservations.map((res) => {
            const isExpanded = expandedId === res.id;
            const ha = res.healthAssessment;

            return (
              <div
                key={res.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  res.status === 'cancelled'
                    ? 'border-gray-200 opacity-60'
                    : 'border-[#e2d7c5] hover:border-[#c5a059]'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#ede5d8] text-[#415344] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-[#8e5d43]">
                        {new Date(`${res.date}T00:00:00`).toLocaleDateString('es-EC', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {new Date(`${res.date}T00:00:00`).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-bold text-base text-[#2d2a26]">
                          {res.treatmentName}
                        </span>
                        <span className="text-xs text-[#7d7468] font-medium">
                          ({res.durationMinutes} min)
                        </span>
                        {res.status === 'cancelled' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                            Cancelada
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5a534b]">
                        <span className="flex items-center gap-1 font-semibold text-[#2d2a26]">
                          <User className="w-3.5 h-3.5 text-[#415344]" />
                          {res.clientName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#415344]" />
                          {res.timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#8e5d43]" />
                          {res.clientPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-[#7d7468] block">
                        Abono 50%:
                      </span>
                      <span className="text-sm font-bold text-[#415344]">
                        ${res.depositRequired} USD
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : res.id)}
                        className="px-3 py-1.5 rounded-lg border border-[#d8ccbc] hover:bg-[#faf7f2] text-xs font-semibold text-[#4a453e] flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? 'Ocultar Ficha' : 'Ver Ficha de Salud'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {res.status !== 'cancelled' && (
                        <button
                          onClick={() => setReservationToDelete(res)}
                          title="Cancelar cita"
                          className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Clinical Health Card */}
                {isExpanded && (
                  <div className="bg-[#faf8f5] p-5 sm:p-6 border-t border-[#ede5d8] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#e8dfd3]">
                      <h5 className="text-xs font-bold text-[#8e5d43] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                        Ficha Médica & Perfil del Cliente (Lissett Morante)
                      </h5>
                      <div className="flex items-center gap-3 text-[11px] text-[#7d7468]">
                        <span>Fecha Ficha: {ha.intakeDate || res.date}</span>
                        <span>·</span>
                        <span>Registrada: {new Date(res.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Client Demographics & Emergency Contact */}
                    <div className="bg-white p-4 rounded-xl border border-[#e2d7c5] space-y-2 text-xs">
                      <span className="font-bold text-[#415344] uppercase tracking-wider text-[11px] block">
                        ✦ Datos Personales & Contacto de Emergencia
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[#5a534b]">
                        <div>
                          <span className="text-[10px] text-[#8e8477] block">ID / Cédula / Pasaporte:</span>
                          <span className="font-semibold text-[#2d2a26]">{ha.idNumber || 'No registrada'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8e8477] block">F. Nacimiento / Edad:</span>
                          <span className="font-semibold text-[#2d2a26]">
                            {ha.dateOfBirth ? `${ha.dateOfBirth} (${ha.age || '—'} años)` : ha.age ? `${ha.age} años` : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8e8477] block">Nacionalidad / Ciudad:</span>
                          <span className="font-semibold text-[#2d2a26]">
                            {ha.nationality || 'Ecuador'} {ha.cityOfResidence ? `· ${ha.cityOfResidence}` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8e8477] block">Ocupación:</span>
                          <span className="font-semibold text-[#2d2a26]">{ha.occupation || '—'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-[#8e8477] block">Contacto de Emergencia:</span>
                          <span className="font-semibold text-rose-900">
                            {ha.emergencyContact ? `${ha.emergencyContact} (${ha.emergencyPhoneNumber})` : 'No especificado'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-[#8e8477] block">Motivo de Visita:</span>
                          <span className="font-semibold text-[#415344]">
                            {ha.visitReasons && ha.visitReasons.length > 0 ? ha.visitReasons.join(', ') : 'Bienestar'}
                            {ha.otherVisitReason ? ` (${ha.otherVisitReason})` : ''}
                          </span>
                        </div>
                      </div>
                      {ha.expectedOutcome && (
                        <div className="pt-2 border-t border-[#f0eae1] text-xs">
                          <span className="text-[10px] text-[#8e8477] block font-semibold">
                            ¿Qué espera obtener de esta experiencia?
                          </span>
                          <p className="italic text-[#3e3831]">"{ha.expectedOutcome}"</p>
                        </div>
                      )}
                    </div>

                    {/* Medical Checklist (YES / NO) */}
                    <div className="bg-white p-4 rounded-xl border border-[#e2d7c5] space-y-3">
                      <span className="font-bold text-[#415344] uppercase tracking-wider text-[11px] block flex items-center justify-between">
                        <span>✦ Cuestionario Médico: Marca SÍ o NO (Screening)</span>
                        <span className="text-[10px] font-normal text-[#8e8477] lowercase">
                          (condiciones marcadas con SÍ se destacan)
                        </span>
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                        {[
                          { label: 'Presión alta', val: ha.medicalChecklist?.highBloodPressure },
                          { label: 'Problemas cardíacos', val: ha.medicalChecklist?.heartProblems, alert: true },
                          { label: 'Diabetes', val: ha.medicalChecklist?.diabetes },
                          { label: 'Prob. circulatorios', val: ha.medicalChecklist?.circulatoryProblems },
                          { label: 'Trombosis / Várices', val: ha.medicalChecklist?.thrombosisVaricose, alert: true },
                          { label: 'Epilepsia', val: ha.medicalChecklist?.epilepsy, alert: true },
                          { label: 'Asma / Respiratorio', val: ha.medicalChecklist?.asthma || ha.medicalChecklist?.respiratoryProblems },
                          { label: 'Prob. en columna', val: ha.medicalChecklist?.spinalProblems, alert: true },
                          { label: 'Lesiones recientes', val: ha.medicalChecklist?.recentMuscleInjuries },
                          { label: 'Fracturas recientes', val: ha.medicalChecklist?.recentFractures, alert: true },
                          { label: 'Cirugías 12 meses', val: ha.medicalChecklist?.surgeriesLast12Months, alert: true, detail: ha.medicalChecklist?.surgeriesDetails || ha.surgeriesDetails },
                          { label: 'Condiciones piel', val: ha.medicalChecklist?.skinConditions },
                          { label: 'Alergias', val: ha.medicalChecklist?.allergies || ha.hasAllergies, alert: true, detail: ha.medicalChecklist?.allergiesDetails || ha.allergiesList.join(', ') },
                          { label: 'Embarazo', val: ha.medicalChecklist?.pregnancy || ha.isPregnant, alert: true, detail: ha.pregnancyWeeks ? `${ha.pregnancyWeeks} sem` : '' },
                          { label: 'Lactancia', val: ha.medicalChecklist?.breastfeeding },
                          { label: 'Cáncer / Antecedentes', val: ha.medicalChecklist?.cancerHistory, alert: true },
                          { label: 'Medicación actual', val: ha.medicalChecklist?.currentMedications, detail: ha.medicalChecklist?.medicationsDetails },
                          { label: 'Marcapasos / Dispositivo', val: ha.medicalChecklist?.pacemakerDevices, alert: true },
                          { label: 'Otras condiciones', val: ha.medicalChecklist?.otherConditions, detail: ha.medicalChecklist?.otherConditionsDetails },
                        ].map((mItem, mIdx) => (
                          <div
                            key={mIdx}
                            className={`p-2 rounded-lg border flex flex-col justify-between ${
                              mItem.val
                                ? mItem.alert
                                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                                  : 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                                : 'bg-[#faf8f5] border-[#ede5d8] text-[#6b645b]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] truncate">{mItem.label}:</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${mItem.val ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                {mItem.val ? 'SÍ' : 'NO'}
                              </span>
                            </div>
                            {mItem.detail && (
                              <span className="text-[10px] mt-1 text-rose-800 italic block truncate">
                                {mItem.detail}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Critical health alerts banner */}
                    {(ha.isPregnant || ha.hasAllergies || ha.hasRestrictions || ha.hasSurgeries) && (
                      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-950">
                        <span className="font-bold flex items-center gap-1 text-rose-800">
                          <AlertTriangle className="w-4 h-4 text-rose-700" />
                          Atención Clínica Especial:
                        </span>
                        {ha.isPregnant && (
                          <p>
                            • <strong>Embarazo:</strong> Sí ({ha.pregnancyWeeks ? `${ha.pregnancyWeeks} semanas` : 'Gestación'}). Evitar posturas prona y piedras calientes directas.
                          </p>
                        )}
                        {ha.hasAllergies && (
                          <p>
                            • <strong>Alergias / Sensibilidades:</strong> {ha.allergiesList.join(', ')} {ha.otherAllergies && `(${ha.otherAllergies})`}
                          </p>
                        )}
                        {ha.hasRestrictions && (
                          <p>
                            • <strong>Restricción Física:</strong> {ha.restrictionsDetails}
                          </p>
                        )}
                        {ha.hasSurgeries && (
                          <p>
                            • <strong>Cirugías / Implantes:</strong> {ha.surgeriesDetails} {ha.surgeriesDate && `(${ha.surgeriesDate})`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Focus vs Avoid Areas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-[#e2d7c5]">
                        <span className="text-[11px] font-semibold text-emerald-800 block mb-1">
                          🟢 Zonas prioritarias a enfocar:
                        </span>
                        <p className="font-medium text-[#2d2a26]">
                          {ha.focusAreas.length > 0 ? ha.focusAreas.join(' • ') : 'Equilibrio general'}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#e2d7c5]">
                        <span className="text-[11px] font-semibold text-rose-800 block mb-1">
                          🔴 Zonas a evitar o tratar con suavidad:
                        </span>
                        <p className="font-medium text-[#2d2a26]">
                          {ha.avoidAreas.length > 0 ? ha.avoidAreas.join(' • ') : 'Ninguna zona excluida'}
                        </p>
                      </div>
                    </div>

                    {/* Pressure, Stress, and Intention */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-[#e2d7c5]">
                        <span className="text-[11px] text-[#7d7468] block">Preferencia de Presión:</span>
                        <span className="font-bold text-[#2d2a26] uppercase">
                          {ha.pressurePreference}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#e2d7c5]">
                        <span className="text-[11px] text-[#7d7468] block">Nivel de Estrés / Sobrecarga:</span>
                        <span className="font-bold text-[#415344]">
                          {ha.currentStressLevel} / 10
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#e2d7c5]">
                        <span className="text-[11px] text-[#7d7468] block">Método de Pago:</span>
                        <span className="font-bold text-[#8e5d43] uppercase">
                          {res.paymentMethod} (Abono 50%: ${res.depositRequired} USD)
                        </span>
                      </div>
                    </div>

                    {ha.energyIntention && (
                      <div className="p-3 bg-[#f4ebe1] rounded-xl border border-[#ebd8c6] text-xs">
                        <span className="font-semibold text-[#8e5d43] block mb-0.5">
                          ✦ Intención personal y energética del cliente:
                        </span>
                        <p className="text-[#3e3831] italic">{ha.energyIntention}</p>
                      </div>
                    )}

                    {ha.specialNotes && (
                      <div className="p-3 bg-white rounded-xl border border-[#e2d7c5] text-xs">
                        <span className="font-semibold text-[#5a534b] block mb-0.5">
                          Notas especiales para la sesión:
                        </span>
                        <p className="text-[#3e3831]">{ha.specialNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Destructive Action Modal: Workspace Skill Explicit Confirmation Dialog */}
      {reservationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#e2d7c5] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-lg font-serif font-bold text-[#2d2a26]">
                {lang === 'es' ? '¿Cancelar esta reserva?' : 'Cancel this appointment?'}
              </h4>
              <p className="text-xs text-[#736c63] mt-2 leading-relaxed">
                {lang === 'es'
                  ? `Estás a punto de cancelar la sesión de "${reservationToDelete.treatmentName}" para el cliente ${reservationToDelete.clientName} programada para el ${reservationToDelete.date} a las ${reservationToDelete.timeSlot}. Si está sincronizada con Google Calendar, el evento será eliminado.`
                  : `You are about to cancel the booking for ${reservationToDelete.clientName} on ${reservationToDelete.date} at ${reservationToDelete.timeSlot}. If synced with Google Calendar, the event will be removed.`}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReservationToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-[#d8ccbc] hover:bg-[#faf7f2] text-xs font-semibold text-[#4a453e] transition-colors"
              >
                {lang === 'es' ? 'No, conservar cita' : 'Keep appointment'}
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                {isDeleting
                  ? lang === 'es'
                    ? 'Cancelando...'
                    : 'Cancelling...'
                  : lang === 'es'
                  ? 'Sí, cancelar cita'
                  : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
