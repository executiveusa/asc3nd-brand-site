import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/community-cuts", destination: "/impact", permanent: true },
      { source: "/community-cuts-for-kids", destination: "/impact", permanent: true },
      { source: "/community-cuts-for-kids-2026", destination: "/impact", permanent: true },
      { source: "/events/community-cuts", destination: "/impact", permanent: true },
      { source: "/events/community-cuts-for-kids", destination: "/impact", permanent: true },
      { source: "/events/community-cuts-for-kids-2026", destination: "/impact", permanent: true },
      { source: "/volunteer", destination: "/take-part", permanent: true },
      { source: "/mentor", destination: "/take-part", permanent: true },
      { source: "/mentors", destination: "/take-part", permanent: true },
      { source: "/partner", destination: "/take-part", permanent: true },
      { source: "/partners", destination: "/take-part", permanent: true },
      { source: "/support", destination: "/take-part", permanent: true },
      { source: "/get-involved", destination: "/take-part", permanent: true },
      { source: "/about", destination: "/story", permanent: true },
    ];
  },
};

export default nextConfig;
