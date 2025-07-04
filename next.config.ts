/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "goloka.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pub-762e0b61c1b24a5dbd75d4c89096ee93.r2.dev",
      },
    ],
  },
  webpack: (config: { resolve: { alias: { [x: string]: string } } }) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
