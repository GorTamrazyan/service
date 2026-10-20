import { NextResponse } from "next/server";
import {
    getAllProducts,
    getFilteredProducts,
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
