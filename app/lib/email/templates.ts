const baseStyles = `
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; }
        .header .subtitle { color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 5px; }
        .content { padding: 30px; }
        .footer { background-color: #2d2d2d; padding: 20px; text-align: center; color: #888888; font-size: 12px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%); color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .info-box { background-color: #f8f8f8; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .item-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .total-row { font-weight: bold; font-size: 18px; color: #8B0000; padding-top: 15px; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-pending { background-color: #FEF3C7; color: #92400E; }
        .status-confirmed { background-color: #DBEAFE; color: #1E40AF; }
        .status-shipped { background-color: #E9D5FF; color: #6B21A8; }
        .status-delivered { background-color: #D1FAE5; color: #065F46; }
        .status-cancelled { background-color: #FEE2E2; color: #991B1B; }
    </style>
`;

export const welcomeEmailTemplate = (customerName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ONIK'S VINYL</h1>
            <div class="subtitle">Premium Vinyl Fencing Solutions</div>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to ONIK'S VINYL!</h2>
            <p style="color: #555; line-height: 1.6;">
                Hello <strong>${customerName}</strong>,
            </p>
            <p style="color: #555; line-height: 1.6;">
                Thank you for creating an account with us! We're thrilled to have you as part of our community.
            </p>
            <div class="info-box">
                <p style="margin: 0; color: #555;">
                    <strong>What you can do now:</strong>
                </p>
                <ul style="color: #666; margin: 10px 0;">
                    <li>Browse our premium vinyl fencing collection</li>
                    <li>Book a free consultation with our experts</li>
                    <li>Get personalized recommendations</li>
                    <li>Track your orders and appointments</li>
                </ul>
            </div>
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/client/dashboard/home" class="button">
                    Start Exploring
                </a>
            </div>
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
                If you have any questions, feel free to contact our support team.
            </p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ONIK'S VINYL. All rights reserved.</p>
            <p>Premium Vinyl Fencing Solutions</p>
        </div>
    </div>
</body>
</html>
`;

export interface OrderItem {
    name: string;
    quantity: number;
    price: number | string;
}

export const orderConfirmationTemplate = (
    orderId: string,
    customerName: string,
    items: OrderItem[],
    totalPrice: string,
    shippingAddress: string
) => {
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ONIK'S VINYL</h1>
            <div class="subtitle">Order Confirmation</div>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Thank You for Your Order!</h2>
            <p style="color: #555; line-height: 1.6;">
                Hello <strong>${customerName}</strong>,
            </p>
            <p style="color: #555; line-height: 1.6;">
                We've received your order and are getting it ready. Here are your order details:
            </p>

            <div class="info-box">
                <p style="margin: 0;"><strong>Order ID:</strong> #${orderId.slice(-8)}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background-color: #f8f8f8;">
                        <th style="padding: 12px; text-align: left;">Item</th>
                        <th style="padding: 12px; text-align: center;">Qty</th>
                        <th style="padding: 12px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                        <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #8B0000;">$${totalPrice}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="info-box">
                <p style="margin: 0;"><strong>Shipping Address:</strong></p>
                <p style="margin: 5px 0 0; color: #666;">${shippingAddress}</p>
            </div>

            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/client/dashboard/profile" class="button">
                    Track Your Order
                </a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ONIK'S VINYL. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

export const orderStatusUpdateTemplate = (
    orderId: string,
    customerName: string,
    newStatus: string,
    statusMessage: string
) => {
    const statusClass = `status-${newStatus.toLowerCase()}`;
    const statusLabels: Record<string, string> = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ONIK'S VINYL</h1>
            <div class="subtitle">Order Update</div>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Order Status Update</h2>
            <p style="color: #555; line-height: 1.6;">
                Hello <strong>${customerName}</strong>,
            </p>
            <p style="color: #555; line-height: 1.6;">
                Your order status has been updated.
            </p>

            <div class="info-box" style="text-align: center;">
                <p style="margin: 0 0 10px;"><strong>Order ID:</strong> #${orderId.slice(-8)}</p>
                <span class="status-badge ${statusClass}">${statusLabels[newStatus] || newStatus}</span>
            </div>

            <p style="color: #555; line-height: 1.6; margin-top: 20px;">
                ${statusMessage}
            </p>

            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/client/dashboard/profile" class="button">
                    View Order Details
                </a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ONIK'S VINYL. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

export const consultationBookingTemplate = (
    customerName: string,
    consultationType: string,
    date: string,
    time: string,
    duration: number,
    meetingLink?: string
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ONIK'S VINYL</h1>
            <div class="subtitle">Consultation Confirmed</div>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Your Consultation is Booked!</h2>
            <p style="color: #555; line-height: 1.6;">
                Hello <strong>${customerName}</strong>,
            </p>
            <p style="color: #555; line-height: 1.6;">
                Great news! Your consultation has been successfully scheduled. Here are the details:
            </p>

            <div class="info-box">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #888;">Consultation Type:</td>
                        <td style="padding: 8px 0; font-weight: bold;">${consultationType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #888;">Date:</td>
                        <td style="padding: 8px 0; font-weight: bold;">${date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #888;">Time:</td>
                        <td style="padding: 8px 0; font-weight: bold;">${time}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #888;">Duration:</td>
                        <td style="padding: 8px 0; font-weight: bold;">${duration} minutes</td>
                    </tr>
                </table>
            </div>

            ${meetingLink ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="${meetingLink}" class="button">
                    Join Meeting
                </a>
            </div>
            ` : ''}

            <div style="background-color: #FEF3C7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400E; font-size: 14px;">
                    <strong>Reminder:</strong> Please be ready 5 minutes before your scheduled time. You'll receive a calendar invitation shortly.
                </p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ONIK'S VINYL. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const passwordResetTemplate = (
    customerName: string,
    resetLink: string
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ONIK'S VINYL</h1>
            <div class="subtitle">Password Reset Request</div>
        </div>
        <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #555; line-height: 1.6;">
                Hello <strong>${customerName}</strong>,
            </p>
            <p style="color: #555; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">
                    Reset Password
                </a>
            </div>

            <div style="background-color: #FEE2E2; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #991B1B; font-size: 14px;">
                    <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                </p>
            </div>

            <p style="color: #888; font-size: 12px; margin-top: 30px;">
                This link will expire in 1 hour for security reasons.
            </p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ONIK'S VINYL. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const newsletterTemplate = (
    customerName: string,
    subject: string,
    content: string,
    ctaText?: string,
    ctaLink?: string
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ONIK'S VINYL</h1>
            <div class="subtitle">${subject}</div>
        </div>
        <div class="content">
            <p style="color: #555; line-height: 1.6;">
                Hello <strong>${customerName}</strong>,
            </p>
            <div style="color: #555; line-height: 1.8;">
                ${content}
            </div>

            ${ctaText && ctaLink ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="${ctaLink}" class="button">
                    ${ctaText}
                </a>
            </div>
            ` : ''}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ONIK'S VINYL. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/unsubscribe" style="color: #888; text-decoration: underline;">
                    Unsubscribe from emails
                </a>
            </p>
        </div>
    </div>
</body>
</html>
`;

export type EmailTemplateType =
    | 'welcome'
    | 'order_confirmation'
    | 'order_status'
    | 'consultation_booking'
    | 'password_reset'
    | 'newsletter';
