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
    ],
  },
  webpack: (config: { resolve: { alias: { [x: string]: string } } }) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
