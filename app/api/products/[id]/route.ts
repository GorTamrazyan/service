import { NextResponse } from "next/server";
import {
    getProductById,
    updateProduct,
    deleteProduct,
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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, colorPrices, categoryId, typeOfProductId, materialId, colorIds, featured, discount } = body;

        if (name !== undefined && !name) {
            return NextResponse.json(
                { message: "Имя продукта не может быть пустым" },
                { status: 400 }
            );
        }

        if (
            colorPrices !== undefined &&
            (typeof colorPrices !== "object" || Array.isArray(colorPrices) ||
            !Object.values(colorPrices).every((v) => typeof v === "number" && (v as number) > 0))
        ) {
            return NextResponse.json(
                {
                    message: "colorPrices должен быть объектом с положительными числами",
                },
                { status: 400 }
            );
        }

        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { message: "Продукт не найден" },
                { status: 404 }
            );
        }

        await updateProduct(id, {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(colorPrices !== undefined && { colorPrices }),
            ...(categoryId !== undefined && { categoryId }),
            ...(typeOfProductId !== undefined && { typeOfProductId }),
            ...(materialId !== undefined && { materialId }),
            ...(colorIds !== undefined && { colorIds }),
            ...(featured !== undefined && { featured }),
            ...(discount !== undefined && { discount }),
        });

        const updatedProduct = await getProductById(id);

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("Ошибка при обновлении продукта:", error);
        return NextResponse.json(
            { message: "Не удалось обновить продукт" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { message: "Продукт не найден" },
                { status: 404 }
            );
        }

        await deleteProduct(id);

        return NextResponse.json(
            { message: "Продукт успешно удален" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
        return NextResponse.json(
            { message: "Не удалось удалить продукт" },
            { status: 500 }
        );
    }
}
