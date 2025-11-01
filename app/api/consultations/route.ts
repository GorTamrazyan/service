// app/api/consultations/route.ts
import { NextResponse } from "next/server";
// Убедитесь, что путь импорта соответствует вашему файлу
import { getAllConsultations } from "../../lib/firebase/service";

export async function GET() {
    try {
        // Вызываем функцию для получения консультаций
        const consultations = await getAllConsultations();

        // Возвращаем успешный ответ
        return NextResponse.json(consultations, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении консультаций:", error);
        // Возвращаем ошибку 500
        return NextResponse.json(
            { message: "Не удалось загрузить список консультаций (тарифов)" },
            { status: 500 }
        );
    }
}
