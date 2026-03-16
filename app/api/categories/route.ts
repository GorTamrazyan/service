import { NextResponse } from "next/server";
import { getAllCategories } from "../../lib/firebase/products";

export async function GET() {
    try {
        
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
