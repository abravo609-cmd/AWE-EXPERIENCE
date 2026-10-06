import React from 'react';
import { TREATMENTS } from '../data/treatments';
import { Treatment, TreatmentDuration } from '../types/spa';
import {
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Phone,
  Calendar,
  Heart,
  Award,
} from 'lucide-react';

interface CatalogViewProps {
  lang: 'es' | 'en';
  onSelectForBooking: (treatment: Treatment, duration: TreatmentDuration) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  lang,
  onSelectForBooking,
}) => {
  const rituals = TREATMENTS.filter((t) => t.category === 'rituales');
  const bodyMassage = TREATMENTS.filter((t) => t.category === 'masajes');
  const ancestral = TREATMENTS.filter((t) => t.category === 'ancestrales');
  const facial = TREATMENTS.filter((t) => t.category === 'facial');
  const connection = TREATMENTS.filter((t) => t.category === 'conexion');

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Cover Brochure Header */}
      <div className="bg-[#2d2a26] text-[#faf7f2] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border border-[#4a453e] shadow-xl">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#c5a059] tracking-[0.3em] uppercase">
            <span>✦ Ancestral Wellness Experience ✦</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            LISSETT MORANTE
          </h1>
          <p className="text-sm font-medium tracking-[0.2em] text-[#ecd7ab] uppercase">
            Spa & Holistic Wellness
          </p>

          <div className="py-4">
            <div className="w-16 h-px bg-[#c5a059]/60 mx-auto mb-4" />
            <p className="font-serif italic text-lg sm:text-xl text-[#f2ede4] font-light max-w-lg mx-auto">
              {lang === 'es'
                ? '"Tu cuerpo recuerda lo que tu mente olvidó."'
                : '"Your body remembers what your mind has forgotten."'}
            </p>
            <div className="w-16 h-px bg-[#c5a059]/60 mx-auto mt-4" />
          </div>

          <div className="pt-2 text-xs text-[#b8ad9f] tracking-widest uppercase flex flex-wrap items-center justify-center gap-4">
            <span>CARTA DE SERVICIOS · MENU OF SERVICES</span>
            <span>·</span>
            <span>Ecuador · 2026</span>
            <span>·</span>
            <a
              href="https://wa.me/593990587684"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c5a059] hover:underline"
            >
              WhatsApp: +593 99 058 7684
            </a>
          </div>
        </div>
      </div>

      {/* Welcome to your Sacred Space Banner (From PDF Page 2) */}
      <div className="bg-gradient-to-r from-[#faf7f2] via-[#f5ede2] to-[#faf7f2] p-8 rounded-3xl border border-[#e2d7c5] shadow-xs">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-[#8e5d43] uppercase">
            {lang === 'es' ? 'Bienvenida a tu Espacio Sagrado' : 'Welcome to Your Sacred Space'}
          </span>
          <p className="text-sm sm:text-base text-[#4a453e] font-serif italic leading-relaxed">
            {lang === 'es'
              ? 'Cada sesión que vives en este espacio está diseñada para ir más allá del cuerpo. Aquí no solo se relajan los músculos, se libera lo que el alma ha cargado en silencio. Con 14 años de experiencia en bienestar de lujo internacional, fusiono la precisión de las terapias más sofisticadas del mundo con la sabiduría de las tradiciones ancestrales de Ecuador.'
              : 'Each session is designed to go beyond the body. Here, muscles relax and the soul releases what it has silently carried. Blending 14 years of international luxury spa expertise with Ecuador’s ancestral healing wisdom.'}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs text-[#524c44] font-medium">
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#d8ccbc] shadow-2xs">
              ✦ Licenciada en Hotelería & Turismo
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#d8ccbc] shadow-2xs">
              ✦ Spa & Wellness Manager Certificada
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#d8ccbc] shadow-2xs">
              ✦ +14 años en bienestar de lujo
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#d8ccbc] shadow-2xs">
              ✦ Terapeuta Holística & Energética
            </span>
          </div>
        </div>
      </div>

      {/* 1. RITUALES DE TRANSFORMACIÓN */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">
            ✦ Experiencias Completas ✦
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2a26]">
            {lang === 'es' ? 'Rituales de Transformación' : 'Transformation Rituals'}
          </h2>
          <p className="text-xs sm:text-sm text-[#736c63] italic">
            {lang === 'es'
              ? 'Experiencias completas diseñadas para transformar, no solo relajar.'
              : 'Comprehensive experiences designed to transform, not just relax.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rituals.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2d7c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-[#8e5d43] uppercase tracking-wider">
                    ✦ {lang === 'es' ? r.subtitle : r.subtitleEn}
                  </span>
                  {r.durations[0].savings && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      Ahorras ${r.durations[0].savings} USD
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#2d2a26] mb-1">
                  {lang === 'es' ? r.name : r.nameEn}
                </h3>

                <p className="text-xs sm:text-sm text-[#5a534b] leading-relaxed mb-4">
                  {lang === 'es' ? r.description : r.descriptionEn}
                </p>

                {/* Included Steps */}
                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#ede5d8] mb-5">
                  <span className="text-[11px] font-bold text-[#415344] uppercase tracking-wider block mb-2">
                    {lang === 'es' ? 'Incluye:' : 'Includes:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#4a453e]">
                    {(lang === 'es' ? r.includes : r.includesEn).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#c5a059] font-bold">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Booking action */}
              <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7d7468] block">
                    Duración total: {r.durations[0].minutes} min
                  </span>
                  {r.durations[0].originalPrice && (
                    <span className="text-xs text-gray-400 line-through mr-2">
                      ${r.durations[0].originalPrice} USD
                    </span>
                  )}
                  <span className="text-2xl font-serif font-bold text-[#415344]">
                    ${r.durations[0].price} <span className="text-xs font-normal text-[#7d7468]">USD</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectForBooking(r, r.durations[0])}
                  className="px-5 py-2.5 rounded-xl bg-[#415344] hover:bg-[#344337] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{lang === 'es' ? 'Reservar' : 'Book'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. EXPERIENCIAS CORPORALES & MASAJES */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">
            ◈ Masajes Corporales ◈
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2a26]">
            {lang === 'es' ? 'Experiencias Corporales' : 'Body Experiences'}
          </h2>
          <p className="text-xs sm:text-sm text-[#736c63] italic">
            {lang === 'es'
              ? 'Para quienes buscan una experiencia específica o tienen tiempo limitado.'
              : 'For targeted relief or limited timeframes.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bodyMassage.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-[#e2d7c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2d2a26]">
                  {lang === 'es' ? t.name : t.nameEn}
                </h3>
                <p className="text-xs font-semibold text-[#8e5d43] mt-0.5 mb-2">
                  {lang === 'es' ? t.subtitle : t.subtitleEn}
                </p>
                <p className="text-xs text-[#5a534b] leading-relaxed mb-4">
                  {lang === 'es' ? t.description : t.descriptionEn}
                </p>
                <div className="text-xs text-[#6e665d] italic border-l-2 border-[#c5a059] pl-2.5 py-0.5 mb-4">
                  <span className="font-semibold not-italic text-[#415344]">Beneficio: </span>
                  {lang === 'es' ? t.benefits : t.benefitsEn}
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7d7468] block">
                    {t.durations.map((d) => `${d.minutes}m`).join(' / ')}
                  </span>
                  <span className="text-lg font-bold text-[#415344]">
                    {t.durations.map((d) => `$${d.price}`).join(' · ')}{' '}
                    <span className="text-xs font-normal text-[#7d7468]">USD</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectForBooking(t, t.durations[0])}
                  className="px-4 py-2 rounded-xl bg-[#415344] hover:bg-[#344337] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Reservar</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TERAPIAS ANCESTRALES Y CERTIFICADAS DE AUTOR */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">
            ✦ Técnicas Originales & Certificadas ✦
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2a26]">
            {lang === 'es'
              ? 'Terapias Ancestrales y de Autor'
              : 'Ancestral & Certified Original Therapies'}
          </h2>
          <p className="text-xs sm:text-sm text-[#736c63] italic">
            Barras de Access, Pindas Herbales, Piedras Calientes, Bambuterapia, Quirotermia y Puntos Gatillo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ancestral.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-[#e2d7c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {t.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#f4ebe1] text-[#8e5d43] uppercase mb-2">
                    {t.badge}
                  </span>
                )}
                <h3 className="text-xl font-serif font-bold text-[#2d2a26]">
                  {lang === 'es' ? t.name : t.nameEn}
                </h3>
                <p className="text-xs font-semibold text-[#8e5d43] mt-0.5 mb-2">
                  {lang === 'es' ? t.subtitle : t.subtitleEn}
                </p>
                <p className="text-xs text-[#5a534b] leading-relaxed mb-4">
                  {lang === 'es' ? t.description : t.descriptionEn}
                </p>
                <div className="text-xs text-[#6e665d] italic border-l-2 border-[#c5a059] pl-2.5 py-0.5 mb-4">
                  <span className="font-semibold not-italic text-[#415344]">Beneficio: </span>
                  {lang === 'es' ? t.benefits : t.benefitsEn}
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7d7468] block">
                    {t.durations.map((d) => `${d.minutes}m`).join(' / ')}
                  </span>
                  <span className="text-lg font-bold text-[#415344]">
                    {t.durations.map((d) => `$${d.price}`).join(' · ')}{' '}
                    <span className="text-xs font-normal text-[#7d7468]">USD</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectForBooking(t, t.durations[0])}
                  className="px-4 py-2 rounded-xl bg-[#415344] hover:bg-[#344337] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Reservar</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FACIAL KOBIDO & CONEXIÓN PODAL */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facial.concat(connection).map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2d7c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <span className="text-xs font-bold text-[#8e5d43] uppercase tracking-wider block mb-1">
                {t.category === 'facial' ? '◇ BIENESTAR FACIAL' : '◎ TERAPIAS DE CONEXIÓN'}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2d2a26]">
                {lang === 'es' ? t.name : t.nameEn}
              </h3>
              <p className="text-xs font-semibold text-[#8e5d43] mt-0.5 mb-2">
                {lang === 'es' ? t.subtitle : t.subtitleEn}
              </p>
              <p className="text-xs sm:text-sm text-[#5a534b] leading-relaxed mb-4">
                {lang === 'es' ? t.description : t.descriptionEn}
              </p>
              <div className="text-xs text-[#6e665d] italic border-l-2 border-[#c5a059] pl-3 py-0.5 mb-4">
                <span className="font-semibold not-italic text-[#415344]">Beneficio: </span>
                {lang === 'es' ? t.benefits : t.benefitsEn}
              </div>
            </div>

            <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#7d7468] block">
                  Duración: {t.durations[0].minutes} min
                </span>
                <span className="text-xl font-bold text-[#415344]">
                  ${t.durations[0].price} <span className="text-xs font-normal text-[#7d7468]">USD</span>
                </span>
              </div>

              <button
                onClick={() => onSelectForBooking(t, t.durations[0])}
                className="px-5 py-2.5 rounded-xl bg-[#415344] hover:bg-[#344337] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Reservar</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 5. RESUMEN DE INVERSIÓN (TABLE FROM PDF PAGE 9) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d7c5] shadow-xs space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">
            ✦ Tarifario Completo ✦
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#2d2a26]">
            RESUMEN DE INVERSIÓN · INVESTMENT SUMMARY
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#e2d7c5] text-[#8e5d43] uppercase text-[11px] font-bold">
                <th className="py-3 px-3">Servicio / Service</th>
                <th className="py-3 px-3">Duración</th>
                <th className="py-3 px-3">Precio USD</th>
                <th className="py-3 px-3">Ahorras</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eae1] text-[#3e3831]">
              {TREATMENTS.map((t) => (
                <tr key={t.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#2d2a26]">
                    {t.name}
                  </td>
                  <td className="py-3 px-3 text-[#5a534b]">
                    {t.durations.map((d) => `${d.minutes} min`).join(' / ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#415344]">
                    {t.durations.map((d) => `$${d.price}`).join(' / ')}
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">
                    {t.durations[0].savings ? `$${t.durations[0].savings} USD` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectForBooking(t, t.durations[0])}
                      className="text-xs font-bold text-[#8e5d43] hover:text-[#415344] underline"
                    >
                      Reservar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. INFORMACIÓN IMPORTANTE (FROM PDF PAGE 10) */}
      <section className="bg-gradient-to-br from-[#faf7f2] to-[#f4ebe1] rounded-3xl p-6 sm:p-8 border border-[#e2d7c5] shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#8e5d43] tracking-widest uppercase">
            ✦ Transparencia & Cuidado ✦
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#2d2a26]">
            INFORMACIÓN IMPORTANTE · IMPORTANT INFORMATION
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-[#524c44]">
          <div className="p-4 bg-white rounded-2xl border border-[#ede5d8] space-y-1">
            <strong className="text-sm font-serif font-bold text-[#2d2a26] block">
              RESERVAS · Reservations
            </strong>
            <p>
              Reserva con anticipación. Abono de confirmación: <strong>50% del valor</strong> de la experiencia seleccionada (cupos limitados).
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#ede5d8] space-y-1">
            <strong className="text-sm font-serif font-bold text-[#2d2a26] block">
              CANCELACIONES · Cancellations
            </strong>
            <p>
              Cancelación gratuita y reprogramación flexible <strong>hasta 24 horas antes</strong> de tu sesión.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#ede5d8] space-y-1">
            <strong className="text-sm font-serif font-bold text-[#2d2a26] block">
              PAGO · Payment
            </strong>
            <p>
              Efectivo · Transferencia bancaria (Banco Pichincha) · Tarjeta de Crédito / Débito.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#ede5d8] space-y-1">
            <strong className="text-sm font-serif font-bold text-[#2d2a26] block">
              RECOMENDACIONES
            </strong>
            <p>
              • Llegar 10 minutos antes de tu sesión.<br />
              • Ropa cómoda o se provee cobertura.<br />
              • Hidratación abundante post-sesión.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#ede5d8] space-y-1 sm:col-span-2">
            <strong className="text-sm font-serif font-bold text-rose-900 block">
              CONTRAINDICACIONES & CONDICIONES ESPECIALES
            </strong>
            <p className="text-rose-950">
              Es mandatorio informar <strong>embarazo, cirugías recientes, alergias a aceites botánicos o lesiones osteomusculares</strong> antes de la sesión a través de nuestra ficha de salud para personalizar o contraindicar técnicas de calor o presión profunda.
            </p>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="text-center pt-4 border-t border-[#e2d7c5] space-y-1">
          <p className="font-serif font-bold text-lg text-[#2d2a26]">Lissett Morante</p>
          <p className="text-xs text-[#8e5d43] tracking-widest uppercase">Ancestral Wellness Experience</p>
          <p className="text-xs text-[#6e665d]">@lissettmorante.awe · +593 99 058 7684 · Ecuador 2026</p>
          <p className="font-serif italic text-sm text-[#415344] mt-2">
            "Donde la sabiduría ancestral sana el ser moderno."
          </p>
        </div>
      </section>
    </div>
  );
};
