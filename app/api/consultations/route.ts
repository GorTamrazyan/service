import { NextResponse } from "next/server";
import {
    getAllConsultations,
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
