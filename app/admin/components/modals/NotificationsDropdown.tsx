// components/NotificationsDropdown.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Bell, X, CheckCircle, RefreshCw } from "lucide-react";

export interface Notification {
    id?: string;
    message: string;
    type: "order" | "system" | "alert";
    order_id?: string;
    read: boolean;
    created_at: any;
}

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // ----------------------------------------------------
    //  API CALLS WITH DEBUGGING
    // ----------------------------------------------------

    const fetchNotifications = useCallback(async (silent = false) => {
        if (!silent) {
            console.log("📄 Starting to fetch notifications...");
            setLoading(true);
        } else {
            console.log("🔄 Silent refresh notifications...");
        }

        try {
            const response = await fetch("/api/notifications", {
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache",
                },
            });

            console.log("📡 API Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("📦 Raw API Response:", data);
            console.log("📋 Notifications array:", data.notifications);
            console.log(
                "📊 Notifications count:",
                data.notifications?.length || 0
            );

            // Детальный лог каждого уведомления
            if (data.notifications && data.notifications.length > 0) {
                console.log("🔍 Detailed notifications:");
                data.notifications.forEach(
                    (notif: Notification, index: number) => {
                        console.log(`  [${index}]:`, {
                            id: notif.id,
                            message: notif.message,
                            read: notif.read,
                            type: notif.type,
                            order_id: notif.order_id,
                            created_at: notif.created_at,
                        });
                    }
                );
            }

            setNotifications(data.notifications || []);
            console.log("✅ State updated with notifications");
        } catch (error) {
            console.error("❌ Failed to fetch notifications:", error);
        } finally {
            if (!silent) {
                setLoading(false);
            }
            console.log("✅ Fetch completed");
        }
    }, []);

    const markAsRead = async (notificationId: string) => {
        console.log("👁 Marking notification as read:", notificationId);
        try {
            const response = await fetch(
                `/api/notifications/${notificationId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("📡 Mark as read response status:", response.status);

            if (!response.ok) throw new Error("Failed to mark as read");

            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
            console.log("✅ Notification marked as read");
        } catch (error) {
            console.error("❌ Failed to mark as read:", error);
            await fetchNotifications(true); // Re-fetch on error
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) {
            console.log("⚠️ No unread notifications to mark");
            return;
        }

        console.log("👁 Marking all notifications as read, count:", unreadCount);
        setMarkingAll(true);
        try {
            const response = await fetch("/api/notifications", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(
                "📡 Mark all as read response status:",
                response.status
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ API Error:", errorData);
                throw new Error(
                    errorData.error || "Failed to mark all as read"
                );
            }

            const result = await response.json();
            console.log("✅ API Response:", result);

            // Optimistic update
            setNotifications((prev) => {
                const updated = prev.map((n) => ({ ...n, read: true }));
                console.log("📊 Updated notifications in state:", updated);
                return updated;
            });

            console.log("✅ All notifications marked as read in UI");

            // Принудительно обновляем через 500ms для синхронизации
            setTimeout(() => {
                console.log("🔄 Syncing with server...");
                fetchNotifications(true);
            }, 500);
        } catch (error) {
            console.error("❌ Failed to mark all as read:", error);
            alert(
                "Failed to mark all notifications as read. Check console for details."
            );
            await fetchNotifications(true);
        } finally {
            setMarkingAll(false);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        console.log("🗑️ Deleting notification:", notificationId);
        try {
            const response = await fetch(
                `/api/notifications/${notificationId}`,
                {
                    method: "DELETE",
                }
            );

            console.log("📡 Delete response status:", response.status);

            if (!response.ok) throw new Error("Failed to delete notification");

            // Optimistic update - удаляем из списка
            setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId)
            );
            console.log("✅ Notification deleted");
        } catch (error) {
            console.error("❌ Failed to delete notification:", error);
            await fetchNotifications(true);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        console.log("👆 Notification clicked:", notification);

        // Mark as read if needed
        if (!notification.read && notification.id) {
            await markAsRead(notification.id);
        }

        // Redirect if there's an order_id
        if (notification.order_id) {
            console.log("🔗 Redirecting to order:", notification.order_id);
            setTimeout(() => {
                setIsOpen(false);
                window.location.href = `/admin/orders?showOrder=${notification.order_id}`;
            }, 300);
        }
    };

    // ----------------------------------------------------
    //  EFFECTS
    // ----------------------------------------------------

    // Первоначальная загрузка
    useEffect(() => {
        console.log("🚀 Component mounted, fetching initial notifications");
        fetchNotifications();
    }, [fetchNotifications]);

    // Загрузка при открытии dropdown
    useEffect(() => {
        console.log("🔔 Notifications dropdown opened:", isOpen);
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    useEffect(() => {
        console.log("📊 Notifications state updated:", {
            total: notifications.length,
            unread: unreadCount,
            notifications: notifications,
        });
    }, [notifications, unreadCount]);

    // Auto-refresh каждые 10 секунд (уменьшил для тестирования)
    useEffect(() => {
        console.log("⏰ Setting up auto-refresh interval");

        // Очищаем предыдущий интервал
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Создаем новый интервал
        intervalRef.current = setInterval(() => {
            console.log("🔄 Auto-refresh triggered");
            fetchNotifications(true); // Silent refresh
        }, 10000); // Каждые 10 секунд

        return () => {
            console.log("🛑 Clearing auto-refresh interval");
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest(".notifications-dropdown")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // ----------------------------------------------------
    //  UTILITIES
    // ----------------------------------------------------

    const formatTime = (timestamp: any) => {
        if (!timestamp) {
            console.log("⏰ No timestamp provided");
            return "";
        }

        try {
            const date = timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);

            if (isNaN(date.getTime())) {
                console.log("⏰ Invalid date:", timestamp);
                return "Invalid date";
            }

            const now = new Date();
            const diffInMinutes = Math.floor(
                (now.getTime() - date.getTime()) / (1000 * 60)
            );
            const diffInHours = Math.floor(diffInMinutes / 60);
            const diffInDays = Math.floor(diffInHours / 24);

            if (diffInMinutes < 1) return "Just now";
            if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
            if (diffInHours < 24) return `${diffInHours}h ago`;
            if (diffInDays < 7) return `${diffInDays}d ago`;

            return date.toLocaleDateString();
        } catch (error) {
            console.error("⏰ Error formatting time:", error);
            return "Error";
        }
    };

    // ----------------------------------------------------
    //  RENDER
    // ----------------------------------------------------

    return (
        <div className="relative notifications-dropdown">
            {/* Notification Bell */}
            <button
                onClick={() => {
                    console.log("🔔 Bell clicked, current state:", isOpen);
                    setIsOpen(!isOpen);
                }}
                className="p-2 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors relative"
                aria-label={`Notifications ${
                    unreadCount > 0 ? `(${unreadCount} unread)` : ""
                }`}
            >
                <Bell className="w-5 h-5 text-[var(--color-text)]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-[var(--color-background)] border border-[var(--color-text)]/20 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-[var(--color-text)]/10 bg-[var(--color-secondary)]/20">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-[var(--color-text)]">
                                Notifications{" "}
                                {unreadCount > 0 && (
                                    <span className="text-[var(--color-accent)]">
                                        ({unreadCount} new)
                                    </span>
                                )}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        console.log(
                                            "🔄 Manual refresh clicked"
                                        );
                                        fetchNotifications();
                                    }}
                                    disabled={loading}
                                    className="text-sm p-1 text-[var(--color-text)]/60 hover:text-[var(--color-text)] hover:bg-[var(--color-secondary)]/50 rounded transition-colors disabled:opacity-50"
                                    title="Refresh"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 ${
                                            loading ? "animate-spin" : ""
                                        }`}
                                    />
                                </button>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={markingAll || loading}
                                        className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 disabled:opacity-50 flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--color-secondary)]/50 transition-colors"
                                    >
                                        <CheckCircle className="w-3 h-3" />
                                        <span className="whitespace-nowrap">
                                            {markingAll
                                                ? "Marking..."
                                                : "Mark all read"}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--color-text)]/60">
                                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                <p>Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-[var(--color-text)]/60">
                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No notifications</p>
                                <p className="text-xs mt-2 text-[var(--color-text)]/40">
                                    You're all caught up!
                                </p>
                                <button
                                    onClick={() => fetchNotifications()}
                                    className="mt-4 text-xs text-[var(--color-accent)] hover:underline"
                                >
                                    Check again
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--color-text)]/10">
                                {notifications.map((notification, index) => (
                                    <div
                                        key={notification.id || index}
                                        className={`p-4 transition-all hover:bg-[var(--color-secondary)]/30 ${
                                            !notification.read
                                                ? "bg-[var(--color-accent)]/10 border-l-4 border-l-[var(--color-accent)]"
                                                : "opacity-70"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                            >
                                                <p
                                                    className={`text-sm ${
                                                        !notification.read
                                                            ? "font-semibold text-[var(--color-text)]"
                                                            : "font-medium text-[var(--color-text)]/70"
                                                    }`}
                                                >
                                                    {notification.message}
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <p className="text-xs text-[var(--color-text)]/50">
                                                        {formatTime(
                                                            notification.created_at
                                                        )}
                                                    </p>
                                                    {notification.order_id && (
                                                        <span className="text-xs text-[var(--color-accent)] font-medium">
                                                            View Order →
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (notification.id)
                                                        deleteNotification(
                                                            notification.id
                                                        );
                                                }}
                                                disabled={loading}
                                                className="flex-shrink-0 p-1.5 text-[var(--color-text)]/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                                                title="Delete notification"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Debug Info */}
                    <div className="p-2 border-t border-[var(--color-text)]/10 bg-[var(--color-secondary)]/10">
                        <p className="text-xs text-[var(--color-text)]/40 text-center">
                            Total: {notifications.length} | Unread:{" "}
                            {unreadCount} 
                            
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
