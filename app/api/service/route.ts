// app/api/services/route.ts
import { NextResponse } from "next/server";
// Убедитесь, что путь импорта соответствует вашему файлу
import { getAllServices } from "../../lib/firebase/service";

export async function GET() {
    try {
        // Вызываем функцию для получения услуг
        const services = await getAllServices();

        // Возвращаем успешный ответ
        return NextResponse.json(services, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении услуг:", error);
        // Возвращаем ошибку 500
        return NextResponse.json(
            { message: "Не удалось загрузить список услуг" },
            { status: 500 }
        );
    }
}
