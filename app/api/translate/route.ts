import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("q");
    const lang = searchParams.get("tl");

    if (!text || !lang) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation failed");
        }

        const data = await response.json();
        const translated = data?.[0]?.[0]?.[0] ?? text;

        return NextResponse.json({ translated });
    } catch {
        return NextResponse.json({ translated: text });
    }
}
