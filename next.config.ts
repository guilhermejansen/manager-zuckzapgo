import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  serverActions: {
    bodySizeLimit: "50mb",
  },
  /* config options here */
}

export default nextConfig
