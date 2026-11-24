import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FIRST_AVAILABLE_ID, getBarberById } from "../../../data/barbers";
import {
  GROOMING_SERVICES,
  getAddonById,
  getServiceById,
} from "../../../data/services";
import {
  createBooking,
  getStudioSlotsForDate,
  getUpcomingDays,
  isBarberWorkingOnDate,
  isSlotBooked,
  isSlotInPast,
} from "../../../services/bookings";
import type {
  BookingRecord,
  ServiceCategory,
  UpcomingDay,
} from "../../../types/booking";

export interface GuestFormValues {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

export interface BookingDrawerPrefill {
  initialStep?: 1 | 2 | 3;
  serviceId?: string;
  addonIds?: string[];
  barberId?: string;
  bookingDate?: string;
  bookingTime?: string;
  guest?: Partial<GuestFormValues>;
}

export interface FormErrors {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
}

export interface SlotGroup {
  id: "morning" | "afternoon" | "evening";
  label: string;
  slots: string[];
}

function getDefaultOpenDate(days: UpcomingDay[], barberId: string): string {
  for (const day of days) {
    if (day.isStudioClosed) continue;
    if (barberId !== FIRST_AVAILABLE_ID) {
      const barber = getBarberById(barberId);
      if (!barber || !isBarberWorkingOnDate(barber, day.date)) continue;
    }
    return day.date;
  }
  return days[0]?.date ?? "";
}

function validateField(
  field: keyof FormErrors,
  value: string
): string | undefined {
  const trimmed = value.trim();
  if (field === "clientName") {
    return trimmed.length < 2
      ? "Enter your full name (at least 2 characters)."
      : undefined;
  }
  if (field === "clientPhone") {
    const digits = value.replace(/\D/g, "");
    return digits.length < 7
      ? "Enter a valid mobile number (at least 7 digits)."
      : undefined;
  }
  if (field === "clientEmail") {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
      ? "Enter an email address in the format you@example.com."
      : undefined;
  }
  return undefined;
}

export function useBookingFlow({
  isOpen,
  prefill,
  bookings,
  onBookingCreated,
}: {
  isOpen: boolean;
  prefill: BookingDrawerPrefill | null;
  bookings: BookingRecord[];
  onBookingCreated: (record: BookingRecord) => void;
}) {
  const upcomingDays = useMemo(() => getUpcomingDays(7), []);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("cuts");
  const [selectedServiceId, setSelectedServiceId] =
    useState<string>("signature-cut");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [selectedBarberId, setSelectedBarberId] =
    useState<string>(FIRST_AVAILABLE_ID);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    getDefaultOpenDate(upcomingDays, FIRST_AVAILABLE_ID)
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [guest, setGuest] = useState<GuestFormValues>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: "",
  });
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof FormErrors, boolean>>
  >({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [errorAnnouncement, setErrorAnnouncement] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(
    null
  );
  const [previewChannel, setPreviewChannel] = useState<"sms" | "email">("sms");

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // Sync drawer state whenever opened or given a new prefill payload
  useEffect(() => {
    if (!isOpen) return;

    const serviceId = prefill?.serviceId ?? "signature-cut";
    const service = getServiceById(serviceId) ?? GROOMING_SERVICES[0];
    const barberId = prefill?.barberId ?? FIRST_AVAILABLE_ID;
    const defaultDate = getDefaultOpenDate(upcomingDays, barberId);
    const targetDate = prefill?.bookingDate ?? defaultDate;

    setDirection(1);
    setStep(prefill?.initialStep ?? 1);
    setActiveCategory(service.category);
    setSelectedServiceId(service.id);
    setSelectedAddonIds(prefill?.addonIds ?? []);
    setSelectedBarberId(barberId);
    setSelectedDate(targetDate);
    setSelectedTime(prefill?.bookingTime ?? "");
    setGuest({
      clientName: prefill?.guest?.clientName ?? "",
      clientPhone: prefill?.guest?.clientPhone ?? "",
      clientEmail: prefill?.guest?.clientEmail ?? "",
      notes: prefill?.guest?.notes ?? "",
    });
    setTouchedFields({});
    setFormErrors({});
    setErrorAnnouncement("");
    setSubmitError(null);
    setIsConfirming(false);
    setConfirmedBooking(null);
    setPreviewChannel("sms");
  }, [isOpen, prefill, upcomingDays]);

  const goToStep = useCallback(
    (nextStep: 1 | 2 | 3) => {
      setDirection(nextStep >= step ? 1 : -1);
      setStep(nextStep);
    },
    [step]
  );

  const selectedService = useMemo(
    () => getServiceById(selectedServiceId) ?? GROOMING_SERVICES[0],
    [selectedServiceId]
  );

  const selectedAddons = useMemo(
    () =>
      selectedAddonIds
        .map((id) => getAddonById(id))
        .filter((addon): addon is NonNullable<typeof addon> => Boolean(addon)),
    [selectedAddonIds]
  );

  const totalPrice = useMemo(() => {
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return (selectedService?.price ?? 0) + addonTotal;
  }, [selectedService, selectedAddons]);

  const totalDuration = useMemo(() => {
    const addonDuration = selectedAddons.reduce(
      (sum, addon) => sum + addon.durationMins,
      0
    );
    return (selectedService?.durationMins ?? 0) + addonDuration;
  }, [selectedService, selectedAddons]);

  const filteredServices = useMemo(
    () => GROOMING_SERVICES.filter((service) => service.category === activeCategory),
    [activeCategory]
  );

  const daySlots = useMemo(
    () => (selectedDate ? getStudioSlotsForDate(selectedDate) : []),
    [selectedDate]
  );

  const groupedSlots = useMemo<SlotGroup[]>(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    for (const slot of daySlots) {
      const hour = Number(slot.split(":")[0]);
      if (hour < 12) morning.push(slot);
      else if (hour < 17) afternoon.push(slot);
      else evening.push(slot);
    }

    return [
      { id: "morning" as const, label: "Morning", slots: morning },
      { id: "afternoon" as const, label: "Afternoon", slots: afternoon },
      { id: "evening" as const, label: "Evening", slots: evening },
    ].filter((group) => group.slots.length > 0);
  }, [daySlots]);

  const openCountByDate = useMemo(() => {
    const counts = new Map<string, number>();
    for (const day of upcomingDays) {
      if (day.isStudioClosed) {
        counts.set(day.date, 0);
        continue;
      }
      if (selectedBarberId !== FIRST_AVAILABLE_ID) {
        const barber = getBarberById(selectedBarberId);
        if (!barber || !isBarberWorkingOnDate(barber, day.date)) {
          counts.set(day.date, 0);
          continue;
        }
      }
      const slots = getStudioSlotsForDate(day.date);
      let openCount = 0;
      for (const time24 of slots) {
        if (
          !isSlotInPast(day.date, time24) &&
          !isSlotBooked(day.date, time24, selectedBarberId, bookings)
        ) {
          openCount += 1;
        }
      }
      counts.set(day.date, openCount);
    }
    return counts;
  }, [upcomingDays, selectedBarberId, bookings]);

  const selectedBarberLabel = useMemo(() => {
    if (selectedBarberId === FIRST_AVAILABLE_ID) return "First Available";
    return getBarberById(selectedBarberId)?.name ?? "First Available";
  }, [selectedBarberId]);

  const handleToggleAddon = useCallback((addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  }, []);

  const handleSelectBarber = useCallback(
    (barberId: string) => {
      setSelectedBarberId(barberId);
      setSelectedTime("");

      if (barberId !== FIRST_AVAILABLE_ID) {
        const barber = getBarberById(barberId);
        if (barber && selectedDate && !isBarberWorkingOnDate(barber, selectedDate)) {
          setSelectedDate(getDefaultOpenDate(upcomingDays, barberId));
        }
      } else if (!selectedDate) {
        setSelectedDate(getDefaultOpenDate(upcomingDays, FIRST_AVAILABLE_ID));
      }
    },
    [selectedDate, upcomingDays]
  );

  const handleSelectDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime("");
  }, []);

  const handleGuestChange = useCallback(
    (field: keyof GuestFormValues, value: string) => {
      setGuest((prev) => ({ ...prev, [field]: value }));
      if (field !== "notes" && touchedFields[field]) {
        const nextErr = validateField(field, value);
        setFormErrors((prev) => ({ ...prev, [field]: nextErr }));
      }
    },
    [touchedFields]
  );

  const handleGuestBlur = useCallback(
    (field: keyof FormErrors) => {
      setTouchedFields((prev) => ({ ...prev, [field]: true }));
      const nextErr = validateField(field, guest[field]);
      setFormErrors((prev) => ({ ...prev, [field]: nextErr }));
      if (nextErr) {
        setErrorAnnouncement(nextErr);
      }
    },
    [guest]
  );

  const handleConfirmSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitError(null);

      const errors: FormErrors = {
        clientName: validateField("clientName", guest.clientName),
        clientPhone: validateField("clientPhone", guest.clientPhone),
        clientEmail: validateField("clientEmail", guest.clientEmail),
      };

      setTouchedFields({
        clientName: true,
        clientPhone: true,
        clientEmail: true,
      });
      setFormErrors(errors);

      if (errors.clientName) {
        setErrorAnnouncement(errors.clientName);
        nameInputRef.current?.focus();
        return;
      }
      if (errors.clientPhone) {
        setErrorAnnouncement(errors.clientPhone);
        phoneInputRef.current?.focus();
        return;
      }
      if (errors.clientEmail) {
        setErrorAnnouncement(errors.clientEmail);
        emailInputRef.current?.focus();
        return;
      }

      if (!selectedService || !selectedDate || !selectedTime) {
        setSubmitError("Please select a service, date, and chair time first.");
        return;
      }

      setIsConfirming(true);

      window.setTimeout(() => {
        try {
          const record = createBooking({
            serviceId: selectedService.id,
            addonIds: selectedAddonIds,
            barberId: selectedBarberId,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
            clientName: guest.clientName,
            clientPhone: guest.clientPhone,
            clientEmail: guest.clientEmail,
            notes: guest.notes,
          });
          setConfirmedBooking(record);
          setIsConfirming(false);
          onBookingCreated(record);
        } catch (err) {
          setIsConfirming(false);
          setSubmitError(
            err instanceof Error
              ? err.message
              : "Unable to complete reservation. Please choose another slot."
          );
        }
      }, 320);
    },
    [
      guest,
      onBookingCreated,
      selectedAddonIds,
      selectedBarberId,
      selectedDate,
      selectedService,
      selectedTime,
    ]
  );

  const handleBookAnother = useCallback(() => {
    setConfirmedBooking(null);
    setDirection(-1);
    setStep(1);
    setSelectedAddonIds([]);
    setSelectedTime("");
    setTouchedFields({});
    setFormErrors({});
    setErrorAnnouncement("");
    setSubmitError(null);
    setGuest((prev) => ({ ...prev, notes: "" }));
  }, []);

  return {
    upcomingDays,
    step,
    direction,
    goToStep,
    activeCategory,
    setActiveCategory,
    selectedServiceId,
    setSelectedServiceId,
    selectedAddonIds,
    handleToggleAddon,
    selectedBarberId,
    handleSelectBarber,
    selectedDate,
    handleSelectDate,
    selectedTime,
    setSelectedTime,
    guest,
    handleGuestChange,
    handleGuestBlur,
    formErrors,
    errorAnnouncement,
    submitError,
    isConfirming,
    confirmedBooking,
    previewChannel,
    setPreviewChannel,
    selectedService,
    selectedAddons,
    totalPrice,
    totalDuration,
    filteredServices,
    daySlots,
    groupedSlots,
    openCountByDate,
    selectedBarberLabel,
    handleConfirmSubmit,
    handleBookAnother,
    nameInputRef,
    phoneInputRef,
    emailInputRef,
  };
}
