// app/api/categories/route.ts
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Получаем все уникальные категории из таблицы Product
        const categories = await prisma.product.findMany({
            distinct: ["category"], // Получаем только уникальные значения поля 'category'
            select: {
                category: true, // Выбираем только само поле 'category'
            },
            where: {
                category: {
                    not: null, // Исключаем записи, где category равно null
                },
            },
            orderBy: {
                category: "asc", // Сортируем по имени категории
            },
        });

        // Преобразуем результат в массив строк категорий и фильтруем null
        const categoryNames = categories
            .map((item) => item.category)
            .filter((name): name is string => name !== null); // Фильтруем null и указываем TypeScript, что это string[]

        return NextResponse.json(categoryNames, { status: 200 });
    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        return NextResponse.json(
            { message: "Не удалось загрузить категории" },
            { status: 500 }
        );
    }
}
