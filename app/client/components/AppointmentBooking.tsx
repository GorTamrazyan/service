"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
    FaTimes,
    FaClock,
    FaMoneyBillWave,
    FaCalendarCheck,
    FaCheckCircle,
    FaInfoCircle,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { T } from "./T";
import { createConsultationOrder } from "../../lib/firebase/orders";
import { useAuthState } from "../../hooks/useAuthState";
import { useProfile } from "../../hooks/useProfile";
import { sendConsultationEmail } from "../../lib/email/helpers";

interface AppointmentBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    consultationType: string;
    duration: number;
    features: string[];
    price: number;
    description: string;
}

export default function AppointmentBookingModal({
    isOpen,
    onClose,
    consultationType,
    features,
    duration,
    price,
}: AppointmentBookingModalProps) {
    const [user] = useAuthState();
    const { profile } = useProfile();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [allSlots, setAllSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [isLoadingDays, setIsLoadingDays] = useState(false);
    const [daysLoadError, setDaysLoadError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPhone, setFormPhone] = useState("");

    const dynamicCalendarLink = useMemo(() => {
        const baseUrl =
            "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3N03_W5ud1xs6uoMMUj8JymnthLS5WZz4FW5axu6pFj_4mezmBsVCMS42vZrlhWmmNpycXYYIm";
        return baseUrl;
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const fetchAvailableDays = useCallback(async (date: Date) => {
        setIsLoadingDays(true);
        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const monthString = `${year}-${month}`;

            console.log('🗓️ Fetching available days for month:', monthString);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`/api/available-days?month=${monthString}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch available days: ${errorText}`);
            }

            const data = await response.json();
            setAvailableDays(data.availableDays || []);
            setDaysLoadError(false);
            console.log('✅ Available days loaded:', data.availableDays);
        } catch (error) {
            console.error('❌ Error fetching available days:', error);
            if (error instanceof Error && error.name === 'AbortError') {
                console.error('Запрос занял слишком много времени');
            }
            setAvailableDays([]);
            setDaysLoadError(true);
        } finally {
            setIsLoadingDays(false);
        }
    }, []);

    const isDateDisabled = (date: Date | null) => {
        if (!date) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) return true;

        if (isLoadingDays) return false;

        if (daysLoadError) {
            const dayOfWeek = date.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6; 
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        return !availableDays.includes(dateString);
    };

    const isSameDay = (date1: Date | null, date2: Date | null) => {
        if (!date1 || !date2) return false;
        return date1.toDateString() === date2.toDateString();
    };

    const fetchAvailableSlots = useCallback(async (date: Date) => {
        setIsLoadingSlots(true);
        try {
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateString = `${year}-${month}-${day}`;
            
            console.log('🔍 Fetching slots for date:', dateString);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`/api/available-slots?date=${dateString}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch available slots: ${errorText}`);
            }

            const data = await response.json();

            setAvailableSlots(data.availableSlots || []);
            setBookedSlots(data.bookedSlots || []);
            setAllSlots(data.allSlots || []);
            console.log('✅ Available slots loaded:', data.availableSlots);
            console.log('🔴 Booked slots:', data.bookedSlots);
            console.log('⏰ Working hours:', data.workingHours);
        } catch (error) {
            console.error('❌ Error fetching available slots:', error);
            if (error instanceof Error && error.name === 'AbortError') {
                alert('Запрос занял слишком много времени. Попробуйте еще раз.');
            }
            setAvailableSlots([]);
            setBookedSlots([]);
            setAllSlots([]);
        } finally {
            setIsLoadingSlots(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && !isBooked) {
            fetchAvailableDays(currentMonth);
        }
    }, [currentMonth, isOpen, isBooked, fetchAvailableDays]);

    useEffect(() => {
        if (!isOpen) {
            setShowSuccess(false);
            setIsBooked(false);
            setSelectedDate(null);
            setSelectedTime(null);
            setAvailableSlots([]);
            setBookedSlots([]);
            setAllSlots([]);
            setAvailableDays([]);
            setShowConfirmation(false);
            setFormName("");
            setFormEmail("");
            setFormPhone("");
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedDate && !isBooked) {
            fetchAvailableSlots(selectedDate);
            setSelectedTime(null); 
        }
    }, [selectedDate, isBooked, fetchAvailableSlots]);

    const handleOpenConfirmation = () => {
        if (!selectedDate || !selectedTime) return;
        setFormName(profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "");
        setFormEmail(profile?.email || "");
        setFormPhone(profile?.phone || "");
        setShowConfirmation(true);
    };

    const handleBookConsultation = async () => {
        if (!user) {
            alert("Пожалуйста, войдите в аккаунт");
            return;
        }

        if (!formName || !formEmail || !formPhone) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Пожалуйста, выберите дату и время консультации");
            return;
        }

        if (isBooked) {
            return;
        }

        setIsSaving(true);

        try {
            const customerInfo = {
                name: formName,
                email: formEmail,
                phone: formPhone,
            };

            const [hours, minutes] = selectedTime.split(':');
            const appointmentDate = new Date(selectedDate);
            appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            console.log('📅 Selected date:', selectedDate);
            console.log('⏰ Selected time:', selectedTime);
            console.log('📍 Appointment date (local):', appointmentDate.toString());
            console.log('🌍 Appointment date (ISO):', appointmentDate.toISOString());

            console.log("📝 Step 1: Saving consultation to Firebase...", {
                userId: user.uid,
                consultationType,
                duration,
                price,
                customerInfo,
            });

            const orderId = await createConsultationOrder(
                user.uid,
                {
                    consultationType,
                    duration,
                    price,
                    googleCalendarUrl: dynamicCalendarLink,
                },
                customerInfo
            );

            console.log("✅ Step 1 complete: Consultation saved with ID:", orderId);

            console.log("📝 Step 2: Creating Google Calendar event...");

            const response = await fetch("/api/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: customerInfo.name,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                    startTime: appointmentDate.toISOString(),
                    duration: duration,
                    consultationType: consultationType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                
                if (response.status === 409) {
                    alert(`❌ Это время уже забронировано! Пожалуйста, обновите страницу и выберите другое время.`);
                    
                    if (selectedDate) {
                        await fetchAvailableSlots(selectedDate);
                    }
                    return;
                }
                console.warn("⚠️ Google Calendar event creation failed, but consultation is saved in Firebase");
                alert(`Консультация сохранена, но не удалось создать событие в календаре: ${data.error}`);
            } else {
                console.log("✅ Step 2 complete: Calendar event created:", data);

                try {
                    await sendConsultationEmail({
                        customerEmail: customerInfo.email,
                        customerName: customerInfo.name,
                        consultationType: consultationType,
                        date: appointmentDate.toLocaleDateString(),
                        time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        duration: duration,
                        meetingLink: data.eventLink
                    });
                    console.log("✅ Consultation confirmation email sent");
                } catch (emailError) {
                    console.error("⚠️ Error sending consultation email:", emailError);
                    
                }

                setIsBooked(true);
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error("❌ Error during booking process:", error);
            alert(`Ошибка при бронировании: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsBooked(false);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-[var(--color-modal-overlay)] backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-[var(--color-card-bg)] rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden transform transition-all border border-[var(--color-border)]">

                    <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[#8B1515] to-[var(--color-accent)] px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                                    <FaCalendarCheck className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-1">
                                        {consultationType}
                                    </h2>
                                    <p className="text-white/80 text-sm">
                                        <T>Book your consultation slot</T>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-200 group"
                            >
                                <FaTimes className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                            </button>
                        </div>
                    </div>

                    {showSuccess && (
                        <div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-20 bg-[var(--color-success)] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in">
                            <div className="bg-white/20 p-2 rounded-full">
                                <FaCheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">
                                    <T>Success!</T>
                                </p>
                                <p className="text-sm text-white/90">
                                    <T>Your consultation has been booked</T>
                                </p>
                            </div>
                        </div>
                    )}

                    {isSaving && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center">
                            <div className="bg-[var(--color-card-bg)] rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 border border-[var(--color-border)]">
                                <div className="relative mx-auto">
                                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-gray-200)]"></div>
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-primary)] absolute top-0"></div>
                                </div>
                                <span className="text-[var(--color-text)] font-semibold text-lg">
                                    <T>Processing your booking...</T>
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="p-8 sm:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                            <div className="lg:col-span-2 space-y-6">

                                <div className="bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-gray-100)] rounded-2xl p-6 border border-[var(--color-border)]">
                                    <h3 className="text-lg font-bold mb-6 flex items-center text-[var(--color-text)]">
                                        <div className="bg-[var(--color-info)] p-2 rounded-xl mr-3">
                                            <FaInfoCircle className="text-white w-4 h-4" />
                                        </div>
                                        <T>Details</T>
                                    </h3>
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between bg-[var(--color-card-bg)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-[var(--color-info)]/10 rounded-xl flex items-center justify-center mr-4">
                                                    <FaClock className="text-[var(--color-info)] w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--color-gray-500)] uppercase tracking-wide">
                                                        <T>Duration</T>
                                                    </p>
                                                    <p className="text-lg font-bold text-[var(--color-text)]">
                                                        {duration} <T>min</T>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between bg-[var(--color-card-bg)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-[var(--color-success)]/10 rounded-xl flex items-center justify-center mr-4">
                                                    <FaMoneyBillWave className="text-[var(--color-success)] w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--color-gray-500)] uppercase tracking-wide">
                                                        <T>Price</T>
                                                    </p>
                                                    <p className="text-2xl font-bold text-[var(--color-success)]">
                                                        ${price}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[var(--color-card-bg)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 text-[var(--color-text)]">
                                        <T>What&apos;s Included</T>
                                    </h3>
                                    <ul className="space-y-3">
                                        {features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 text-sm text-[var(--color-text)]"
                                            >
                                                <div className="bg-[var(--color-success)]/10 p-1 rounded-lg mt-0.5">
                                                    <FaCheckCircle className="text-[var(--color-success)] w-4 h-4" />
                                                </div>
                                                <span>
                                                    <T>{feature}</T>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {profile && profile.firstName && profile.email && (
                                    <div className="bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-2xl p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[var(--color-accent)] p-2 rounded-xl">
                                                <FaInfoCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--color-gray-500)] mb-1">
                                                    <T>Booking as:</T>
                                                </p>
                                                <p className="font-semibold text-[var(--color-text)]">
                                                    {profile.firstName} {profile.lastName}
                                                </p>
                                                <p className="text-sm text-[var(--color-gray-500)]">
                                                    {profile.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-3 space-y-6">

                                <div className="bg-[var(--color-card-bg)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-[var(--color-text)]">
                                                <T>Select Date</T>
                                            </h3>
                                            {isLoadingDays && (
                                                <div className="flex items-center gap-2 text-xs text-[var(--color-info)]">
                                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-[var(--color-info)] border-t-transparent"></div>
                                                    <span><T>Checking availability...</T></span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handlePrevMonth}
                                                className="p-2 hover:bg-[var(--color-gray-100)] rounded-xl transition-colors"
                                            >
                                                <FaChevronLeft className="w-4 h-4 text-[var(--color-text)]" />
                                            </button>
                                            <span className="text-sm font-semibold text-[var(--color-text)] min-w-[140px] text-center">
                                                {
                                                    monthNames[
                                                        currentMonth.getMonth()
                                                    ]
                                                }{" "}
                                                {currentMonth.getFullYear()}
                                            </span>
                                            <button
                                                onClick={handleNextMonth}
                                                className="p-2 hover:bg-[var(--color-gray-100)] rounded-xl transition-colors"
                                            >
                                                <FaChevronRight className="w-4 h-4 text-[var(--color-text)]" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 mb-3">
                                        {dayNames.map((day) => (
                                            <div
                                                key={day}
                                                className="text-center text-xs font-semibold text-[var(--color-gray-500)] py-2"
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-2">
                                        {days.map((day, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    day &&
                                                    !isDateDisabled(day) &&
                                                    setSelectedDate(day)
                                                }
                                                disabled={
                                                    isDateDisabled(day) ||
                                                    isBooked
                                                }
                                                className={`
                                                    aspect-square rounded-xl text-sm font-medium transition-all duration-200
                                                    ${!day ? "invisible" : ""}
                                                    ${
                                                        isDateDisabled(day)
                                                            ? "text-[var(--color-gray-300)] cursor-not-allowed"
                                                            : "hover:bg-[var(--color-primary)]/10 cursor-pointer text-[var(--color-text)]"
                                                    }
                                                    ${
                                                        isSameDay(
                                                            day,
                                                            selectedDate
                                                        )
                                                            ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg scale-105"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                {day?.getDate()}
                                            </button>
                                        ))}
                                    </div>

                                    {!isLoadingDays && (
                                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                                            <div className="flex flex-wrap gap-4 text-xs text-[var(--color-gray-500)]">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">1</span>
                                                    </div>
                                                    <span><T>Selected</T></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 rounded-lg bg-[var(--color-gray-100)] flex items-center justify-center">
                                                        <span className="text-[var(--color-text)] text-xs font-medium">1</span>
                                                    </div>
                                                    <span><T>Available</T></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                                                        <span className="text-[var(--color-gray-300)] text-xs font-medium">1</span>
                                                    </div>
                                                    <span><T>No available slots</T></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {selectedDate && (
                                    <div className="bg-[var(--color-card-bg)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm animate-fade-in">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-[var(--color-text)]">
                                                <T>Select Time</T>
                                            </h3>
                                            {isLoadingSlots && (
                                                <div className="flex items-center gap-2 text-sm text-[var(--color-info)] font-medium">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--color-info)] border-t-transparent"></div>
                                                    <span>
                                                        <T>
                                                            Checking Google
                                                            Calendar...
                                                        </T>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {allSlots.length > 0 &&
                                            !isLoadingSlots && (
                                                <div className="mb-4 flex gap-4 text-xs text-[var(--color-gray-500)]">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-3 h-3 bg-[var(--color-gray-100)] rounded"></div>
                                                        <span>
                                                            <T>Available</T>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-3 h-3 bg-red-50 rounded line-through"></div>
                                                        <span>
                                                            <T>Booked</T>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        {allSlots.length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {allSlots
                                                        .filter((time) => !bookedSlots.includes(time)) 
                                                        .map((time) => {
                                                            return (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedTime(time)}
                                                                    disabled={isLoadingSlots}
                                                                    className={`
                                                                        py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200
                                                                        ${
                                                                            selectedTime === time
                                                                                ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg scale-105"
                                                                                : "bg-[var(--color-gray-100)] text-[var(--color-text)] hover:bg-[var(--color-gray-200)] cursor-pointer"
                                                                        }
                                                                    `}
                                                                >
                                                                    {time}
                                                                </button>
                                                            );
                                                        })}
                                                </div>
                                                
                                            </>
                                        ) : !isLoadingSlots ? (
                                            <div className="p-6 text-center">
                                                <div className="text-4xl mb-3">
                                                    📅
                                                </div>
                                                <p className="text-[var(--color-text)] font-semibold mb-2">
                                                    <T>
                                                        No available time slots
                                                    </T>
                                                </p>
                                                <p className="text-sm text-[var(--color-gray-500)]">
                                                    <T>
                                                        Please select another
                                                        date or contact us
                                                        directly
                                                    </T>
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                {isBooked && (
                                    <div className="bg-gradient-to-r from-[var(--color-success)]/10 to-[var(--color-success)]/5 border-2 border-[var(--color-success)] rounded-2xl p-6 animate-fade-in">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-[var(--color-success)] p-3 rounded-2xl">
                                                <FaCheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-[var(--color-success)] mb-1">
                                                    <T>Booking Confirmed!</T>
                                                </p>
                                                <p className="text-sm text-[var(--color-text)]">
                                                    <T>
                                                        Your consultation has
                                                        been scheduled.
                                                        You&apos;ll receive a
                                                        calendar invitation via
                                                        email.
                                                    </T>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-gray-50)] px-8 py-6 border-t border-[var(--color-border)]">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-[var(--color-gray-500)] flex items-center">
                                <span className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-2 animate-pulse"></span>
                                <T>Secure & encrypted booking</T>
                            </p>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-[var(--color-border)] rounded-xl text-[var(--color-text)] font-semibold hover:bg-[var(--color-gray-100)] transition-all duration-200"
                                >
                                    <T>Cancel</T>
                                </button>
                                <button
                                    onClick={handleOpenConfirmation}
                                    disabled={
                                        isBooked ||
                                        !selectedDate ||
                                        !selectedTime
                                    }
                                    className={`
                                        flex-1 sm:flex-none px-8 py-3 font-bold rounded-xl shadow-lg
                                        flex items-center justify-center gap-2
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all duration-200 transform hover:scale-105
                                        ${
                                            isBooked
                                                ? "bg-[var(--color-success)] text-white"
                                                : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white hover:shadow-xl"
                                        }
                                    `}
                                >
                                    {isBooked ? (
                                        <>
                                            <FaCheckCircle className="w-5 h-5" />
                                            <T>Booked!</T>
                                        </>
                                    ) : (
                                        <>
                                            <FaChevronRight className="w-5 h-5" />
                                            <T>Continue</T>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmation && selectedDate && selectedTime && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmation(false)} />
                    <div className="relative bg-[var(--color-card-bg)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--color-border)] overflow-hidden">

                        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] px-6 py-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <FaCalendarCheck className="w-5 h-5" />
                                    <T>Confirm Booking</T>
                                </h3>
                                <button onClick={() => setShowConfirmation(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <FaTimes className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {isSaving && (
                            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                                <div className="bg-[var(--color-card-bg)] rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-gray-200)] border-t-[var(--color-primary)]"></div>
                                    <span className="text-[var(--color-text)] font-semibold"><T>Processing your booking...</T></span>
                                </div>
                            </div>
                        )}

                        <div className="p-6 space-y-5">

                            <div className="bg-[var(--color-gray-50)] rounded-xl p-4 space-y-3 border border-[var(--color-border)]">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--color-gray-500)]"><T>Consultation</T></span>
                                    <span className="font-semibold text-[var(--color-text)]">{consultationType}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--color-gray-500)]"><T>Date</T></span>
                                    <span className="font-semibold text-[var(--color-text)]">{selectedDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--color-gray-500)]"><T>Time</T></span>
                                    <span className="font-semibold text-[var(--color-text)]">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--color-gray-500)]"><T>Duration</T></span>
                                    <span className="font-semibold text-[var(--color-text)]">{duration} <T>min</T></span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
                                    <span className="text-sm font-semibold text-[var(--color-text)]"><T>Price</T></span>
                                    <span className="text-xl font-bold text-[var(--color-success)]">${price}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-[var(--color-text)]"><T>Your Information</T></h4>
                                <div>
                                    <label className="block text-sm text-[var(--color-gray-500)] mb-1"><T>Full Name</T> *</label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-card-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--color-gray-500)] mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-card-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--color-gray-500)] mb-1"><T>Phone</T> *</label>
                                    <input
                                        type="tel"
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-card-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-[var(--color-border)] flex gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 px-4 py-3 border-2 border-[var(--color-border)] rounded-xl text-[var(--color-text)] font-semibold hover:bg-[var(--color-gray-100)] transition-colors"
                            >
                                <T>Back</T>
                            </button>
                            <button
                                onClick={handleBookConsultation}
                                disabled={isSaving || !formName || !formEmail || !formPhone}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <T>Booking...</T>
                                    </>
                                ) : (
                                    <>
                                        <FaCalendarCheck className="w-5 h-5" />
                                        <T>Confirm Booking</T>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
