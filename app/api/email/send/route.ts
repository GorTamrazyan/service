import { NextRequest, NextResponse } from 'next/server';
import {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
    sendConsultationConfirmationEmail,
    sendPasswordResetEmail,
    sendNewsletterEmail,
    escapeHtml,
} from '../../../lib/email/services';
import {
    requireUser,
    requireAdmin,
    authErrorResponse,
    getDocumentAsUser,
    queryAsUser,
    AuthContext,
} from '../../../lib/firebase/serverAuth';

// Emails a signed-in customer may trigger for themselves
const USER_EMAIL_TYPES = ['welcome', 'order_confirmation', 'consultation_booking'];
// Emails only an admin may send
const ADMIN_EMAIL_TYPES = ['order_status', 'newsletter', 'password_reset'];
// Non-transactional emails the customer can opt out of in profile settings
const OPTIONAL_EMAIL_TYPES = ['order_status', 'newsletter'];

const ORDER_ID_PATTERN = /^[A-Za-z0-9]{1,64}$/;
const MEETING_LINK_PREFIX = 'https://www.google.com/calendar/';

const text = (value: unknown, max = 200) => escapeHtml(String(value ?? '').slice(0, max));

const badRequest = (error: string) =>
    NextResponse.json({ success: false, error }, { status: 400 });

// Loads an order as the calling user; Firestore rules only allow the owner (or an admin)
const loadOwnOrder = async (ctx: AuthContext, orderId: unknown) => {
    if (typeof orderId !== 'string' || !ORDER_ID_PATTERN.test(orderId)) return null;
    const order = await getDocumentAsUser(`orders/${orderId}`, ctx.token);
    if (!order || order.userId !== ctx.user.uid) return null;
    return order;
};

const isEmailNotificationsEnabled = async (email: string, token: string) => {
    const users = await queryAsUser('users', 'email', email, token);
    return !users.some((u) => u.emailNotifications === false);
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type || !data) {
            return badRequest('Missing type or data');
        }

        let ctx: AuthContext;
        if (USER_EMAIL_TYPES.includes(type)) {
            ctx = await requireUser(request);
        } else if (ADMIN_EMAIL_TYPES.includes(type)) {
            ctx = await requireAdmin(request);
        } else {
            return badRequest(`Unknown email type: ${type}`);
        }

        if (OPTIONAL_EMAIL_TYPES.includes(type) && data.customerEmail) {
            if (!(await isEmailNotificationsEnabled(data.customerEmail, ctx.token))) {
                return NextResponse.json({ success: true, skipped: true });
            }
        }

        let result;

        switch (type) {
            case 'welcome': {
                const email = ctx.user.email;
                if (!email) {
                    return badRequest('Account has no email');
                }
                result = await sendWelcomeEmail({
                    customerEmail: email,
                    customerName: text(data.customerName || email.split('@')[0], 100),
                });
                break;
            }

            case 'order_confirmation': {
                const order = await loadOwnOrder(ctx, data.orderId);
                if (!order || !order.customerInfo?.email) {
                    return badRequest('Order not found');
                }
                result = await sendOrderConfirmationEmail({
                    orderId: data.orderId,
                    customerEmail: order.customerInfo.email,
                    customerName: text(order.customerInfo.name, 100),
                    items: (order.products || []).map((p: any) => ({
                        name: text(p.name),
                        quantity: Number(p.quantity) || 0,
                        price: text(p.price, 20),
                    })),
                    totalPrice: text(order.totalPrice, 20),
                    shippingAddress: text(order.customerInfo.address, 300),
                });
                break;
            }

            case 'consultation_booking': {
                const order = await loadOwnOrder(ctx, data.orderId);
                if (!order || order.type !== 'consultation' || !order.customerInfo?.email) {
                    return badRequest('Consultation not found');
                }
                const meetingLink =
                    typeof data.meetingLink === 'string' && data.meetingLink.startsWith(MEETING_LINK_PREFIX)
                        ? data.meetingLink
                        : undefined;
                result = await sendConsultationConfirmationEmail({
                    customerEmail: order.customerInfo.email,
                    customerName: text(order.customerInfo.name, 100),
                    consultationType: text(order.consultation?.consultationType, 100),
                    date: text(data.date, 50),
                    time: text(data.time, 50),
                    duration: Number(order.consultation?.duration) || 0,
                    meetingLink,
                });
                break;
            }

            case 'order_status':
                if (!data.orderId || !data.customerEmail || !data.customerName || !data.newStatus) {
                    return badRequest('Missing required order status data');
                }
                result = await sendOrderStatusEmail({
                    orderId: data.orderId,
                    customerEmail: data.customerEmail,
                    customerName: text(data.customerName, 100),
                    newStatus: data.newStatus,
                });
                break;

            case 'password_reset':
                if (!data.customerEmail || !data.customerName || !data.resetLink) {
                    return badRequest('Missing required password reset data');
                }
                result = await sendPasswordResetEmail({
                    customerEmail: data.customerEmail,
                    customerName: text(data.customerName, 100),
                    resetLink: data.resetLink,
                });
                break;

            case 'newsletter':
                if (!data.customerEmail || !data.customerName || !data.subject || !data.content) {
                    return badRequest('Missing required newsletter data');
                }
                result = await sendNewsletterEmail({
                    customerEmail: data.customerEmail,
                    customerName: text(data.customerName, 100),
                    subject: data.subject,
                    content: data.content,
                    ctaText: data.ctaText,
                    ctaLink: data.ctaLink,
                });
                break;

            default:
                return badRequest(`Unknown email type: ${type}`);
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                messageId: result.messageId,
            });
        } else {
            return NextResponse.json(
                { success: false, error: 'Failed to send email' },
                { status: 500 }
            );
        }
    } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;

        console.error('Error in email send API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
