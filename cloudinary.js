const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file, options = {}) {
    const defaultOptions = {
        folder: 'uploads',
        resource_type: 'image',
        ...options
    };
    return await cloudinary.uploader.upload(file, defaultOptions);
}

async function uploadBase64(base64String, options = {}) {
    const defaultOptions = {
        folder: 'uploads',
        resource_type: 'image',
        ...options
    };
    return await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, defaultOptions);
}

async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId);
}

function getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
        fetch_format: 'auto',
        quality: 'auto',
        ...options
    };
    return cloudinary.url(publicId, defaultOptions);
}

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
