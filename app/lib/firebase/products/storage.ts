/**
 * Upload product images to Cloudinary via API
 * @param files - array of image files
 * @param productId - ID of the product
 * @returns array of uploaded image URLs
 */
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

/**
 * Upload a single product image to Cloudinary via API
 * @param file - image file
 * @param productId - ID of the product
 * @param index - image index (for ordering)
 * @returns uploaded image URL
 */
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

/**
 * Delete an image from Cloudinary
 * @param imageUrl - URL of the image to delete
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    // Get everything after 'upload/' and remove the file extension
    const publicIdWithExt = urlParts.slice(uploadIndex + 1).join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

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

/**
 * Delete multiple images from Cloudinary
 * @param imageUrls - array of image URLs to delete
 */
export const deleteProductImages = async (imageUrls: string[]): Promise<void> => {
  try {
    const deletePromises = imageUrls.map((url) => deleteProductImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};
