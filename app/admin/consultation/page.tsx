// app/admin/consultation/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    FaCalendarAlt,
    FaDownload,
    FaPrint,
    FaEye,
    FaEyeSlash,
    FaSync,
    FaPhone,
    FaEnvelope,
    FaClock,
} from "react-icons/fa";

interface Appointment {
    id: string;
    clientName: string;
    email: string;
    phone: string;
    type: string;
    duration: number;
    date: string;
    status: string;
    notes: string;
    htmlLink?: string;
}

export default function AdminCalendarView() {
    const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");
    const [showDetails, setShowDetails] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ID календаря из переменных окружения
    const CALENDAR_ID = "gor.tamrazyan2002@gmail.com";

    // Функция для отмены бронирования
    const handleCancelAppointment = async (appointmentId: string, clientName: string) => {
        if (!confirm(`Вы уверены, что хотите отменить бронирование для ${clientName}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/cancel?eventId=${appointmentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to cancel appointment");
            }

            // Успешная отмена - обновляем список
            alert(`Бронирование для ${clientName} успешно отменено`);
            fetchCalendarEvents(); // Перезагружаем список
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            alert(`Ошибка при отмене бронирования: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Функция для получения событий из API
    const fetchCalendarEvents = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Получаем события за следующие 30 дней
            const timeMin = new Date().toISOString();
            const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

            const response = await fetch(
                `/api/calendar-events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=50`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch calendar events");
            }

            const data = await response.json();

            // Фильтруем только клиентские бронирования (с маркером CLIENT_BOOKING:)
            const clientBookings = data.events.filter((event: { description?: string }) => {
                return event.description?.includes("CLIENT_BOOKING:");
            });

            // Преобразуем события в формат appointments
            const formattedAppointments = clientBookings.map((event: {
                id: string;
                description?: string;
                summary: string;
                start: string;
                status: string;
                htmlLink?: string;
            }) => {
                // Извлекаем информацию из description
                const description = event.description || "";
                const clientMatch = description.match(/Клиент:\s*(.+)/);
                const emailMatch = description.match(/Email:\s*(.+)/);
                const phoneMatch = description.match(/Телефон:\s*(.+)/);
                const durationMatch = description.match(/Длительность:\s*(\d+)/);
                const typeMatch = event.summary.match(/Консультация:\s*(.+?)\s*-\s*(.+)/);

                return {
                    id: event.id,
                    clientName: clientMatch ? clientMatch[1].trim() : event.summary,
                    email: emailMatch ? emailMatch[1].trim() : "N/A",
                    phone: phoneMatch ? phoneMatch[1].trim() : "N/A",
                    type: typeMatch ? typeMatch[2].trim() : "General Consultation",
                    duration: durationMatch ? parseInt(durationMatch[1]) : 60,
                    date: event.start,
                    status: event.status === "confirmed" ? "confirmed" : "pending",
                    notes: description,
                    htmlLink: event.htmlLink,
                };
            });

            setAppointments(formattedAppointments);
            console.log(`Loaded ${formattedAppointments.length} appointments from Google Calendar`);
        } catch (err) {
            console.error("Error fetching calendar events:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch calendar events");
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для получения embed URL
    const getCalendarEmbedUrl = () => {
        const baseUrl = "https://calendar.google.com/calendar/embed";
        const params = new URLSearchParams({
            src: CALENDAR_ID,
            ctz: "UTC",
            mode: viewMode,
            showPrint: "0",
            showTabs: "0",
            showCalendars: "0",
            showTitle: "0",
            showNav: "1",
            showDate: "1",
            height: "600",
            wkst: "1",
            bgcolor: "#ffffff",
            color: "#3b82f6",
            showTz: "0",
        });

        return `${baseUrl}?${params.toString()}`;
    };

    // Загружаем события при монтировании компонента
    useEffect(() => {
        fetchCalendarEvents();
    }, []);

    useEffect(() => {
        // При изменении режима просмотра обновляем iframe
        setIsLoading(true);
        // Имитация загрузки
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [viewMode]);

    const refreshCalendar = () => {
        fetchCalendarEvents();
    };

    const exportAppointments = () => {
        // Логика экспорта в CSV
        const csvContent =
            "data:text/csv;charset=utf-8," +
            "Client Name,Email,Phone,Type,Date,Status,Notes\n" +
            appointments
                .map(
                    (a) =>
                        `"${a.clientName}","${a.email}","${a.phone}","${a.type}","${a.date}","${a.status}","${a.notes}"`
                )
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "appointments.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full space-y-6">
            {/* Панель управления админа */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FaCalendarAlt className="text-blue-600 mr-3" />
                            Consultation Calendar - Admin View
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View and manage all scheduled consultations
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={refreshCalendar}
                            className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <FaSync className="mr-2" />
                            Refresh
                        </button>
                        <button
                            onClick={exportAppointments}
                            className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <FaDownload className="mr-2" />
                            Export CSV
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <FaPrint className="mr-2" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Переключатель вида календаря */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-700 font-medium">View:</span>
                        {(["week", "month", "day"] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === mode
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-gray-700 font-medium">Show:</span>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                                showDetails
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {showDetails ? (
                                <>
                                    <FaEye className="mr-2" />
                                    Details
                                </>
                            ) : (
                                <>
                                    <FaEyeSlash className="mr-2" />
                                    Details
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Основной календарь */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Google Calendar
                        </h2>
                        <div className="flex gap-2">
                            <a
                                href="https://calendar.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Open in Google Calendar
                            </a>
                            <span className="text-gray-400">|</span>
                            <button
                                onClick={refreshCalendar}
                                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                            >
                                <FaSync className="mr-1" size={12} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300 flex items-center justify-between">
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-blue-600 mr-2" />
                                <span className="font-medium text-gray-700">
                                    Calendar View ({viewMode})
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center h-[600px] bg-gray-50">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">
                                        Loading calendar...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-[600px]">
                                {/* Альтернатива 1: Используйте embed URL */}
                                <iframe
                                    src={getCalendarEmbedUrl()}
                                    className="w-full h-full border-0"
                                    title="Admin Calendar View"
                                    onLoad={() => setIsLoading(false)}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    scrolling="no"
                                />

                                {/* Альтернатива 2: Если iframe не работает, покажите инструкцию */}
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 hidden">
                                    <div className="text-center p-8 max-w-md">
                                        <FaCalendarAlt className="text-4xl text-blue-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">
                                            Calendar Setup Required
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            To display the calendar, you need
                                            to:
                                        </p>
                                        <ol className="text-left text-sm text-gray-600 mb-6 space-y-2">
                                            <li>
                                                1. Open Google Calendar settings
                                            </li>
                                            <li>2. Find your Calendar ID</li>
                                            <li>
                                                3. Replace CALENDAR_EMAIL in the
                                                code
                                            </li>
                                            <li>
                                                4. Make sure calendar is public
                                            </li>
                                        </ol>
                                        <a
                                            href="https://support.google.com/calendar/answer/37648"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            View setup instructions
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Список предстоящих консультаций */}
                {showDetails && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaClock className="text-blue-600 mr-2" />
                            Upcoming Appointments ({appointments.length})
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-800">
                                                {appointment.clientName}
                                            </h4>
                                            <div className="flex items-center mt-1">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        appointment.status ===
                                                        "confirmed"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {appointment.status}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {appointment.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-500 block">
                                                {new Date(
                                                    appointment.date
                                                ).toLocaleDateString()}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    appointment.date
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <FaEnvelope className="w-3 h-3 mr-2 text-blue-500" />
                                            <span>{appointment.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaPhone className="w-3 h-3 mr-2 text-green-500" />
                                            <span>{appointment.phone}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaClock className="w-3 h-3 mr-2 text-purple-500" />
                                            <span>
                                                {appointment.duration} minutes
                                            </span>
                                        </div>
                                    </div>

                                    {appointment.notes && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-sm text-gray-700">
                                                {appointment.notes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                                        {appointment.htmlLink && (
                                            <a
                                                href={appointment.htmlLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                                            >
                                                View Details
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleCancelAppointment(appointment.id, appointment.clientName)}
                                            className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Ошибка загрузки */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                        <div className="text-red-600 mr-3">⚠️</div>
                        <div>
                            <h3 className="font-semibold text-red-800">Error Loading Calendar</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow">
                    <div className="text-2xl font-bold text-blue-600">
                        {appointments.length}
                    </div>
                    <div className="text-sm text-gray-600">
                        Total Appointments
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                    <div className="text-2xl font-bold text-green-600">
                        {appointments.filter(a => a.status === "confirmed").length}
                    </div>
                    <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                    <div className="text-2xl font-bold text-yellow-600">
                        {appointments.filter(a => a.status === "pending").length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                    <div className="text-2xl font-bold text-red-600">
                        {appointments.filter(a => a.status === "cancelled").length}
                    </div>
                    <div className="text-sm text-gray-600">Cancelled</div>
                </div>
            </div>
        </div>
    );
}
