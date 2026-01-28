// app/api/email/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConnection, transporter, defaultSender } from '../../../lib/email/config';

export async function GET() {
    try {
        // Проверяем наличие environment variables
        const emailUser = process.env.EMAIL_USER;
        const emailPassword = process.env.EMAIL_PASSWORD;

        const configStatus = {
            EMAIL_USER: emailUser ? 'Set' : 'Missing',
            EMAIL_PASSWORD: emailPassword ? 'Set' : 'Missing',
            NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'Not set (using default)',
        };

        // Если конфигурация неполная, возвращаем информацию об ошибке
        if (!emailUser || !emailPassword) {
            return NextResponse.json({
                success: false,
                error: 'Email configuration incomplete',
                config: configStatus,
                instructions: [
                    '1. Create an App Password in your Gmail account:',
                    '   - Go to Google Account > Security > 2-Step Verification',
                    '   - Scroll down to "App passwords"',
                    '   - Create a new app password for "Mail"',
                    '2. Add to your .env.local file:',
                    '   EMAIL_USER=your-email@gmail.com',
                    '   EMAIL_PASSWORD=your-app-password',
                    '3. Restart your Next.js development server',
                ],
            });
        }

        // Проверяем подключение к SMTP серверу
        const isConnected = await verifyEmailConnection();

        if (isConnected) {
            return NextResponse.json({
                success: true,
                message: 'Email server connection verified successfully',
                config: configStatus,
                sender: defaultSender,
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'Failed to connect to email server',
                config: configStatus,
                troubleshooting: [
                    'Check if your email and password are correct',
                    'Make sure you are using an App Password, not your regular password',
                    'Verify that "Less secure app access" is enabled or use App Passwords',
                    'Check if your Gmail account has 2-Step Verification enabled',
                ],
            });
        }
    } catch (error) {
        console.error('Error testing email connection:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }, { status: 500 });
    }
}

// POST endpoint для отправки тестового письма
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testEmail } = body;

        if (!testEmail) {
            return NextResponse.json({
                success: false,
                error: 'Test email address is required',
            }, { status: 400 });
        }

        // Отправляем тестовое письмо
        const info = await transporter.sendMail({
            from: `"${defaultSender.name}" <${defaultSender.email}>`,
            to: testEmail,
            subject: "Test Email - ONIK'S VINYL Email System",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%); padding: 20px; text-align: center; color: white; }
                        .content { padding: 20px; background: #f5f5f5; }
                        .success { color: #10B981; font-size: 24px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>ONIK'S VINYL</h1>
                            <p>Email System Test</p>
                        </div>
                        <div class="content">
                            <h2 class="success">Email Configuration Successful!</h2>
                            <p>This is a test email from your ONIK'S VINYL email system.</p>
                            <p>If you received this email, your email configuration is working correctly.</p>
                            <hr>
                            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                            <p><strong>Sent to:</strong> ${testEmail}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: info.messageId,
            recipient: testEmail,
        });
    } catch (error) {
        console.error('Error sending test email:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }, { status: 500 });
    }
}
