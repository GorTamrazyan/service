"use client";

import React, { useState } from "react";
import { sendOrderStatusEmail } from "../../../lib/email/helpers";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";

interface OrderStatusUpdateProps {
    orderId: string;
    customerEmail: string;
    customerName: string;
    currentStatus: string;
    onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
}

const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-500" },
    { value: "shipped", label: "Shipped", color: "bg-purple-500" },
    { value: "delivered", label: "Delivered", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

export default function OrderStatusUpdate({
    orderId,
    customerEmail,
    customerName,
    currentStatus,
    onStatusUpdate,
}: OrderStatusUpdateProps) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleStatusChange = async () => {
        if (selectedStatus === currentStatus) return;

        setIsUpdating(true);
        setEmailStatus("idle");
        setErrorMessage("");

        try {
            
            await onStatusUpdate(orderId, selectedStatus);

            if (sendEmail) {
                setEmailStatus("sending");
                try {
                    const emailSent = await sendOrderStatusEmail({
                        orderId,
                        customerEmail,
                        customerName,
                        newStatus: selectedStatus,
                    });

                    if (emailSent) {
                        setEmailStatus("success");
                    } else {
                        setEmailStatus("error");
                        setErrorMessage("Failed to send email notification");
                    }
                } catch (emailError) {
                    console.error("Error sending email:", emailError);
                    setEmailStatus("error");
                    setErrorMessage("Email sending failed");
                }
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setErrorMessage("Failed to update order status");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        const found = statusOptions.find((s) => s.value === status);
        return found?.color || "bg-gray-500";
    };

    return (
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-4">
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                Update Order Status
            </h4>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={isUpdating}
                    className={`flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium border-none ${getStatusColor(
                        selectedStatus
                    )}`}
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleStatusChange}
                    disabled={isUpdating || selectedStatus === currentStatus}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium
                             hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2 transition-all"
                >
                    {isUpdating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Update Status
                        </>
                    )}
                </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <input
                    type="checkbox"
                    id={`send-email-${orderId}`}
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    disabled={isUpdating}
                    className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label
                    htmlFor={`send-email-${orderId}`}
                    className="text-sm text-[var(--color-text)] flex items-center gap-1"
                >
                    <Mail className="w-4 h-4" />
                    Send email notification to customer
                </label>
            </div>

            <div className="text-xs text-[var(--color-gray-500)] mb-2">
                Notification will be sent to: <strong>{customerEmail}</strong>
            </div>

            {emailStatus === "sending" && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-info)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending email notification...
                </div>
            )}

            {emailStatus === "success" && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                    <Check className="w-4 h-4" />
                    Email notification sent successfully!
                </div>
            )}

            {emailStatus === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage || "Failed to send email"}
                </div>
            )}
        </div>
    );
}
