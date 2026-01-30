// app/api/products/route.ts
import { NextResponse } from "next/server";
import {
    getAllProducts,
    getFilteredProducts,
    createProduct,
    getProductById,
    getAllProductsEnriched,
    getFilteredProductsEnriched,
    getProductByIdEnriched,
} from "../../lib/firebase/products";

/**
 * Обработчик GET-запроса для получения всех продуктов с возможностью фильтрации.
 * Принимает параметры запроса:
 * - category: string (например, ?category=vinyl)
 * - minPrice: string (например, ?minPrice=30)
 * - maxPrice: string (например, ?maxPrice=70)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const categoryId = searchParams.get("categoryId");
        const typeOfProductId = searchParams.get("typeOfProductId");
        const materialId = searchParams.get("materialId");
        const colorIds = searchParams.get("colorIds")?.split(",").filter(Boolean);
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");

        // Используем Firestore helper функции для получения продуктов с полными данными
        let products;

        const hasFilters = categoryId || typeOfProductId || materialId || minPrice || maxPrice;

        if (hasFilters) {
            // Получаем продукты с фильтрацией и полными данными материалов/цветов
            products = await getFilteredProductsEnriched({
                categoryId: categoryId || undefined,
                typeOfProductId: typeOfProductId || undefined,
                materialId: materialId || undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            });
        } else {
            // Получаем все продукты с полными данными материалов/цветов
            products = await getAllProductsEnriched();
        }

        // Фильтруем по colorIds на сервере (после получения)
        if (colorIds && colorIds.length > 0) {
            products = products.filter((product) =>
                colorIds.some((colorId) => product.colorIds?.includes(colorId))
            );
        }

        // Форматируем продукты для клиента с массивом URL изображений
        const formattedProducts = products.map((product) => ({
            ...product,
            images: product.images?.map((img) => img.url) || [],
        }));

        return NextResponse.json(formattedProducts, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении продуктов:", error);
        return NextResponse.json(
            { message: "Не удалось загрузить продукты" },
            { status: 500 }
        );
    }
}
/*
 * POST-запрос для создания новых продуктов через API
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, colorPrices, categoryId, typeOfProductId, materialId, colorIds, featured, discount } = body;

        // Базовая валидация входных данных
        if (!name || !colorPrices) {
            return NextResponse.json(
                { message: "Имя и цены продукта обязательны" },
                { status: 400 }
            );
        }

        if (
            typeof colorPrices !== "object" || Array.isArray(colorPrices) ||
            Object.keys(colorPrices).length === 0 ||
            !Object.values(colorPrices).every((v) => typeof v === "number" && (v as number) > 0)
        ) {
            return NextResponse.json(
                {
                    message: "colorPrices должен быть объектом с положительными числами",
                },
                { status: 400 }
            );
        }

        // Используем Firestore helper функцию для создания продукта
        const newProductId = await createProduct({
            name,
            description: description || undefined,
            colorPrices,
            categoryId: categoryId || undefined,
            typeOfProductId: typeOfProductId || undefined,
            materialId: materialId || undefined,
            colorIds: colorIds || [],
            featured: featured || false,
            discount: discount || 0,
        });

        // Получаем созданный продукт для возврата
        const newProduct = await getProductById(newProductId);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Ошибка при создании продукта:", error);
        return NextResponse.json(
            { message: "Не удалось создать продукт" },
            { status: 500 }
        );
    }
}
