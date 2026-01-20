import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
    try {
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
        );

        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
        });

        const calendar = google.calendar({ version: "v3", auth });
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        // Получаем параметры
        const { searchParams } = new URL(request.url);
        const timeMin = searchParams.get("timeMin") || new Date().toISOString();
        const timeMax = searchParams.get("timeMax") || undefined;
        const maxResults = parseInt(searchParams.get("maxResults") || "50");

        const response = await calendar.events.list({
            calendarId,
            timeMin,
            timeMax,
            maxResults,
            singleEvents: true,
            orderBy: "startTime",
            // Мы не запрашиваем удаленные события
            showDeleted: false,
        });

        const events = response.data.items || [];

        // Форматируем события с защитой от пустых дат
        const formattedEvents = events.map((event) => {
            // Google возвращает либо dateTime (для встреч), либо date (для событий на весь день)
            const start = event.start?.dateTime || event.start?.date;
            const end = event.end?.dateTime || event.end?.date;

            return {
                id: event.id,
                summary: event.summary || "Без названия",
                description: event.description || "",
                start,
                end,
                // Добавляем флаг "весь день", это поможет правильно отрисовать в UI
                isAllDay: !event.start?.dateTime,
                htmlLink: event.htmlLink,
                status: event.status,
            };
        });

        return NextResponse.json({
            success: true,
            count: formattedEvents.length,
            events: formattedEvents,
            // Передаем часовой пояс календаря, чтобы фронтенд знал, в каком контексте данные
            timeZone: response.data.timeZone,
        });
    } catch (error: any) {
        console.error("❌ Calendar Events Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch events" },
            { status: 500 }
        );
    }
}
