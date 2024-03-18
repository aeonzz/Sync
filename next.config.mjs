/** @type {import('next').NextConfig} */
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

export default nextConfig;
