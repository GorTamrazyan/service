// app/api/products/route.ts
import { PrismaClient } from "../../generated/prisma"; // Убедитесь, что путь правильный
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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

        // Объект, который будет содержать условия фильтрации для Prisma
        const whereClause: any = {};

        if (category && category !== "all") {
            // 'all' будет означать отсутствие фильтрации по категории
            whereClause.category = category;
        }

        if (minPrice || maxPrice) {
            whereClause.price = {}; // Создаем объект для условий по цене
            if (minPrice) {
                // Prisma ожидает число для сравнения, поэтому преобразуем строку
                // Так как price в БД String, нам нужно использовать gte (больше или равно) на строке,
                // что может быть не идеально для числовых сравнений.
                // Для точных числовых сравнений лучше использовать Number(price) и сравнивать.
                // Но для фильтрации по строке, Prisma может сравнивать лексикографически.
                // Для корректного числового сравнения, мы можем получить все и фильтровать на фронте,
                // или использовать более сложный запрос в Prisma, если бы price был Float/Decimal.
                // Для простоты, пока будем считать, что price в БД хранится как "XX.YY" и сравнивать как строки.
                // В реальном проекте, если price String, то фильтрация по диапазону цен на бэкенде
                // требует преобразования в число перед сравнением или использования RAW SQL.
                // Для этого примера, мы будем полагать, что minPrice и maxPrice будут сравниваться как строки.
                // ЛУЧШЕЕ РЕШЕНИЕ: если price в БД String, фильтрацию по диапазону цен выполнять на фронтенде
                // после получения всех данных, или использовать Float в БД.
                // Для демонстрации, я покажу, как это можно сделать, но имейте в виду ограничения строкового сравнения.
                whereClause.price.gte = minPrice;
            }
            if (maxPrice) {
                whereClause.price.lte = maxPrice;
            }
        }

        // Получаем продукты с учетом фильтров
        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: {
                name: "asc", // Сортируем по имени по умолчанию
            },
        });

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
 * Опционально: Вы можете также добавить POST-запрос в этот же файл,
 * чтобы создавать новые продукты через API.
 * Если вы уже заполняете базу данных через Prisma Studio, этот POST-метод
 * может быть не нужен для начала.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json(); // Получаем данные из тела запроса
        const { name, description, price, imageUrl, category } = body;

        // Базовая валидация входных данных
        if (!name || !price) {
            return NextResponse.json(
                { message: "Имя и цена продукта обязательны" },
                { status: 400 }
            );
        }
        // Поскольку price теперь String в вашей схеме SQLite
        if (
            typeof price !== "string" ||
            isNaN(parseFloat(price)) ||
            parseFloat(price) <= 0
        ) {
            return NextResponse.json(
                {
                    message:
                        "Цена должна быть корректной строкой-числом и быть положительной",
                },
                { status: 400 }
            );
        }

        // Создаем новую запись продукта в базе данных
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price).toFixed(2), // Убедитесь, что цена сохраняется с 2 знаками после запятой
                imageUrl,
                category,
            },
        });
        // Возвращаем созданный продукт с HTTP-статусом 201 (Created)
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Ошибка при создании продукта:", error);
        return NextResponse.json(
            { message: "Не удалось создать продукт" },
            { status: 500 }
        );
    }
}
