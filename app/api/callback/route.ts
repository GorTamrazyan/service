import { NextRequest, NextResponse } from 'next/server';
import { sendCallbackRequestEmail } from '../../lib/email/services';

const PHONE_PATTERN = /^[+()\-.\s\d]{7,25}$/;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const name = typeof body?.name === 'string' ? body.name.trim() : '';
        const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
        const page = typeof body?.page === 'string' ? body.page.slice(0, 200) : undefined;

        // Honeypot: real users never fill this hidden field
        if (body?.website) {
            return NextResponse.json({ success: true });
        }

        const digits = phone.replace(/\D/g, '');
        if (!name || name.length > 100 || !PHONE_PATTERN.test(phone) || digits.length < 7 || digits.length > 15) {
            return NextResponse.json(
                { success: false, error: 'Invalid name or phone' },
                { status: 400 }
            );
        }

        const result = await sendCallbackRequestEmail({ name, phone, page });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: 'Failed to send request' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in callback API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send request' },
            { status: 500 }
        );
    }
}
