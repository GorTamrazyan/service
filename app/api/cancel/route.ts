import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get("eventId");

        if (!eventId) {
            return NextResponse.json(
                { error: "Event ID is required" },
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

        // Удаляем событие из календаря
        await calendar.events.delete({
            calendarId: calendarId,
            eventId: eventId,
        });

        return NextResponse.json({
            success: true,
            message: "Event cancelled successfully",
        });
    } catch (error: any) {
        console.error("❌ Cancel Error:", error);

        // Если событие не найдено
        if (error.code === 404 || error.message?.includes("Not Found")) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to cancel event" },
            { status: 500 }
        );
    }
}
