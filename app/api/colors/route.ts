// app/api/colors/route.ts
import { NextResponse } from "next/server";
import { getAllColors } from "../../lib/firebase/products";

export async function GET() {
    try {
        const colors = await getAllColors();
        return NextResponse.json(colors, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении цветов:", error);
        return NextResponse.json(
            { message: "Не удалось загрузить цвета" },
            { status: 500 }
        );
    }
}
