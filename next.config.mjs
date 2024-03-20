/** @type {import('next').NextConfig} */

import withPlaiceholder from "@plaiceholder/next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "supabase.com",
        port: "",
        pathname: "/dashboard/project/jolfgowviyxdrvtelayh/storage/buckets",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
