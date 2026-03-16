export const uploadProductImages = async (
  files: File[],
  productId: string
): Promise<string[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("productId", productId);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload images");
    }

    const data = await response.json();
    return data.urls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export const uploadProductImage = async (
  file: File,
  productId: string,
  index: number
): Promise<string> => {
  try {
    const urls = await uploadProductImages([file], productId);
    return urls[0];
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    let parts = urlParts.slice(uploadIndex + 1);
    if (parts[0] && /^v\d+$/.test(parts[0])) {
      parts = parts.slice(1);
    }
    const publicId = parts.join("/").replace(/\.[^/.]+$/, "");

    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export const deleteProductImages = async (imageUrls: string[]): Promise<void> => {
  try {
    const deletePromises = imageUrls.map((url) => deleteProductImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};
