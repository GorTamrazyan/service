import { NextResponse } from "next/server";
import {
    getAllProjects,
    getActiveProjects,
    getProjectById,
    uploadProjectImage,
    deleteProjectImage,
} from "../../lib/firebase/beforeAfter";
import {
    requireAdmin,
    authErrorResponse,
    createDocumentAsUser,
    updateDocumentAsUser,
    deleteDocumentAsUser,
} from "../../lib/firebase/serverAuth";

const COLLECTION = "beforeAfterProjects";
const ID_PATTERN = /^[A-Za-z0-9]{1,64}$/;

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

export async function POST(request: Request) {
    try {
        const { token } = await requireAdmin(request);
        const formData = await request.formData();

        const beforeFile = formData.get("beforeImage") as File;
        const afterFile = formData.get("afterImage") as File;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const order = parseInt(formData.get("order") as string) || 0;
        const isActive = formData.get("isActive") === "true";

        if (!beforeFile || !afterFile || !description || !location) {
            return NextResponse.json(
                {
                    message:
                        "Before image, after image, description and location are required",
                },
                { status: 400 }
            );
        }

        const beforeImageUrl = await uploadProjectImage(beforeFile, "before");
        const afterImageUrl = await uploadProjectImage(afterFile, "after");

        const now = new Date();
        const projectId = await createDocumentAsUser(
            COLLECTION,
            {
                beforeImage: beforeImageUrl,
                afterImage: afterImageUrl,
                description,
                location,
                order,
                isActive,
                createdAt: now,
                updatedAt: now,
            },
            token
        );

        return NextResponse.json(
            {
                message: "Project created successfully",
                id: projectId,
            },
            { status: 201 }
        );
    } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;

        console.error("Error creating project:", error);
        return NextResponse.json(
            { message: "Failed to create project" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { token } = await requireAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id || !ID_PATTERN.test(id)) {
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

        updates.updatedAt = new Date();
        await updateDocumentAsUser(`${COLLECTION}/${id}`, updates, token);

        return NextResponse.json(
            { message: "Project updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;

        console.error("Error updating project:", error);
        return NextResponse.json(
            { message: "Failed to update project" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { token } = await requireAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id || !ID_PATTERN.test(id)) {
            return NextResponse.json(
                { message: "Project ID is required" },
                { status: 400 }
            );
        }

        const project = await getProjectById(id);
        await deleteDocumentAsUser(`${COLLECTION}/${id}`, token);
        if (project?.beforeImage) await deleteProjectImage(project.beforeImage);
        if (project?.afterImage) await deleteProjectImage(project.afterImage);

        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;

        console.error("Error deleting project:", error);
        return NextResponse.json(
            { message: "Failed to delete project" },
            { status: 500 }
        );
    }
}
