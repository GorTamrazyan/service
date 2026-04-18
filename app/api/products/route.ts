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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const categoryId = searchParams.get("categoryId");
        const typeOfProductId = searchParams.get("typeOfProductId");
        const materialId = searchParams.get("materialId");
        const colorIds = searchParams.get("colorIds")?.split(",").filter(Boolean);
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const featuredParam = searchParams.get("featured");
        const featured = featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;
        const limit = searchParams.get("_limit") ? parseInt(searchParams.get("_limit")!) : undefined;

        let products;

        const hasFilters = categoryId || typeOfProductId || materialId || minPrice || maxPrice || featured !== undefined;

        if (hasFilters) {
            products = await getFilteredProductsEnriched({
                categoryId: categoryId || undefined,
                typeOfProductId: typeOfProductId || undefined,
                materialId: materialId || undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                featured,
            });
        } else {
            products = await getAllProductsEnriched();
        }

        if (limit) {
            products = products.slice(0, limit);
        }

        if (colorIds && colorIds.length > 0) {
            products = products.filter((product) =>
                colorIds.some((colorId) => product.colorIds?.includes(colorId))
            );
        }

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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, colorPrices, categoryId, typeOfProductId, materialId, colorIds, featured, discount } = body;

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
