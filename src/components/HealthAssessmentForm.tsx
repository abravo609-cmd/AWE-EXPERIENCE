import React from 'react';
import { HealthAssessment } from '../types/spa';
import {
  AlertTriangle,
  Heart,
  Baby,
  Activity,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  AlertOctagon,
} from 'lucide-react';

interface HealthAssessmentFormProps {
  lang: 'es' | 'en';
  assessment: HealthAssessment;
  setAssessment: React.Dispatch<React.SetStateAction<HealthAssessment>>;
  treatmentName: string;
  onNext: () => void;
  onBack: () => void;
}

export const HealthAssessmentForm: React.FC<HealthAssessmentFormProps> = ({
  lang,
  assessment,
  setAssessment,
  treatmentName,
  onNext,
  onBack,
}) => {
  const visitReasonOptions = [
    { id: 'Relaxation', labelEs: 'Relajación', labelEn: 'Relaxation' },
    { id: 'Stress', labelEs: 'Estrés', labelEn: 'Stress' },
    { id: 'Muscle pain', labelEs: 'Dolor muscular', labelEn: 'Muscle pain' },
    { id: 'Rest', labelEs: 'Descanso', labelEn: 'Rest' },
    { id: 'Gift', labelEs: 'Regalo', labelEn: 'Gift' },
    { id: 'General well-being', labelEs: 'Bienestar general', labelEn: 'General well-being' },
    { id: 'Traditional experience', labelEs: 'Experiencia tradicional', labelEn: 'Traditional experience' },
    { id: 'Other', labelEs: 'Otro', labelEn: 'Other' },
  ];

  const medicalItems = [
    {
      key: 'highBloodPressure' as const,
      labelEs: 'Presión arterial alta / Hipertensión',
      labelEn: 'High blood pressure',
      warning: false,
    },
    {
      key: 'heartProblems' as const,
      labelEs: 'Problemas cardíacos',
      labelEn: 'Heart problems',
      warning: true,
      alertNote: 'Requiere técnica circulatoria suave; omitir cambios bruscos de temperatura.',
    },
    {
      key: 'diabetes' as const,
      labelEs: 'Diabetes',
      labelEn: 'Diabetes',
      warning: false,
    },
    {
      key: 'circulatoryProblems' as const,
      labelEs: 'Problemas circulatorios',
      labelEn: 'Circulatory problems',
      warning: false,
    },
    {
      key: 'thrombosisVaricose' as const,
      labelEs: 'Trombosis o várices severas',
      labelEn: 'Thrombosis or severe varicose veins',
      warning: true,
      alertNote: 'Contraindicado masaje profundo y piedras calientes directas en extremidades afectadas.',
    },
    {
      key: 'epilepsy' as const,
      labelEs: 'Epilepsia',
      labelEn: 'Epilepsy',
      warning: true,
      alertNote: 'Evitar estímulos lumínicos repentinos o aromaterapia estimulante.',
    },
    {
      key: 'asthma' as const,
      labelEs: 'Asma',
      labelEn: 'Asthma',
      warning: false,
    },
    {
      key: 'respiratoryProblems' as const,
      labelEs: 'Problemas respiratorios',
      labelEn: 'Respiratory problems',
      warning: false,
    },
    {
      key: 'spinalProblems' as const,
      labelEs: 'Problemas en la columna (hernias, escoliosis, lumbalgia)',
      labelEn: 'Spinal problems (hernias, scoliosis, disc issues)',
      warning: true,
      alertNote: 'Lissett adaptará la alineación postural y quirotermia descontracturante.',
    },
    {
      key: 'recentMuscleInjuries' as const,
      labelEs: 'Lesiones musculares recientes (desgarros, contracturas agudas)',
      labelEn: 'Recent muscle injuries',
      warning: false,
    },
    {
      key: 'recentFractures' as const,
      labelEs: 'Fracturas recientes o fisuras óseas',
      labelEn: 'Recent fractures',
      warning: true,
      alertNote: 'Se excluirá la zona afectada de presión directa.',
    },
    {
      key: 'surgeriesLast12Months' as const,
      labelEs: 'Cirugías en los últimos 12 meses',
      labelEn: 'Surgeries in the last 12 months',
      hasDetails: true,
      detailsPlaceholderEs: 'Especificar tipo de cirugía (cesárea, estética, rodilla...)',
      detailsPlaceholderEn: 'Specify surgery type (c-section, cosmetic, knee...)',
    },
    {
      key: 'skinConditions' as const,
      labelEs: 'Condiciones en la piel (eccemas, psoriasis, dermatitis, heridas)',
      labelEn: 'Skin conditions',
      warning: false,
    },
    {
      key: 'allergies' as const,
      labelEs: 'Alergias (aceites botánicos, frutos secos/almendra, lavanda, látex)',
      labelEn: 'Allergies',
      hasDetails: true,
      detailsPlaceholderEs: 'Especificar sustancias alérgenas',
      detailsPlaceholderEn: 'Specify allergen substances',
    },
    {
      key: 'pregnancy' as const,
      labelEs: 'Embarazo',
      labelEn: 'Pregnancy',
      warning: true,
      alertNote: 'Protocolo de maternidad: sin calor excesivo ni presión en puntos uterinos.',
    },
    {
      key: 'breastfeeding' as const,
      labelEs: 'Lactancia materna',
      labelEn: 'Breastfeeding',
      warning: false,
    },
    {
      key: 'cancerHistory' as const,
      labelEs: 'Cáncer o antecedentes recientes de cáncer',
      labelEn: 'Cancer or recent history of cancer',
      warning: true,
      alertNote: 'Protocolo oncológico gentil sin estimulación linfática vigorosa.',
    },
    {
      key: 'currentMedications' as const,
      labelEs: 'Medicamentos actuales (anticoagulantes, antihipertensivos, etc.)',
      labelEn: 'Current medications',
      hasDetails: true,
      detailsPlaceholderEs: 'Indicar medicamentos que tomas actualmente',
      detailsPlaceholderEn: 'Indicate medications currently taken',
    },
    {
      key: 'pacemakerDevices' as const,
      labelEs: 'Marcapasos u otros dispositivos médicos implantados',
      labelEn: 'Pacemaker or other medical devices',
      warning: true,
      alertNote: 'Se omiten terapias con electromagnetismo o dispositivos vibratorios.',
    },
    {
      key: 'otherConditions' as const,
      labelEs: 'Otras condiciones relevantes',
      labelEn: 'Other relevant conditions',
      hasDetails: true,
      detailsPlaceholderEs: 'Detallar cualquier otra condición o antecedente de salud',
      detailsPlaceholderEn: 'Detail any other health condition or history',
    },
  ];

  const bodyAreas = [
    { id: 'cervical_neck', labelEs: 'Cuello & Cervical', labelEn: 'Neck & Cervical' },
    { id: 'shoulders', labelEs: 'Hombros & Escápulas', labelEn: 'Shoulders & Blades' },
    { id: 'upper_back', labelEs: 'Espalda Alta & Trapecios', labelEn: 'Upper Back & Trapezius' },
    { id: 'lower_back', labelEs: 'Espalda Baja & Lumbar', labelEn: 'Lower Back & Lumbar' },
    { id: 'glutes_hips', labelEs: 'Glúteos & Caderas', labelEn: 'Glutes & Hips' },
    { id: 'legs_thighs', labelEs: 'Piernas & Muslos cansados', labelEn: 'Legs & Hamstrings' },
    { id: 'feet_soles', labelEs: 'Pies & Puntos Reflejos', labelEn: 'Feet & Reflex Points' },
    { id: 'arms_hands', labelEs: 'Brazos, Antebrazos & Manos', labelEn: 'Arms & Hands' },
    { id: 'head_scalp', labelEs: 'Cráneo & Puntos Craneales (Access)', labelEn: 'Head & Cranial Points' },
    { id: 'face_jaw', labelEs: 'Rostro & Mandíbula (Bruxismo)', labelEn: 'Face & Jaw Tension' },
  ];

  const toggleVisitReason = (reasonId: string) => {
    const list = assessment.visitReasons || [];
    const exists = list.includes(reasonId);
    const updated = exists ? list.filter((r) => r !== reasonId) : [...list, reasonId];
    setAssessment((prev) => ({
      ...prev,
      visitReasons: updated,
    }));
  };

  const setMedicalCheckValue = (key: keyof typeof assessment.medicalChecklist, val: boolean) => {
    setAssessment((prev) => {
      const updatedChecklist = {
        ...prev.medicalChecklist,
        [key]: val,
      };

      // Keep legacy fields synchronized
      return {
        ...prev,
        medicalChecklist: updatedChecklist,
        isPregnant: key === 'pregnancy' ? val : prev.isPregnant,
        hasAllergies: key === 'allergies' ? val : prev.hasAllergies,
        hasSurgeries: key === 'surgeriesLast12Months' ? val : prev.hasSurgeries,
        hasMedicalConditions:
          updatedChecklist.highBloodPressure ||
          updatedChecklist.heartProblems ||
          updatedChecklist.diabetes ||
          updatedChecklist.circulatoryProblems ||
          updatedChecklist.thrombosisVaricose ||
          updatedChecklist.epilepsy ||
          updatedChecklist.asthma ||
          updatedChecklist.spinalProblems ||
          updatedChecklist.pacemakerDevices ||
          false,
      };
    });
  };

  const toggleFocusArea = (areaLabel: string) => {
    const isFocus = assessment.focusAreas.includes(areaLabel);
    const isAvoid = assessment.avoidAreas.includes(areaLabel);

    if (!isFocus && !isAvoid) {
      setAssessment((prev) => ({
        ...prev,
        focusAreas: [...prev.focusAreas, areaLabel],
      }));
    } else if (isFocus) {
      setAssessment((prev) => ({
        ...prev,
        focusAreas: prev.focusAreas.filter((a) => a !== areaLabel),
        avoidAreas: [...prev.avoidAreas, areaLabel],
      }));
    } else {
      setAssessment((prev) => ({
        ...prev,
        avoidAreas: prev.avoidAreas.filter((a) => a !== areaLabel),
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with Title and Form Date */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2d7c5] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ebe1] text-[#8e5d43] text-xs font-semibold tracking-wider uppercase">
            <span>Paso 2 de 4</span> · <span>Ficha Clínica del Cliente</span>
          </div>

          {/* DATE: ____ / ____ / ______ */}
          <div className="flex items-center gap-2 bg-[#faf7f2] px-3.5 py-1.5 rounded-xl border border-[#ede5d8]">
            <Calendar className="w-4 h-4 text-[#8e5d43]" />
            <span className="text-xs font-bold text-[#4a453e]">
              {lang === 'es' ? 'FECHA / DATE:' : 'DATE:'}
            </span>
            <input
              type="date"
              value={assessment.intakeDate || new Date().toISOString().split('T')[0]}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, intakeDate: e.target.value }))
              }
              className="text-xs font-semibold text-[#2d2a26] bg-transparent border-b border-[#c5a059] focus:outline-none"
            />
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#2d2a26]">
          {lang === 'es' ? 'Ficha de Información Personal y de Salud' : 'Client Profile & Medical Intake Form'}
        </h2>
        <p className="text-sm text-[#615a51] mt-1 font-light leading-relaxed">
          {lang === 'es'
            ? `Sesión seleccionada: ${treatmentName}. Por favor proporciona tus datos completos y marca SÍ o NO en el cuestionario médico para tu máxima seguridad y bienestar.`
            : `Selected treatment: ${treatmentName}. Please complete your personal profile and check YES or NO on the medical screening questionnaire.`}
        </p>
      </div>

      {/* SECTION 1: PERSONAL DEMOGRAPHIC & CONTACT INFORMATION */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f0eae1]">
          <div className="w-9 h-9 rounded-full bg-[#faf7f2] text-[#415344] border border-[#d8ccbc] flex items-center justify-center font-bold">
            <User className="w-5 h-5 text-[#8e5d43]" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#2d2a26]">
              {lang === 'es' ? '1. Información del Cliente' : '1. Client Profile Information'}
            </h3>
            <p className="text-xs text-[#736c63]">
              {lang === 'es'
                ? 'Datos para registro oficial de sesión y contacto directo.'
                : 'Official booking registry and emergency contact details.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* First and Last Names */}
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#4a453e] block mb-1">
              {lang === 'es' ? 'Nombres y Apellidos / First and Last Names *' : 'First and Last Names *'}
            </label>
            <input
              type="text"
              required
              value={assessment.fullName}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="Ej. Valeria Sofía Mendoza Castro"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* ID Number */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1">
              {lang === 'es' ? 'Cédula / Pasaporte / ID Number *' : 'ID Number (Passport / National ID) *'}
            </label>
            <input
              type="text"
              required
              value={assessment.idNumber}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, idNumber: e.target.value }))
              }
              placeholder="1718293041"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1">
              {lang === 'es' ? 'Fecha de Nacimiento / Date of Birth' : 'Date of Birth'}
            </label>
            <input
              type="date"
              value={assessment.dateOfBirth}
              onChange={(e) => {
                const dob = e.target.value;
                let calculatedAge = '';
                if (dob) {
                  const birthYear = new Date(dob).getFullYear();
                  const currentYear = new Date().getFullYear();
                  calculatedAge = `${Math.max(0, currentYear - birthYear)}`;
                }
                setAssessment((prev) => ({
                  ...prev,
                  dateOfBirth: dob,
                  age: calculatedAge || prev.age,
                }));
              }}
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1">
              {lang === 'es' ? 'Edad / Age' : 'Age'}
            </label>
            <input
              type="number"
              min="1"
              max="115"
              value={assessment.age}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, age: e.target.value }))
              }
              placeholder="Ej. 35"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1">
              {lang === 'es' ? 'Nacionalidad / Nationality' : 'Nationality'}
            </label>
            <input
              type="text"
              value={assessment.nationality}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, nationality: e.target.value }))
              }
              placeholder="Ej. Ecuatoriana"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#8e5d43]" />
              {lang === 'es' ? 'Número de Teléfono / Phone Number *' : 'Phone Number *'}
            </label>
            <input
              type="tel"
              required
              value={assessment.phoneNumber}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
              placeholder="+593 99 000 0000"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#8e5d43]" />
              {lang === 'es' ? 'Correo Electrónico / Email Address *' : 'Email Address *'}
            </label>
            <input
              type="email"
              required
              value={assessment.emailAddress}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, emailAddress: e.target.value }))
              }
              placeholder="cliente@ejemplo.com"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* City of Residence */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8e5d43]" />
              {lang === 'es' ? 'Ciudad de Residencia / City of Residence' : 'City of Residence'}
            </label>
            <input
              type="text"
              value={assessment.cityOfResidence}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, cityOfResidence: e.target.value }))
              }
              placeholder="Ej. Guayaquil / Quito"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#8e5d43]" />
              {lang === 'es' ? 'Ocupación / Occupation' : 'Occupation'}
            </label>
            <input
              type="text"
              value={assessment.occupation}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, occupation: e.target.value }))
              }
              placeholder="Ej. Diseñadora / Ejecutiva"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1">
              {lang === 'es' ? 'Contacto de Emergencia / Emergency Contact *' : 'Emergency Contact Name *'}
            </label>
            <input
              type="text"
              required
              value={assessment.emergencyContact}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, emergencyContact: e.target.value }))
              }
              placeholder="Ej. Carlos Mendoza (Esposo / Familiar)"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>

          {/* Emergency Phone Number */}
          <div>
            <label className="text-xs font-semibold text-[#4a453e] block mb-1">
              {lang === 'es' ? 'Teléfono de Emergencia / Emergency Phone Number *' : 'Emergency Phone Number *'}
            </label>
            <input
              type="tel"
              required
              value={assessment.emergencyPhoneNumber}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, emergencyPhoneNumber: e.target.value }))
              }
              placeholder="+593 99 888 7777"
              className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: MOTIVATION & GOALS */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f0eae1]">
          <div className="w-9 h-9 rounded-full bg-[#f4ebe1] text-[#8e5d43] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#8e5d43]" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#2d2a26]">
              {lang === 'es' ? '2. Motivo de tu Visita & Expectativas' : '2. Motivation & Expected Goals'}
            </h3>
            <p className="text-xs text-[#736c63]">
              {lang === 'es'
                ? '¿Qué te trae a nuestro spa hoy y qué esperas obtener de esta experiencia?'
                : 'What brings you to our spa today and what do you hope to gain from this experience?'}
            </p>
          </div>
        </div>

        {/* What brings you to our spa today? */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#4a453e] uppercase tracking-wider block">
            {lang === 'es'
              ? '¿Qué te trae a nuestro spa hoy? / What brings you to our spa today?'
              : 'What brings you to our spa today?'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {visitReasonOptions.map((opt) => {
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
                  <span>{lang === 'es' ? opt.labelEs : opt.labelEn}</span>
                  <span className={`text-xs ${isSelected ? 'text-[#ebd8b1]' : 'text-gray-400'}`}>
                    {isSelected ? '✓' : '□'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Other visit reason specify */}
          {(assessment.visitReasons || []).includes('Other') && (
            <div className="pt-2">
              <label className="text-xs font-semibold text-[#8e5d43] block mb-1">
                {lang === 'es' ? 'Por favor especifica tu motivo / Please specify:' : 'Please specify:'}
              </label>
              <input
                type="text"
                value={assessment.otherVisitReason || ''}
                onChange={(e) =>
                  setAssessment((prev) => ({ ...prev, otherVisitReason: e.target.value }))
                }
                placeholder="Especifica aquí tu motivo..."
                className="w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
              />
            </div>
          )}
        </div>

        {/* What do you hope to gain from this experience? */}
        <div className="pt-3 border-t border-[#f5ede2]">
          <label className="text-xs font-bold text-[#4a453e] uppercase tracking-wider block mb-1.5">
            {lang === 'es'
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
              lang === 'es'
                ? 'Ej. Desconectar de la mente, aliviar contracturas en espalda, sentir ligereza en las piernas, renovación emocional...'
                : 'E.g., Mental quiet, knot relief in upper back, light legs, energetic renewal...'
            }
            className="w-full p-3 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
          />
        </div>
      </div>

      {/* SECTION 3: COMPREHENSIVE MEDICAL SCREENING (CHECK YES OR NO) */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f0eae1]">
          <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#2d2a26]">
              {lang === 'es'
                ? '3. Cuestionario de Salud: Marca SÍ o NO'
                : '3. Medical Screening: Check YES or NO'}
            </h3>
            <p className="text-xs text-[#736c63]">
              {lang === 'es'
                ? 'Por favor responde honestamente a cada una de las siguientes condiciones para garantizar una sesión segura.'
                : 'Please answer each condition honestly to ensure a tailored, clinically safe therapy session.'}
            </p>
          </div>
        </div>

        {/* Medical Table / Cards */}
        <div className="divide-y divide-[#f0eae1] border border-[#e2d7c5] rounded-2xl overflow-hidden bg-[#faf8f5]">
          {medicalItems.map((item, idx) => {
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
                        {lang === 'es' ? item.labelEs : item.labelEn}
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
                      <span>{lang === 'es' ? 'SÍ' : 'YES'}</span>
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

                {/* Sub-inputs when YES is checked for items requiring details */}
                {isYes && item.hasDetails && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200">
                    <input
                      type="text"
                      value={
                        item.key === 'surgeriesLast12Months'
                          ? assessment.medicalChecklist?.surgeriesDetails || ''
                          : item.key === 'allergies'
                          ? assessment.medicalChecklist?.allergiesDetails || ''
                          : item.key === 'currentMedications'
                          ? assessment.medicalChecklist?.medicationsDetails || ''
                          : assessment.medicalChecklist?.otherConditionsDetails || ''
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setAssessment((prev) => ({
                          ...prev,
                          medicalChecklist: {
                            ...prev.medicalChecklist,
                            ...(item.key === 'surgeriesLast12Months'
                              ? { surgeriesDetails: val }
                              : item.key === 'allergies'
                              ? { allergiesDetails: val }
                              : item.key === 'currentMedications'
                              ? { medicationsDetails: val }
                              : { otherConditionsDetails: val }),
                          },
                          // keep legacy sync
                          ...(item.key === 'surgeriesLast12Months' ? { surgeriesDetails: val } : {}),
                          ...(item.key === 'allergies' ? { otherAllergies: val } : {}),
                        }));
                      }}
                      placeholder={lang === 'es' ? item.detailsPlaceholderEs : item.detailsPlaceholderEn}
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
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f0eae1]">
          <div className="w-9 h-9 rounded-full bg-[#415344] text-[#c5a059] flex items-center justify-center font-bold">
            ✦
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#2d2a26]">
              {lang === 'es'
                ? '4. Zonas Corporales: ¿Dónde Enfocar o Evitar?'
                : '4. Target Body Areas: Focus & Avoid Map'}
            </h3>
            <p className="text-xs text-[#736c63]">
              {lang === 'es'
                ? 'Haz clic para alternar: 🟢 Enfocar con dedicación · 🔴 Evitar o tratar con suavidad · ⚪ Normal.'
                : 'Click to cycle: 🟢 Priority Focus · 🔴 Avoid or delicate · ⚪ Standard.'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-[#faf8f5] p-3 rounded-xl border border-[#ede5d8]">
          <span className="flex items-center gap-1.5 font-medium text-emerald-800">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            {lang === 'es' ? 'Enfocar más tiempo' : 'Target / More focus'}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-800">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            {lang === 'es' ? 'Evitar / Zona delicada' : 'Avoid / Delicate'}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#7d7468]">
            <span className="w-3 h-3 rounded-full bg-[#d8ccbc] inline-block" />
            {lang === 'es' ? 'Estándar habitual' : 'Standard attention'}
          </span>
        </div>

        {/* Interactive Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bodyAreas.map((area) => {
            const areaName = lang === 'es' ? area.labelEs : area.labelEn;
            const isFocus = assessment.focusAreas.includes(areaName);
            const isAvoid = assessment.avoidAreas.includes(areaName);

            let bgClass = 'bg-[#faf8f5] hover:bg-[#f0eae1] border-[#e2d7c5] text-[#3e3831]';
            let statusBadge = (
              <span className="text-[11px] text-[#91877a] font-normal">
                {lang === 'es' ? 'Neutro' : 'Standard'}
              </span>
            );

            if (isFocus) {
              bgClass =
                'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300 shadow-xs';
              statusBadge = (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-semibold">
                  {lang === 'es' ? '🟢 ENFOCAR' : '🟢 FOCUS'}
                </span>
              );
            } else if (isAvoid) {
              bgClass =
                'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-1 ring-rose-300 shadow-xs';
              statusBadge = (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-semibold">
                  {lang === 'es' ? '🔴 EVITAR' : '🔴 AVOID'}
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
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d7c5] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f0eae1]">
          <div className="w-9 h-9 rounded-full bg-[#f4ebe1] text-[#8e5d43] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#8e5d43]" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#2d2a26]">
              {lang === 'es' ? '5. Preferencia de Presión & Nivel de Estrés' : '5. Pressure Preference & Stress Level'}
            </h3>
            <p className="text-xs text-[#736c63]">
              {lang === 'es'
                ? 'Personalizamos la intensidad física de cada maniobra.'
                : 'Customizing physical pressure and therapeutic tactile tempo.'}
            </p>
          </div>
        </div>

        {/* Pressure Preference */}
        <div>
          <label className="text-xs font-semibold text-[#5a534b] uppercase tracking-wider block mb-2.5">
            {lang === 'es' ? 'Presión del masaje preferida:' : 'Preferred pressure:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
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
            ].map((p) => {
              const isSelected = assessment.pressurePreference === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setAssessment((prev) => ({
                      ...prev,
                      pressurePreference: p.id as any,
                    }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#415344] text-white border-[#415344] shadow-xs'
                      : 'bg-[#faf8f5] hover:bg-[#f0eae1] text-[#3e3831] border-[#d8ccbc]'
                  }`}
                >
                  <span className="block text-xs font-bold mb-0.5">
                    {lang === 'es' ? p.labelEs : p.labelEn}
                  </span>
                  <span
                    className={`block text-[11px] leading-tight ${
                      isSelected ? 'text-[#e5dcce]' : 'text-[#7d7468]'
                    }`}
                  >
                    {lang === 'es' ? p.descEs : p.descEn}
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
              {lang === 'es' ? 'Nivel de estrés o sobrecarga actual (1 al 10):' : 'Current stress level (1 to 10):'}
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
              setAssessment((prev) => ({
                ...prev,
                currentStressLevel: parseInt(e.target.value),
              }))
            }
            className="w-full accent-[#415344] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-[#8e8477] mt-1 font-medium">
            <span>1 - {lang === 'es' ? 'Calma' : 'Calm'}</span>
            <span>5 - {lang === 'es' ? 'Tensión laboral' : 'Moderate'}</span>
            <span>10 - {lang === 'es' ? 'Agotamiento agudo' : 'Exhaustion'}</span>
          </div>
        </div>

        {/* Special Notes */}
        <div>
          <label className="text-xs font-semibold text-[#5a534b] uppercase tracking-wider block mb-1.5">
            {lang === 'es'
              ? 'Detalles o peticiones especiales para Lissett Morante:'
              : 'Special notes or requests for Lissett:'}
          </label>
          <textarea
            rows={2}
            value={assessment.specialNotes}
            onChange={(e) =>
              setAssessment((prev) => ({ ...prev, specialNotes: e.target.value }))
            }
            placeholder={
              lang === 'es'
                ? 'Ej. temperatura de cabina, música suave, primera vez en terapia energética...'
                : 'E.g. room temperature, soft music, first time in energy session...'
            }
            className="w-full p-3 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-[#d8ccbc] bg-white hover:bg-[#f0eae1] text-[#4a453e] font-semibold text-sm flex items-center gap-2 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'es' ? 'Cambiar Tratamiento' : 'Back to Treatments'}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-[#415344] hover:bg-[#344337] text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md"
        >
          <span>{lang === 'es' ? 'Ver Disponibilidad de Horarios' : 'Next: Check Availability'}</span>
          <ArrowRight className="w-4 h-4 text-[#c5a059]" />
        </button>
      </div>
    </div>
  );
};
