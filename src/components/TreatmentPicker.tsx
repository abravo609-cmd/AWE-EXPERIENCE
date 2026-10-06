import React, { useState, useMemo } from 'react';
import { TREATMENTS } from '../data/treatments';
import { Treatment, TreatmentCategory, TreatmentDuration } from '../types/spa';
import { Clock, Check, Sparkles, Search, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface TreatmentPickerProps {
  lang: 'es' | 'en';
  selectedTreatment: Treatment | null;
  selectedDuration: TreatmentDuration | null;
  onSelectTreatment: (treatment: Treatment, duration: TreatmentDuration) => void;
  onNext: () => void;
}

export const TreatmentPicker: React.FC<TreatmentPickerProps> = ({
  lang,
  selectedTreatment,
  selectedDuration,
  onSelectTreatment,
  onNext,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TreatmentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: TreatmentCategory; labelEs: string; labelEn: string; icon: string }[] = [
    { key: 'all', labelEs: 'Todos los Servicios', labelEn: 'All Services', icon: '✦' },
    { key: 'rituales', labelEs: 'Rituales de Transformación', labelEn: 'Transformation Rituals', icon: '🌿' },
    { key: 'masajes', labelEs: 'Experiencias Corporales', labelEn: 'Body Massage', icon: '✨' },
    { key: 'ancestrales', labelEs: 'Terapias Ancestrales & Autor', labelEn: 'Ancestral Therapies', icon: '🔥' },
    { key: 'facial', labelEs: 'Bienestar Facial Kobido', labelEn: 'Kobido Facial', icon: '🌸' },
    { key: 'conexion', labelEs: 'Terapias de Conexión', labelEn: 'Connection Therapies', icon: '👣' },
  ];

  const filteredTreatments = useMemo(() => {
    return TREATMENTS.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.subtitleEn.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.descriptionEn.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-[#38483b] via-[#415344] to-[#4e6252] text-[#f7f4ee] p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden border border-[#5a735e]">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 text-[#ecd7ab] text-xs font-semibold tracking-wider uppercase mb-3 border border-[#c5a059]/30">
            <span>Paso 1 de 4</span> · <span>Selección de Tratamiento</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-2">
            {lang === 'es' ? 'Elige tu Experiencia Holística' : 'Choose Your Holistic Experience'}
          </h2>
          <p className="text-sm sm:text-base text-[#d8dfd7] leading-relaxed font-light">
            {lang === 'es'
              ? 'Cada sesión que vives en este espacio está diseñada para ir más allá del cuerpo. Fusionamos 14 años de experiencia en bienestar de lujo internacional con la sabiduría ancestral de Ecuador.'
              : 'Every session in this sanctuary goes beyond the physical. We merge 14 years of international luxury spa mastery with the ancestral healing traditions of Ecuador.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#ebd8b1]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
              {lang === 'es' ? 'Ficha de salud personalizada previa' : 'Customized health intake'}
            </span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#c5a059]" />
              {lang === 'es' ? 'Abono 50% · Cancela gratis hasta 24h antes' : '50% deposit · Free 24h cancellation'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === c.key
                  ? 'bg-[#415344] text-white shadow-xs'
                  : 'bg-[#f0eae1] hover:bg-[#e6dccf] text-[#4a453e]'
              }`}
            >
              <span>{c.icon}</span>
              <span>{lang === 'es' ? c.labelEs : c.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8277]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar masaje o ritual...' : 'Search treatment...'}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#d8ccbc] text-sm text-[#2d2a26] placeholder-[#9c9489] focus:outline-none focus:ring-2 focus:ring-[#415344] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Treatments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTreatments.map((t) => {
          const isCurrentSelected = selectedTreatment?.id === t.id;

          return (
            <div
              key={t.id}
              className={`rounded-2xl transition-all duration-300 border flex flex-col justify-between overflow-hidden bg-white shadow-xs hover:shadow-md ${
                isCurrentSelected
                  ? 'border-[#415344] ring-2 ring-[#415344]/20 bg-gradient-to-b from-[#faf9f6] to-white'
                  : 'border-[#e4daca] hover:border-[#c5a059]/60'
              }`}
            >
              <div className="p-6">
                {/* Header with Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    {t.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider bg-[#f4ebe1] text-[#8e5d43] border border-[#ebd8c6] mb-2 uppercase">
                        {lang === 'es' ? t.badge : t.badgeEn || t.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-serif font-bold text-[#2d2a26] leading-tight">
                      {lang === 'es' ? t.name : t.nameEn}
                    </h3>
                    <p className="text-xs font-semibold text-[#8e5d43] tracking-wide mt-0.5">
                      {lang === 'es' ? t.subtitle : t.subtitleEn}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#7d7468] block uppercase tracking-wider">
                      {lang === 'es' ? 'Desde' : 'From'}
                    </span>
                    <span className="text-xl font-bold text-[#415344]">
                      ${t.durations[0].price} <span className="text-xs font-normal text-[#7d7468]">USD</span>
                    </span>
                  </div>
                </div>

                {/* Tagline & Description */}
                <p className="text-xs sm:text-sm text-[#5d564e] leading-relaxed mb-4">
                  {lang === 'es' ? t.description : t.descriptionEn}
                </p>

                {/* Included Steps / Ritual components */}
                <div className="bg-[#faf7f2] rounded-xl p-3.5 border border-[#ede5d8] mb-5">
                  <span className="text-[11px] font-semibold text-[#415344] uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                    {lang === 'es' ? 'Incluye la experiencia:' : 'Included in experience:'}
                  </span>
                  <ul className="space-y-1.5">
                    {(lang === 'es' ? t.includes : t.includesEn).map((inc, i) => (
                      <li key={i} className="text-xs text-[#524c44] flex items-start gap-2">
                        <span className="text-[#c5a059] font-bold text-xs mt-0.5">✦</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="text-xs text-[#6e665d] italic border-l-2 border-[#c5a059] pl-3 py-0.5">
                  <span className="font-semibold not-italic text-[#415344]">
                    {lang === 'es' ? 'Beneficio principal: ' : 'Key benefit: '}
                  </span>
                  {lang === 'es' ? t.benefits : t.benefitsEn}
                </div>
              </div>

              {/* Duration & Price Selector Footer */}
              <div className="p-4 sm:p-5 bg-[#faf8f5] border-t border-[#ede5d8]">
                <div className="text-xs font-semibold text-[#5a534b] uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8e5d43]" />
                    {lang === 'es' ? 'Elige la duración:' : 'Select duration:'}
                  </span>
                  <span className="text-[11px] text-[#8e5d43] font-medium">
                    {lang === 'es' ? '50% abono requerido' : '50% deposit required'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {t.durations.map((dur, dIdx) => {
                    const isDurSelected =
                      isCurrentSelected && selectedDuration?.minutes === dur.minutes;

                    return (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => onSelectTreatment(t, dur)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isDurSelected
                            ? 'bg-[#415344] text-white border-[#415344] shadow-xs'
                            : 'bg-white hover:bg-[#f3ede3] text-[#2d2a26] border-[#d8ccbc]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">
                            {dur.minutes} min
                          </span>
                          <span className={`text-sm font-extrabold ${isDurSelected ? 'text-[#ebd8b1]' : 'text-[#415344]'}`}>
                            ${dur.price} USD
                          </span>
                        </div>
                        {dur.savings ? (
                          <div className={`text-[10px] mt-1 font-medium ${isDurSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                            {lang === 'es' ? `Ahorras $${dur.savings} USD` : `Save $${dur.savings} USD`}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Primary Button */}
                {isCurrentSelected ? (
                  <button
                    type="button"
                    onClick={onNext}
                    className="w-full py-2.5 px-4 bg-[#415344] hover:bg-[#344337] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>
                      {lang === 'es'
                        ? `Continuar con ${t.name} (${selectedDuration?.minutes} min)`
                        : `Continue with ${t.nameEn} (${selectedDuration?.minutes} min)`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#c5a059]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectTreatment(t, t.durations[0])}
                    className="w-full py-2.5 px-4 bg-white hover:bg-[#ede5d8] text-[#415344] font-semibold text-sm rounded-xl border border-[#415344] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check className="w-4 h-4 text-[#c5a059]" />
                    <span>{lang === 'es' ? 'Seleccionar este Ritual' : 'Select This Ritual'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTreatments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e4daca]">
          <p className="text-gray-500 text-sm">
            {lang === 'es' ? 'No se encontraron tratamientos con ese filtro.' : 'No treatments match your search.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold text-[#415344] underline"
          >
            {lang === 'es' ? 'Restablecer filtros' : 'Reset filters'}
          </button>
        </div>
      )}

      {/* Bottom Sticky Action Bar if treatment selected */}
      {selectedTreatment && selectedDuration && (
        <div className="sticky bottom-4 z-40 bg-[#2d2a26] text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-[#4a453e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#415344] text-[#c5a059] flex items-center justify-center font-bold text-sm shrink-0 border border-[#c5a059]/40">
              ✦
            </div>
            <div>
              <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider">
                {lang === 'es' ? 'Experiencia Seleccionada' : 'Selected Experience'}
              </p>
              <h4 className="text-base font-serif font-bold text-white">
                {lang === 'es' ? selectedTreatment.name : selectedTreatment.nameEn}
                <span className="text-sm font-normal text-[#d6cdbf] ml-2">
                  ({selectedDuration.minutes} min · ${selectedDuration.price} USD)
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-right hidden md:block">
              <span className="text-[11px] text-[#b8ad9f] block">
                {lang === 'es' ? 'Abono confirmación (50%)' : '50% confirmation deposit'}
              </span>
              <span className="text-base font-bold text-[#ecd7ab]">
                ${selectedDuration.price * 0.5} USD
              </span>
            </div>
            <button
              onClick={onNext}
              className="w-full sm:w-auto px-6 py-3 bg-[#c5a059] hover:bg-[#b5924d] text-[#1e1c1a] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{lang === 'es' ? 'Ficha de Salud & Intake' : 'Next: Health Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
