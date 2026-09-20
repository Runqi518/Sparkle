import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ['sequelize', 'sqlite3']
};

export default nextConfig;
