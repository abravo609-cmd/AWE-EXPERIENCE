import React, { useState, useMemo } from 'react';
import { GoogleCalendarEvent, BookingReservation } from '../types/spa';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AvailabilityPickerProps {
  lang: 'es' | 'en';
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  durationMinutes: number;
  calendarEvents: GoogleCalendarEvent[];
  existingReservations: BookingReservation[];
  hasCalendarSync: boolean;
  onRefreshCalendar?: () => void;
  isRefreshing?: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const AvailabilityPicker: React.FC<AvailabilityPickerProps> = ({
  lang,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  durationMinutes,
  calendarEvents,
  existingReservations,
  hasCalendarSync,
  onRefreshCalendar,
  isRefreshing,
  onNext,
  onBack,
}) => {
  // Generate next 21 days
  const dateOptions = useMemo(() => {
    const list: { iso: string; dayName: string; dayNum: number; monthName: string; isWeekend: boolean }[] = [];
    const today = new Date();

    for (let i = 0; i < 21; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(lang === 'es' ? 'es-EC' : 'en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString(lang === 'es' ? 'es-EC' : 'en-US', { month: 'short' });
      const dayOfWeek = d.getDay();

      list.push({
        iso,
        dayName,
        dayNum,
        monthName,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }
    return list;
  }, [lang]);

  // Standard therapist schedule slots
  const allTimeSlots = [
    '09:00',
    '10:30',
    '12:00',
    '14:00',
    '15:30',
    '17:00',
    '18:30',
  ];

  // Calculate conflict with Google Calendar events and existing bookings
  const slotAvailability = useMemo(() => {
    return allTimeSlots.map((slot) => {
      const [slotHours, slotMinutes] = slot.split(':').map(Number);
      const slotStart = new Date(`${selectedDate}T${slot}:00`);
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

      // 1. Check local / stored reservations
      const internalConflict = existingReservations.some((r) => {
        if (r.date !== selectedDate || r.status === 'cancelled') return false;
        const [rHours, rMin] = r.timeSlot.split(':').map(Number);
        const rStart = new Date(`${r.date}T${r.timeSlot}:00`);
        const rEnd = new Date(rStart.getTime() + r.durationMinutes * 60000);

        // Overlap condition
        return slotStart < rEnd && slotEnd > rStart;
      });

      // 2. Check Google Calendar events
      const googleConflict = calendarEvents.some((evt) => {
        const evtStartStr = evt.start?.dateTime || evt.start?.date;
        const evtEndStr = evt.end?.dateTime || evt.end?.date;
        if (!evtStartStr || !evtEndStr) return false;

        const evtStart = new Date(evtStartStr);
        const evtEnd = new Date(evtEndStr);

        // Check if on same day
        const evtDate = evtStart.toISOString().split('T')[0];
        if (evtDate !== selectedDate) return false;

        return slotStart < evtEnd && slotEnd > evtStart;
      });

      const isBooked = internalConflict || googleConflict;

      return {
        slot,
        isBooked,
        conflictType: googleConflict ? 'google' : internalConflict ? 'reservation' : null,
      };
    });
  }, [selectedDate, durationMinutes, calendarEvents, existingReservations]);

  const selectedSlotInfo = slotAvailability.find((s) => s.slot === selectedTimeSlot);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ebe1] text-[#8e5d43] text-xs font-semibold tracking-wider uppercase">
            <span>Paso 3 de 4</span> · <span>Disponibilidad en Tiempo Real</span>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-2 text-xs">
            {hasCalendarSync ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                {lang === 'es' ? 'Sincronizado con Google Calendar' : 'Synced with Google Calendar'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                {lang === 'es' ? 'Agenda local activa (Conecta Google para sync)' : 'Local agenda active'}
              </span>
            )}

            {onRefreshCalendar && (
              <button
                type="button"
                onClick={onRefreshCalendar}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg border border-[#d8ccbc] hover:bg-[#f0eae1] text-[#5a534b] transition-colors"
                title="Actualizar calendario"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#2d2a26]">
          {lang === 'es' ? 'Selecciona Fecha y Hora de tu Sesión' : 'Select Date & Time for Your Session'}
        </h2>
        <p className="text-sm text-[#615a51] mt-1 font-light leading-relaxed">
          {lang === 'es'
            ? `Lissett Morante atiende citas de manera exclusiva y personalizada. La sesión seleccionada requiere ${durationMinutes} minutos de atención continua.`
            : `Lissett Morante provides one-on-one exclusive care. Your ritual requires ${durationMinutes} minutes of uninterrupted presence.`}
        </p>
      </div>

      {/* Date Carousel */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#415344]" />
            <h3 className="text-sm font-semibold text-[#2d2a26] uppercase tracking-wider">
              {lang === 'es' ? '1. Elige el día de tu reserva:' : '1. Choose booking date:'}
            </h3>
          </div>
          <span className="text-xs text-[#8e5d43] font-medium">
            {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
              lang === 'es' ? 'es-EC' : 'en-US',
              { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
            )}
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {dateOptions.map((item) => {
            const isSelected = item.iso === selectedDate;

            return (
              <button
                key={item.iso}
                type="button"
                onClick={() => {
                  setSelectedDate(item.iso);
                  setSelectedTimeSlot('');
                }}
                className={`flex-shrink-0 w-20 py-3 px-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#415344] text-white border-[#415344] shadow-md scale-102'
                    : 'bg-[#faf8f5] hover:bg-[#f0eae1] text-[#4a453e] border-[#d8ccbc]'
                }`}
              >
                <span className="block text-[11px] font-semibold uppercase tracking-wider opacity-80">
                  {item.dayName}
                </span>
                <span className="block text-xl font-bold my-0.5">{item.dayNum}</span>
                <span className="block text-[10px] uppercase tracking-widest opacity-80">
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#415344]" />
            <h3 className="text-sm font-semibold text-[#2d2a26] uppercase tracking-wider">
              {lang === 'es' ? '2. Turnos Disponibles de la Terapeuta:' : '2. Therapist Open Slots:'}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              {lang === 'es' ? 'Disponible' : 'Available'}
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
              {lang === 'es' ? 'Ocupado' : 'Booked'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slotAvailability.map(({ slot, isBooked, conflictType }) => {
            const isSelected = selectedTimeSlot === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={isBooked}
                onClick={() => setSelectedTimeSlot(slot)}
                className={`p-4 rounded-xl border text-center transition-all relative ${
                  isBooked
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#415344] text-white border-[#415344] shadow-md ring-2 ring-[#c5a059]'
                    : 'bg-[#faf8f5] hover:bg-[#ede5d8] text-[#2d2a26] border-[#d8ccbc]'
                }`}
              >
                <span className="text-base font-bold block">{slot}</span>
                <span
                  className={`text-[11px] block mt-1 font-medium ${
                    isBooked
                      ? 'text-gray-400'
                      : isSelected
                      ? 'text-[#ebd8b1]'
                      : 'text-emerald-700'
                  }`}
                >
                  {isBooked
                    ? conflictType === 'google'
                      ? 'Cita en Google'
                      : 'Reservado'
                    : lang === 'es'
                    ? 'Libre'
                    : 'Open'}
                </span>
              </button>
            );
          })}
        </div>

        {selectedTimeSlot && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-900 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {lang === 'es' ? (
                  <>
                    Horario reservado provisionalmente:{' '}
                    <strong>
                      {selectedDate} a las {selectedTimeSlot} ({durationMinutes} min)
                    </strong>
                  </>
                ) : (
                  <>
                    Selected slot:{' '}
                    <strong>
                      {selectedDate} at {selectedTimeSlot} ({durationMinutes} min)
                    </strong>
                  </>
                )}
              </span>
            </div>
            <span className="font-semibold text-emerald-800">
              {lang === 'es' ? 'Listo para confirmar' : 'Ready'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-[#d8ccbc] bg-white hover:bg-[#f0eae1] text-[#4a453e] font-semibold text-sm flex items-center gap-2 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'es' ? 'Volver a Ficha de Salud' : 'Back to Health Form'}</span>
        </button>

        <button
          type="button"
          disabled={!selectedTimeSlot}
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-[#415344] hover:bg-[#344337] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md"
        >
          <span>{lang === 'es' ? 'Continuar con Datos & Abono' : 'Next: Payment & Deposit'}</span>
          <ArrowRight className="w-4 h-4 text-[#c5a059]" />
        </button>
      </div>
    </div>
  );
};
