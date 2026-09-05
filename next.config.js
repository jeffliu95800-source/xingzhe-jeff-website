/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 启用静态导出（Pages 25M 限制绕过）
  output: 'export',
  images: { unoptimized: true },  // 静态导出必须
  // 排除视频/图片，避免被打包到 server bundle（Pages 25M 限制）
  outputFileTracingExcludes: {
    '*': [
      './public/projects/**/*',
      './public/images/**/*',
      './assets/videos/**/*',
    ],
  },
  // 配置 webpack 忽略视频文件
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mov|mp4)$/,
      use: 'ignore-loader',
    });
    return config;
  },
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
