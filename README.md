# 行者 Jeff 个人网站

> 基于 Next.js 14 构建的个人作品集网站，用于求职和接项目。

## 🚀 快速启动

```bash
cd ~/Desktop/行者Jeff网站
./start.sh
```

或手动：

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 📁 目录结构

```
行者Jeff网站/
├── src/
│   └── app/                 # Next.js 页面源码
│       ├── page.tsx         # 主页面（所有内容）
│       ├── layout.tsx       # 全局布局
│       ├── globals.css      # 全局样式
│       ├── about/           # 关于页（预留）
│       ├── api/             # API 路由（短链/代理）
│       └── books/           # 书籍页（预留）
├── public/
│   ├── books/              # 6 本书籍封面（jpg）
│   ├── projects/           # 5 个项目演示视频（mov）
│   └── images/             # 头像等图片
├── assets/                  # 原始素材备份
│   ├── photos/             # 所有原始照片
│   ├── documents/          # 3 个版本的文案 md
│   └── videos/             # 7 个原始项目视频
├── docs/
│   ├── README.md           # 项目说明
│   ├── 快速开始.md          # 快速上手
│   └── 部署指南.md          # 部署文档
├── package.json            # 项目依赖
├── next.config.js          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
├── start.sh                # 启动脚本
└── README.md               # 本文件
```

## 📊 页面结构

| 顺序 | 模块 | 内容 |
|------|------|------|
| 1 | Hero | 核心金句 + 头像 + 数据卡 |
| 2 | Hero 底部 | 6 本书籍轮播 |
| 3 | About | 我定义的 FDE |
| 4 | 代表项目 | 5 个视频演示 |
| 5 | 三大核心能力 | 玻璃卡技能 |
| 6 | 出版著作 | 完整 6 本书 |
| 7 | 实战历程 | 时间线 |
| 8 | 联系合作 | CTA 大卡 |

## 🎨 设计系统

- **主题**：暗色 `#05070d` + 玻璃态
- **强调色**：`#06b6d4` (青) → `#8b5cf6` (紫) → `#ec4899` (粉)
- **字体**：Inter + JetBrains Mono
- **框架**：Next.js 14 + React 18 + TypeScript

## 📦 部署

参考 `docs/部署指南.md`

推荐平台：**Vercel**（免费 + 完美支持 Next.js）

## 📞 联系

- 邮箱：xingzhe_jeff@163.com
- 项目类型：FDE 前沿部署实战专家 · AI 政企落地实践者

---

**📖 详细文档**：
- 快速上手 → `docs/快速开始.md`
- 部署上线 → `docs/部署指南.md`
- 项目说明 → `docs/README.md`

**🎯 素材备份**：
- 所有原始照片 → `assets/photos/`
- 所有文案版本 → `assets/documents/`
- 所有项目视频 → `assets/videos/`
