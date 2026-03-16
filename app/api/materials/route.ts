import { NextResponse } from "next/server";
import { getAllMaterials } from "../../lib/firebase/products";

export async function GET() {
    try {
        const materials = await getAllMaterials();
        return NextResponse.json(materials, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении материалов:", error);
        return NextResponse.json(
            { message: "Не удалось загрузить материалы" },
            { status: 500 }
        );
    }
}
