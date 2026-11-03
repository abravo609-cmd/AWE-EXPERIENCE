import React, { useState } from 'react';
import { Lang, PaymentMethod, Treatment, TreatmentDuration } from '../types/spa';
import {
  CreditCard,
  Building2,
  Banknote,
  ShieldCheck,
  Clock,
  Calendar,
  Lock,
  Phone,
  Sparkles,
} from 'lucide-react';
import { BRAND, calcDeposit } from '../data/brand';
import { BackButton, BankTransferLines, Field } from './ui';

const PAYMENT_METHODS: {
  id: PaymentMethod;
  labelEs: string;
  labelEn: string;
  descEs: string;
  descEn: string;
  icon: typeof CreditCard;
}[] = [
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
];

const POLICIES: { titleEs: string; titleEn: string; bodyEs: string; bodyEn: string }[] = [
  {
    titleEs: '✦ Reservas & Cupos Limitados',
    titleEn: '✦ Limited Reserved Spots',
    bodyEs: 'Abono de confirmación del 50%. Reserva con anticipación.',
    bodyEn: '50% confirmation deposit. Advance booking recommended.',
  },
  {
    titleEs: '✦ Cancelación Gratuita',
    titleEn: '✦ Free Cancellation',
    bodyEs: 'Cancelación sin penalidad hasta 24 horas antes de tu sesión.',
    bodyEn: 'Free cancellation up to 24 hours prior to appointment.',
  },
  {
    titleEs: '✦ Puntualidad & Ropa Cómoda',
    titleEn: '✦ Punctuality & Attire',
    bodyEs: 'Llegar 10 minutos antes. Ropa cómoda (se provee cobertura higiénica).',
    bodyEn: 'Arrive 10 min early. Comfortable clothing or draping provided.',
  },
  {
    titleEs: '✦ Cuidado Post-Sesión',
    titleEn: '✦ Post-Session Care',
    bodyEs: 'Hidratación abundante post-sesión para drenar toxinas acumuladas.',
    bodyEn: 'Abundant post-session hydration to assist toxin elimination.',
  },
];

interface ClientDetailsAndPaymentProps {
  lang: Lang;
  treatment: Treatment;
  duration: TreatmentDuration;
  date: string;
  timeSlot: string;
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (pm: PaymentMethod) => void;
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
  // Los datos de contacto ya se piden en la ficha de salud: solo se muestran si falta alguno
  const [showContact] = useState(
    () => !clientName.trim() || !clientPhone.trim() || !clientEmail.trim(),
  );

  const totalPrice = duration.price;
  const depositAmount = calcDeposit(totalPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMessage(
        lang === 'es' ? 'Por favor ingresa tu nombre completo.' : 'Please enter your full name.',
      );
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMessage(
        lang === 'es'
          ? 'Por favor ingresa tu número de WhatsApp para contacto.'
          : 'Please enter your WhatsApp contact number.',
      );
      return;
    }
    if (!clientEmail.trim()) {
      setErrorMessage(
        lang === 'es' ? 'Por favor ingresa tu correo electrónico.' : 'Please enter your email.',
      );
      return;
    }
    if (!agreedPolicies) {
      setErrorMessage(
        lang === 'es'
          ? 'Debes aceptar las políticas de reserva y cancelación.'
          : 'Please accept spa policies.',
      );
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
            ? 'Para garantizar la exclusividad de tu espacio sagrado con Lisett Morante, requerimos el 50% de abono de confirmación. Tu cita se sincronizará automáticamente con el calendario de la terapeuta.'
            : 'To secure your sacred sanctuary appointment with Lisett Morante, a 50% confirmation deposit is required. Your appointment will sync to the therapist calendar.'}
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
                  {lang === 'es'
                    ? `Ahorras $${duration.savings} USD`
                    : `Save $${duration.savings} USD`}
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

        {/* Client Contact Details (only if missing) */}
        {showContact && (
          <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#2d2a26] uppercase tracking-wider">
              {lang === 'es' ? '1. Datos de Contacto del Cliente' : '1. Client Contact Details'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                large
                required
                className="sm:col-span-2"
                label={lang === 'es' ? 'Nombre y Apellidos completos *' : 'Full Name *'}
                placeholder="Ej. Valeria Mendoza"
                value={clientName}
                onChange={setClientName}
              />

              <Field
                large
                required
                type="tel"
                icon={<Phone className="w-3.5 h-3.5 text-[#8e5d43]" />}
                labelClassName="text-xs font-semibold text-[#4a453e] block mb-1 flex items-center gap-1.5"
                label={
                  lang === 'es' ? 'WhatsApp / Teléfono de Contacto *' : 'WhatsApp / Mobile Number *'
                }
                placeholder="+593 99 ..."
                hint={
                  lang === 'es'
                    ? 'Te enviaremos la confirmación directa por WhatsApp'
                    : 'We will send WhatsApp confirmation directly'
                }
                value={clientPhone}
                onChange={setClientPhone}
              />

              <Field
                large
                required
                type="email"
                label={
                  lang === 'es'
                    ? 'Correo Electrónico (para invitación Google Calendar) *'
                    : 'Email Address *'
                }
                placeholder="valeria@example.com"
                value={clientEmail}
                onChange={setClientEmail}
              />
            </div>
          </div>
        )}

        {/* Payment Method Selector */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-[#2d2a26] uppercase tracking-wider">
            {lang === 'es'
              ? `${showContact ? '2' : '1'}. Método para el Abono del 50%`
              : `${showContact ? '2' : '1'}. Payment Method for 50% Deposit`}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#415344] text-white border-[#415344] shadow-xs ring-1 ring-[#c5a059]'
                      : 'bg-[#faf8f5] hover:bg-[#f0eae1] text-[#3e3831] border-[#d8ccbc]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#ebd8b1]' : 'text-[#8e5d43]'}`}
                  />
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
                  {lang === 'es'
                    ? 'Datos bancarios para transferencia (Ecuador):'
                    : 'Bank transfer coordinates:'}
                </p>
                <BankTransferLines lang={lang} />
                <p>
                  •{' '}
                  <strong>
                    {lang === 'es' ? 'Monto de abono (50%):' : 'Deposit Amount (50%):'}
                  </strong>{' '}
                  ${depositAmount} USD
                </p>
                <p className="text-[11px] text-[#8e5d43] mt-1 italic">
                  {lang === 'es'
                    ? `Envía el comprobante a WhatsApp (${BRAND.whatsapp.display}) para validación automática.`
                    : 'Send transfer receipt via WhatsApp to finalize confirmation.'}
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div>
                <p className="font-semibold text-[#415344] mb-1">
                  {lang === 'es'
                    ? 'Pago seguro con tarjeta de crédito/débito:'
                    : 'Secure card payment:'}
                </p>
                <p>
                  {lang === 'es'
                    ? 'Recibirás un link seguro de pago (Datafast / Kushki) para procesar el abono de $' +
                      depositAmount +
                      ' USD en 1 cuota corriente o diferido.'
                    : 'A secure payment link will be sent to complete your $' +
                      depositAmount +
                      ' USD deposit.'}
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
                    ? 'La terapeuta Lisett Morante se pondrá en contacto contigo para verificar la disponibilidad y coordinar la recepción del anticipo.'
                    : 'Therapist Lisett Morante will contact you to coordinate deposit verification.'}
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
            {POLICIES.map((policy) => (
              <div
                key={policy.titleEs}
                className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5d8]"
              >
                <strong className="text-[#2d2a26] block mb-0.5">
                  {lang === 'es' ? policy.titleEs : policy.titleEn}
                </strong>
                <span>{lang === 'es' ? policy.bodyEs : policy.bodyEn}</span>
              </div>
            ))}
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
          <BackButton onClick={onBack}>
            {lang === 'es' ? 'Modificar Horario' : 'Back to Schedule'}
          </BackButton>

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
