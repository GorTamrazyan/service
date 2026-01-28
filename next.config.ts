/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            // Добавьте другие удаленные домены изображений, если они у вас есть (например, из Firebase Storage)
            // {
            //   protocol: 'https',
            //   hostname: 'firebasestorage.googleapis.com',
            //   port: '',
            //   pathname: '/**',
            // },
        ],
    },
};

module.exports = nextConfig;
