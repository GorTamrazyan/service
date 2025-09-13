// app/api/products/route.ts
import { NextResponse } from "next/server";
import { 
    getAllProducts, 
    getFilteredProducts, 
    createProduct, 
    getProductById 
} from "../../lib/firebase/firestore";

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

        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");

        // Используем Firestore helper функции для получения продуктов
        let products;
        
        if (category || minPrice || maxPrice) {
            // Получаем продукты с фильтрацией
            products = await getFilteredProducts({
                category: category || undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined
            });
        } else {
            // Получаем все продукты
            products = await getAllProducts();
        }

        return NextResponse.json(products, { status: 200 });
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
        const { name, description, price, imageUrl, category, inStock } = body;

        // Базовая валидация входных данных
        if (!name || !price) {
            return NextResponse.json(
                { message: "Имя и цена продукта обязательны" },
                { status: 400 }
            );
        }

        if (
            typeof price !== "string" ||
            isNaN(parseFloat(price)) ||
            parseFloat(price) <= 0
        ) {
            return NextResponse.json(
                {
                    message: "Цена должна быть корректной строкой-числом и быть положительной",
                },
                { status: 400 }
            );
        }

        // Используем Firestore helper функцию для создания продукта
        const newProductId = await createProduct({
            name,
            description: description || undefined,
            price: parseFloat(price).toFixed(2),
            imageUrl: imageUrl || undefined,
            category: category || undefined,
            inStock: inStock !== undefined ? inStock : true
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
