// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { getAllCategories } from "../../lib/firebase/products";

export async function GET() {
    try {
        // Используем Firestore helper функцию для получения всех категорий
        const categories = await getAllCategories();

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        return NextResponse.json(
            { message: "Не удалось загрузить категории" },
            { status: 500 }
        );
    }
}
