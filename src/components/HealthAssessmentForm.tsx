import React from 'react';
import {
  HealthAssessment,
  Lang,
  MedicalDetailsKey,
  MedicalFlagKey,
  PressurePreference,
} from '../types/spa';
import {
  AlertTriangle,
  Sparkles,
  Activity,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { toISODate } from '../utils/date';
import { BackButton, Field, NextButton, SectionHeader, inputClassLg } from './ui';

interface HealthAssessmentFormProps {
  lang: Lang;
  assessment: HealthAssessment;
  setAssessment: React.Dispatch<React.SetStateAction<HealthAssessment>>;
  treatmentName: string;
  onNext: () => void;
  onBack: () => void;
}

type TextFieldKey =
  | 'fullName'
  | 'idNumber'
  | 'dateOfBirth'
  | 'age'
  | 'nationality'
  | 'phoneNumber'
  | 'emailAddress'
  | 'cityOfResidence'
  | 'occupation'
  | 'emergencyContact'
  | 'emergencyPhoneNumber';

const ICON = 'w-3.5 h-3.5 text-[#8e5d43]';

const PERSONAL_FIELDS: {
  key: TextFieldKey;
  labelEs: string;
  labelEn: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  wide?: boolean;
  min?: string;
  max?: string;
}[] = [
  {
    key: 'fullName',
    labelEs: 'Nombres y Apellidos / First and Last Names *',
    labelEn: 'First and Last Names *',
    required: true,
    placeholder: 'Ej. Valeria Sofía Mendoza Castro',
    wide: true,
  },
  {
    key: 'idNumber',
    labelEs: 'Cédula / Pasaporte / ID Number *',
    labelEn: 'ID Number (Passport / National ID) *',
    required: true,
    placeholder: '1718293041',
  },
  {
    key: 'dateOfBirth',
    labelEs: 'Fecha de Nacimiento / Date of Birth',
    labelEn: 'Date of Birth',
    type: 'date',
  },
  {
    key: 'age',
    labelEs: 'Edad / Age',
    labelEn: 'Age',
    type: 'number',
    min: '1',
    max: '115',
    placeholder: 'Ej. 35',
  },
  {
    key: 'nationality',
    labelEs: 'Nacionalidad / Nationality',
    labelEn: 'Nationality',
    placeholder: 'Ej. Ecuatoriana',
  },
  {
    key: 'phoneNumber',
    labelEs: 'Número de Teléfono / Phone Number *',
    labelEn: 'Phone Number *',
    type: 'tel',
    required: true,
    placeholder: '+593 99 000 0000',
    icon: <Phone className={ICON} />,
  },
  {
    key: 'emailAddress',
    labelEs: 'Correo Electrónico / Email Address *',
    labelEn: 'Email Address *',
    type: 'email',
    required: true,
    placeholder: 'cliente@ejemplo.com',
    icon: <Mail className={ICON} />,
  },
  {
    key: 'cityOfResidence',
    labelEs: 'Ciudad de Residencia / City of Residence',
    labelEn: 'City of Residence',
    placeholder: 'Ej. Guayaquil / Quito',
    icon: <MapPin className={ICON} />,
  },
  {
    key: 'occupation',
    labelEs: 'Ocupación / Occupation',
    labelEn: 'Occupation',
    placeholder: 'Ej. Diseñadora / Ejecutiva',
    icon: <Briefcase className={ICON} />,
  },
  {
    key: 'emergencyContact',
    labelEs: 'Contacto de Emergencia / Emergency Contact *',
    labelEn: 'Emergency Contact Name *',
    required: true,
    placeholder: 'Ej. Carlos Mendoza (Esposo / Familiar)',
  },
  {
    key: 'emergencyPhoneNumber',
    labelEs: 'Teléfono de Emergencia / Emergency Phone Number *',
    labelEn: 'Emergency Phone Number *',
    type: 'tel',
    required: true,
    placeholder: '+593 99 888 7777',
  },
];

const VISIT_REASONS = [
  { id: 'Relaxation', labelEs: 'Relajación', labelEn: 'Relaxation' },
  { id: 'Stress', labelEs: 'Estrés', labelEn: 'Stress' },
  { id: 'Muscle pain', labelEs: 'Dolor muscular', labelEn: 'Muscle pain' },
  { id: 'Rest', labelEs: 'Descanso', labelEn: 'Rest' },
  { id: 'Gift', labelEs: 'Regalo', labelEn: 'Gift' },
  { id: 'General well-being', labelEs: 'Bienestar general', labelEn: 'General well-being' },
  {
    id: 'Traditional experience',
    labelEs: 'Experiencia tradicional',
    labelEn: 'Traditional experience',
  },
  { id: 'Other', labelEs: 'Otro', labelEn: 'Other' },
];

interface MedicalItem {
  key: MedicalFlagKey;
  labelEs: string;
  labelEn: string;
  warning?: boolean;
  alertNote?: string;
  /** Campo de texto que se pide cuando la respuesta es SÍ. */
  detailsKey?: MedicalDetailsKey;
  /** Campo "legacy" de la ficha que se mantiene sincronizado con el detalle. */
  legacyDetailsKey?: 'surgeriesDetails' | 'otherAllergies';
  detailsPlaceholderEs?: string;
  detailsPlaceholderEn?: string;
}

const MEDICAL_ITEMS: MedicalItem[] = [
  {
    key: 'highBloodPressure',
    labelEs: 'Presión arterial alta / Hipertensión',
    labelEn: 'High blood pressure',
  },
  {
    key: 'heartProblems',
    labelEs: 'Problemas cardíacos',
    labelEn: 'Heart problems',
    warning: true,
    alertNote: 'Requiere técnica circulatoria suave; omitir cambios bruscos de temperatura.',
  },
  { key: 'diabetes', labelEs: 'Diabetes', labelEn: 'Diabetes' },
  {
    key: 'circulatoryProblems',
    labelEs: 'Problemas circulatorios',
    labelEn: 'Circulatory problems',
  },
  {
    key: 'thrombosisVaricose',
    labelEs: 'Trombosis o várices severas',
    labelEn: 'Thrombosis or severe varicose veins',
    warning: true,
    alertNote:
      'Contraindicado masaje profundo y piedras calientes directas en extremidades afectadas.',
  },
  {
    key: 'epilepsy',
    labelEs: 'Epilepsia',
    labelEn: 'Epilepsy',
    warning: true,
    alertNote: 'Evitar estímulos lumínicos repentinos o aromaterapia estimulante.',
  },
  { key: 'asthma', labelEs: 'Asma', labelEn: 'Asthma' },
  {
    key: 'respiratoryProblems',
    labelEs: 'Problemas respiratorios',
    labelEn: 'Respiratory problems',
  },
  {
    key: 'spinalProblems',
    labelEs: 'Problemas en la columna (hernias, escoliosis, lumbalgia)',
    labelEn: 'Spinal problems (hernias, scoliosis, disc issues)',
    warning: true,
    alertNote: 'Lisett adaptará la alineación postural y quirotermia descontracturante.',
  },
  {
    key: 'recentMuscleInjuries',
    labelEs: 'Lesiones musculares recientes (desgarros, contracturas agudas)',
    labelEn: 'Recent muscle injuries',
  },
  {
    key: 'recentFractures',
    labelEs: 'Fracturas recientes o fisuras óseas',
    labelEn: 'Recent fractures',
    warning: true,
    alertNote: 'Se excluirá la zona afectada de presión directa.',
  },
  {
    key: 'surgeriesLast12Months',
    labelEs: 'Cirugías en los últimos 12 meses',
    labelEn: 'Surgeries in the last 12 months',
    detailsKey: 'surgeriesDetails',
    legacyDetailsKey: 'surgeriesDetails',
    detailsPlaceholderEs: 'Especificar tipo de cirugía (cesárea, estética, rodilla...)',
    detailsPlaceholderEn: 'Specify surgery type (c-section, cosmetic, knee...)',
  },
  {
    key: 'skinConditions',
    labelEs: 'Condiciones en la piel (eccemas, psoriasis, dermatitis, heridas)',
    labelEn: 'Skin conditions',
  },
  {
    key: 'allergies',
    labelEs: 'Alergias (aceites botánicos, frutos secos/almendra, lavanda, látex)',
    labelEn: 'Allergies',
    detailsKey: 'allergiesDetails',
    legacyDetailsKey: 'otherAllergies',
    detailsPlaceholderEs: 'Especificar sustancias alérgenas',
    detailsPlaceholderEn: 'Specify allergen substances',
  },
  {
    key: 'pregnancy',
    labelEs: 'Embarazo',
    labelEn: 'Pregnancy',
    warning: true,
    alertNote: 'Protocolo de maternidad: sin calor excesivo ni presión en puntos uterinos.',
  },
  { key: 'breastfeeding', labelEs: 'Lactancia materna', labelEn: 'Breastfeeding' },
  {
    key: 'cancerHistory',
    labelEs: 'Cáncer o antecedentes recientes de cáncer',
    labelEn: 'Cancer or recent history of cancer',
    warning: true,
    alertNote: 'Protocolo oncológico gentil sin estimulación linfática vigorosa.',
  },
  {
    key: 'currentMedications',
    labelEs: 'Medicamentos actuales (anticoagulantes, antihipertensivos, etc.)',
    labelEn: 'Current medications',
    detailsKey: 'medicationsDetails',
    detailsPlaceholderEs: 'Indicar medicamentos que tomas actualmente',
    detailsPlaceholderEn: 'Indicate medications currently taken',
  },
  {
    key: 'pacemakerDevices',
    labelEs: 'Marcapasos u otros dispositivos médicos implantados',
    labelEn: 'Pacemaker or other medical devices',
    warning: true,
    alertNote: 'Se omiten terapias con electromagnetismo o dispositivos vibratorios.',
  },
  {
    key: 'otherConditions',
    labelEs: 'Otras condiciones relevantes',
    labelEn: 'Other relevant conditions',
    detailsKey: 'otherConditionsDetails',
    detailsPlaceholderEs: 'Detallar cualquier otra condición o antecedente de salud',
    detailsPlaceholderEn: 'Detail any other health condition or history',
  },
];

/** Condiciones que activan el indicador legacy `hasMedicalConditions`. */
const CONDITION_FLAGS: MedicalFlagKey[] = [
  'highBloodPressure',
  'heartProblems',
  'diabetes',
  'circulatoryProblems',
  'thrombosisVaricose',
  'epilepsy',
  'asthma',
  'spinalProblems',
  'pacemakerDevices',
];

const BODY_AREAS = [
  { id: 'cervical_neck', labelEs: 'Cuello & Cervical', labelEn: 'Neck & Cervical' },
  { id: 'shoulders', labelEs: 'Hombros & Escápulas', labelEn: 'Shoulders & Blades' },
  { id: 'upper_back', labelEs: 'Espalda Alta & Trapecios', labelEn: 'Upper Back & Trapezius' },
  { id: 'lower_back', labelEs: 'Espalda Baja & Lumbar', labelEn: 'Lower Back & Lumbar' },
  { id: 'glutes_hips', labelEs: 'Glúteos & Caderas', labelEn: 'Glutes & Hips' },
  { id: 'legs_thighs', labelEs: 'Piernas & Muslos cansados', labelEn: 'Legs & Hamstrings' },
  { id: 'feet_soles', labelEs: 'Pies & Puntos Reflejos', labelEn: 'Feet & Reflex Points' },
  { id: 'arms_hands', labelEs: 'Brazos, Antebrazos & Manos', labelEn: 'Arms & Hands' },
  {
    id: 'head_scalp',
    labelEs: 'Cráneo & Puntos Craneales (Access)',
    labelEn: 'Head & Cranial Points',
  },
  { id: 'face_jaw', labelEs: 'Rostro & Mandíbula (Bruxismo)', labelEn: 'Face & Jaw Tension' },
];

const PRESSURE_OPTIONS: {
  id: PressurePreference;
  labelEs: string;
  labelEn: string;
  descEs: string;
  descEn: string;
}[] = [
  {
    id: 'gentle',
    labelEs: 'Suave & Relajante',
    labelEn: 'Gentle & Soothing',
    descEs: 'Caricias envolventes, drenaje suave',
    descEn: 'Feather-touch, gentle gliding',
  },
  {
    id: 'medium',
    labelEs: 'Media Terapéutica',
    labelEn: 'Medium Therapeutic',
    descEs: 'Equilibrio entre descanso y descontractura',
    descEn: 'Balanced release & relaxation',
  },
  {
    id: 'firm',
    labelEs: 'Firme & Enfocada',
    labelEn: 'Firm & Targeted',
    descEs: 'Presión en nódulos y contracturas',
    descEn: 'Direct knot & trigger work',
  },
  {
    id: 'deep',
    labelEs: 'Deep Tissue Intenso',
    labelEn: 'Intense Deep Tissue',
    descEs: 'Presión profunda miofascial',
    descEn: 'Deep fascial & muscular',
  },
];

const sectionCard = 'bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d7c5] shadow-xs';

export const HealthAssessmentForm: React.FC<HealthAssessmentFormProps> = ({
  lang,
  assessment,
  setAssessment,
  treatmentName,
  onNext,
  onBack,
}) => {
  const es = lang === 'es';

  const setField = (key: TextFieldKey, value: string) =>
    setAssessment((prev) => ({ ...prev, [key]: value }));

  const handleDateOfBirth = (dob: string) => {
    const calculatedAge = dob
      ? `${Math.max(0, new Date().getFullYear() - new Date(dob).getFullYear())}`
      : '';
    setAssessment((prev) => ({
      ...prev,
      dateOfBirth: dob,
      age: calculatedAge || prev.age,
    }));
  };

  const toggleVisitReason = (reasonId: string) => {
    setAssessment((prev) => {
      const list = prev.visitReasons || [];
      return {
        ...prev,
        visitReasons: list.includes(reasonId)
          ? list.filter((r) => r !== reasonId)
          : [...list, reasonId],
      };
    });
  };

  const setMedicalCheckValue = (key: MedicalFlagKey, val: boolean) => {
    setAssessment((prev) => {
      const updatedChecklist = { ...prev.medicalChecklist, [key]: val };

      // Keep legacy fields synchronized
      return {
        ...prev,
        medicalChecklist: updatedChecklist,
        isPregnant: key === 'pregnancy' ? val : prev.isPregnant,
        hasAllergies: key === 'allergies' ? val : prev.hasAllergies,
        hasSurgeries: key === 'surgeriesLast12Months' ? val : prev.hasSurgeries,
        hasMedicalConditions: CONDITION_FLAGS.some((flag) => updatedChecklist[flag]),
      };
    });
  };

  const setMedicalDetails = (item: MedicalItem, value: string) => {
    if (!item.detailsKey) return;
    const detailsKey = item.detailsKey;
    setAssessment((prev) => ({
      ...prev,
      medicalChecklist: { ...prev.medicalChecklist, [detailsKey]: value },
      // keep legacy sync
      ...(item.legacyDetailsKey ? { [item.legacyDetailsKey]: value } : {}),
    }));
  };

  /** Alterna una zona: neutro → enfocar → evitar → neutro. */
  const toggleFocusArea = (areaLabel: string) => {
    setAssessment((prev) => {
      const isFocus = prev.focusAreas.includes(areaLabel);
      const isAvoid = prev.avoidAreas.includes(areaLabel);

      if (!isFocus && !isAvoid) {
        return { ...prev, focusAreas: [...prev.focusAreas, areaLabel] };
      }
      if (isFocus) {
        return {
          ...prev,
          focusAreas: prev.focusAreas.filter((a) => a !== areaLabel),
          avoidAreas: [...prev.avoidAreas, areaLabel],
        };
      }
      return { ...prev, avoidAreas: prev.avoidAreas.filter((a) => a !== areaLabel) };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with Title and Form Date */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ebe1] text-[#8e5d43] text-xs font-semibold tracking-wider uppercase">
            <span>Paso 2 de 4</span> · <span>Ficha Clínica del Cliente</span>
          </div>

          <div className="flex items-center gap-2 bg-[#faf7f2] px-3.5 py-1.5 rounded-xl border border-[#ede5d8]">
            <Calendar className="w-4 h-4 text-[#8e5d43]" />
            <span className="text-xs font-bold text-[#4a453e]">
              {es ? 'FECHA / DATE:' : 'DATE:'}
            </span>
            <input
              type="date"
              value={assessment.intakeDate || toISODate()}
              onChange={(e) => setAssessment((prev) => ({ ...prev, intakeDate: e.target.value }))}
              className="text-xs font-semibold text-[#2d2a26] bg-transparent border-b border-[#c5a059] focus:outline-none"
            />
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#2d2a26]">
          {es ? 'Ficha de Información Personal y de Salud' : 'Client Profile & Medical Intake Form'}
        </h2>
        <p className="text-sm text-[#615a51] mt-1 font-light leading-relaxed">
          {es
            ? `Sesión seleccionada: ${treatmentName}. Por favor proporciona tus datos completos y marca SÍ o NO en el cuestionario médico para tu máxima seguridad y bienestar.`
            : `Selected treatment: ${treatmentName}. Please complete your personal profile and check YES or NO on the medical screening questionnaire.`}
        </p>
      </div>

      {/* SECTION 1: PERSONAL DEMOGRAPHIC & CONTACT INFORMATION */}
      <div className={`${sectionCard} space-y-5`}>
        <SectionHeader
          icon={<User className="w-5 h-5 text-[#8e5d43]" />}
          iconClass="bg-[#faf7f2] text-[#415344] border border-[#d8ccbc]"
          title={es ? '1. Información del Cliente' : '1. Client Profile Information'}
          subtitle={
            es
              ? 'Datos para registro oficial de sesión y contacto directo.'
              : 'Official booking registry and emergency contact details.'
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PERSONAL_FIELDS.map((f) => (
            <Field
              key={f.key}
              className={f.wide ? 'sm:col-span-2' : undefined}
              label={es ? f.labelEs : f.labelEn}
              type={f.type}
              required={f.required}
              placeholder={f.placeholder}
              icon={f.icon}
              min={f.min}
              max={f.max}
              value={assessment[f.key]}
              onChange={f.key === 'dateOfBirth' ? handleDateOfBirth : (v) => setField(f.key, v)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: MOTIVATION & GOALS */}
      <div className={`${sectionCard} space-y-5`}>
        <SectionHeader
          icon={<Sparkles className="w-5 h-5 text-[#8e5d43]" />}
          iconClass="bg-[#f4ebe1] text-[#8e5d43]"
          title={es ? '2. Motivo de tu Visita & Expectativas' : '2. Motivation & Expected Goals'}
          subtitle={
            es
              ? '¿Qué te trae a nuestro spa hoy y qué esperas obtener de esta experiencia?'
              : 'What brings you to our spa today and what do you hope to gain from this experience?'
          }
        />

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#4a453e] uppercase tracking-wider block">
            {es
              ? '¿Qué te trae a nuestro spa hoy? / What brings you to our spa today?'
              : 'What brings you to our spa today?'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VISIT_REASONS.map((opt) => {
              const isSelected = (assessment.visitReasons || []).includes(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleVisitReason(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#415344] text-white border-[#415344] shadow-xs'
                      : 'bg-[#faf8f5] hover:bg-[#f0eae1] text-[#4a453e] border-[#d8ccbc]'
                  }`}
                >
                  <span>{es ? opt.labelEs : opt.labelEn}</span>
                  <span className={`text-xs ${isSelected ? 'text-[#ebd8b1]' : 'text-gray-400'}`}>
                    {isSelected ? '✓' : '□'}
                  </span>
                </button>
              );
            })}
          </div>

          {(assessment.visitReasons || []).includes('Other') && (
            <div className="pt-2">
              <Field
                label={es ? 'Por favor especifica tu motivo / Please specify:' : 'Please specify:'}
                labelClassName="text-xs font-semibold text-[#8e5d43] block mb-1"
                placeholder="Especifica aquí tu motivo..."
                value={assessment.otherVisitReason || ''}
                onChange={(v) => setAssessment((prev) => ({ ...prev, otherVisitReason: v }))}
              />
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#f5ede2]">
          <label className="text-xs font-bold text-[#4a453e] uppercase tracking-wider block mb-1.5">
            {es
              ? '¿Qué esperas obtener de esta experiencia? / What do you hope to gain from this experience?'
              : 'What do you hope to gain from this experience?'}
          </label>
          <textarea
            rows={3}
            value={assessment.expectedOutcome || ''}
            onChange={(e) =>
              setAssessment((prev) => ({ ...prev, expectedOutcome: e.target.value }))
            }
            placeholder={
              es
                ? 'Ej. Desconectar de la mente, aliviar contracturas en espalda, sentir ligereza en las piernas, renovación emocional...'
                : 'E.g., Mental quiet, knot relief in upper back, light legs, energetic renewal...'
            }
            className={inputClassLg}
          />
        </div>
      </div>

      {/* SECTION 3: COMPREHENSIVE MEDICAL SCREENING (CHECK YES OR NO) */}
      <div className={`${sectionCard} space-y-6`}>
        <SectionHeader
          icon={<Activity className="w-5 h-5" />}
          iconClass="bg-rose-50 text-rose-700"
          title={
            es ? '3. Cuestionario de Salud: Marca SÍ o NO' : '3. Medical Screening: Check YES or NO'
          }
          subtitle={
            es
              ? 'Por favor responde honestamente a cada una de las siguientes condiciones para garantizar una sesión segura.'
              : 'Please answer each condition honestly to ensure a tailored, clinically safe therapy session.'
          }
        />

        <div className="divide-y divide-[#f0eae1] border border-[#e2d7c5] rounded-2xl overflow-hidden bg-[#faf8f5]">
          {MEDICAL_ITEMS.map((item, idx) => {
            const currentVal = assessment.medicalChecklist?.[item.key];
            const isYes = currentVal === true;
            const isNo = currentVal === false;

            return (
              <div
                key={item.key}
                className={`p-3.5 sm:p-4 transition-colors ${
                  isYes ? 'bg-amber-50/70' : idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#2d2a26]">
                        {es ? item.labelEs : item.labelEn}
                      </span>
                      {isYes && item.warning && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          Alerta Clínica
                        </span>
                      )}
                    </div>
                    {isYes && item.alertNote && (
                      <p className="text-[11px] text-amber-900 mt-1 italic font-medium">
                        ✦ {item.alertNote}
                      </p>
                    )}
                  </div>

                  {/* YES / NO Toggle Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMedicalCheckValue(item.key, true)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isYes
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-white hover:bg-rose-50 text-[#5a534b] border border-[#d8ccbc]'
                      }`}
                    >
                      <span>{isYes ? '✓' : '□'}</span>
                      <span>{es ? 'SÍ' : 'YES'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMedicalCheckValue(item.key, false)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isNo
                          ? 'bg-[#415344] text-white shadow-xs'
                          : 'bg-white hover:bg-[#f0eae1] text-[#5a534b] border border-[#d8ccbc]'
                      }`}
                    >
                      <span>{isNo ? '✓' : '□'}</span>
                      <span>NO</span>
                    </button>
                  </div>
                </div>

                {/* Details input when YES is checked for items requiring details */}
                {isYes && item.detailsKey && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200">
                    <input
                      type="text"
                      value={assessment.medicalChecklist?.[item.detailsKey] || ''}
                      onChange={(e) => setMedicalDetails(item, e.target.value)}
                      placeholder={es ? item.detailsPlaceholderEs : item.detailsPlaceholderEn}
                      className="w-full p-2 bg-white rounded-lg border border-amber-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: BODY PARTS MAP - FOCUS VS AVOID */}
      <div className={`${sectionCard} space-y-5`}>
        <SectionHeader
          icon="✦"
          iconClass="bg-[#415344] text-[#c5a059]"
          title={
            es
              ? '4. Zonas Corporales: ¿Dónde Enfocar o Evitar?'
              : '4. Target Body Areas: Focus & Avoid Map'
          }
          subtitle={
            es
              ? 'Haz clic para alternar: 🟢 Enfocar con dedicación · 🔴 Evitar o tratar con suavidad · ⚪ Normal.'
              : 'Click to cycle: 🟢 Priority Focus · 🔴 Avoid or delicate · ⚪ Standard.'
          }
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-[#faf8f5] p-3 rounded-xl border border-[#ede5d8]">
          <span className="flex items-center gap-1.5 font-medium text-emerald-800">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            {es ? 'Enfocar más tiempo' : 'Target / More focus'}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-800">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            {es ? 'Evitar / Zona delicada' : 'Avoid / Delicate'}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#7d7468]">
            <span className="w-3 h-3 rounded-full bg-[#d8ccbc] inline-block" />
            {es ? 'Estándar habitual' : 'Standard attention'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BODY_AREAS.map((area) => {
            const areaName = es ? area.labelEs : area.labelEn;
            const isFocus = assessment.focusAreas.includes(areaName);
            const isAvoid = assessment.avoidAreas.includes(areaName);

            let bgClass = 'bg-[#faf8f5] hover:bg-[#f0eae1] border-[#e2d7c5] text-[#3e3831]';
            let statusBadge = (
              <span className="text-[11px] text-[#91877a] font-normal">
                {es ? 'Neutro' : 'Standard'}
              </span>
            );

            if (isFocus) {
              bgClass =
                'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300 shadow-xs';
              statusBadge = (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-semibold">
                  {es ? '🟢 ENFOCAR' : '🟢 FOCUS'}
                </span>
              );
            } else if (isAvoid) {
              bgClass =
                'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-1 ring-rose-300 shadow-xs';
              statusBadge = (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-semibold">
                  {es ? '🔴 EVITAR' : '🔴 AVOID'}
                </span>
              );
            }

            return (
              <button
                key={area.id}
                type="button"
                onClick={() => toggleFocusArea(areaName)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${bgClass}`}
              >
                <span className="text-xs sm:text-sm">{areaName}</span>
                {statusBadge}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: PRESSURE PREFERENCE & INTENTION */}
      <div className={`${sectionCard} space-y-6`}>
        <SectionHeader
          icon={<Sparkles className="w-5 h-5 text-[#8e5d43]" />}
          iconClass="bg-[#f4ebe1] text-[#8e5d43]"
          title={
            es
              ? '5. Preferencia de Presión & Nivel de Estrés'
              : '5. Pressure Preference & Stress Level'
          }
          subtitle={
            es
              ? 'Personalizamos la intensidad física de cada maniobra.'
              : 'Customizing physical pressure and therapeutic tactile tempo.'
          }
        />

        <div>
          <label className="text-xs font-semibold text-[#5a534b] uppercase tracking-wider block mb-2.5">
            {es ? 'Presión del masaje preferida:' : 'Preferred pressure:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {PRESSURE_OPTIONS.map((p) => {
              const isSelected = assessment.pressurePreference === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAssessment((prev) => ({ ...prev, pressurePreference: p.id }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#415344] text-white border-[#415344] shadow-xs'
                      : 'bg-[#faf8f5] hover:bg-[#f0eae1] text-[#3e3831] border-[#d8ccbc]'
                  }`}
                >
                  <span className="block text-xs font-bold mb-0.5">
                    {es ? p.labelEs : p.labelEn}
                  </span>
                  <span
                    className={`block text-[11px] leading-tight ${
                      isSelected ? 'text-[#e5dcce]' : 'text-[#7d7468]'
                    }`}
                  >
                    {es ? p.descEs : p.descEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stress Level */}
        <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ede5d8]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#415344] uppercase tracking-wider">
              {es
                ? 'Nivel de estrés o sobrecarga actual (1 al 10):'
                : 'Current stress level (1 to 10):'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#415344] text-white text-xs font-bold">
              {assessment.currentStressLevel} / 10
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={assessment.currentStressLevel}
            onChange={(e) =>
              setAssessment((prev) => ({ ...prev, currentStressLevel: parseInt(e.target.value) }))
            }
            className="w-full accent-[#415344] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-[#8e8477] mt-1 font-medium">
            <span>1 - {es ? 'Calma' : 'Calm'}</span>
            <span>5 - {es ? 'Tensión laboral' : 'Moderate'}</span>
            <span>10 - {es ? 'Agotamiento agudo' : 'Exhaustion'}</span>
          </div>
        </div>

        {/* Special Notes */}
        <div>
          <label className="text-xs font-semibold text-[#5a534b] uppercase tracking-wider block mb-1.5">
            {es
              ? 'Detalles o peticiones especiales para Lisett Morante:'
              : 'Special notes or requests for Lisett:'}
          </label>
          <textarea
            rows={2}
            value={assessment.specialNotes}
            onChange={(e) => setAssessment((prev) => ({ ...prev, specialNotes: e.target.value }))}
            placeholder={
              es
                ? 'Ej. temperatura de cabina, música suave, primera vez en terapia energética...'
                : 'E.g. room temperature, soft music, first time in energy session...'
            }
            className={inputClassLg}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <BackButton onClick={onBack}>
          {es ? 'Cambiar Tratamiento' : 'Back to Treatments'}
        </BackButton>
        <NextButton onClick={onNext}>
          {es ? 'Ver Disponibilidad de Horarios' : 'Next: Check Availability'}
        </NextButton>
      </div>
    </div>
  );
};
