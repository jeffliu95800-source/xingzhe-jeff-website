import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://xingzhe-jeff.netlify.app'),
  title: {
    default: '行者 Jeff · FDE前沿部署实战专家 · 政企AI化改造落地实践者',
    template: '%s | 行者 Jeff'
  },
  description: '国内第一批一线FDE实战家 · 弥合产品标准，适配生产环境 · 政企AI化改造落地实践者 · 出版6本FDE实战系列丛书',
  keywords: ['FDE', 'AI落地', '智能体', '政企数字化', '大模型', 'Agent', 'RAG', '私域部署', '现场工程师', '行者Jeff', 'xingzhejeff'],
  authors: [{ name: '行者 Jeff' }],
  creator: '行者 Jeff',
  publisher: '行者 Jeff',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'profile',
    locale: 'zh_CN',
    url: 'https://xingzhe-jeff.netlify.app',
    title: '行者 Jeff · FDE前沿部署实战专家',
    description: '国内第一批一线FDE实战家 · 政企AI化改造落地实践者 · 出版6本FDE实战系列丛书',
    siteName: '行者 Jeff 个人网站',
  },
  twitter: {
    card: 'summary_large_image',
    title: '行者 Jeff · FDE前沿部署实战专家',
    description: 'FDE = AI厂商标准化产品与甲方真实生产环境之间的最适配载体',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://xingzhe-jeff.netlify.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#05070d" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="author" content="行者 Jeff" />
        <meta name="robots" content="index, follow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
