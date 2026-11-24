import { MotionConfig } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookingDrawer,
  type BookingDrawerPrefill,
} from "./components/layout/BookingDrawer";
import { DemoUtilityBar } from "./components/layout/DemoUtilityBar";
import { MobileStickyBar } from "./components/layout/MobileStickyBar";
import { Navbar } from "./components/layout/Navbar";
import { AtmosphereSection } from "./components/sections/AtmosphereSection";
import { BarbersSection } from "./components/sections/BarbersSection";
import { HeroSection } from "./components/sections/HeroSection";
import { LocationFooterSection } from "./components/sections/LocationFooterSection";
import { ReviewsSection } from "./components/sections/ReviewsSection";
import { ServiceMenuSection } from "./components/sections/ServiceMenuSection";
import { FIRST_AVAILABLE_ID } from "./data/barbers";
import { useDocumentVisibility } from "./lib/motion";
import {
  getBookings,
  getNextAvailableSlot,
  resetDemoBookings,
} from "./services/bookings";
import type { AvailableSlot, BookingRecord } from "./types/booking";

export function App() {
  useDocumentVisibility();

  const [bookings, setBookings] = useState<BookingRecord[]>(() => getBookings());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPrefill, setDrawerPrefill] = useState<BookingDrawerPrefill | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const nextStudioSlot = useMemo(
    () => getNextAvailableSlot(FIRST_AVAILABLE_ID, bookings),
    [bookings]
  );

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const openDrawer = useCallback((prefill: BookingDrawerPrefill | null = null) => {
    setDrawerPrefill(prefill);
    setIsDrawerOpen(true);
  }, []);

  const handleBookDefault = useCallback(() => {
    openDrawer({ initialStep: 1 });
  }, [openDrawer]);

  const handleQuickSlotClick = useCallback(
    (slot: AvailableSlot) => {
      openDrawer({
        initialStep: 1,
        barberId: slot.barberId,
        bookingDate: slot.date,
        bookingTime: slot.time,
      });
    },
    [openDrawer]
  );

  const handleSelectService = useCallback(
    (serviceId: string) => {
      openDrawer({
        initialStep: 1,
        serviceId,
      });
    },
    [openDrawer]
  );

  const handleBookWithBarber = useCallback(
    (barberId: string) => {
      openDrawer({
        initialStep: 1,
        barberId,
      });
    },
    [openDrawer]
  );

  const handleAutoFillTestBooking = useCallback(() => {
    const earliestStudioSlot = getNextAvailableSlot(FIRST_AVAILABLE_ID, bookings);
    const earliestKenjiSlot = getNextAvailableSlot("kenji", bookings);

    const useKenji =
      Boolean(earliestKenjiSlot) &&
      (!earliestStudioSlot || earliestKenjiSlot?.date === earliestStudioSlot.date);

    const chosenSlot = useKenji ? earliestKenjiSlot : earliestStudioSlot;
    const chosenBarberId = useKenji ? "kenji" : FIRST_AVAILABLE_ID;

    openDrawer({
      initialStep: 3,
      serviceId: "signature-cut",
      addonIds: ["eucalyptus-steam"],
      barberId: chosenBarberId,
      bookingDate: chosenSlot?.date,
      bookingTime: chosenSlot?.time,
      guest: {
        clientName: "Marcus Vance",
        clientPhone: "(917) 555-0148",
        clientEmail: "marcus.vance@example.com",
        notes: "Mid skin taper, keep length on top.",
      },
    });
  }, [bookings, openDrawer]);

  const handleBookingCreated = useCallback(() => {
    setBookings(getBookings());
  }, []);

  const handleResetDemo = useCallback(() => {
    const resetRecords = resetDemoBookings();
    setBookings(resetRecords);
    setToastMessage("Demo reset to default availability.");
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-plaster text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:rounded-sm focus:border focus:border-cypress focus:bg-paper focus:px-4 focus:py-2.5 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.14em] focus:text-ink"
        >
          Skip to main content
        </a>

        <Navbar onBookClick={handleBookDefault} />

        <main id="main-content">
          <HeroSection
            nextSlot={nextStudioSlot}
            onBookClick={handleBookDefault}
            onQuickSlotClick={handleQuickSlotClick}
          />

          <ServiceMenuSection onSelectService={handleSelectService} />

          <BarbersSection
            bookings={bookings}
            onBookWithBarber={handleBookWithBarber}
            onQuickSlotClick={handleQuickSlotClick}
          />

          <AtmosphereSection />

          <ReviewsSection />
        </main>

        <LocationFooterSection onBookClick={handleBookDefault} />

        <MobileStickyBar
          nextSlot={nextStudioSlot}
          isDrawerOpen={isDrawerOpen}
          onBookClick={handleBookDefault}
          onQuickSlotClick={handleQuickSlotClick}
        />

        <DemoUtilityBar
          onAutoFillTestBooking={handleAutoFillTestBooking}
          onResetDemo={handleResetDemo}
          toastMessage={toastMessage}
        />

        <BookingDrawer
          isOpen={isDrawerOpen}
          prefill={drawerPrefill}
          bookings={bookings}
          onClose={() => setIsDrawerOpen(false)}
          onBookingCreated={handleBookingCreated}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
