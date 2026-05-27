import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@quotekai/api-client', '@quotekai/shared-types'],
}

export default nextConfig
