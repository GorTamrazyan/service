import { NextResponse } from "next/server";
import {
    getAllConsultations,
    createConsultation,
    updateConsultation,
    deleteConsultation,
} from "../../lib/firebase/service";

export async function GET(request: Request) {
    try {
        const consultations = await getAllConsultations();
        return NextResponse.json(consultations, { status: 200 });
    } catch (error) {
        console.error("Error fetching consultations:", error);
        return NextResponse.json(
            { message: "Failed to load consultations" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, features, price, duration } = body;

        if (!title || !description || !Array.isArray(features)) {
            return NextResponse.json(
                {
                    message:
                        "Title, description and features array are required",
                },
                { status: 400 }
            );
        }

        const newConsultationId = await createConsultation({
            title,
            description,
            features,
            duration,
            price,
        });

        return NextResponse.json(
            {
                message: "Consultation created successfully",
                id: newConsultationId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating consultation:", error);
        return NextResponse.json(
            { message: "Failed to create consultation" },
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
                { message: "Consultation ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, description, features, price, duration } = body;

        if (!title || !description || !Array.isArray(features)) {
            return NextResponse.json(
                {
                    message:
                        "Title, description and features array are required",
                },
                { status: 400 }
            );
        }

        await updateConsultation(id, {
            title,
            description,
            features,
            price,
            duration,
        });

        return NextResponse.json(
            { message: "Consultation updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating consultation:", error);
        return NextResponse.json(
            { message: "Failed to update consultation" },
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
                { message: "Consultation ID is required" },
                { status: 400 }
            );
        }

        await deleteConsultation(id);

        return NextResponse.json(
            { message: "Consultation deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting consultation:", error);
        return NextResponse.json(
            { message: "Failed to delete consultation" },
            { status: 500 }
        );
    }
}
