import { NextResponse } from 'next/server'

// 中转站业务隐藏嫁接的API代理
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target')
  const path = searchParams.get('path') || ''
  
  if (!target) {
    return NextResponse.json(
      { error: '缺少目标参数' },
      { status: 400 }
    )
  }

  try {
    // 构建目标URL
    const targetUrl = `${target}/${path}`
    
    // 转发请求到目标服务
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'PersonalHomepage/1.0',
        // 可以添加其他需要的请求头
      },
    })

    // 获取响应数据
    const data = await response.json()
    
    // 返回响应，添加自定义头部
    return NextResponse.json(data, {
      headers: {
        'X-Proxy-By': 'PersonalHomepage',
        'X-Original-Target': target,
      },
    })
  } catch (error) {
    console.error('代理请求失败:', error)
    return NextResponse.json(
      { error: '代理请求失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target')
  const path = searchParams.get('path') || ''
  
  if (!target) {
    return NextResponse.json(
      { error: '缺少目标参数' },
      { status: 400 }
    )
  }

  try {
    // 获取请求体
    const body = await request.json()
    
    // 构建目标URL
    const targetUrl = `${target}/${path}`
    
    // 转发POST请求到目标服务
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PersonalHomepage/1.0',
      },
      body: JSON.stringify(body),
    })

    // 获取响应数据
    const data = await response.json()
    
    // 返回响应
    return NextResponse.json(data, {
      headers: {
        'X-Proxy-By': 'PersonalHomepage',
        'X-Original-Target': target,
      },
    })
  } catch (error) {
    console.error('代理请求失败:', error)
    return NextResponse.json(
      { error: '代理请求失败' },
      { status: 500 }
    )
  }
}
