import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Lang } from '../types/spa';
import { BRAND } from '../data/brand';

/** Estilos de campos de formulario (antes copiados ~20 veces). */
export const inputClass =
  'w-full p-2.5 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]';
export const inputClassLg =
  'w-full p-3 bg-[#faf8f5] rounded-xl border border-[#d8ccbc] text-sm focus:outline-none focus:ring-2 focus:ring-[#415344]';
const labelClass = 'text-xs font-semibold text-[#4a453e] block mb-1';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  hint?: string;
  large?: boolean;
  className?: string;
  labelClassName?: string;
  min?: string;
  max?: string;
}

/** Etiqueta + input de texto reutilizable. */
export const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  icon,
  hint,
  large,
  className,
  labelClassName,
  min,
  max,
}) => (
  <div className={className}>
    <label
      className={labelClassName ?? (icon ? `${labelClass} flex items-center gap-1` : labelClass)}
    >
      {icon}
      {label}
    </label>
    <input
      type={type}
      required={required}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={large ? inputClassLg : inputClass}
    />
    {hint && <span className="text-[10px] text-[#8e8477] mt-1 block">{hint}</span>}
  </div>
);

interface SectionHeaderProps {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  subtitle: string;
}

/** Cabecera de cada sección del formulario de salud. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  iconClass,
  title,
  subtitle,
}) => (
  <div className="flex items-center gap-3 pb-3 border-b border-[#f0eae1]">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${iconClass}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-base font-serif font-bold text-[#2d2a26]">{title}</h3>
      <p className="text-xs text-[#736c63]">{subtitle}</p>
    </div>
  </div>
);

export const BackButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="px-5 py-3 rounded-xl border border-[#d8ccbc] bg-white hover:bg-[#f0eae1] text-[#4a453e] font-semibold text-sm flex items-center gap-2 transition-all shadow-xs"
  >
    <ArrowLeft className="w-4 h-4" />
    <span>{children}</span>
  </button>
);

export const NextButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="px-7 py-3 rounded-xl bg-[#415344] hover:bg-[#344337] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md"
  >
    <span>{children}</span>
    <ArrowRight className="w-4 h-4 text-[#c5a059]" />
  </button>
);

/** Líneas con los datos de transferencia (usadas en el pago y en el recibo). */
export const BankTransferLines: React.FC<{ lang: Lang; compact?: boolean }> = ({
  lang,
  compact,
}) => {
  const es = lang === 'es';
  const { bank } = BRAND;
  return (
    <>
      <p>
        • <strong>{es ? 'Banco:' : 'Bank:'}</strong> {bank.name} (
        {es ? 'Cta Ahorros:' : 'Savings Acc:'} {bank.account})
      </p>
      {compact ? (
        <p>
          • <strong>{es ? 'Titular:' : 'Holder:'}</strong> {bank.holder} ·{' '}
          <strong>RUC / CI:</strong> {bank.ruc}
        </p>
      ) : (
        <>
          <p>
            • <strong>{es ? 'Titular:' : 'Account Holder:'}</strong> {bank.holder}
          </p>
          <p>
            • <strong>RUC / CI:</strong> {bank.ruc}
          </p>
        </>
      )}
    </>
  );
};
