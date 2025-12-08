// app/api/admin/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
    getAllNotifications,
    markAllNotificationsAsRead,
} from "../../lib/firebase/notifications";

// GET: Получить все уведомления
export async function GET() {
    try {
        console.log("🔔 API: Fetching all notifications...");

        const notifications = await getAllNotifications();

        console.log(
            "📊 API: Retrieved notifications count:",
            notifications.length
        );
        console.log("📋 API: Notifications data:", notifications);

        // Преобразуем Timestamp в строку для JSON
        const serializedNotifications = notifications.map((notif) => ({
            ...notif,
            created_at:
                notif.created_at?.toDate?.()?.toISOString() || notif.created_at,
        }));

        console.log("✅ API: Returning serialized notifications");

        return NextResponse.json({
            notifications: serializedNotifications,
            count: serializedNotifications.length,
        });
    } catch (error) {
        console.error("❌ API Error fetching notifications:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch notifications",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// PUT: Пометить все уведомления как прочитанные
export async function PUT() {
    try {
        console.log("👁 API: Marking all notifications as read...");
        await markAllNotificationsAsRead();
        console.log("✅ API: All notifications marked as read");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ API Error marking all notifications as read:", error);
        return NextResponse.json(
            {
                error: "Failed to mark all notifications as read",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
