/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.devtunnels.ms",
        "8zwg5mhn-3000.inc1.devtunnels.ms",
      ],
    },
  },
};

export default nextConfig;
