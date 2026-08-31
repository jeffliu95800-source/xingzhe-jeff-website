#!/bin/bash

echo "🚀 启动个人主页..."
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖中..."
    npm install
fi

# 杀死已有的next进程
pkill -f "next dev" 2>/dev/null
sleep 1

echo "✨ 启动开发服务器..."
echo "🌐 请打开 http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
npm run dev
