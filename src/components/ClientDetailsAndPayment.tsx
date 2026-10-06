import React, { useState } from 'react';
import { Treatment, TreatmentDuration, HealthAssessment } from '../types/spa';
import {
  CreditCard,
  Building2,
  Banknote,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Clock,
  Calendar,
  Lock,
  Phone,
  Sparkles,
} from 'lucide-react';

interface ClientDetailsAndPaymentProps {
  lang: 'es' | 'en';
  treatment: Treatment;
  duration: TreatmentDuration;
  date: string;
  timeSlot: string;
  healthAssessment: HealthAssessment;
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  paymentMethod: 'cash' | 'transfer' | 'card';
  setPaymentMethod: (pm: 'cash' | 'transfer' | 'card') => void;
  onBack: () => void;
  onConfirmBooking: () => Promise<void>;
  isSubmitting: boolean;
}

export const ClientDetailsAndPayment: React.FC<ClientDetailsAndPaymentProps> = ({
  lang,
  treatment,
  duration,
  date,
  timeSlot,
  healthAssessment,
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  paymentMethod,
  setPaymentMethod,
  onBack,
  onConfirmBooking,
  isSubmitting,
}) => {
  const [agreedPolicies, setAgreedPolicies] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const totalPrice = duration.price;
  const depositAmount = totalPrice * 0.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMessage(lang === 'es' ? 'Por favor ingresa tu nombre completo.' : 'Please enter your full name.');
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMessage(lang === 'es' ? 'Por favor ingresa tu número de WhatsApp para contacto.' : 'Please enter your WhatsApp contact number.');
      return;
    }
    if (!clientEmail.trim()) {
      setErrorMessage(lang === 'es' ? 'Por favor ingresa tu correo electrónico.' : 'Please enter your email.');
      return;
    }
    if (!agreedPolicies) {
      setErrorMessage(lang === 'es' ? 'Debes aceptar las políticas de reserva y cancelación.' : 'Please accept spa policies.');
      return;
    }

    setErrorMessage('');
    await onConfirmBooking();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ebe1] text-[#8e5d43] text-xs font-semibold tracking-wider uppercase mb-2">
          <span>Paso 4 de 4</span> · <span>Confirmación & Abono</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#2d2a26]">
          {lang === 'es' ? 'Finalizar Reserva en AWE SPA' : 'Finalize Reservation at AWE SPA'}
        </h2>
        <p className="text-sm text-[#615a51] mt-1 font-light leading-relaxed">
          {lang === 'es'
            ? 'Para garantizar la exclusividad de tu espacio sagrado con Lissett Morante, requerimos el 50% de abono de confirmación. Tu cita se sincronizará automáticamente con el calendario de la terapeuta.'
            : 'To secure your sacred sanctuary appointment with Lissett Morante, a 50% confirmation deposit is required. Your appointment will sync to the therapist calendar.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Booking Summary Box */}
        <div className="bg-gradient-to-br from-[#faf7f2] to-[#f4ebe1] p-6 rounded-2xl border border-[#e2d7c5] shadow-xs">
          <h3 className="text-xs font-bold text-[#8e5d43] uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            {lang === 'es' ? 'Resumen de tu Experiencia' : 'Your Session Summary'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#e2d7c5]">
            <div>
              <span className="text-xs text-[#736c63] block">
                {lang === 'es' ? 'Tratamiento:' : 'Treatment:'}
              </span>
              <h4 className="text-lg font-serif font-bold text-[#2d2a26]">
                {lang === 'es' ? treatment.name : treatment.nameEn}
              </h4>
              <p className="text-xs text-[#8e5d43] font-medium">
                {lang === 'es' ? treatment.subtitle : treatment.subtitleEn}
              </p>
            </div>

            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-[#4a453e]">
                <Calendar className="w-4 h-4 text-[#415344]" />
                <span className="font-semibold">{date}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4a453e]">
                <Clock className="w-4 h-4 text-[#415344]" />
                <span className="font-semibold">
                  {timeSlot} ({duration.minutes} minutos)
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Deposit */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#736c63] block">
                {lang === 'es' ? 'Inversión total del servicio:' : 'Total Investment:'}
              </span>
              <span className="text-2xl font-bold text-[#2d2a26]">
                ${totalPrice} <span className="text-xs font-normal text-[#736c63]">USD</span>
              </span>
              {duration.savings && (
                <span className="ml-2 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {lang === 'es' ? `Ahorras $${duration.savings} USD` : `Save $${duration.savings} USD`}
                </span>
              )}
            </div>

            <div className="bg-[#415344] text-white p-3.5 rounded-xl text-right w-full sm:w-auto shadow-xs">
              <span className="text-[11px] text-[#ebd8b1] block uppercase tracking-wider font-semibold">
                {lang === 'es' ? 'Abono de Confirmación (50%)' : '50% Confirmation Deposit'}
              </span>
              <span className="text-2xl font-extrabold text-white">
                ${depositAmount} <span className="text-xs font-normal text-[#ebd8b1]">USD</span>
              </span>
              <span className="text-[10px] text-[#ebd8b1]/80 block mt-0.5">
                {lang === 'es'
                  ? `Saldo restante ($${depositAmount} USD) a cancelar en el Spa`
                  : `Remaining $${depositAmount} USD due at session`}
              </span>
            </div>
          </div>
        </div>

        {/* Client Contact Details */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-[#2d2a26] uppercase tracking-wider">
            {lang === 'es' ? '1. Datos de Contacto del Cliente' : '1. Client Contact Details'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#4a453e] block mb-1">
                {lang === 'es' ? 'Nombre y Apellidos completos *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Valeria Mendoza"
                className="w-full p-3 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4a453e] block mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8e5d43]" />
                {lang === 'es' ? 'WhatsApp / Teléfono de Contacto *' : 'WhatsApp / Mobile Number *'}
              </label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+593 99 ..."
                className="w-full p-3 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
              />
              <span className="text-[10px] text-[#8e8477] mt-1 block">
                {lang === 'es'
                  ? 'Te enviaremos la confirmación directa por WhatsApp'
                  : 'We will send WhatsApp confirmation directly'}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4a453e] block mb-1">
                {lang === 'es' ? 'Correo Electrónico (para invitación Google Calendar) *' : 'Email Address *'}
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="valeria@example.com"
                className="w-full p-3 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-[#2d2a26] uppercase tracking-wider">
            {lang === 'es' ? '2. Método para el Abono del 50%' : '2. Payment Method for 50% Deposit'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'transfer',
                labelEs: 'Transferencia Bancaria',
                labelEn: 'Bank Transfer',
                descEs: 'Banco Pichincha / Produbanco / De Una',
                descEn: 'Pichincha / Produbanco / De Una',
                icon: Building2,
              },
              {
                id: 'card',
                labelEs: 'Tarjeta de Crédito / Débito',
                labelEn: 'Credit / Debit Card',
                descEs: 'Visa, Mastercard, Diners',
                descEn: 'Visa, Mastercard, Diners',
                icon: CreditCard,
              },
              {
                id: 'cash',
                labelEs: 'Efectivo / Pago en Spa',
                labelEn: 'Cash at Spa',
                descEs: 'Abonar previamente o coordinar',
                descEn: 'Direct coordination',
                icon: Banknote,
              },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#415344] text-white border-[#415344] shadow-xs ring-1 ring-[#c5a059]'
                      : 'bg-[#faf8f5] hover:bg-[#f0eae1] text-[#3e3831] border-[#d8ccbc]'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#ebd8b1]' : 'text-[#8e5d43]'}`} />
                  <span className="block text-xs font-bold mb-0.5">
                    {lang === 'es' ? m.labelEs : m.labelEn}
                  </span>
                  <span
                    className={`block text-[11px] leading-tight ${
                      isSelected ? 'text-[#e5dcce]' : 'text-[#7d7468]'
                    }`}
                  >
                    {lang === 'es' ? m.descEs : m.descEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Payment instructions based on selection */}
          <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ede5d8] text-xs text-[#524c44] space-y-2">
            {paymentMethod === 'transfer' && (
              <div>
                <p className="font-semibold text-[#415344] mb-1">
                  {lang === 'es' ? 'Datos bancarios para transferencia (Ecuador):' : 'Bank transfer coordinates:'}
                </p>
                <p>• <strong>Banco:</strong> Banco Pichincha (Cta Corriente: 2100849204)</p>
                <p>• <strong>Titular:</strong> Lissett Morante — AWE SPA</p>
                <p>• <strong>RUC / CI:</strong> 0924881029001</p>
                <p>• <strong>Monto de abono:</strong> ${depositAmount} USD</p>
                <p className="text-[11px] text-[#8e5d43] mt-1 italic">
                  {lang === 'es'
                    ? 'Envía el comprobante a WhatsApp (+593 99 058 7684) para validación automática.'
                    : 'Send transfer receipt via WhatsApp to finalize confirmation.'}
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div>
                <p className="font-semibold text-[#415344] mb-1">
                  {lang === 'es' ? 'Pago seguro con tarjeta de crédito/débito:' : 'Secure card payment:'}
                </p>
                <p>
                  {lang === 'es'
                    ? 'Recibirás un link seguro de pago (Datafast / Kushki) para procesar el abono de $' +
                      depositAmount +
                      ' USD en 1 cuota corriente o diferido.'
                    : 'A secure payment link will be sent to complete your $' + depositAmount + ' USD deposit.'}
                </p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div>
                <p className="font-semibold text-[#415344] mb-1">
                  {lang === 'es' ? 'Coordinación directa de abono:' : 'Direct coordination:'}
                </p>
                <p>
                  {lang === 'es'
                    ? 'La terapeuta Lissett Morante se pondrá en contacto contigo para verificar la disponibilidad y coordinar la recepción del anticipo.'
                    : 'Therapist Lissett Morante will contact you to coordinate deposit verification.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Important Spa Policies Notice from PDF Page 10 */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-[#8e5d43] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#415344]" />
            {lang === 'es' ? 'Políticas & Recomendaciones AWE SPA' : 'Spa Policies & Guidelines'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5a534b]">
            <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5d8]">
              <strong className="text-[#2d2a26] block mb-0.5">
                {lang === 'es' ? '✦ Reservas & Cupos Limitados' : '✦ Limited Reserved Spots'}
              </strong>
              <span>
                {lang === 'es'
                  ? 'Abono de confirmación del 50%. Reserva con anticipación.'
                  : '50% confirmation deposit. Advance booking recommended.'}
              </span>
            </div>

            <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5d8]">
              <strong className="text-[#2d2a26] block mb-0.5">
                {lang === 'es' ? '✦ Cancelación Gratuita' : '✦ Free Cancellation'}
              </strong>
              <span>
                {lang === 'es'
                  ? 'Cancelación sin penalidad hasta 24 horas antes de tu sesión.'
                  : 'Free cancellation up to 24 hours prior to appointment.'}
              </span>
            </div>

            <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5d8]">
              <strong className="text-[#2d2a26] block mb-0.5">
                {lang === 'es' ? '✦ Puntualidad & Ropa Cómoda' : '✦ Punctuality & Attire'}
              </strong>
              <span>
                {lang === 'es'
                  ? 'Llegar 10 minutos antes. Ropa cómoda (se provee cobertura higiénica).'
                  : 'Arrive 10 min early. Comfortable clothing or draping provided.'}
              </span>
            </div>

            <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5d8]">
              <strong className="text-[#2d2a26] block mb-0.5">
                {lang === 'es' ? '✦ Cuidado Post-Sesión' : '✦ Post-Session Care'}
              </strong>
              <span>
                {lang === 'es'
                  ? 'Hidratación abundante post-sesión para drenar toxinas acumuladas.'
                  : 'Abundant post-session hydration to assist toxin elimination.'}
              </span>
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedPolicies}
              onChange={(e) => setAgreedPolicies(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#415344] focus:ring-[#415344] accent-[#415344]"
            />
            <span className="text-xs text-[#4a453e]">
              {lang === 'es'
                ? 'He leído y acepto las políticas de AWE SPA, confirmo la veracidad de mi ficha de salud y entiendo que se requiere el 50% de abono para garantizar el horario reservado.'
                : 'I have read and agree to AWE SPA policies, attest to the accuracy of my health intake form, and understand the 50% confirmation deposit.'}
            </span>
          </label>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-[#d8ccbc] bg-white hover:bg-[#f0eae1] text-[#4a453e] font-semibold text-sm flex items-center gap-2 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'es' ? 'Modificar Horario' : 'Back to Schedule'}</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-[#415344] hover:bg-[#344337] disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2.5 transition-all shadow-lg active:scale-98"
          >
            <Lock className="w-4 h-4 text-[#c5a059]" />
            <span>
              {isSubmitting
                ? lang === 'es'
                  ? 'Sincronizando con Google Calendar...'
                  : 'Syncing with Google Calendar...'
                : lang === 'es'
                ? `Confirmar Reserva ($${depositAmount} USD Abono)`
                : `Confirm Booking ($${depositAmount} USD Deposit)`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
