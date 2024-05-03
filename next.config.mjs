/** @type {import('next').NextConfig} */

import withPlaiceholder from "@plaiceholder/next";

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "jolfgowviyxdrvtelayh.supabase.co",
        port: "",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
