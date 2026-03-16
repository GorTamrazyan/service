import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, 
    },
});

export const createCustomTransporter = (config: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
}) => {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass,
        },
    });
};

export const verifyEmailConnection = async (): Promise<boolean> => {
    try {
        await transporter.verify();
        console.log('Email server connection verified successfully');
        return true;
    } catch (error) {
        console.error('Email server connection failed:', error);
        return false;
    }
};

export const defaultSender = {
    name: "ONIK'S VINYL",
    email: process.env.EMAIL_USER || 'noreply@oniks-vinyl.com',
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
