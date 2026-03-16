import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, startTime, duration, consultationType } =
            body;

        if (!name || !email || !startTime) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

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
            scopes: ["https://www.googleapis.com/auth/calendar"],
        });

        const calendar = google.calendar({ version: "v3", auth });
        const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

        const calendarResponse = await calendar.calendars.get({ calendarId });
        const calendarTimezone =
            calendarResponse.data.timeZone || "Europe/Moscow";

        const startDate = new Date(startTime);
        const endDate = new Date(
            startDate.getTime() + (duration || 60) * 60 * 1000
        );

        const freeBusyResponse = await calendar.freebusy.query({
            requestBody: {
                timeMin: startDate.toISOString(),
                timeMax: endDate.toISOString(),
                timeZone: calendarTimezone,
                items: [{ id: calendarId }],
            },
        });

        const busySlots =
            freeBusyResponse.data.calendars?.[calendarId]?.busy || [];

        const isSlotBusy = busySlots.some((busy) => {
            const bStart = new Date(busy.start!);
            const bEnd = new Date(busy.end!);
            return startDate < bEnd && endDate > bStart;
        });

        if (isSlotBusy) {
            return NextResponse.json(
                { error: "This time slot has already been booked." },
                { status: 409 }
            );
        }

        const description = `CLIENT_BOOKING:
Консультация: ${consultationType || "Общая"}
Клиент: ${name}
Email: ${email}
Телефон: ${phone || "не указан"}
Длительность: ${duration || 60} мин.
        `.trim();

        const event = await calendar.events.insert({
            calendarId: calendarId,
            requestBody: {
                summary: `📞 ${consultationType || "Консультация"}: ${name}`,
                description: description,
                start: {
                    dateTime: startDate.toISOString(),
                    timeZone: calendarTimezone,
                },
                end: {
                    dateTime: endDate.toISOString(),
                    timeZone: calendarTimezone,
                },
                reminders: {
                    useDefault: false,
                    overrides: [{ method: "popup", minutes: 30 }],
                },
            },
        });

        return NextResponse.json({
            success: true,
            eventId: event.data.id,
            eventLink: event.data.htmlLink,
        });
    } catch (error: any) {
        console.error("❌ Booking Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
