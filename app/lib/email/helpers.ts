const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

export interface SendWelcomeEmailParams {
    email: string;
    name: string;
}

export interface SendOrderEmailParams {
    orderId: string;
    customerEmail: string;
    customerName: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number | string;
    }>;
    totalPrice: string;
    shippingAddress: string;
}

export interface SendConsultationEmailParams {
    customerEmail: string;
    customerName: string;
    consultationType: string;
    date: string;
    time: string;
    duration: number;
    meetingLink?: string;
}

export interface SendOrderStatusEmailParams {
    orderId: string;
    customerEmail: string;
    customerName: string;
    newStatus: string;
}

export const sendWelcomeEmailHelper = async (email: string, name: string): Promise<boolean> => {
    try {
        const response = await fetch(`${getApiUrl()}/api/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'welcome',
                data: {
                    customerEmail: email,
                    customerName: name || email.split('@')[0],
                },
            }),
        });

        const result = await response.json();

        if (!result.success) {
            console.error('Failed to send welcome email:', result.error);
            return false;
        }

        console.log('Welcome email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

export const sendOrderEmail = async (params: SendOrderEmailParams): Promise<boolean> => {
    try {
        const response = await fetch(`${getApiUrl()}/api/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'order_confirmation',
                data: {
                    orderId: params.orderId,
                    customerEmail: params.customerEmail,
                    customerName: params.customerName,
                    items: params.items,
                    totalPrice: params.totalPrice,
                    shippingAddress: params.shippingAddress,
                },
            }),
        });

        const result = await response.json();

        if (!result.success) {
            console.error('Failed to send order confirmation email:', result.error);
            return false;
        }

        console.log('Order confirmation email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return false;
    }
};

export const sendConsultationEmail = async (params: SendConsultationEmailParams): Promise<boolean> => {
    try {
        const response = await fetch(`${getApiUrl()}/api/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'consultation_booking',
                data: {
                    customerEmail: params.customerEmail,
                    customerName: params.customerName,
                    consultationType: params.consultationType,
                    date: params.date,
                    time: params.time,
                    duration: params.duration,
                    meetingLink: params.meetingLink,
                },
            }),
        });

        const result = await response.json();

        if (!result.success) {
            console.error('Failed to send consultation confirmation email:', result.error);
            return false;
        }

        console.log('Consultation confirmation email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending consultation confirmation email:', error);
        return false;
    }
};

export const sendOrderStatusEmail = async (params: SendOrderStatusEmailParams): Promise<boolean> => {
    try {
        const response = await fetch(`${getApiUrl()}/api/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'order_status',
                data: {
                    orderId: params.orderId,
                    customerEmail: params.customerEmail,
                    customerName: params.customerName,
                    newStatus: params.newStatus,
                },
            }),
        });

        const result = await response.json();

        if (!result.success) {
            console.error('Failed to send order status email:', result.error);
            return false;
        }

        console.log('Order status email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending order status email:', error);
        return false;
    }
};

export const sendPasswordResetEmailHelper = async (
    email: string,
    name: string,
    resetLink: string
): Promise<boolean> => {
    try {
        const response = await fetch(`${getApiUrl()}/api/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'password_reset',
                data: {
                    customerEmail: email,
                    customerName: name,
                    resetLink: resetLink,
                },
            }),
        });

        const result = await response.json();

        if (!result.success) {
            console.error('Failed to send password reset email:', result.error);
            return false;
        }

        console.log('Password reset email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};
