// app/api/admin/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
    markNotificationAsRead,
    deleteNotification,
} from "../../../lib/firebase/notifications"; // Импортируем deleteNotification

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await markNotificationAsRead(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to mark notification as read" },
            { status: 500 }
        );
    }
}

// Новый метод: DELETE для удаления конкретного уведомления
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteNotification(id); // Вызываем функцию удаления
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return NextResponse.json(
            { error: "Failed to delete notification" },
            { status: 500 }
        );
    }
}
