/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Разрешаем Next.js загружать аватарки от GoIT
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        port: "",
        pathname: "/**", // Разрешаем любые пути на этом домене
      },
    ],
  },

  // 2. Ваше существующее проксирование запросов для CORS
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://goit.study*",
      },
    ];
  },
};

export default nextConfig;
