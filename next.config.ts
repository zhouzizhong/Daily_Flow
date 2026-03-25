import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cloudflare Pages 需要 Server Actions 支持
  output: 'standalone',

  // 允许的图片域名
  images: {
    unoptimized: true,
  },

  // 实验性功能
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
