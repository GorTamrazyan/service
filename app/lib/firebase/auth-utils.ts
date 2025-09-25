// lib/firebase/auth-utils.ts

import { User, sendEmailVerification, reload } from "firebase/auth";

export const checkEmailVerification = async (user: User): Promise<boolean> => {
    try {
        await reload(user);
        return user.emailVerified;
    } catch (error) {
        console.error('Ошибка при перезагрузке пользователя:', error);
        return user.emailVerified;
    }
};

export const resendVerificationEmail = async (user: User): Promise<void> => {
    try {
        await sendEmailVerification(user, {
            url: `${window.location.origin}/client/dashboard/home`,
            handleCodeInApp: false,
        });
        console.log("✅ Email для верификации повторно отправлен на:", user.email);
    } catch (error) {
        console.error("❌ Ошибка при повторной отправке email:", error);
        throw new Error("Не удалось отправить email для верификации");
    }
};

export const waitForEmailVerification = async (user: User): Promise<boolean> => {
    return new Promise((resolve) => {
        const checkInterval = setInterval(async () => {
            await reload(user);
            if (user.emailVerified) {
                clearInterval(checkInterval);
                resolve(true);
            }
        }, 3000); // Проверяем каждые 3 секунды

        // Останавливаем проверку через 5 минут
        setTimeout(() => {
            clearInterval(checkInterval);
            resolve(false);
        }, 300000);
    });
};