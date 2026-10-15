import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        pathname: "/fullstack/career/campers/**",
      },
    ],
  },
};

export default nextConfig;
