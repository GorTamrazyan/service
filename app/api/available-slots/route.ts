import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15 * 1000;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get("date"); // Ожидаем формат YYYY-MM-DD

        if (!date)
            return NextResponse.json(
                { error: "Date is required" },
                { status: 400 }
            );

        const cacheKey = `slots-${date}`;
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

        // 1. Получаем часовой пояс календаря
        const calendarResponse = await calendar.calendars.get({ calendarId });
        const calendarTimezone =
            calendarResponse.data.timeZone || "Europe/Moscow";

        // 2. Настраиваем временной диапазон запроса (весь выбранный день)
        // Используем формат ISO с указанием таймзоны, чтобы Google понял нас правильно
        const timeMin = `${date}T00:00:00Z`;
        const timeMax = `${date}T23:59:59Z`;

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

        // 3. Генерируем слоты
        const workingHoursStart = parseInt(
            process.env.WORKING_HOURS_START || "9"
        );
        const workingHoursEnd = parseInt(process.env.WORKING_HOURS_END || "18");

        const allSlots = [];
        const now = new Date(); // Для проверки, не прошло ли время уже

        for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
            const timeString = `${hour.toString().padStart(2, "0")}:00`;

            /** * Создаем объект даты для каждого слота.
             * Мы используем Intl для парсинга, чтобы гарантировать, что "09:00"
             * — это именно 09:00 в часовом поясе календаря.
             */
            const slotDate = new Date(`${date}T${timeString}:00`);

            // Если выбран "сегодняшний" день — не показываем часы, которые уже прошли
            if (slotDate < now) continue;

            allSlots.push({
                time: timeString,
                start: slotDate,
                end: new Date(slotDate.getTime() + 60 * 60 * 1000), // +1 час
            });
        }

        // 4. Фильтруем занятые
        const availableSlotsStrings: string[] = [];
        const bookedSlotsStrings: string[] = [];

        allSlots.forEach((slot) => {
            const isBusy = busySlots.some((busy) => {
                const busyStart = new Date(busy.start!);
                const busyEnd = new Date(busy.end!);
                // Проверка пересечения: начало слота раньше конца занятости И конец слота позже начала занятости
                return slot.start < busyEnd && slot.end > busyStart;
            });

            if (isBusy) {
                bookedSlotsStrings.push(slot.time);
            } else {
                availableSlotsStrings.push(slot.time);
            }
        });

        const result = {
            success: true,
            availableSlots: availableSlotsStrings,
            bookedSlots: bookedSlotsStrings,
            allSlots: allSlots.map((s) => s.time),
            calendarTimezone,
        };

        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
