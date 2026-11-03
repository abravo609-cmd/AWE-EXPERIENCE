/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, subscribeToAuth } from './services/googleAuth';
import {
  listTherapistEvents,
  createTherapistEvent,
  deleteTherapistEvent,
} from './services/googleCalendar';
import { getStoredReservations, saveReservation } from './services/storage';
import { TREATMENTS } from './data/treatments';
import { calcDeposit } from './data/brand';
import { createDefaultAssessment } from './data/defaultAssessment';
import { addDays, toISODate } from './utils/date';
import {
  Treatment,
  TreatmentDuration,
  HealthAssessment,
  BookingReservation,
  GoogleCalendarEvent,
  Lang,
  Tab,
  BookingStep,
  PaymentMethod,
} from './types/spa';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TreatmentPicker } from './components/TreatmentPicker';
import { HealthAssessmentForm } from './components/HealthAssessmentForm';
import { AvailabilityPicker } from './components/AvailabilityPicker';
import { ClientDetailsAndPayment } from './components/ClientDetailsAndPayment';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { CalendarManagerView } from './components/CalendarManagerView';
import { CatalogView } from './components/CatalogView';
import { AboutTherapistView } from './components/AboutTherapistView';

const BOOKING_STEPS: { step: BookingStep; labelEs: string; labelEn: string }[] = [
  { step: 1, labelEs: '1. Tratamiento', labelEn: '1. Treatment' },
  { step: 2, labelEs: '2. Ficha de Salud', labelEn: '2. Health Form' },
  { step: 3, labelEs: '3. Disponibilidad', labelEn: '3. Availability' },
  { step: 4, labelEs: '4. Datos & Abono', labelEn: '4. Deposit & Pay' },
];

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [currentTab, setCurrentTab] = useState<Tab>('book');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isRefreshingCalendar, setIsRefreshingCalendar] = useState(false);

  // Stored reservations state
  const [reservations, setReservations] = useState<BookingReservation[]>([]);

  // Booking flow (1: Treatment, 2: Health Intake, 3: Availability, 4: Client & Payment)
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);

  // Selected booking parameters
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(TREATMENTS[0]);
  const [selectedDuration, setSelectedDuration] = useState<TreatmentDuration | null>(
    TREATMENTS[0].durations[0],
  );
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment>(() =>
    createDefaultAssessment(),
  );

  const [selectedDate, setSelectedDate] = useState<string>(toISODate(addDays(1)));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30');

  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Receipt Modal
  const [confirmedReservation, setConfirmedReservation] = useState<BookingReservation | null>(null);

  const goToStep = (step: BookingStep) => {
    setBookingStep(step);
    scrollToTop();
  };

  const startNewBooking = () => {
    setCurrentTab('book');
    setBookingStep(1);
  };

  const refreshReservations = () => setReservations(getStoredReservations());

  // Load reservations from storage on mount
  useEffect(() => {
    refreshReservations();
  }, []);

  // Subscribe to auth changes (the service also notifies after an interactive sign-in)
  useEffect(() => {
    const unsubSubscribe = subscribeToAuth((u, t) => {
      setUser(u);
      setToken(t);
      // Pre-fill contact data without overwriting what the client already typed
      if (u?.email) setClientEmail((prev) => prev || u.email!);
      if (u?.displayName) setClientName((prev) => prev || u.displayName!);
    });
    const unsubAuth = initAuth();

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
      await googleSignIn();
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
    if (currentTab === 'agenda') setCurrentTab('book');
  };

  const handleSelectTreatment = (treatment: Treatment, duration: TreatmentDuration) => {
    setSelectedTreatment(treatment);
    setSelectedDuration(duration);
  };

  const handleSelectFromCatalog = (treatment: Treatment, duration: TreatmentDuration) => {
    handleSelectTreatment(treatment, duration);
    setCurrentTab('book');
    goToStep(2); // Jump directly to health intake
  };

  const handleHealthNext = () => {
    // Reuse what the client already typed in the health form
    if (healthAssessment.fullName && !clientName) setClientName(healthAssessment.fullName);
    if (healthAssessment.phoneNumber && !clientPhone) setClientPhone(healthAssessment.phoneNumber);
    if (healthAssessment.emailAddress && !clientEmail)
      setClientEmail(healthAssessment.emailAddress);
    goToStep(3);
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
        depositRequired: calcDeposit(selectedDuration.price),
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
      refreshReservations();

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
    // If it has a Google Calendar event and we have a token, delete it there too
    if (reservation.calendarEventId && token) {
      try {
        await deleteTherapistEvent(token, reservation.calendarEventId);
      } catch (e) {
        console.warn('Could not remove from Google Calendar:', e);
      }
    }

    saveReservation({ ...reservation, status: 'cancelled' });
    refreshReservations();

    if (token) {
      fetchCalendar();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d2a26] flex flex-col font-sans selection:bg-[#c5a059]/30">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          scrollToTop();
        }}
        lang={lang}
        setLang={setLang}
        user={user}
        hasToken={Boolean(token)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'book' && (
          <div className="space-y-8">
            {/* Step Navigation Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                {BOOKING_STEPS.map((s) => {
                  const isActive = bookingStep === s.step;
                  const isDone = bookingStep > s.step;

                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setBookingStep(s.step)}
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

            {bookingStep === 1 && (
              <TreatmentPicker
                lang={lang}
                selectedTreatment={selectedTreatment}
                selectedDuration={selectedDuration}
                onSelectTreatment={handleSelectTreatment}
                onNext={() => goToStep(2)}
              />
            )}

            {bookingStep === 2 && selectedTreatment && (
              <HealthAssessmentForm
                lang={lang}
                assessment={healthAssessment}
                setAssessment={setHealthAssessment}
                treatmentName={lang === 'es' ? selectedTreatment.name : selectedTreatment.nameEn}
                onNext={handleHealthNext}
                onBack={() => goToStep(1)}
              />
            )}

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
                onNext={() => goToStep(4)}
                onBack={() => goToStep(2)}
              />
            )}

            {bookingStep === 4 && selectedTreatment && selectedDuration && (
              <ClientDetailsAndPayment
                lang={lang}
                treatment={selectedTreatment}
                duration={selectedDuration}
                date={selectedDate}
                timeSlot={selectedTimeSlot}
                clientName={clientName}
                setClientName={setClientName}
                clientEmail={clientEmail}
                setClientEmail={setClientEmail}
                clientPhone={clientPhone}
                setClientPhone={setClientPhone}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onBack={() => goToStep(3)}
                onConfirmBooking={handleConfirmBooking}
                isSubmitting={isSubmittingBooking}
              />
            )}
          </div>
        )}

        {currentTab === 'catalog' && (
          <CatalogView lang={lang} onSelectForBooking={handleSelectFromCatalog} />
        )}

        {currentTab === 'agenda' && token && (
          <CalendarManagerView
            lang={lang}
            reservations={reservations}
            calendarEvents={calendarEvents}
            hasGoogleSync={Boolean(token)}
            onRefreshCalendar={fetchCalendar}
            isRefreshing={isRefreshingCalendar}
            onCancelReservation={handleCancelReservation}
            onNewBookingClick={startNewBooking}
          />
        )}

        {currentTab === 'about' && <AboutTherapistView lang={lang} onBookNow={startNewBooking} />}
      </main>

      <BookingConfirmationModal
        lang={lang}
        reservation={confirmedReservation}
        onClose={() => {
          setConfirmedReservation(null);
          setBookingStep(1);
        }}
        onViewAgenda={
          token
            ? () => {
                setConfirmedReservation(null);
                setCurrentTab('agenda');
              }
            : undefined
        }
        hasGoogleSync={Boolean(token && confirmedReservation?.calendarEventId)}
      />

      <Footer />
    </div>
  );
}
