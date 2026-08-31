import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '行者 Jeff · FDE前沿部署实战专家',
  description: '政企AI化改造落地实践者 · 智慧政务/养老/社区/园区 · FDE工程化交付 · 出版《FDE实战现场》《FDE零基础实战手册》',
  keywords: ['FDE', 'AI落地', '智能体', '政企数字化', '大模型', 'Agent', '行者Jeff'],
  openGraph: {
    title: '行者 Jeff · FDE前沿部署实战专家',
    description: '政企AI化改造落地实践者 · 智慧政务/养老/社区/园区 · 出版FDE方向专业书籍',
    type: 'profile',
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
