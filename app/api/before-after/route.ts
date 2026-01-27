// app/api/before-after/route.ts
import { NextResponse } from "next/server";
import {
    getAllProjects,
    getActiveProjects,
    createProject,
    updateProject,
    deleteProject,
    uploadProjectImage,
} from "../../lib/firebase/beforeAfter";

/**
 * GET - Получить все проекты или только активные
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get("activeOnly") === "true";

        const projects = activeOnly
            ? await getActiveProjects()
            : await getAllProjects();

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { message: "Failed to load projects" },
            { status: 500 }
        );
    }
}

/**
 * POST - Создать новый проект
 */
export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const beforeFile = formData.get("beforeImage") as File;
        const afterFile = formData.get("afterImage") as File;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const order = parseInt(formData.get("order") as string) || 0;
        const isActive = formData.get("isActive") === "true";

        // Валидация
        if (!beforeFile || !afterFile || !description || !location) {
            return NextResponse.json(
                {
                    message:
                        "Before image, after image, description and location are required",
                },
                { status: 400 }
            );
        }

        // Загружаем изображения
        const beforeImageUrl = await uploadProjectImage(beforeFile, "before");
        const afterImageUrl = await uploadProjectImage(afterFile, "after");

        // Создаем проект
        const projectId = await createProject({
            beforeImage: beforeImageUrl,
            afterImage: afterImageUrl,
            description,
            location,
            order,
            isActive,
        });

        return NextResponse.json(
            {
                message: "Project created successfully",
                id: projectId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { message: "Failed to create project" },
            { status: 500 }
        );
    }
}

/**
 * PUT - Обновить проект
 */
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Project ID is required" },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        const beforeFile = formData.get("beforeImage") as File | null;
        const afterFile = formData.get("afterImage") as File | null;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const order = formData.get("order")
            ? parseInt(formData.get("order") as string)
            : undefined;
        const isActive = formData.has("isActive")
            ? formData.get("isActive") === "true"
            : undefined;

        const updates: any = {};

        // Загружаем новые изображения если они предоставлены
        if (beforeFile && beforeFile.size > 0) {
            updates.beforeImage = await uploadProjectImage(
                beforeFile,
                "before"
            );
        }
        if (afterFile && afterFile.size > 0) {
            updates.afterImage = await uploadProjectImage(afterFile, "after");
        }

        if (description) updates.description = description;
        if (location) updates.location = location;
        if (order !== undefined) updates.order = order;
        if (isActive !== undefined) updates.isActive = isActive;

        await updateProject(id, updates);

        return NextResponse.json(
            { message: "Project updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { message: "Failed to update project" },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Удалить проект
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Project ID is required" },
                { status: 400 }
            );
        }

        await deleteProject(id);

        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { message: "Failed to delete project" },
            { status: 500 }
        );
    }
}
