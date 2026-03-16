import { NextResponse } from "next/server";
import {
    getAllServices,
    createService,
    updateService,
    deleteService,
} from "../../lib/firebase/service";

export async function GET(request: Request) {
    try {
        const services = await getAllServices();
        return NextResponse.json(services, { status: 200 });
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json(
            { message: "Failed to load services" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { icon, title, description, features, price } = body;

        if (!icon || !title || !description || !Array.isArray(features)) {
            return NextResponse.json(
                {
                    message:
                        "Icon, title, description and features array are required",
                },
                { status: 400 }
            );
        }

        const newServiceId = await createService({
            icon,
            title,
            description,
            features,
            price,
        });

        return NextResponse.json(
            { message: "Service created successfully", id: newServiceId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json(
            { message: "Failed to create service" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Service ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { icon, title, description, features, price } = body;

        if (!icon || !title || !description || !Array.isArray(features)) {
            return NextResponse.json(
                {
                    message:
                        "Icon, title, description and features array are required",
                },
                { status: 400 }
            );
        }

        await updateService(id, {
            icon,
            title,
            description,
            features,
            price,
        });

        return NextResponse.json(
            { message: "Service updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json(
            { message: "Failed to update service" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Service ID is required" },
                { status: 400 }
            );
        }

        await deleteService(id);

        return NextResponse.json(
            { message: "Service deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json(
            { message: "Failed to delete service" },
            { status: 500 }
        );
    }
}
