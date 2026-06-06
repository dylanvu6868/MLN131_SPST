/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com"
      },
      {
        protocol: "https",
        hostname: "flagsapi.com"
      }
    ]
  }
};

export default nextConfig;
