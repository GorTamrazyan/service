// app/api/email/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
    sendConsultationConfirmationEmail,
    sendPasswordResetEmail,
    sendNewsletterEmail,
} from '../../../lib/email/services';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type || !data) {
            return NextResponse.json(
                { success: false, error: 'Missing type or data' },
                { status: 400 }
            );
        }

        let result;

        switch (type) {
            case 'welcome':
                if (!data.customerEmail || !data.customerName) {
                    return NextResponse.json(
                        { success: false, error: 'Missing customerEmail or customerName' },
                        { status: 400 }
                    );
                }
                result = await sendWelcomeEmail({
                    customerEmail: data.customerEmail,
                    customerName: data.customerName,
                });
                break;

            case 'order_confirmation':
                if (!data.orderId || !data.customerEmail || !data.customerName || !data.items || !data.totalPrice || !data.shippingAddress) {
                    return NextResponse.json(
                        { success: false, error: 'Missing required order data' },
                        { status: 400 }
                    );
                }
                result = await sendOrderConfirmationEmail({
                    orderId: data.orderId,
                    customerEmail: data.customerEmail,
                    customerName: data.customerName,
                    items: data.items,
                    totalPrice: data.totalPrice,
                    shippingAddress: data.shippingAddress,
                });
                break;

            case 'order_status':
                if (!data.orderId || !data.customerEmail || !data.customerName || !data.newStatus) {
                    return NextResponse.json(
                        { success: false, error: 'Missing required order status data' },
                        { status: 400 }
                    );
                }
                result = await sendOrderStatusEmail({
                    orderId: data.orderId,
                    customerEmail: data.customerEmail,
                    customerName: data.customerName,
                    newStatus: data.newStatus,
                });
                break;

            case 'consultation_booking':
                if (!data.customerEmail || !data.customerName || !data.consultationType || !data.date || !data.time || !data.duration) {
                    return NextResponse.json(
                        { success: false, error: 'Missing required consultation data' },
                        { status: 400 }
                    );
                }
                result = await sendConsultationConfirmationEmail({
                    customerEmail: data.customerEmail,
                    customerName: data.customerName,
                    consultationType: data.consultationType,
                    date: data.date,
                    time: data.time,
                    duration: data.duration,
                    meetingLink: data.meetingLink,
                });
                break;

            case 'password_reset':
                if (!data.customerEmail || !data.customerName || !data.resetLink) {
                    return NextResponse.json(
                        { success: false, error: 'Missing required password reset data' },
                        { status: 400 }
                    );
                }
                result = await sendPasswordResetEmail({
                    customerEmail: data.customerEmail,
                    customerName: data.customerName,
                    resetLink: data.resetLink,
                });
                break;

            case 'newsletter':
                if (!data.customerEmail || !data.customerName || !data.subject || !data.content) {
                    return NextResponse.json(
                        { success: false, error: 'Missing required newsletter data' },
                        { status: 400 }
                    );
                }
                result = await sendNewsletterEmail({
                    customerEmail: data.customerEmail,
                    customerName: data.customerName,
                    subject: data.subject,
                    content: data.content,
                    ctaText: data.ctaText,
                    ctaLink: data.ctaLink,
                });
                break;

            default:
                return NextResponse.json(
                    { success: false, error: `Unknown email type: ${type}` },
                    { status: 400 }
                );
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                messageId: result.messageId,
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error in email send API:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
}
