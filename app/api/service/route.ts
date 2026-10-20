import { NextResponse } from "next/server";
import {
    getAllServices,
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
