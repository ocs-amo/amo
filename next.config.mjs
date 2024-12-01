import path from "path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias, // 既存のエイリアスを保持
      "@": path.resolve(process.cwd()), // プロジェクトルートへのエイリアス
    }
    return config
  },
}

export default nextConfig
