// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            "via.placeholder.com", // <--- Add this line to allow placeholder images
            // You can add other domains here when you use real image hosting, e.g.:
            // 'your-cdn-domain.com',
            // 'res.cloudinary.com',
            // 's3.amazonaws.com',
        ],
    },
};

export default nextConfig;
