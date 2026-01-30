import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const month = searchParams.get("month"); // Формат: YYYY-MM

        if (!month) {
            return NextResponse.json(
                { error: "Month is required (format: YYYY-MM)" },
                { status: 400 }
            );
        }

        // Проверяем кэш
        const cacheKey = `days-${month}`;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return NextResponse.json(cached.data);
        }

        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
        );
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
        });

        const calendar = google.calendar({ version: "v3", auth });
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        // Получаем часовой пояс календаря
        const calendarResponse = await calendar.calendars.get({ calendarId });
        const calendarTimezone =
            calendarResponse.data.timeZone || "Europe/Moscow";

        // Определяем начало и конец месяца
        const [year, monthNum] = month.split("-").map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0); // Последний день месяца

        const timeMin = `${month}-01T00:00:00Z`;
        const lastDay = endDate.getDate();
        const timeMax = `${month}-${lastDay.toString().padStart(2, "0")}T23:59:59Z`;

        // Получаем занятые слоты для всего месяца
        const freeBusyResponse = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                timeZone: calendarTimezone,
                items: [{ id: calendarId }],
            },
        });

        const busySlots =
            freeBusyResponse.data.calendars?.[calendarId]?.busy || [];

        const workingHoursStart = parseInt(
            process.env.WORKING_HOURS_START || "9"
        );
        const workingHoursEnd = parseInt(process.env.WORKING_HOURS_END || "18");

        // Определяем доступные дни
        const availableDays: string[] = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Проверяем каждый день месяца
        for (let day = 1; day <= lastDay; day++) {
            const dateString = `${month}-${day.toString().padStart(2, "0")}`;
            const currentDate = new Date(year, monthNum - 1, day);

            // Пропускаем прошедшие дни
            if (currentDate < now) continue;

            // Проверяем есть ли хотя бы один свободный слот в этот день
            let hasAvailableSlot = false;

            for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
                const timeString = `${hour.toString().padStart(2, "0")}:00`;
                // Создаём время слота в локальном часовом поясе календаря
                const slotDate = new Date(`${dateString}T${timeString}:00`);
                const slotEnd = new Date(slotDate.getTime() + 60 * 60 * 1000);

                // Пропускаем прошедшие слоты
                if (slotDate < new Date()) continue;

                // Проверяем, не занят ли слот
                const isBusy = busySlots.some((busy) => {
                    const busyStart = new Date(busy.start!);
                    const busyEnd = new Date(busy.end!);
                    return slotDate < busyEnd && slotEnd > busyStart;
                });

                if (!isBusy) {
                    hasAvailableSlot = true;
                    break;
                }
            }

            if (hasAvailableSlot) {
                availableDays.push(dateString);
            }
        }

        const result = {
            success: true,
            month,
            availableDays,
            calendarTimezone,
        };

        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
