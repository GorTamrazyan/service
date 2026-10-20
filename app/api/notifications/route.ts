import { NextResponse } from "next/server";

// Removed: the admin panel now reads notifications directly from Firestore,
// where Security Rules restrict access to admins. This file can be deleted.
const gone = () => NextResponse.json({ error: "Gone" }, { status: 410 });

export const GET = gone;
export const PUT = gone;
