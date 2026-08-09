/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        pathname: "/**",
      },
    ],
  },

  // ІСПРАВЛЕНО: Проксі налаштовано так, щоб воно не перехоплювало стандартні сторінки Next.js
  async rewrites() {
    return [
      {
        // Перенаправляємо на бекенд GoIT ТІЛЬКИ ті запити, які йдуть на /api/...
        source: "/api/:path*",
        destination: "https://goit.study*",
      },
    ];
  },
};

export default nextConfig;
