import { NextResponse } from "next/server";
import {
    getProductById,
} from "../../../lib/firebase/products";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await getProductById(id);

        if (!product) {
            return NextResponse.json(
                { message: "Продукт не найден" },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении продукта:", error);
        return NextResponse.json(
            { message: "Не удалось загрузить продукт" },
            { status: 500 }
        );
    }
}
