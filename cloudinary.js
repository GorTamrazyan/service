const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image from file path or URL
async function uploadImage(file, options = {}) {
    const defaultOptions = {
        folder: 'uploads',
        resource_type: 'image',
        ...options
    };
    return await cloudinary.uploader.upload(file, defaultOptions);
}

// Upload image from base64 string
async function uploadBase64(base64String, options = {}) {
    const defaultOptions = {
        folder: 'uploads',
        resource_type: 'image',
        ...options
    };
    return await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, defaultOptions);
}

// Delete image by public_id
async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId);
}

// Get optimized image URL
function getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
        fetch_format: 'auto',
        quality: 'auto',
        ...options
    };
    return cloudinary.url(publicId, defaultOptions);
}

// Get image URL with transformations
function getTransformedUrl(publicId, transformations = {}) {
    return cloudinary.url(publicId, transformations);
}

module.exports = {
    cloudinary,
    uploadImage,
    uploadBase64,
    deleteImage,
    getOptimizedUrl,
    getTransformedUrl
};
