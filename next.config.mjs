import path from "path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(process.cwd()) // プロジェクトルートにマッピング
    return config
  },
}

export default nextConfig
