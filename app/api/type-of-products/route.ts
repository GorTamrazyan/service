// app/api/type-of-products/route.ts
import { NextResponse } from "next/server";
import { getAllTypeOfProducts } from "../../lib/firebase/products";

export async function GET() {
    try {
        const types = await getAllTypeOfProducts();
        return NextResponse.json(types, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении типов продуктов:", error);
        return NextResponse.json(
            { message: "Не удалось загрузить типы продуктов" },
            { status: 500 }
        );
    }
}


