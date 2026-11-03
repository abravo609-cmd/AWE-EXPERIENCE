import { Lang } from '../types/spa';

export interface CredentialItem {
  title: string;
  desc: string;
  pill?: string;
}

export const BRAND = {
  name: 'AWE SPA',
  fullName: 'AWE SPA — Ancestral Wellness Experience',
  therapist: 'Lisett Morante',
  subtitle: 'Ancestral Wellness Experience',
  tagline: {
    es: 'Tu cuerpo recuerda lo que tu mente olvidó.',
    en: 'Your body remembers what your mind forgot.',
  },
  motto: 'Tu cuerpo recuerda lo que tu mente olvidó.',
  whatsapp: {
    number: '593990587684',
    display: '+593 99 058 7684',
  },
  instagram: {
    handle: '@awespa.ec',
    url: 'https://instagram.com/awespa.ec',
  },
  bank: {
    name: 'Banco Pichincha',
    account: '2203426509',
    holder: 'Lisett Morante Morales',
    ruc: '0927358887001',
  },
};

export const CREDENTIALS: CredentialItem[] = [
  {
    title: '14 Años de Liderazgo en Spas de Lujo',
    desc: 'Trayectoria como Spa Manager y Head Therapist en prestigiosos resorts y spas holísticos internacionales.',
    pill: '14 Años de Experiencia Internacional',
  },
  {
    title: 'Maestría en Terapias Ancestrales & Masajes de Autor',
    desc: 'Certificada en Masaje Tailandés tradicional, Pindas Herbales, Bambuterapia y Terapia con Piedras Volcánicas.',
    pill: 'Técnicas Ancestrales & Autor',
  },
  {
    title: 'Facilitadora de Barras de Access & Terapias Energéticas',
    desc: 'Técnicas sutiles cuánticas para liberar sobrecarga mental, estrés acumulado y bloqueos emocionales.',
    pill: 'Barras de Access & Energía',
  },
  {
    title: 'Enfoque Clínico & Bienestar Integral',
    desc: 'Protocolos adaptados a cada historia física: evaluación de cirugías, restricciones, lesiones y embarazo.',
    pill: 'Atención Clínica Personalizada',
  },
];

export const calcDeposit = (price: number): number => {
  return Math.round(price * 0.5 * 10) / 10;
};

export const quote = (lang: Lang): string => {
  return lang === 'es' ? BRAND.tagline.es : BRAND.tagline.en;
};

export const whatsappUrl = (message?: string): string => {
  const defaultMsg = `Hola Lisett, deseo información sobre las sesiones en ${BRAND.name}`;
  const text = message || defaultMsg;
  return `https://wa.me/${BRAND.whatsapp.number}?text=${encodeURIComponent(text)}`;
};
