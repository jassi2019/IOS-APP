/** @type {import('next').NextConfig} */

const allowedImageDomains = [{ protocol: "https", hostname: "*" }];

const nextConfig = {
  images: {
    remotePatterns: allowedImageDomains,
    unoptimized: true,
  },
  output: "standalone",
  reactStrictMode: false,
};

export default nextConfig;
