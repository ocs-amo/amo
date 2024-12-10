/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  publicRuntimeConfig: {
    api: {
      bodyParser: false,
    },
  },
}

export default nextConfig
