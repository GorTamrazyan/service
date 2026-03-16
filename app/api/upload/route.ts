import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Cloudinary configuration missing");
            return NextResponse.json(
                { error: "Cloudinary not configured" },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const productId = formData.get("productId") as string;

        console.log("Upload request received:", {
            filesCount: files.length,
            productId,
            fileNames: files.map(f => f.name)
        });

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        const uploadPromises = files.map(async (file) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString('base64');
            const dataURI = `data:${file.type};base64,${base64}`;

            console.log("Uploading file:", file.name, "size:", file.size);

            return new Promise<string>((resolve, reject) => {
                cloudinary.uploader.upload(
                    dataURI,
                    {
                        folder: productId ? `products/${productId}` : "products",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            reject(error);
                        } else {
                            console.log("Upload successful:", result?.secure_url);
                            resolve(result!.secure_url);
                        }
                    }
                );
            });
        });

        const urls = await Promise.all(uploadPromises);
        console.log("All uploads complete:", urls);

        return NextResponse.json({ urls }, { status: 200 });
    } catch (error) {
        console.error("Error in upload API:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to upload images" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return NextResponse.json(
                { error: "No publicId provided" },
                { status: 400 }
            );
        }

        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Delete result:", result);

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        );
    }
}
