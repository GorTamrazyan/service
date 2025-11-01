// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import {
    getProductById,
    updateProduct,
    deleteProduct,
} from "../../../lib/firebase/products";

/**
 * GET-запрос для получения продукта по ID
 */
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

/**
 * PUT-запрос для обновления продукта
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, price, categoryId, typeOfProductId, materialId, colorIds, featured, discount } = body;

        // Базовая валидация
        if (name !== undefined && !name) {
            return NextResponse.json(
                { message: "Имя продукта не может быть пустым" },
                { status: 400 }
            );
        }

        if (
            price !== undefined &&
            (typeof price !== "number" || price <= 0)
        ) {
            return NextResponse.json(
                {
                    message: "Цена должна быть положительным числом",
                },
                { status: 400 }
            );
        }

        // Проверяем, существует ли продукт
        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { message: "Продукт не найден" },
                { status: 404 }
            );
        }

        // Обновляем продукт
        await updateProduct(id, {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price }),
            ...(categoryId !== undefined && { categoryId }),
            ...(typeOfProductId !== undefined && { typeOfProductId }),
            ...(materialId !== undefined && { materialId }),
            ...(colorIds !== undefined && { colorIds }),
            ...(featured !== undefined && { featured }),
            ...(discount !== undefined && { discount }),
        });

        // Получаем обновленный продукт
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

/**
 * DELETE-запрос для удаления продукта
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Проверяем, существует ли продукт
        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { message: "Продукт не найден" },
                { status: 404 }
            );
        }

        // Удаляем продукт
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
