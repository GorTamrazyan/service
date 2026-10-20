import { NextResponse } from "next/server";

// Removed: the admin panel now updates notifications directly in Firestore,
// where Security Rules restrict access to admins. This file can be deleted.
const gone = () => NextResponse.json({ error: "Gone" }, { status: 410 });

export const PUT = gone;
export const DELETE = gone;
