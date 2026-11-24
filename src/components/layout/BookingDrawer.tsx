import { ChevronLeft, ChevronRight, Clock, Scissors, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ARCHITECTURAL_EASE, MOTION_DURATIONS, SPRINGS } from "../../lib/motion";
import { cn, formatCurrency, formatDuration } from "../../lib/utils";
import type { BookingRecord } from "../../types/booking";
import { Button } from "../ui";
import { ConfirmationTicket } from "./booking-drawer/ConfirmationTicket";
import { StepBarberDateTime } from "./booking-drawer/StepBarberDateTime";
import { StepGuestForm } from "./booking-drawer/StepGuestForm";
import { StepServiceSelect } from "./booking-drawer/StepServiceSelect";
import {
  useBookingFlow,
  type BookingDrawerPrefill,
  type GuestFormValues,
} from "./booking-drawer/useBookingFlow";

export type { BookingDrawerPrefill, GuestFormValues };

export interface BookingDrawerProps {
  isOpen: boolean;
  prefill: BookingDrawerPrefill | null;
  bookings: BookingRecord[];
  onClose: () => void;
  onBookingCreated: (record: BookingRecord) => void;
}

const stepVariants = {
  enter: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * 20,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * -20,
  }),
};

export function BookingDrawer({
  isOpen,
  prefill,
  bookings,
  onClose,
  onBookingCreated,
}: BookingDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pressedOutsideRef = useRef(false);

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const dragControls = useDragControls();
  const dragY = useMotionValue(0);
  const backdropDragOpacity = useTransform(dragY, [0, 260], [1, 0.15]);

  const flow = useBookingFlow({
    isOpen,
    prefill,
    bookings,
    onBookingCreated,
  });

  // Open native <dialog> via showModal() when isOpen becomes true
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dragY.set(0);
      if (!dialog.open) {
        dialog.showModal();
      }
    }
  }, [isOpen, dragY]);

  const isOutsidePanel = (clientX: number, clientY: number): boolean => {
    const panel = panelRef.current;
    if (!panel) return false;
    const rect = panel.getBoundingClientRect();
    return (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    );
  };

  const handleDialogPointerDown = (
    event: React.PointerEvent<HTMLDialogElement>
  ) => {
    pressedOutsideRef.current = isOutsidePanel(event.clientX, event.clientY);
  };

  const handleDialogPointerUp = (
    event: React.PointerEvent<HTMLDialogElement>
  ) => {
    if (
      pressedOutsideRef.current &&
      isOutsidePanel(event.clientX, event.clientY)
    ) {
      onClose();
    }
    pressedOutsideRef.current = false;
  };

  const handleDialogCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const stepLabel = flow.confirmedBooking ? "Confirmed" : `Step ${flow.step} of 3`;

  return (
    <dialog
      ref={dialogRef}
      className="kobo-drawer"
      aria-labelledby="kobo-drawer-title"
      onCancel={handleDialogCancel}
      onPointerDown={handleDialogPointerDown}
      onPointerUp={handleDialogPointerUp}
    >
      <AnimatePresence
        onExitComplete={() => {
          const dialog = dialogRef.current;
          if (dialog?.open) {
            dialog.close();
          }
        }}
      >
        {isOpen && (
          <div className="fixed inset-0 flex items-end justify-end md:items-stretch">
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: MOTION_DURATIONS.base, ease: "easeOut" }}
              style={isDesktop ? undefined : { opacity: backdropDragOpacity }}
              className="fixed inset-0 bg-iron/60 backdrop-blur-sm"
            />

            {/* Drawer / Mobile Bottom Sheet */}
            <motion.div
              key="drawer-panel"
              ref={panelRef}
              initial={isDesktop ? { x: "100%" } : { y: "100%" }}
              animate={isDesktop ? { x: 0 } : { y: 0 }}
              exit={isDesktop ? { x: "100%" } : { y: "100%" }}
              transition={SPRINGS.drawer}
              drag={isDesktop ? false : "y"}
              dragControls={isDesktop ? undefined : dragControls}
              dragListener={false}
              dragConstraints={isDesktop ? undefined : { top: 0 }}
              dragElastic={isDesktop ? undefined : { top: 0, bottom: 0.35 }}
              style={isDesktop ? undefined : { y: dragY }}
              onDragEnd={
                isDesktop
                  ? undefined
                  : (_, info) => {
                      if (info.offset.y > 120 || info.velocity.y > 500) {
                        onClose();
                      }
                    }
              }
              className={cn(
                "relative z-10 flex w-full flex-col bg-paper text-ink shadow-2xl",
                "max-h-[92dvh] rounded-t-2xl border-t border-hairline",
                "md:h-dvh md:max-h-dvh md:max-w-[500px] md:rounded-none md:border-t-0 md:border-l md:border-hairline"
              )}
            >
              {/* Mobile drag handle */}
              <div
                onPointerDown={(e) => {
                  if (!isDesktop) dragControls.start(e);
                }}
                className="flex touch-none justify-center pt-3 pb-1.5 md:hidden cursor-grab active:cursor-grabbing"
                aria-hidden="true"
              >
                <span className="h-1 w-10 rounded-full bg-hairline-strong" />
              </div>

              {/* Sticky Drawer Header */}
              <div className="shrink-0 border-b border-hairline px-5 pt-2 pb-4 md:px-6 md:pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1
                      id="kobo-drawer-title"
                      className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-cypress"
                    >
                      KŌBŌ RESERVATION
                    </h1>
                    <p className="mt-1 font-mono text-xs text-ink-secondary tabular-data">
                      {stepLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close booking drawer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-hairline-strong bg-plaster/70 text-ink-secondary transition-colors duration-150 hover:border-cypress hover:text-ink cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* 3-segment 2px hairline progress bar */}
                <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
                  {[1, 2, 3].map((segment) => {
                    const isFilled =
                      Boolean(flow.confirmedBooking) || flow.step >= segment;
                    return (
                      <div
                        key={segment}
                        className="relative h-[2px] w-full overflow-hidden bg-hairline"
                      >
                        <motion.div
                          className="absolute inset-0 origin-left bg-cypress"
                          initial={false}
                          animate={{ scaleX: isFilled ? 1 : 0 }}
                          transition={{
                            duration: MOTION_DURATIONS.base,
                            ease: ARCHITECTURAL_EASE,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Step Body */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-5 md:px-6">
                {flow.confirmedBooking ? (
                  <ConfirmationTicket
                    booking={flow.confirmedBooking}
                    previewChannel={flow.previewChannel}
                    onChannelChange={flow.setPreviewChannel}
                  />
                ) : (
                  <AnimatePresence mode="wait" custom={flow.direction}>
                    <motion.div
                      key={flow.step}
                      custom={flow.direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: MOTION_DURATIONS.base,
                        ease: ARCHITECTURAL_EASE,
                      }}
                    >
                      {flow.step === 1 && (
                        <StepServiceSelect
                          activeCategory={flow.activeCategory}
                          onCategoryChange={flow.setActiveCategory}
                          filteredServices={flow.filteredServices}
                          selectedServiceId={flow.selectedServiceId}
                          onSelectService={flow.setSelectedServiceId}
                          selectedAddonIds={flow.selectedAddonIds}
                          onToggleAddon={flow.handleToggleAddon}
                        />
                      )}

                      {flow.step === 2 && (
                        <StepBarberDateTime
                          selectedBarberId={flow.selectedBarberId}
                          onSelectBarber={flow.handleSelectBarber}
                          upcomingDays={flow.upcomingDays}
                          selectedDate={flow.selectedDate}
                          onSelectDate={flow.handleSelectDate}
                          openCountByDate={flow.openCountByDate}
                          daySlots={flow.daySlots}
                          groupedSlots={flow.groupedSlots}
                          selectedTime={flow.selectedTime}
                          onSelectTime={flow.setSelectedTime}
                          bookings={bookings}
                        />
                      )}

                      {flow.step === 3 && (
                        <StepGuestForm
                          selectedService={flow.selectedService}
                          selectedAddons={flow.selectedAddons}
                          selectedBarberLabel={flow.selectedBarberLabel}
                          selectedDate={flow.selectedDate}
                          selectedTime={flow.selectedTime}
                          totalPrice={flow.totalPrice}
                          totalDuration={flow.totalDuration}
                          onEditStep={flow.goToStep}
                          guest={flow.guest}
                          onGuestChange={flow.handleGuestChange}
                          onGuestBlur={flow.handleGuestBlur}
                          formErrors={flow.formErrors}
                          errorAnnouncement={flow.errorAnnouncement}
                          submitError={flow.submitError}
                          onSubmit={flow.handleConfirmSubmit}
                          nameInputRef={flow.nameInputRef}
                          phoneInputRef={flow.phoneInputRef}
                          emailInputRef={flow.emailInputRef}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Sticky Drawer Footer */}
              <div className="shrink-0 border-t border-hairline bg-plaster/90 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-md md:px-6 md:pb-4">
                {flow.step === 1 && !flow.confirmedBooking && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="shrink-0 font-mono tabular-data">
                      <p className="whitespace-nowrap text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                        Session Total
                      </p>
                      <p className="whitespace-nowrap text-sm font-semibold text-ink">
                        {formatCurrency(flow.totalPrice)}{" "}
                        <span className="text-ink-muted">•</span>{" "}
                        {formatDuration(flow.totalDuration)}
                      </p>
                    </div>
                    <Button
                      disabled={!flow.selectedService}
                      onClick={() => flow.goToStep(2)}
                      className="shrink-0 px-4 sm:px-6"
                    >
                      <span className="sm:hidden">Barber &amp; Time</span>
                      <span className="hidden sm:inline">
                        Continue to Barber &amp; Time
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {flow.step === 2 && !flow.confirmedBooking && (
                  <div className="flex items-center justify-between gap-3">
                    <Button variant="outline" onClick={() => flow.goToStep(1)}>
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>
                    <Button
                      disabled={!flow.selectedDate || !flow.selectedTime}
                      onClick={() => flow.goToStep(3)}
                      className="flex-1"
                    >
                      <span>Continue to Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {flow.step === 3 && !flow.confirmedBooking && (
                  <div className="flex items-center justify-between gap-3">
                    <Button variant="outline" onClick={() => flow.goToStep(2)}>
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>
                    <Button
                      type="submit"
                      form="kobo-guest-form"
                      disabled={flow.isConfirming}
                      className="flex-1 tabular-data"
                    >
                      {flow.isConfirming ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>Reserving Chair...</span>
                        </>
                      ) : (
                        <>
                          <Scissors className="h-4 w-4" />
                          <span>
                            Confirm Chair — {formatCurrency(flow.totalPrice)}
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {flow.confirmedBooking && (
                  <div className="flex items-center justify-between gap-3">
                    <Button variant="outline" onClick={flow.handleBookAnother}>
                      Book Another Chair
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
