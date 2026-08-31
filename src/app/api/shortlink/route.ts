import { NextResponse } from 'next/server'

// 短链服务 - 用于隐藏真实URL
// 这是一个示例实现，实际使用时需要数据库存储短链映射

// 模拟数据库
const shortLinks = new Map<string, string>([
  ['abc123', 'https://your-transit-service.com/resource1'],
  ['def456', 'https://your-transit-service.com/resource2'],
  ['ghi789', 'https://your-transit-service.com/resource3'],
])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.json(
      { error: '缺少短链代码' },
      { status: 400 }
    )
  }

  const targetUrl = shortLinks.get(code)
  
  if (!targetUrl) {
    return NextResponse.json(
      { error: '短链不存在' },
      { status: 404 }
    )
  }

  // 302重定向到真实URL
  return NextResponse.redirect(targetUrl, 302)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, customCode } = body
    
    if (!url) {
      return NextResponse.json(
        { error: '缺少URL参数' },
        { status: 400 }
      )
    }

    // 生成短链代码（示例实现）
    const code = customCode || generateShortCode()
    
    // 检查代码是否已存在
    if (shortLinks.has(code)) {
      return NextResponse.json(
        { error: '短链代码已存在' },
        { status: 409 }
      )
    }

    // 存储短链映射（实际应该存入数据库）
    shortLinks.set(code, url)
    
    // 返回短链信息
    return NextResponse.json({
      code,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/s/${code}`,
      originalUrl: url,
    })
  } catch (error) {
    console.error('创建短链失败:', error)
    return NextResponse.json(
      { error: '创建短链失败' },
      { status: 500 }
    )
  }
}

function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
