/** @type {import('next').NextConfig} */
const nextConfig = {
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
