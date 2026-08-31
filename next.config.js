/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 启用静态导出（如果需要）
  // output: 'export',
  // 配置图片域名（如果需要外部图片）
  images: {
    domains: ['your-cdn-domain.com'],
  },
  // 配置重定向（用于中转站业务隐藏嫁接）
  async redirects() {
    return [
      {
        source: '/go/:path*',
        destination: 'https://your-transit-service.com/:path*',
        permanent: false,
      },
    ];
  },
  // 配置重写（用于API代理）
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://your-transit-service.com/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
