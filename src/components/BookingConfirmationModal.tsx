import React from 'react';
import { BookingReservation } from '../types/spa';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  FileText,
  X,
  Share2,
  AlertTriangle,
} from 'lucide-react';

interface BookingConfirmationModalProps {
  lang: 'es' | 'en';
  reservation: BookingReservation | null;
  onClose: () => void;
  onViewAgenda: () => void;
  hasGoogleSync: boolean;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  lang,
  reservation,
  onClose,
  onViewAgenda,
  hasGoogleSync,
}) => {
  if (!reservation) return null;

  const ha = reservation.healthAssessment;

  // WhatsApp text message formatted for Lissett Morante
  const waMessage = encodeURIComponent(
    `✦ *RESERVA EN AWE SPA* ✦\n` +
      `¡Hola Lissett! Acabo de registrar mi cita y ficha de salud:\n\n` +
      `• *Cliente:* ${reservation.clientName}\n` +
      (ha.idNumber ? `• *Cédula/ID:* ${ha.idNumber}\n` : '') +
      (ha.emergencyContact ? `• *Contacto Emergencia:* ${ha.emergencyContact} (${ha.emergencyPhoneNumber})\n` : '') +
      `• *Tratamiento:* ${reservation.treatmentName} (${reservation.durationMinutes} min)\n` +
      `• *Fecha:* ${reservation.date}\n` +
      `• *Hora:* ${reservation.timeSlot}\n` +
      `• *Abono 50%:* $${reservation.depositRequired} USD (${reservation.paymentMethod.toUpperCase()})\n` +
      `• *Motivo de visita:* ${ha.visitReasons && ha.visitReasons.length > 0 ? ha.visitReasons.join(', ') : 'Bienestar'}\n` +
      `• *Zonas a enfocar:* ${ha.focusAreas.join(', ') || 'Equilibrio general'}\n` +
      (ha.hasRestrictions ? `• *Restricciones:* ${ha.restrictionsDetails}\n` : '') +
      (ha.isPregnant ? `• *Embarazo:* Sí (${ha.pregnancyWeeks ? `${ha.pregnancyWeeks} semanas` : ''})\n` : '') +
      (ha.hasAllergies ? `• *Alergias:* ${ha.allergiesList.join(', ')}\n` : '') +
      `\nAdjunto mi comprobante para confirmar mi espacio sagrado. ¡Gracias!`
  );

  const waLink = `https://wa.me/593990587684?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e2d7c5] shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-600 flex items-center justify-center shadow-xs transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#38483b] via-[#415344] to-[#4e6252] text-white p-6 sm:p-8 rounded-t-3xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#ebd8b1] tracking-widest uppercase">
                {lang === 'es' ? '✦ Reserva Registrada con Éxito' : '✦ Reservation Confirmed'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {reservation.treatmentName}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#e0ded8] leading-relaxed">
            {lang === 'es'
              ? `Tu cita ha sido agendada para el ${reservation.date} a las ${reservation.timeSlot}. El espacio ha sido reservado para tu experiencia con Lissett Morante.`
              : `Your session is booked for ${reservation.date} at ${reservation.timeSlot}. The sanctuary space is prepared for your time with Lissett Morante.`}
          </p>

          {/* Sync badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-200 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {hasGoogleSync
              ? lang === 'es'
                ? 'Sincronizado en tiempo real con Google Calendar'
                : 'Synced in real-time to Google Calendar'
              : lang === 'es'
              ? 'Guardado en la agenda de AWE SPA'
              : 'Saved in AWE SPA Agenda'}
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Appointment Details */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm pb-3 border-b border-[#f0eae1]">
              <div>
                <span className="text-xs text-[#736c63] block">
                  {lang === 'es' ? 'Fecha de la Sesión:' : 'Session Date:'}
                </span>
                <span className="font-bold text-[#2d2a26] flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-[#415344]" />
                  {reservation.date}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#736c63] block">
                  {lang === 'es' ? 'Horario & Duración:' : 'Time & Duration:'}
                </span>
                <span className="font-bold text-[#2d2a26] flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-[#415344]" />
                  {reservation.timeSlot} ({reservation.durationMinutes} min)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm pb-3 border-b border-[#f0eae1]">
              <div>
                <span className="text-xs text-[#736c63] block">
                  {lang === 'es' ? 'Cliente:' : 'Client Name:'}
                </span>
                <span className="font-semibold text-[#2d2a26] flex items-center gap-1.5 mt-0.5">
                  <User className="w-4 h-4 text-[#415344]" />
                  {reservation.clientName}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#736c63] block">
                  {lang === 'es' ? 'WhatsApp de contacto:' : 'Client WhatsApp:'}
                </span>
                <span className="font-semibold text-[#2d2a26] mt-0.5 block">
                  {reservation.clientPhone}
                </span>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="pt-1 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#736c63] block">
                  {lang === 'es' ? 'Inversión Total:' : 'Total Investment:'}
                </span>
                <span className="text-base font-bold text-[#2d2a26]">
                  ${reservation.totalPrice} USD
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#8e5d43] font-semibold block">
                  {lang === 'es' ? 'Abono 50% requerido:' : '50% Deposit due:'}
                </span>
                <span className="text-xl font-extrabold text-[#415344]">
                  ${reservation.depositRequired} USD
                </span>
                <span className="text-[11px] text-[#736c63] block">
                  ({reservation.paymentMethod.toUpperCase()})
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Health Snapshot */}
          <div className="bg-[#faf7f2] p-5 rounded-2xl border border-[#ede5d8] space-y-3">
            <h4 className="text-xs font-bold text-[#8e5d43] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#415344]" />
              {lang === 'es' ? 'Ficha de Salud Registrada para Lissett Morante' : 'Client Health Assessment Attached'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#e8dfd3]">
                <span className="text-[11px] text-[#7d7468] block">
                  {lang === 'es' ? 'Zonas a enfocar:' : 'Focus zones:'}
                </span>
                <span className="font-semibold text-[#2d2a26]">
                  {ha.focusAreas.length > 0 ? ha.focusAreas.join(', ') : 'Armonía general'}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#e8dfd3]">
                <span className="text-[11px] text-[#7d7468] block">
                  {lang === 'es' ? 'Presión preferida:' : 'Pressure:'}
                </span>
                <span className="font-semibold text-[#2d2a26] uppercase">
                  {ha.pressurePreference}
                </span>
              </div>
            </div>

            {/* Contraindications highlight */}
            {(ha.isPregnant || ha.hasAllergies || ha.hasRestrictions || ha.hasSurgeries) && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-900">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  {lang === 'es' ? 'Avisos clínicos para la terapeuta:' : 'Clinical cautions:'}
                </span>
                {ha.isPregnant && (
                  <p>• Embarazo: Sí ({ha.pregnancyWeeks || 'En gestación'}) - Protocolo prenatal activo</p>
                )}
                {ha.hasAllergies && (
                  <p>• Alergias: {ha.allergiesList.join(', ')} {ha.otherAllergies}</p>
                )}
                {ha.hasRestrictions && (
                  <p>• Restricción física: {ha.restrictionsDetails}</p>
                )}
                {ha.hasSurgeries && (
                  <p>• Cirugías: {ha.surgeriesDetails} ({ha.surgeriesDate || 'Reciente'})</p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            {/* WhatsApp Direct Confirmation Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>
                {lang === 'es'
                  ? 'Confirmar y Enviar Comprobante por WhatsApp (+593 99 058 7684)'
                  : 'Confirm via WhatsApp (+593 99 058 7684)'}
              </span>
            </a>

            {/* View Agenda Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onViewAgenda}
                className="flex-1 py-3 px-4 bg-[#415344] hover:bg-[#344337] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#c5a059]" />
                <span>{lang === 'es' ? 'Ver en la Agenda de AWE SPA' : 'View in Spa Agenda'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 bg-white hover:bg-[#ede5d8] border border-[#d8ccbc] text-[#4a453e] font-semibold text-xs sm:text-sm rounded-xl transition-colors"
              >
                {lang === 'es' ? 'Cerrar' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
