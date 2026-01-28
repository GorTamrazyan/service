// app/lib/email/services.ts
import { transporter, defaultSender, siteUrl } from './config';
import {
    welcomeEmailTemplate,
    orderConfirmationTemplate,
    orderStatusUpdateTemplate,
    consultationBookingTemplate,
    passwordResetTemplate,
    newsletterTemplate,
    OrderItem
} from './templates';

// Интерфейсы для параметров отправки
export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export interface WelcomeEmailParams {
    customerEmail: string;
    customerName: string;
}

export interface OrderEmailParams {
    orderId: string;
    customerEmail: string;
    customerName: string;
    items: OrderItem[];
    totalPrice: string;
    shippingAddress: string;
}

export interface OrderStatusEmailParams {
    orderId: string;
    customerEmail: string;
    customerName: string;
    newStatus: string;
}

export interface ConsultationEmailParams {
    customerEmail: string;
    customerName: string;
    consultationType: string;
    date: string;
    time: string;
    duration: number;
    meetingLink?: string;
}

export interface PasswordResetEmailParams {
    customerEmail: string;
    customerName: string;
    resetLink: string;
}

export interface NewsletterEmailParams {
    customerEmail: string;
    customerName: string;
    subject: string;
    content: string;
    ctaText?: string;
    ctaLink?: string;
}

// Базовая функция отправки email
export const sendEmail = async (options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
        const mailOptions = {
            from: options.from || `"${defaultSender.name}" <${defaultSender.email}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};

// 1. Отправка приветственного письма
export const sendWelcomeEmail = async (params: WelcomeEmailParams) => {
    const html = welcomeEmailTemplate(params.customerName);

    return sendEmail({
        to: params.customerEmail,
        subject: `Welcome to ONIK'S VINYL, ${params.customerName}!`,
        html,
    });
};

// 2. Отправка подтверждения заказа
export const sendOrderConfirmationEmail = async (params: OrderEmailParams) => {
    const html = orderConfirmationTemplate(
        params.orderId,
        params.customerName,
        params.items,
        params.totalPrice,
        params.shippingAddress
    );

    return sendEmail({
        to: params.customerEmail,
        subject: `Order Confirmation #${params.orderId.slice(-8)} - ONIK'S VINYL`,
        html,
    });
};

// 3. Отправка обновления статуса заказа
export const sendOrderStatusEmail = async (params: OrderStatusEmailParams) => {
    const statusMessages: Record<string, string> = {
        pending: 'Your order has been received and is being processed.',
        confirmed: 'Great news! Your order has been confirmed and is being prepared.',
        shipped: 'Your order is on its way! Track your shipment for delivery updates.',
        delivered: 'Your order has been delivered. Thank you for shopping with us!',
        cancelled: 'Your order has been cancelled. If you have questions, please contact support.'
    };

    const html = orderStatusUpdateTemplate(
        params.orderId,
        params.customerName,
        params.newStatus,
        statusMessages[params.newStatus] || 'Your order status has been updated.'
    );

    return sendEmail({
        to: params.customerEmail,
        subject: `Order #${params.orderId.slice(-8)} Status: ${params.newStatus.charAt(0).toUpperCase() + params.newStatus.slice(1)}`,
        html,
    });
};

// 4. Отправка подтверждения консультации
export const sendConsultationConfirmationEmail = async (params: ConsultationEmailParams) => {
    const html = consultationBookingTemplate(
        params.customerName,
        params.consultationType,
        params.date,
        params.time,
        params.duration,
        params.meetingLink
    );

    return sendEmail({
        to: params.customerEmail,
        subject: `Consultation Confirmed: ${params.consultationType} - ONIK'S VINYL`,
        html,
    });
};

// 5. Отправка письма для сброса пароля
export const sendPasswordResetEmail = async (params: PasswordResetEmailParams) => {
    const html = passwordResetTemplate(
        params.customerName,
        params.resetLink
    );

    return sendEmail({
        to: params.customerEmail,
        subject: `Password Reset Request - ONIK'S VINYL`,
        html,
    });
};

// 6. Отправка рассылки/промо
export const sendNewsletterEmail = async (params: NewsletterEmailParams) => {
    const html = newsletterTemplate(
        params.customerName,
        params.subject,
        params.content,
        params.ctaText,
        params.ctaLink
    );

    return sendEmail({
        to: params.customerEmail,
        subject: params.subject,
        html,
    });
};

// Массовая отправка email (для рассылок)
export const sendBulkEmails = async (
    recipients: Array<{ email: string; name: string }>,
    subject: string,
    content: string,
    ctaText?: string,
    ctaLink?: string
): Promise<{ successful: number; failed: number; errors: string[] }> => {
    const results = {
        successful: 0,
        failed: 0,
        errors: [] as string[]
    };

    for (const recipient of recipients) {
        try {
            const result = await sendNewsletterEmail({
                customerEmail: recipient.email,
                customerName: recipient.name,
                subject,
                content,
                ctaText,
                ctaLink
            });

            if (result.success) {
                results.successful++;
            } else {
                results.failed++;
                results.errors.push(`${recipient.email}: ${result.error}`);
            }

            // Небольшая задержка между отправками для избежания rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            results.failed++;
            results.errors.push(`${recipient.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return results;
};
