/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  subscribeToAuth,
} from './services/googleAuth';
import {
  listTherapistEvents,
  createTherapistEvent,
  deleteTherapistEvent,
} from './services/googleCalendar';
import {
  getStoredReservations,
  saveReservation,
  updateReservation,
  deleteStoredReservation,
} from './services/storage';
import { TREATMENTS } from './data/treatments';
import {
  Treatment,
  TreatmentDuration,
  HealthAssessment,
  BookingReservation,
  GoogleCalendarEvent,
} from './types/spa';

import { Navbar } from './components/Navbar';
import { TreatmentPicker } from './components/TreatmentPicker';
import { HealthAssessmentForm } from './components/HealthAssessmentForm';
import { AvailabilityPicker } from './components/AvailabilityPicker';
import { ClientDetailsAndPayment } from './components/ClientDetailsAndPayment';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { CalendarManagerView } from './components/CalendarManagerView';
import { CatalogView } from './components/CatalogView';
import { AboutTherapistView } from './components/AboutTherapistView';

const defaultAssessment: HealthAssessment = {
  intakeDate: new Date().toISOString().split('T')[0],
  fullName: '',
  idNumber: '',
  dateOfBirth: '',
  age: '',
  nationality: 'Ecuatoriana',
  phoneNumber: '',
  emailAddress: '',
  cityOfResidence: '',
  occupation: '',
  emergencyContact: '',
  emergencyPhoneNumber: '',

  visitReasons: ['Relaxation'],
  otherVisitReason: '',
  expectedOutcome: '',

  medicalChecklist: {
    highBloodPressure: false,
    heartProblems: false,
    diabetes: false,
    circulatoryProblems: false,
    thrombosisVaricose: false,
    epilepsy: false,
    asthma: false,
    respiratoryProblems: false,
    spinalProblems: false,
    recentMuscleInjuries: false,
    recentFractures: false,
    surgeriesLast12Months: false,
    skinConditions: false,
    allergies: false,
    pregnancy: false,
    breastfeeding: false,
    cancerHistory: false,
    currentMedications: false,
    pacemakerDevices: false,
    otherConditions: false,
    otherConditionsDetails: '',
    medicationsDetails: '',
    surgeriesDetails: '',
    allergiesDetails: '',
  },

  hasRestrictions: false,
  restrictionsDetails: '',
  hasSurgeries: false,
  surgeriesDetails: '',
  hasMedicalConditions: false,
  medicalConditionsDetails: '',
  hasAllergies: false,
  allergiesList: [],
  otherAllergies: '',
  isPregnant: false,
  pregnancyNotes: '',
  focusAreas: ['Cuello & Cervical', 'Espalda Alta & Trapecios'],
  avoidAreas: [],
  pressurePreference: 'medium',
  energyIntention: 'Silencio y descanso mental (desconexión de sobrepensamiento)',
  currentStressLevel: 5,
  specialNotes: '',
};

export default function App() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [currentTab, setCurrentTab] = useState<'book' | 'catalog' | 'agenda' | 'about'>('book');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isRefreshingCalendar, setIsRefreshingCalendar] = useState(false);

  // Stored reservations state
  const [reservations, setReservations] = useState<BookingReservation[]>([]);

  // Booking Flow Steps (1: Treatment, 2: Health Intake, 3: Availability, 4: Client & Payment)
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected Booking Parameters
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(TREATMENTS[0]);
  const [selectedDuration, setSelectedDuration] = useState<TreatmentDuration | null>(
    TREATMENTS[0].durations[0]
  );
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment>(defaultAssessment);

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30');

  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('transfer');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Receipt Modal
  const [confirmedReservation, setConfirmedReservation] = useState<BookingReservation | null>(null);

  // Load reservations from storage on mount
  useEffect(() => {
    setReservations(getStoredReservations());
  }, []);

  // Initialize Auth listener
  useEffect(() => {
    const unsubSubscribe = subscribeToAuth((u, t) => {
      setUser(u);
      setToken(t);
      if (u?.email && !clientEmail) {
        setClientEmail(u.email);
      }
      if (u?.displayName && !clientName) {
        setClientName(u.displayName);
      }
    });

    const unsubAuth = initAuth(
      (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
      },
      () => {
        // Not logged in or needs interactive login
      }
    );

    return () => {
      unsubSubscribe();
      unsubAuth();
    };
  }, []);

  // Fetch Calendar Events when token changes
  const fetchCalendar = useCallback(async () => {
    if (!token) return;
    setIsRefreshingCalendar(true);
    try {
      const events = await listTherapistEvents(token);
      setCalendarEvents(events);
    } catch (err) {
      console.warn('Could not load Google Calendar events:', err);
    } finally {
      setIsRefreshingCalendar(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCalendar();
    }
  }, [token, fetchCalendar]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        if (res.user.email && !clientEmail) {
          setClientEmail(res.user.email);
        }
        if (res.user.displayName && !clientName) {
          setClientName(res.user.displayName);
        }
      }
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setCalendarEvents([]);
  };

  const handleSelectTreatment = (treatment: Treatment, duration: TreatmentDuration) => {
    setSelectedTreatment(treatment);
    setSelectedDuration(duration);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTreatment || !selectedDuration) return;

    setIsSubmittingBooking(true);
    try {
      const newReservation: BookingReservation = {
        id: `awe-${Date.now()}`,
        treatmentId: selectedTreatment.id,
        treatmentName: selectedTreatment.name,
        treatmentNameEn: selectedTreatment.nameEn,
        durationMinutes: selectedDuration.minutes,
        totalPrice: selectedDuration.price,
        depositRequired: selectedDuration.price * 0.5,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        paymentMethod,
        healthAssessment: { ...healthAssessment },
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };

      // 1. Sync to Google Calendar if token available
      if (token) {
        try {
          const calEvent = await createTherapistEvent(token, newReservation);
          newReservation.calendarEventId = calEvent.id;
        } catch (calError) {
          console.warn('Google Calendar sync warning:', calError);
        }
      }

      // 2. Save locally
      saveReservation(newReservation);
      setReservations(getStoredReservations());

      // 3. Show confirmation modal
      setConfirmedReservation(newReservation);

      // 4. Refresh calendar
      if (token) {
        fetchCalendar();
      }
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleCancelReservation = async (reservation: BookingReservation) => {
    // If has Google Calendar event and access token, delete from Google Calendar
    if (reservation.calendarEventId && token) {
      try {
        await deleteTherapistEvent(token, reservation.calendarEventId);
      } catch (e) {
        console.warn('Could not remove from Google Calendar:', e);
      }
    }

    const updated: BookingReservation = {
      ...reservation,
      status: 'cancelled',
    };
    updateReservation(updated);
    setReservations(getStoredReservations());

    if (token) {
      fetchCalendar();
    }
  };

  const handleSelectFromCatalog = (treatment: Treatment, duration: TreatmentDuration) => {
    setSelectedTreatment(treatment);
    setSelectedDuration(duration);
    setCurrentTab('book');
    setBookingStep(2); // Jump directly to health intake
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d2a26] flex flex-col font-sans selection:bg-[#c5a059]/30">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        setLang={setLang}
        user={user}
        hasToken={Boolean(token)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'book' && (
          <div className="space-y-8">
            {/* Step Navigation Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                {[
                  { step: 1, labelEs: '1. Tratamiento', labelEn: '1. Treatment' },
                  { step: 2, labelEs: '2. Ficha de Salud', labelEn: '2. Health Form' },
                  { step: 3, labelEs: '3. Disponibilidad', labelEn: '3. Availability' },
                  { step: 4, labelEs: '4. Datos & Abono', labelEn: '4. Deposit & Pay' },
                ].map((s) => {
                  const isActive = bookingStep === s.step;
                  const isDone = bookingStep > s.step;

                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setBookingStep(s.step as any)}
                      className={`py-2 px-1 rounded-xl transition-all border ${
                        isActive
                          ? 'bg-[#415344] text-white border-[#415344] shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-[#7d7468] border-[#e2d7c5] hover:bg-[#faf7f2]'
                      }`}
                    >
                      <span className="block truncate">
                        {lang === 'es' ? s.labelEs : s.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Treatment Selection */}
            {bookingStep === 1 && (
              <TreatmentPicker
                lang={lang}
                selectedTreatment={selectedTreatment}
                selectedDuration={selectedDuration}
                onSelectTreatment={handleSelectTreatment}
                onNext={() => {
                  setBookingStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Step 2: Health & Medical Intake Form */}
            {bookingStep === 2 && selectedTreatment && (
              <HealthAssessmentForm
                lang={lang}
                assessment={healthAssessment}
                setAssessment={setHealthAssessment}
                treatmentName={lang === 'es' ? selectedTreatment.name : selectedTreatment.nameEn}
                onNext={() => {
                  if (healthAssessment.fullName && !clientName) {
                    setClientName(healthAssessment.fullName);
                  }
                  if (healthAssessment.phoneNumber && !clientPhone) {
                    setClientPhone(healthAssessment.phoneNumber);
                  }
                  if (healthAssessment.emailAddress && !clientEmail) {
                    setClientEmail(healthAssessment.emailAddress);
                  }
                  setBookingStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => {
                  setBookingStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Step 3: Availability & Time Slot */}
            {bookingStep === 3 && selectedDuration && (
              <AvailabilityPicker
                lang={lang}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                durationMinutes={selectedDuration.minutes}
                calendarEvents={calendarEvents}
                existingReservations={reservations}
                hasCalendarSync={Boolean(token)}
                onRefreshCalendar={fetchCalendar}
                isRefreshing={isRefreshingCalendar}
                onNext={() => {
                  setBookingStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => {
                  setBookingStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Step 4: Client Info, Policies & 50% Deposit */}
            {bookingStep === 4 && selectedTreatment && selectedDuration && (
              <ClientDetailsAndPayment
                lang={lang}
                treatment={selectedTreatment}
                duration={selectedDuration}
                date={selectedDate}
                timeSlot={selectedTimeSlot}
                healthAssessment={healthAssessment}
                clientName={clientName}
                setClientName={setClientName}
                clientEmail={clientEmail}
                setClientEmail={setClientEmail}
                clientPhone={clientPhone}
                setClientPhone={setClientPhone}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onBack={() => {
                  setBookingStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onConfirmBooking={handleConfirmBooking}
                isSubmitting={isSubmittingBooking}
              />
            )}
          </div>
        )}

        {/* Tab 2: Full Catalog Brochure */}
        {currentTab === 'catalog' && (
          <CatalogView lang={lang} onSelectForBooking={handleSelectFromCatalog} />
        )}

        {/* Tab 3: Therapist Agenda & Real-Time Google Calendar Manager */}
        {currentTab === 'agenda' && (
          <CalendarManagerView
            lang={lang}
            reservations={reservations}
            calendarEvents={calendarEvents}
            hasGoogleSync={Boolean(token)}
            onRefreshCalendar={fetchCalendar}
            isRefreshing={isRefreshingCalendar}
            onCancelReservation={handleCancelReservation}
            onNewBookingClick={() => {
              setCurrentTab('book');
              setBookingStep(1);
            }}
          />
        )}

        {/* Tab 4: About Lissett Morante */}
        {currentTab === 'about' && (
          <AboutTherapistView
            lang={lang}
            onBookNow={() => {
              setCurrentTab('book');
              setBookingStep(1);
            }}
          />
        )}
      </main>

      {/* Confirmation Modal Receipt */}
      <BookingConfirmationModal
        lang={lang}
        reservation={confirmedReservation}
        onClose={() => {
          setConfirmedReservation(null);
          setBookingStep(1);
        }}
        onViewAgenda={() => {
          setConfirmedReservation(null);
          setCurrentTab('agenda');
        }}
        hasGoogleSync={Boolean(token && confirmedReservation?.calendarEventId)}
      />

      {/* Footer */}
      <footer className="bg-[#2d2a26] text-[#e0ded8] py-12 border-t border-[#443f38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#443f38]">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold text-[#c5a059] tracking-[0.25em] uppercase">
                ✦ ANCESTRAL WELLNESS EXPERIENCE ✦
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                LISSETT MORANTE
              </h3>
              <p className="text-xs text-[#a89e90]">
                Spa & Holistic Wellness · Ecuador 2026
              </p>
            </div>

            <div className="text-center md:text-right text-xs space-y-1">
              <p className="font-serif italic text-sm text-[#ebd8b1]">
                "Tu cuerpo recuerda lo que tu mente olvidó."
              </p>
              <p className="text-[#a89e90]">
                WhatsApp:{' '}
                <a
                  href="https://wa.me/593990587684"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#c5a059] font-medium"
                >
                  +593 99 058 7684
                </a>
              </p>
              <p className="text-[#a89e90]">Instagram: @lissettmorante.awe</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8477]">
            <p>
              © {new Date().getFullYear()} AWE SPA · Lissett Morante. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <span>Abono de confirmación 50%</span>
              <span>·</span>
              <span>Cancelación gratuita 24h antes</span>
              <span>·</span>
              <span>Google Calendar Sync</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
