'use client'

import { useEffect, useState, useRef, ReactNode, CSSProperties } from 'react'

// ============ HOOKS ============

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setInView(true)
          setHasAnimated(true)
        }
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, hasAnimated])
  return { ref, inView }
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.floor(target * eased))
      if (progress < 1) requestAnimationFrame(animate)
      else setValue(target)
    }
    requestAnimationFrame(animate)
  }, [target, duration, start])
  return value
}

function useScroll() {
  const [scrollY, setScrollY] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handle = () => {
      setScrollY(window.scrollY)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress((window.scrollY / total) * 100)
    }
    window.addEventListener('scroll', handle)
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return { scrollY, progress }
}

// ============ GLASS PRIMITIVES ============

const glassBase: CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  boxShadow: `
    0 1px 0 0 rgba(255, 255, 255, 0.08) inset,
    0 -1px 0 0 rgba(0, 0, 0, 0.1) inset,
    0 20px 60px -20px rgba(0, 0, 0, 0.5),
    0 8px 24px -8px rgba(0, 0, 0, 0.3)
  `
}

function Glass({ children, style, className = '' }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={`glass-card ${className}`} style={{ ...glassBase, ...style }}>
      {children}
    </div>
  )
}

// ============ INTERACTION COMPONENTS ============

function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [variant, setVariant] = useState<'default' | 'hover' | 'text'>('default')
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dot) dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`
    }
    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`
      requestAnimationFrame(tick)
    }
    tick()
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, .clickable, input, textarea')) setVariant('hover')
      else if (['P', 'H1', 'H2', 'H3', 'H4', 'SPAN'].includes(t.tagName)) setVariant('text')
      else setVariant('default')
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', () => setHidden(true))
    document.addEventListener('mouseenter', () => setHidden(false))
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])
  const size = variant === 'hover' ? 56 : variant === 'text' ? 60 : 40
  const color = variant === 'hover' ? 'rgba(255, 255, 255, 0.8)' : variant === 'text' ? 'rgba(6, 182, 212, 0.6)' : 'rgba(255, 255, 255, 0.3)'
  return (
    <>
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, width: `${size}px`, height: `${size}px`,
        borderRadius: '50%', border: `1.5px solid ${color}`, pointerEvents: 'none', zIndex: 9999,
        opacity: hidden ? 0 : 1, transition: 'width 0.2s, height 0.2s, border 0.2s, opacity 0.2s',
        background: variant === 'hover' ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
        backdropFilter: 'invert(1)', mixBlendMode: 'difference'
      }} />
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, width: '6px', height: '6px', borderRadius: '50%',
        background: '#fff', pointerEvents: 'none', zIndex: 9999, opacity: hidden ? 0 : 1
      }} />
    </>
  )
}

function MagneticButton({ children, primary = false, href, large = false }: {
  children: ReactNode; primary?: boolean; href?: string; large?: boolean
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setPos({ x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35 })
    }
    const onLeave = () => setPos({ x: 0, y: 0 })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])
  const style: CSSProperties = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'inline-flex', alignItems: 'center', gap: '12px',
    padding: large ? '18px 36px' : '14px 28px',
    fontSize: large ? '15px' : '14px', fontWeight: 500,
    borderRadius: '14px',
    textDecoration: 'none',
    background: primary 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
    color: primary ? '#0a0a0a' : '#e8eaed',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: primary ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: primary 
      ? '0 10px 40px -10px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      : '0 8px 32px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative', overflow: 'hidden', cursor: 'none'
  }
  if (href) {
    return <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} style={style}>{children}</a>
  }
  return <button ref={ref as React.RefObject<HTMLButtonElement>} style={style}>{children}</button>
}

function Reveal({ children, delay = 0, direction = 'up', className = '' }: {
  children: ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' | 'fade'; className?: string
}) {
  const { ref, inView } = useInView(0.1)
  const t = { up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(40px)', right: 'translateX(-40px)', fade: 'translate(0,0)' }
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translate(0,0)' : t[direction],
      transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
    }}>{children}</div>
  )
}

function Parallax({ children, speed = 0.3 }: { children: ReactNode; speed?: number }) {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY * speed)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])
  return <div style={{ transform: `translateY(${y}px)` }}>{children}</div>
}

function AnimatedNumber({ target, suffix = '', inView }: { target: number; suffix?: string; inView: boolean }) {
  const v = useCountUp(target, 1800, inView)
  return <>{v}{suffix}</>
}

function Typewriter({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) {
  const [s, setS] = useState('')
  const [go, setGo] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGo(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  useEffect(() => {
    if (!go) return
    let i = 0
    const iv = setInterval(() => {
      i++; setS(text.slice(0, i))
      if (i >= text.length) clearInterval(iv)
    }, speed)
    return () => clearInterval(iv)
  }, [text, speed, go])
  return (
    <span>
      {s}
      <span style={{ display: 'inline-block', width: '2px', height: '0.9em', background: '#06b6d4', marginLeft: '4px', verticalAlign: '-2px', animation: 'blink 1.1s infinite' }} />
    </span>
  )
}

// ============ DATA ============

const projects = [
  {
    num: '01',
    title: '省级政务业务监控平台',
    zh: 'Province Gov Platform',
    category: '智慧政务 · FDE 驻场',
    desc: '作为 FDE 承接 AI 模块现场落地。完成政务内网私有化部署就位；核验网络/权限/算力约束；知识库业务数据灌入与业务侧调参；现场实测真实政务样本下输出效果；复现检索偏差、模型越权等问题，采集样本日志回流研发；跟进迭代做现场回归验证；输出政务环境运维配置手册，配合项目团队完成系统投产。',
    tech: ['政务内网', '私有化部署', '业务调参', '样本回流'],
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    videoSrc: '/projects/gov-platform-2.mov'
  },
  {
    num: '02',
    title: '头部城市智慧养老服务平台',
    zh: 'Smart Elderly Care',
    category: '智慧养老 · 政府验收',
    desc: '承担项目 FDE 现场工作。完成养老业务 AI 组件私有化部署就位；面向养老业务场景完成知识库校准、提示词业务调优；现场观测老人风险研判、智能咨询等真实业务表现；复现边界场景失效、回答偏离业务规范等问题；整理业务样本同步研发；版本更新后完成现场回归验证，助力平台通过政府验收。',
    tech: ['养老业务校准', '边界场景复现', '政府验收'],
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    videoSrc: '/projects/smart-elderly-care.mov'
  },
  {
    num: '03',
    title: '大型城投智慧社区管理平台',
    zh: 'Smart Community',
    category: '智慧社区 · FDE 落地',
    desc: 'FDE 现场落地实施。完成社区 AI 分析组件在客户私有环境部署；核验多源社区业务数据接入后的运行状态；针对事件识别、智能检索能力做业务侧校准；复现高并发场景下响应异常、数据召回错乱等现场现象；整理完整问题材料回流研发；迭代后现场验证，沉淀社区场景适配配置，支撑系统平稳上线。',
    tech: ['高并发场景', '数据接入校准', '问题闭环'],
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    videoSrc: '/projects/smart-community.mov'
  },
{
    num: '04',
    title: '智慧景区&智慧园区系列项目',
    zh: 'Smart Park',
    category: '智慧景区/园区 · 系列',
    desc: '作为 FDE 完成 AI 智能分析组件现场部署就位；针对客流研判、运维事件识别能力做业务侧参数校准；在大客流真实业务压力下观测系统表现；复现实时分析异常、识别偏差等问题；采集环境与业务样本回流研发；完成修复版本现场验证，输出园区场景现场适配资产。',
    tech: ['大客流压力', '实时分析', '适配资产'],
    gradient: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    videoSrc: '/projects/smart-scenic.mov'
  },
  {
    num: '05',
    title: '智慧园区综合管控平台',
    zh: 'Smart Park Plus',
    category: '智慧园区 · FDE 落地',
    desc: '作为 FDE 落地智慧园区综合管控平台。完成园区多源数据 AI 分析组件私有化部署；针对园区能耗、安防、设备运维等场景做业务侧参数校准；复现高并发下识别异常等问题；采集现场样本回流研发；完成修复版本现场验证，沉淀园区场景完整适配资产。',
    tech: ['园区综合管控', '多源数据', 'FDE 闭环'],
    gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)',
    videoSrc: '/projects/smart-park-2.mov'
  },
  {
    num: '06',
    title: '更多项目持续沉淀中',
    zh: 'More In Progress',
    category: 'Coming Soon · 敬请期待',
    desc: '作为 FDE 持续深耕政企 AI 落地一线，更多行业标杆项目、跨领域实践案例正在持续沉淀。期待与更多合作伙伴共同打磨 AI 政企落地的最佳实践。',
    tech: ['持续更新', '敬请期待', '合作共赢'],
    gradient: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    isPlaceholder: true
  }
]

const skillCategories = [
  {
    icon: '🧠',
    title: 'AI 现场部署与业务适配',
    zh: 'AI ON-SITE',
    skills: ['私有化 AI 组件部署就位', 'Agent 智能体业务适配', 'RAG 知识库业务校准', '提示词业务调优', '现场业务效果评测', 'POC 现场实测', '业务样本采集', '现象复现'],
    primary: true
  },
  {
    icon: '🛠',
    title: 'FDE 现场问题闭环',
    zh: 'FDE FEEDBACK LOOP',
    skills: ['客户生产环境核验', '日志采集分析', '问题工单回流研发', '版本现场回归验证', '现场适配配置沉淀', 'FAQ 与现场文档', '业务‑研发双向沟通', '流程合规可控'],
    primary: true
  },
  {
    icon: '🤝',
    title: '业务‑研发双向枢纽',
    zh: 'TECH BRIDGE',
    skills: ['驻场 FDE 角色定位', '立足现场视角', '业务使用反馈收集', '需求/bug/缺陷区分', '不主导整体方案', '技术桥梁作用', '高级 AI 应用工程师', 'PMP 项目管理'],
    primary: true
  },
  {
    icon: '💻',
    title: '开发与工具栈',
    zh: 'DEV TOOLS',
    skills: ['Python 脚本（样本处理）', 'SQL 业务数据查询', 'REST 接口现场验证', 'Linux 基础环境排查', 'Markdown 技术文档']
  },
  {
    icon: '🏛',
    title: '行业赛道',
    zh: 'INDUSTRIES',
    skills: ['智慧政务', '智慧养老', '智慧社区', '智慧景区', '智慧园区', '政企合规']
  },
  {
    icon: '📚',
    title: '专业资质',
    zh: 'CREDENTIALS',
    skills: ['PMP 项目管理', '高级 AI 应用工程师', '智能体效率工具从业者', '人工智能与大数据管理硕士']
  }
]

const experiences = [
  {
    period: '主导中 · ONGOING',
    role: 'FDE 前沿部署实战专家',
    company: 'AI 政企落地实践者',
    desc: '深耕智慧政务、智慧养老、智慧社区、智慧园区四大赛道，主导多套行业业务体系落地，可支撑多项目并行推进，联动跨职能团队完成高复杂度项目交付。',
    achievements: ['5+ 标杆政企项目', '主导项目均顺利投产验收', '沉淀可复用交付体系', '出版 FDE 方向专业书籍']
  },
  {
    period: '此前 · PRIOR',
    role: 'AI 解决方案架构师',
    company: '行业一线工程交付',
    desc: '完成 AI 能力与政企存量业务系统深度集成，落地 AI+养老、AI+政务场景，完成业务链路改造与场景扩容，处理客户侧复杂生产环境。',
    achievements: ['RAG 知识库业务化', '私有化部署多项目', 'POC 验证与方案论证', '沉淀标准化交付资产']
  },
  {
    period: '起点 · FOUNDATION',
    role: '人工智能与大数据',
    company: '专业硕士背景',
    desc: '兼具业务解析、方案架构与一线工程落地能力，长期深耕 AI 工程化交付，拒绝纸面 Demo，把 AI 方案转化为真实可用的业务系统。',
    achievements: ['业务‑技术双向翻译', '完整闭环交付', '行业知识沉淀', '生态社区建设']
  }
]

const books = [
  {
    num: '01',
    title: '《FDE 实战现场：行业案例拆解与交付方法论》',
    en: 'FDE IN PRACTICE',
    bigTitle: ['FDE', '实战', '现场'],
    subtitle: '行业案例拆解与交付方法论',
    tagline: '在每一个 FDE 落地的现场，问题即答案。',
    taglineAuthor: '行业箴言',
    desc: '面向行业从业者，汇集一线大型项目实战经验，拆解政企项目落地卡点、交付流程、风险管控、标准化体系建设思路。',
    audience: '实战派从业者',
    tags: ['FDE交付', '案例拆解', '标准化'],
    palette: ['#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'],
    hasRealCover: true,
    coverSrc: '/books/fde-practice.jpg'
  },
  {
    num: '02',
    title: '《FDE 零基础实战手册：从零开始到交付你的第一个 AI 项目》',
    en: 'FDE FROM ZERO',
    bigTitle: ['FDE', '零基础', '实战'],
    subtitle: '从零开始到交付你的第一个 AI 项目',
    tagline: '把第一个 AI 项目，跑成可复用的实战手册。',
    taglineAuthor: '入门即实战',
    desc: '面向入门学习者，完整讲解 FDE 工作链路，引导完成首个 AI 项目全流程交付，降低行业入行门槛。',
    audience: '入门学习者',
    tags: ['入门', '实战手册', '完整链路'],
    palette: ['#a78bfa', '#ec4899', '#06b6d4', '#22d3ee', '#fbbf24'],
    hasRealCover: true,
    coverSrc: '/books/fde-from-zero.jpg',
    designTheme: 'fde'
  },
  {
    num: '03',
    title: '《智能体插件工程：从开发到生产级插件生态构建》',
    en: 'AGENT PLUGIN',
    bigTitle: ['Agent', '插件', '工程'],
    subtitle: '从开发到生产级插件生态构建',
    tagline: '每一个插件，都是智能体能力的延伸。',
    taglineAuthor: '插件即能力',
    desc: '面向技术从业者，聚焦 Agent 插件体系设计、插件开发调试、安全沙箱、插件分发与运维，拆解大量真实业务插件案例。',
    audience: '技术从业者',
    tags: ['Agent', '插件生态', '安全沙箱'],
    palette: ['#10b981', '#06b6d4', '#a78bfa', '#22d3ee', '#34d399'],
    hasRealCover: true,
    coverSrc: '/books/agent-plugin.jpg',
    designTheme: 'agent'
  },
  {
    num: '04',
    title: '《政企大模型私有化落地实战：隔离环境下 AI 系统搭建》',
    en: 'PRIVATE LLM',
    bigTitle: ['私有化', '大模型', '落地'],
    subtitle: '隔离环境下 AI 系统搭建',
    tagline: '在隔离网络中，把大模型跑成业务系统。',
    taglineAuthor: '隔离即生产',
    desc: '面向 FDE 与交付工程师，聚焦离线、内网隔离等复杂政企生产环境，讲解私有化部署、算力适配、异构数据集成、安全脱敏。',
    audience: 'FDE / 交付工程师',
    tags: ['私有化', '政企隔离', '安全脱敏'],
    palette: ['#f59e0b', '#ef4444', '#ec4899', '#fb923c', '#06b6d4'],
    hasRealCover: true,
    coverSrc: '/books/private-llm.jpg',
    designTheme: 'private'
  },
  {
    num: '05',
    title: '《RAG 生产化调优实战：知识库质量治理与效果评测》',
    en: 'RAG IN PROD',
    bigTitle: ['RAG', '生产化', '调优'],
    subtitle: '知识库质量治理与效果评测',
    tagline: '跳出 Demo，让 RAG 成为稳定的生产系统。',
    taglineAuthor: '生产即标准',
    desc: '技术实战向，跳出 Demo 层面，讲解真实业务下知识库构建、文档切片策略、检索链路优化、幻觉治理、量化评测体系。',
    audience: '技术实战者',
    tags: ['RAG', '知识库', '效果评测'],
    palette: ['#06b6d4', '#8b5cf6', '#22d3ee', '#3b82f6', '#a78bfa'],
    hasRealCover: true,
    coverSrc: '/books/rag-tuning.jpg',
    designTheme: 'rag'
  },
  {
    num: '06',
    title: '《AI 政企项目风险与合规实践：交付视角下的数据与业务安全》',
    en: 'AI COMPLIANCE',
    bigTitle: ['合规', '风控', '政企'],
    subtitle: '数据与业务安全的实战防线',
    tagline: '在交付一线，把风险关进合规的笼子里。',
    taglineAuthor: '合规即底线',
    desc: '面向行业交付人员，从一线 FDE 交付视角，梳理政企业务 AI 项目的数据合规、内容风控、验收基线、风险预案。',
    audience: '行业交付人员',
    tags: ['合规风控', '数据安全', '政企'],
    palette: ['#ec4899', '#f59e0b', '#ef4444', '#a78bfa', '#06b6d4'],
    hasRealCover: true,
    coverSrc: '/books/ai-compliance.jpg',
    designTheme: 'compliance'
  }
]

// ============ MAIN PAGE ============

export default function Home() {
  const { scrollY, progress } = useScroll()
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsInView, setStatsInView] = useState(false)

  useEffect(() => {
    setMounted(true)
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsInView(true) }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    const sections = ['hero', 'about', 'work', 'skills', 'books', 'experience', 'contact']
    const sObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
    }, { threshold: 0.2, rootMargin: '-20% 0px -60% 0px' })
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) sObs.observe(el)
    })
    return () => { observer.disconnect(); sObs.disconnect() }
  }, [])

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease', minHeight: '100vh' }}>
      <CustomCursor />

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 100, background: 'rgba(255,255,255,0.04)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)', boxShadow: '0 0 12px rgba(6, 182, 212, 0.6)', transition: 'width 0.1s' }} />
      </div>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Parallax speed={0.15}>
          <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25), transparent 60%)', filter: 'blur(100px)' }} />
        </Parallax>
        <Parallax speed={-0.1}>
          <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 60%)', filter: 'blur(100px)' }} />
        </Parallax>
        <Parallax speed={0.05}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08), transparent 60%)', filter: 'blur(100px)' }} />
        </Parallax>
      </div>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(circle at 50% 30%, black, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black, transparent 70%)'
      }} />

      <div style={{
        position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`
      }} />

      {/* ============ NAVIGATION ============ */}
      <nav style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(8, 8, 14, 0.6)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '100px',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.6s ease 0.3s',
        maxWidth: 'calc(100vw - 48px)'
      }}>
        {/* Logo - 大尺寸品牌区 */}
        <a href="#hero" style={{
          padding: '12px 24px 12px 12px',
          borderRadius: '100px',
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            position: 'relative',
            flexShrink: 0
          }}>
            <img 
              src="/images/avatar.png" 
              alt="Jeff"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%'
              }}
            />
          </div>
          <div>
            <div style={{
              fontSize: '14px', fontWeight: 700, color: '#f1f5f9',
              letterSpacing: '-0.01em', lineHeight: 1.1
            }}>
              行者 Jeff
            </div>
            <div style={{
              fontSize: '9px', color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.2, marginTop: '2px'
            }}>
              FDE · STUDIO
            </div>
          </div>
        </a>
        
        {/* 分隔线 */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' }} />
        
        {/* 主导航 */}
        {[
          { id: 'about', zh: '关于', en: 'ABOUT' },
          { id: 'work', zh: '项目', en: 'WORK' },
          { id: 'skills', zh: '能力', en: 'SKILLS' },
          { id: 'books', zh: '著作', en: 'BOOKS' },
          { id: 'experience', zh: '历程', en: 'JOURNEY' },
          { id: 'contact', zh: '联系', en: 'CONTACT' },
        ].map(item => (
          <a key={item.id} href={`#${item.id}`} style={{
            padding: '10px 14px',
            borderRadius: '100px',
            textDecoration: 'none',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', lineHeight: 1.1,
            color: activeSection === item.id ? '#fff' : 'rgba(255, 255, 255, 0.55)',
            background: activeSection === item.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {activeSection === item.id && (
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '100px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(139, 92, 246, 0.18))',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                pointerEvents: 'none'
              }} />
            )}
            <span style={{ position: 'relative', fontSize: '13px', fontWeight: 500 }}>{item.zh}</span>
            <span style={{
              position: 'relative', fontSize: '8px',
              opacity: 0.5, letterSpacing: '0.1em',
              marginTop: '1px',
              fontFamily: 'JetBrains Mono, monospace'
            }}>{item.en}</span>
          </a>
        ))}
        
        {/* 分隔线 */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' }} />
        
        {/* Hire Me CTA */}
        <a href="mailto:xingzhe_jeff@163.com" style={{
          padding: '12px 22px',
          borderRadius: '100px',
          background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
          color: '#0a0a0a', textDecoration: 'none',
          fontSize: '13px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 10px 30px -10px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          letterSpacing: '-0.01em',
          transition: 'all 0.2s'
        }}>
          <span>合作咨询</span>
          <span style={{
            width: '16px', height: '16px',
            background: '#0a0a0a',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', color: '#fff'
          }}>→</span>
        </a>
      </nav>

      {/* ============ HERO ============ */}
      <section id="hero" style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '140px 60px 100px',
        position: 'relative', zIndex: 3
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
          
          {/* 顶部品牌标识 + 状态 */}
          <Reveal direction="fade" delay={0.1}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
              marginBottom: '60px'
            }}>
              {/* AVAILABLE 状态 */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '10px 18px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '100px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.05em',
                fontWeight: 500
              }}>
                <span style={{
                  width: '8px', height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)',
                  animation: 'pulse 2s infinite'
                }} />
                AVAILABLE FOR PROJECTS
              </div>
              
              {/* FDE Series 标识 */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.2em',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                <span style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                <span>PORTFOLIO · 2026 EDITION</span>
              </div>
            </div>
          </Reveal>

          {/* 主标题 - 大字号版本 */}
          <Reveal direction="up" delay={0.2}>
            <div style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#06b6d4',
              marginBottom: '28px',
              textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: '14px',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.02))',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '100px',
              backdropFilter: 'blur(20px)'
            }}>
              <span style={{
                width: '32px', height: '2px',
                background: 'linear-gradient(90deg, #06b6d4, transparent)'
              }} />
              FDE前沿部署实战专家 · 政企AI化改造落地实践者
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 3.6vw, 3.5rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#fafafa',
              marginBottom: '32px',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ display: 'block', lineHeight: '1.1' }}>FDE 就是 AI 厂商标准化产品</span>
              <span style={{ display: 'block', lineHeight: '1.1' }}>与甲方真实生产环境之间</span>
              <span style={{ 
                display: 'block', lineHeight: '1.1',
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient 8s ease infinite'
              }}>的最适配载体。</span>
              <span style={{ 
                display: 'block',
                fontSize: '0.25em', fontWeight: 400,
                color: 'rgba(255,255,255,0.5)',
                marginTop: '24px', letterSpacing: '0.1em',
                fontStyle: 'italic'
              }}>—— 行者 Jeff</span>
            </h1>
          </Reveal>

          {/* 下方双栏：左介绍 + 右数据卡 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '60px', alignItems: 'flex-start' }}>
            
            {/* 左侧：介绍 + CTA */}
            <Reveal direction="up" delay={0.4}>
              

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <MagneticButton primary href="#work" large>
                  <span>查看项目</span>
                  <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '4px' }}>WORK</span>
                  <span style={{ fontSize: '18px' }}>→</span>
                </MagneticButton>
                <MagneticButton href="#contact" large>
                  <span>合作咨询</span>
                  <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '4px' }}>CONTACT</span>
                </MagneticButton>
              </div>
            </Reveal>

            {/* 右侧：数据玻璃卡 */}
            <Reveal direction="right" delay={0.5}>
              <Glass style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  paddingBottom: '20px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div>
                    <div style={{
                      fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.2em', fontFamily: 'JetBrains Mono, monospace',
                      marginBottom: '8px'
                    }}>
                      AT A GLANCE
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                      一线 FDE 实战家
                    </div>
                  </div>
                  <div style={{
                    width: '36px', height: '36px',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>J</span>
                  </div>
                </div>
                
                {/* 4 个数据 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{
                      fontSize: '32px', fontWeight: 700,
                      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em'
                    }}>5+</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>标杆项目</div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '32px', fontWeight: 700,
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em'
                    }}>6</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>出版著作</div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '32px', fontWeight: 700,
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em'
                    }}>4</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>行业赛道</div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '32px', fontWeight: 700,
                      background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em'
                    }}>2</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>行业社区</div>
                  </div>
                </div>

                {/* 位置信息 */}
                <div style={{
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.05em'
                }}>
                  <span>📍 上海 · CHINA</span>
                  <span>v4.0 · 2026</span>
                </div>
              </Glass>
            </Reveal>
          </div>

          {/* 底部装饰 - 跑马灯 */}
          <Reveal direction="fade" delay={0.7}>
            <div style={{
              marginTop: '100px',
              padding: '24px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)'
            }}>
              <div style={{
                display: 'flex', gap: '32px',
                animation: 'marquee 50s linear infinite',
                paddingLeft: '20px'
              }}>
                {[...Array(2)].flatMap((_, i) => [
                  { title: 'FDE 实战现场', cover: '/books/fde-practice.jpg' },
                  { title: 'FDE 零基础实战手册', cover: '/books/fde-from-zero.jpg' },
                  { title: '智能体插件工程', cover: '/books/agent-plugin.jpg' },
                  { title: '政企大模型私有化落地', cover: '/books/private-llm.jpg' },
                  { title: 'RAG 生产化调优实战', cover: '/books/rag-tuning.jpg' },
                  { title: 'AI 风险与合规实践', cover: '/books/ai-compliance.jpg' }
                ].map((book, j) => (
                  <div key={`${i}-${j}`} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    flexShrink: 0
                  }}>
                    <div style={{
                      width: '60px', height: '80px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      flexShrink: 0
                    }}>
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block'
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: '18px', fontWeight: 500,
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap'
                    }}>
                      {book.title}
                    </span>
                    <span style={{
                      fontSize: '24px', color: '#06b6d4',
                      opacity: 0.4, marginLeft: '20px'
                    }}>✦</span>
                  </div>
                )))}
              </div>
            </div>
          </Reveal>
        </div>

        <div style={{
          position: 'absolute', bottom: '30px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '0.2em',
          animation: 'bounce 2.5s infinite'
        }}>
          <span>SCROLL TO EXPLORE</span>
          <span style={{ fontSize: '16px' }}>↓</span>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" style={{ padding: '120px 40px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel number="01" zh="关于我" en="ABOUT" />
          
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '60px', marginTop: '60px' }}>
            <Reveal direction="left">
              <Glass style={{ padding: '0', aspectRatio: '4/5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'url(/images/avatar.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 25%',
                  zIndex: 0
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(5,7,13,0.3) 0%, transparent 30%, transparent 60%, rgba(5,7,13,0.95) 100%)',
                  zIndex: 1
                }} />
                
                <div style={{ position: 'relative', zIndex: 2, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* 顶部：编号 + AVAILABLE */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      fontSize: '10px', letterSpacing: '0.2em',
                      color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
                      backdropFilter: 'blur(20px)',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '6px 12px',
                      borderRadius: '100px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      PORTRAIT · 01
                    </div>
                    <div style={{
                      color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px',
                      backdropFilter: 'blur(20px)',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '6px 12px',
                      borderRadius: '100px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '10px',
                      letterSpacing: '0.15em'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)', animation: 'pulse 2s infinite' }} />
                      AVAILABLE
                    </div>
                  </div>
                  
                </div>

                <div style={{ position: 'relative', zIndex: 2, padding: '32px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>行者 Jeff</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>FDE前沿部署实战专家</div>
                  <div style={{ fontSize: '11px', color: 'rgba(6, 182, 212, 0.85)', marginTop: '2px', fontWeight: 500 }}>FDE STUDY 平台特约讲师</div>
                </div>
              </Glass>
            </Reveal>

            <div>
              <Reveal direction="up" delay={0.1}>
                <h2 style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  color: '#fafafa',
                  marginBottom: '40px'
                }}>
                  我定义的 <span style={{ 
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>FDE</span>
                </h2>
              </Reveal>

              <Reveal direction="up" delay={0.2}>
                <div style={{ fontSize: '17px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '32px' }}>
                  <p style={{ 
                    fontSize: '20px', fontWeight: 500,
                    color: '#fff', letterSpacing: '-0.01em',
                    marginBottom: '24px'
                  }}>
                    弥合产品标准，适配生产环境；
                    <br />
                    搭建现场桥梁，实现 AI 落地。
                  </p>
                  
                  <p style={{ 
                    fontSize: '14px', color: 'rgba(255,255,255,0.5)',
                    fontStyle: 'italic', textAlign: 'right',
                    marginBottom: '20px'
                  }}>
                    —— 行者 Jeff
                  </p>

                  <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255, 255, 255, 0.55)' }}>
                    长期深耕智慧政务、智慧养老、智慧社区、智慧园区四大赛道，
                    作为驻场 FDE 不主导项目整体方案，立足现场视角，
                    做客户业务团队与内部研发团队之间的技术桥梁。
                  </p>
                  
                  <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>
                    围绕 FDE 现场实战、智能体插件落地、政企私有化现场部署、AI 项目现场合规风控等方向出版多部专业书籍，发起两大垂直行业社区平台。
                  </p>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.3}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
                  {['PMP 项目管理', '高级 AI 应用工程师', '智能体效率工具从业者'].map(tag => (
                    <span key={tag} style={{
                      padding: '6px 14px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '100px',
                      fontSize: '12px',
                      color: '#06b6d4',
                      fontWeight: 500
                    }}>{tag}</span>
                  ))}
                </div>
              </Reveal>

              <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { num: 5, suffix: '+', label: 'Projects', zh: '标杆项目' },
                  { num: 4, suffix: '', label: 'Domains', zh: '行业赛道' },
                  { num: 2, suffix: '', label: 'Books', zh: '出版著作' },
                  { num: 2, suffix: '', label: 'Community', zh: '行业社区' },
                ].map((s, i) => (
                  <Reveal key={s.label} direction="up" delay={0.4 + i * 0.1}>
                    <Glass style={{ padding: '20px 16px' }}>
                      <div style={{
                        fontSize: '32px', fontWeight: 700, color: '#fff',
                        marginBottom: '4px', fontVariantNumeric: 'tabular-nums',
                        background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                      }}>
                        <AnimatedNumber target={s.num} suffix={s.suffix} inView={statsInView} />
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{s.zh}</div>
                    </Glass>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WORK ============ */}
      <section id="work" style={{ padding: '120px 40px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel number="02" zh="代表项目" en="SELECTED WORK" />
          
          <Reveal direction="up">
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fafafa',
              marginTop: '40px',
              marginBottom: '80px',
              maxWidth: '800px'
            }}>
              政企标杆项目 
              <span style={{ 
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>已投产验收。</span>
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {projects.map((p, i) => (
              <Reveal key={p.num} direction="up" delay={i * 0.08}>
                {p.isPlaceholder ? (
                  // 占位卡 - 文字描述
                  <Glass style={{ 
                    padding: '40px', 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '420px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute', top: '24px', right: '24px',
                      padding: '6px 14px',
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '100px',
                      fontSize: '10px', letterSpacing: '0.1em',
                      color: '#06b6d4', textTransform: 'uppercase',
                      fontWeight: 600
                    }}>
                      06 · COMING SOON
                    </div>
                    
                    {/* 装饰圆环 */}
                    <div style={{
                      width: '100px', height: '100px',
                      borderRadius: '50%',
                      border: '1px dashed rgba(6, 182, 212, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '24px',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '70px', height: '70px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px'
                      }}>✦</div>
                    </div>
                    
                    <h3 style={{
                      fontSize: '22px', fontWeight: 600, color: '#fff',
                      letterSpacing: '-0.01em', marginBottom: '8px'
                    }}>
                      {p.title}
                    </h3>
                    <p style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.1em', marginBottom: '16px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {p.zh}
                    </p>
                    <p style={{
                      fontSize: '14px', color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.7, maxWidth: '360px', marginBottom: '20px'
                    }}>
                      {p.desc}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {p.tech.map(t => (
                        <span key={t} style={{
                          padding: '4px 10px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '100px',
                          fontSize: '11px', color: 'rgba(255,255,255,0.5)',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>{t}</span>
                      ))}
                    </div>
                  </Glass>
                ) : (
                <a href="#" className="project-link" style={{ display: 'block', textDecoration: 'none', cursor: 'none' }}>
                  <Glass style={{ padding: '20px', overflow: 'hidden' }}>
                    {/* Video Preview */}
                    <div className="video-frame" style={{
                      aspectRatio: '16/10',
                      background: p.gradient,
                      borderRadius: '16px',
                      marginBottom: '20px',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {p.videoSrc && (
                        <video
                          className="project-video"
                          src={p.videoSrc}
                          muted
                          loop
                          playsInline
                          autoPlay
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      )}
                      
                      {/* Gradient overlay for readability */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))',
                        pointerEvents: 'none'
                      }} />
                      
                      {/* Top category badge */}
                      <div style={{
                        position: 'absolute', top: '16px', left: '16px',
                        padding: '6px 14px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '100px',
                        fontSize: '10px', letterSpacing: '0.1em',
                        color: '#fff', textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        {p.category}
                      </div>
                      
                      {/* Project number - top right */}
                      <div style={{
                        position: 'absolute', top: '16px', right: '16px',
                        fontSize: '13px', fontWeight: 700,
                        color: 'rgba(255,255,255,0.6)',
                        fontFamily: 'JetBrains Mono, monospace',
                        padding: '4px 10px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '100px'
                      }}>
                        {p.num}
                      </div>
                      
                      {/* Play indicator at bottom */}
                      <div style={{
                        position: 'absolute', bottom: '16px', left: '16px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 12px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '100px',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 500
                      }}>
                        <span style={{
                          width: '8px', height: '8px',
                          background: '#ef4444',
                          borderRadius: '50%',
                          boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                          animation: 'pulse 1.5s infinite'
                        }} />
                        LIVE DEMO
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '0 4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                          {p.title}
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginTop: '4px', fontSize: '12px' }}>{p.zh}</div>
                        </h3>
                        <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} className="arrow-icon">→</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {p.tech.map(t => (
                          <span key={t} style={{
                            padding: '4px 10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '100px',
                            fontSize: '11px', color: 'rgba(255,255,255,0.6)',
                            fontFamily: 'JetBrains Mono, monospace'
                          }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </Glass>
                </a>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SKILLS ============ */}
      <section id="skills" style={{ padding: '120px 40px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel number="03" zh="核心能力" en="CAPABILITIES" />
          
          <Reveal direction="up">
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fafafa',
              marginTop: '40px',
              marginBottom: '80px',
              maxWidth: '800px'
            }}>
              三大核心能力
              <span style={{ 
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}> · 现场闭环交付。</span>
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {skillCategories.map((cat, i) => (
              <Reveal key={cat.title} direction="up" delay={i * 0.08}>
                <Glass className="skill-card" style={{ padding: '32px', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div className="skill-icon" style={{
                      fontSize: '32px',
                      transition: 'transform 0.5s ease'
                    }}>{cat.icon}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', fontFamily: 'JetBrains Mono, monospace' }}>{cat.zh}</div>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>{cat.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cat.skills.map(s => (
                      <li key={s} style={{
                        padding: '8px 0',
                        fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', gap: '10px'
                      }}>
                        <span style={{ color: '#06b6d4', fontSize: '10px' }}>▸</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Glass>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOOKS ============ */}
      <section id="books" style={{ padding: '120px 40px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel number="04" zh="出版著作" en="PUBLISHED BOOKS" />
          
          <Reveal direction="up">
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fafafa',
              marginTop: '40px',
              marginBottom: '80px'
            }}>
              行业知识沉淀
              <span style={{ 
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}> · 6 部专业著作。</span>
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {books.map((b, i) => (
              <Reveal key={b.num} direction="up" delay={i * 0.08}>
                <div className="book-card" style={{
                  cursor: 'none',
                  transition: 'transform 0.4s ease'
                }}>
                  {/* Book Cover */}
                  <BookCover book={b} />
                  
                  {/* Book Info */}
                  <div style={{ padding: '20px 4px 0' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        fontSize: '10px', letterSpacing: '0.2em',
                        color: 'rgba(255,255,255,0.4)', fontWeight: 600,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>{b.num} · {b.audience}</span>
                    </div>
                    <h3 style={{
                      fontSize: '15px', fontWeight: 500, color: '#fff',
                      lineHeight: 1.4, marginBottom: '12px', letterSpacing: '-0.005em'
                    }}>
                      {b.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {b.tags.map(tag => (
                        <span key={tag} style={{
                          padding: '3px 10px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '100px',
                          fontSize: '10px', color: 'rgba(255,255,255,0.6)',
                          fontFamily: 'JetBrains Mono, monospace',
                          letterSpacing: '0.05em'
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          
          {/* Communities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '32px' }}>
            <Reveal direction="up" delay={0.2}>
              <Glass style={{ padding: '28px', height: '100%' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '4px 12px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '100px',
                  fontSize: '11px', color: '#06b6d4',
                  letterSpacing: '0.15em', fontWeight: 600,
                  marginBottom: '16px',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  COMMUNITY · 01
                </div>
                <h4 style={{
                  fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '8px',
                  letterSpacing: '-0.01em'
                }}>
                  DeepSeek Harness 之家
                </h4>
                <div style={{
                  display: 'inline-block', marginBottom: '12px',
                  padding: '3px 10px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.05))',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  borderRadius: '100px',
                  fontSize: '10px', color: '#06b6d4',
                  letterSpacing: '0.1em', fontWeight: 600
                }}>✦ 创办者</div>
                <div style={{
                  fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: '12px', letterSpacing: '0.05em'
                }}>DSH‑HOME</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                  国内首个面向 DSH 同行者的垂直学习社区，汇聚实战案例、学习资料、行业交流，助力从业者共同成长。
                </p>
              </Glass>
            </Reveal>

            <Reveal direction="up" delay={0.3}>
              <Glass style={{ padding: '28px', height: '100%' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '4px 12px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '100px',
                  fontSize: '11px', color: '#a78bfa',
                  letterSpacing: '0.15em', fontWeight: 600,
                  marginBottom: '16px',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  COMMUNITY · 02
                </div>
                <h4 style={{
                  fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '8px',
                  letterSpacing: '-0.01em'
                }}>
                  智能体插件平台
                </h4>
                <div style={{
                  display: 'inline-block', marginBottom: '12px',
                  padding: '3px 10px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '100px',
                  fontSize: '10px', color: '#a78bfa',
                  letterSpacing: '0.1em', fontWeight: 600
                }}>✦ 建设合伙人</div>
                <div style={{
                  fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: '12px', letterSpacing: '0.05em'
                }}>Agent‑Plugin</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                  聚焦 Agent 插件生态建设，提供插件发布、获取、复用能力，赋能智能体应用快速搭建。
                </p>
              </Glass>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE ============ */}
      <section id="experience" style={{ padding: '120px 40px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel number="05" zh="实战历程" en="EXPERIENCE" />
          
          <Reveal direction="up">
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fafafa',
              marginTop: '40px',
              marginBottom: '80px'
            }}>
              从 POC 到生产
              <span style={{ 
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}> · 完整闭环。</span>
            </h2>
          </Reveal>

          <div>
            {experiences.map((job, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 0.15}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '6px 14px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '100px',
                      fontSize: '11px', color: '#06b6d4',
                      letterSpacing: '0.15em', fontWeight: 600,
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>{job.period}</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>{job.role}</h3>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{job.company}</span>
                  </div>
                  <Glass style={{ padding: '32px' }}>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '20px' }}>{job.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {job.achievements.map(a => (
                        <div key={a} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                          <span style={{ color: '#06b6d4' }}>✓</span>{a}
                        </div>
                      ))}
                    </div>
                  </Glass>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" style={{ padding: '120px 40px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionLabel number="06" zh="联系合作" en="CONTACT" />
          
          <Reveal direction="up" delay={0.1}>
            <Glass style={{ padding: '80px 60px', marginTop: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '200%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 60%)',
                filter: 'blur(60px)', pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', bottom: '-50%', right: '-20%', width: '60%', height: '200%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 60%)',
                filter: 'blur(60px)', pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: '#fafafa',
                  marginBottom: '24px'
                }}>
                  期待与你共建
                  <span style={{ 
                    display: 'block',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradient 8s ease infinite'
                  }}>AI 政企落地项目。</span>
                </h2>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 12px', lineHeight: 1.6 }}>
                  接受 AI 政企项目合作、咨询、培训，欢迎联系。
                </p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '40px' }}>
                  Open for AI enterprise projects, consulting, and training.
                </p>

                <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <MagneticButton primary href="mailto:xingzhe_jeff@163.com" large>
                    <span>xingzhe_jeff@163.com</span>
                    <span>→</span>
                  </MagneticButton>
                </div>

                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {[
                    { name: 'GitHub', url: '#' },
                    { name: '知乎', url: '#' },
                    { name: '公众号', url: '#' },
                    { name: 'CSDN', url: '#' },
                  ].map(s => (
                    <a key={s.name} href={s.url} className="social-link" style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      letterSpacing: '0.02em', fontWeight: 500,
                      transition: 'all 0.3s'
                    }}>{s.name}</a>
                  ))}
                </div>
              </div>
            </Glass>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ padding: '40px', position: 'relative', zIndex: 3 }}>
        <Glass style={{ padding: '20px 32px', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace' }}>© 2026 行者 Jeff · AI 政企落地实践者</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>AVAILABLE · 接受项目</span>
            </div>
          </div>
        </Glass>
      </footer>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; cursor: none; }
        body {
          background: #05070d;
          color: #e8eaed;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
          cursor: none;
          min-height: 100vh;
        }
        a, button { cursor: none; }

        ::selection { background: rgba(6, 182, 212, 0.3); color: #fff; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .glass-card {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease, background 0.3s ease;
          position: relative;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          pointerEvents: none;
          z-index: 2;
        }
        .glass-card:hover {
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow:
            0 1px 0 0 rgba(255, 255, 255, 0.1) inset,
            0 -1px 0 0 rgba(0, 0, 0, 0.1) inset,
            0 30px 80px -20px rgba(0, 0, 0, 0.6),
            0 12px 32px -8px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(6, 182, 212, 0.1) !important;
        }

        .book-card:hover {
          transform: translateY(-6px) !important;
        }
        .book-card:hover .book-cover-img {
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(6, 182, 212, 0.4) !important;
        }
        .video-frame {
          position: relative;
        }
        .book-feature-card:hover .book-feature-img {
          transform: scale(1.05);
        }
        .book-feature-card:hover .book-buy-btn {
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255,255,255,0.25) !important;
        }
        .view-all-books-link:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.3) !important;
          color: #fff !important;
        }
        .project-video {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-link:hover .project-video {
          transform: scale(1.05);
        }
        .project-link:hover .view-project {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .project-link:hover .arrow-icon {
          color: #06b6d4 !important;
          transform: translateX(6px);
        }

        .skill-card:hover .skill-icon {
          transform: rotate(12deg) scale(1.15);
        }

        .social-link:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.15) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          [id="about"] > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          [id="work"] > div > div:nth-child(3),
          [id="books"] > div > div:nth-child(3) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          
          [id="skills"] > div > div:nth-child(3) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          [id="about"] > div > div:nth-child(2) > div:last-child > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          html, body, a, button { cursor: auto; }
          nav { display: none !important; }
          section[id] { padding: 80px 20px !important; }
          [id="hero"] { padding: 100px 20px 60px !important; min-height: auto !important; }
          [id="about"] > div > div:nth-child(2),
          [id="work"] > div > div:nth-child(3),
          [id="skills"] > div > div:nth-child(3),
          [id="books"] > div > div:nth-child(3),
          [id="contact"] > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          [id="contact"] > div > div:nth-child(2) > div > div {
            padding: 50px 30px !important;
          }
          [id="about"] > div > div:nth-child(2) > div:last-child > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// =============== BOOK COVER DESIGNS ===============

// 共用：底部出品方 + 底部装饰
function CoverFooter({ palette }: { palette: string[] }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '14px 18px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
      zIndex: 3
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{
          fontSize: '8px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.15em',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          FIND FDE × FDE STUDY
        </div>
        <div style={{
          width: '6px', height: '6px',
          background: palette[0],
          borderRadius: '50%',
          boxShadow: `0 0 8px ${palette[0]}`
        }} />
      </div>
    </div>
  )
}

// 共用：Glitch 标题组件
function GlitchTitle({ words, size = 40 }: { words: string[]; size?: number }) {
  return (
    <div style={{ textAlign: 'center', margin: 'auto 0' }}>
      {words.map((word, idx) => (
        <div key={idx} style={{
          position: 'relative',
          fontSize: idx === 0 ? size * 1.2 : size,
          fontWeight: 900,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          marginBottom: '4px',
          fontFamily: 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
        }}>
          <span style={{
            position: 'absolute', top: 0, left: 0,
            color: '#ef4444', opacity: 0.85,
            transform: 'translate(2px, 1px)', mixBlendMode: 'screen',
            clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
          }}>{word}</span>
          <span style={{
            position: 'absolute', top: 0, left: 0,
            color: '#06b6d4', opacity: 0.85,
            transform: 'translate(-2px, -1px)', mixBlendMode: 'screen',
            clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
          }}>{word}</span>
          <span style={{ position: 'relative', color: '#fff' }}>{word}</span>
        </div>
      ))}
    </div>
  )
}

// 共用：顶部引言（不重复）
function CoverTagline({ tagline, author }: { tagline: string; author: string }) {
  return (
    <div style={{ position: 'relative', zIndex: 3 }}>
      <div style={{
        fontSize: '11px', lineHeight: 1.5,
        color: 'rgba(255,255,255,0.95)',
        fontStyle: 'italic',
        textShadow: '0 1px 4px rgba(0,0,0,0.6)'
      }}>
        "{tagline}"
      </div>
      <div style={{
        fontSize: '10px', color: 'rgba(255,255,255,0.5)',
        textAlign: 'right', marginTop: '2px',
        fontFamily: 'serif'
      }}>
        —— {author}
      </div>
    </div>
  )
}

// === 03 AGENT 插件工程 - 节点网络主题 ===
function AgentCoverDesign({ book }: { book: any }) {
  const [c1, c2, c3] = [book.palette[0], book.palette[1], book.palette[2]]
  // 节点位置（相对单位 0-1）
  const nodes = [
    { x: 0.5, y: 0.32, r: 8 },
    { x: 0.25, y: 0.45, r: 6 },
    { x: 0.75, y: 0.42, r: 6 },
    { x: 0.15, y: 0.25, r: 4 },
    { x: 0.85, y: 0.22, r: 4 },
    { x: 0.35, y: 0.58, r: 5 },
    { x: 0.65, y: 0.55, r: 5 },
    { x: 0.5, y: 0.65, r: 4 }
  ]
  const connections = [[0,1],[0,2],[1,3],[2,4],[1,5],[2,6],[5,7],[6,7]]
  
  return (
    <div style={{
      position: 'relative', aspectRatio: '3/4', borderRadius: '8px',
      overflow: 'hidden', background: '#000',
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
    }}>
      {/* 背景渐变 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${c1}30, transparent 60%),
                     radial-gradient(ellipse 50% 30% at 30% 60%, ${c2}20, transparent 60%),
                     radial-gradient(ellipse 50% 30% at 70% 70%, ${c3}25, transparent 60%)`
      }} />
      
      {/* SVG 节点网络 */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {connections.map(([a, b], i) => (
          <line key={i}
            x1={nodes[a].x * 100} y1={nodes[a].y * 100}
            x2={nodes[b].x * 100} y2={nodes[b].y * 100}
            stroke={c1} strokeWidth="0.2" opacity="0.5"
          />
        ))}
      </svg>
      
      {/* 节点圆点 */}
      {nodes.map((node, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `calc(${node.x * 100}% - ${node.r}px)`,
          top: `calc(${node.y * 100}% - ${node.r}px)`,
          width: `${node.r * 2}px`, height: `${node.r * 2}px`,
          background: i === 0 ? c1 : c2,
          borderRadius: '50%',
          boxShadow: `0 0 ${node.r * 2}px ${i === 0 ? c1 : c2}80`,
          zIndex: 2
        }} />
      ))}
      
      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%', padding: '24px 20px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 30%, transparent 70%, rgba(0,0,0,0.5))'
      }}>
        <CoverTagline tagline={book.tagline} author={book.taglineAuthor} />
        <GlitchTitle words={book.bigTitle} size={42} />
        <div style={{ paddingBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            fontSize: '10px', color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace'
          }}>
            <span style={{ width: '6px', height: '6px', background: c1, borderRadius: '50%' }} />
            PLUGIN ECOSYSTEM
          </div>
        </div>
      </div>
      <CoverFooter palette={book.palette} />
    </div>
  )
}

// === 04 PRIVATE 私有化部署 - 内网隔离主题 ===
function PrivateCoverDesign({ book }: { book: any }) {
  const [c1, c2, c3] = [book.palette[0], book.palette[1], book.palette[2]]
  return (
    <div style={{
      position: 'relative', aspectRatio: '3/4', borderRadius: '8px',
      overflow: 'hidden', background: '#000',
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
    }}>
      {/* 背景：内外网络分层 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${c1}40, transparent 60%),
                     radial-gradient(ellipse 50% 30% at 50% 30%, ${c2}20, transparent 60%)`
      }} />
      
      {/* 防火墙竖线条 */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%',
        width: '2px',
        background: `linear-gradient(to bottom, transparent, ${c1} 20%, ${c1} 80%, transparent)`,
        boxShadow: `0 0 20px ${c1}`,
        zIndex: 2
      }} />
      
      {/* 防火墙装饰 - 左侧条纹 */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 'calc(50% - 12px)',
        width: '24px',
        background: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 4px,
          ${c1}15 4px,
          ${c1}15 6px
        )`,
        zIndex: 1
      }} />
      
      {/* 锁形装饰 */}
      <svg style={{ position: 'absolute', bottom: '20%', right: '10%', width: '60px', height: '60px', zIndex: 2, opacity: 0.3 }} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="11" width="16" height="10" rx="1" stroke={c2} strokeWidth="1"/>
        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={c2} strokeWidth="1"/>
        <circle cx="12" cy="16" r="1" fill={c2}/>
      </svg>
      
      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%', padding: '24px 20px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 30%, transparent 70%, rgba(0,0,0,0.6))'
      }}>
        <CoverTagline tagline={book.tagline} author={book.taglineAuthor} />
        <GlitchTitle words={book.bigTitle} size={42} />
        <div style={{ paddingBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px',
            fontSize: '10px', color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace'
          }}>
            <span style={{ width: '6px', height: '6px', background: c1, borderRadius: '50%', boxShadow: `0 0 6px ${c1}` }} />
            INTRANET ISOLATION
          </div>
        </div>
      </div>
      <CoverFooter palette={book.palette} />
    </div>
  )
}

// === 05 RAG 检索 - 数据网格主题 ===
function RagCoverDesign({ book }: { book: any }) {
  const [c1, c2, c3] = [book.palette[0], book.palette[1], book.palette[2]]
  // 网格点位置
  const gridPts = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 10; j++) {
      if (Math.random() > 0.5) {
        gridPts.push({ x: i / 7, y: j / 9 })
      }
    }
  }
  
  return (
    <div style={{
      position: 'relative', aspectRatio: '3/4', borderRadius: '8px',
      overflow: 'hidden', background: '#000',
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
    }}>
      {/* 背景：双向径向渐变 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 30% 30%, ${c2}25, transparent 60%),
                     radial-gradient(ellipse 70% 50% at 70% 70%, ${c1}30, transparent 60%)`
      }} />
      
      {/* 数据网格点阵 */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {gridPts.map((p, i) => (
          <circle key={i} cx={p.x * 100} cy={p.y * 100} r="0.6" fill={i % 3 === 0 ? c1 : c2} opacity={0.3 + (i % 5) * 0.1} />
        ))}
        {/* 检索路径 - 螺旋连线 */}
        <path d="M 15 75 Q 50 10 85 60" fill="none" stroke={c1} strokeWidth="0.3" opacity="0.6" strokeDasharray="2,1" />
        <path d="M 25 80 Q 55 20 80 50" fill="none" stroke={c2} strokeWidth="0.3" opacity="0.5" strokeDasharray="2,1" />
      </svg>
      
      {/* 大型"@"符号 - 代表检索 */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '180px',
        fontWeight: 900,
        color: 'transparent',
        WebkitTextStroke: `1px ${c1}40`,
        opacity: 0.4,
        zIndex: 1,
        fontFamily: 'serif'
      }}>@</div>
      
      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%', padding: '24px 20px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 30%, transparent 70%, rgba(0,0,0,0.6))'
      }}>
        <CoverTagline tagline={book.tagline} author={book.taglineAuthor} />
        <GlitchTitle words={book.bigTitle} size={42} />
        <div style={{ paddingBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px',
            fontSize: '10px', color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace'
          }}>
            <span style={{ width: '6px', height: '6px', background: c1, borderRadius: '50%', boxShadow: `0 0 6px ${c1}` }} />
            KNOWLEDGE RETRIEVAL
          </div>
        </div>
      </div>
      <CoverFooter palette={book.palette} />
    </div>
  )
}

// === 06 COMPLIANCE 合规 - 盾牌主题 ===
function ComplianceCoverDesign({ book }: { book: any }) {
  const [c1, c2, c3] = [book.palette[0], book.palette[1], book.palette[2]]
  return (
    <div style={{
      position: 'relative', aspectRatio: '3/4', borderRadius: '8px',
      overflow: 'hidden', background: '#000',
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
    }}>
      {/* 背景：危险警示色 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${c1}35, transparent 60%),
                     radial-gradient(ellipse 40% 30% at 20% 20%, ${c2}20, transparent 60%),
                     radial-gradient(ellipse 40% 30% at 80% 80%, ${c3}20, transparent 60%)`
      }} />
      
      {/* 警示条纹（左上→右下） */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 30px,
          ${c1}08 30px,
          ${c1}08 35px
        )`,
        zIndex: 1
      }} />
      
      {/* 盾牌 SVG（中央装饰） */}
      <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%', height: '60%', zIndex: 2, opacity: 0.25 }} viewBox="0 0 100 110" fill="none">
        <path d="M 50 5 L 90 20 L 90 55 Q 90 90 50 105 Q 10 90 10 55 L 10 20 Z" stroke={c1} strokeWidth="1" />
        <path d="M 50 15 L 80 27 L 80 55 Q 80 85 50 95 Q 20 85 20 55 L 20 27 Z" stroke={c2} strokeWidth="0.5" opacity="0.7" />
        {/* 检查标记 */}
        <path d="M 38 55 L 47 65 L 65 45" stroke={c1} strokeWidth="2" fill="none" />
      </svg>
      
      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%', padding: '24px 20px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 30%, transparent 70%, rgba(0,0,0,0.7))'
      }}>
        <CoverTagline tagline={book.tagline} author={book.taglineAuthor} />
        <GlitchTitle words={book.bigTitle} size={42} />
        <div style={{ paddingBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid ' + c1 + '60',
            borderRadius: '100px',
            fontSize: '10px', color: c2,
            letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace'
          }}>
            <span style={{ width: '6px', height: '6px', background: c1, borderRadius: '50%', boxShadow: `0 0 6px ${c1}` }} />
            COMPLIANCE SHIELD
          </div>
        </div>
      </div>
      <CoverFooter palette={book.palette} />
    </div>
  )
}

// === 默认封面（用于真实封面和基础样式） ===
function DefaultCoverDesign({ book }: { book: any }) {
  const [c1, c2, c3, c4, c5] = book.palette
  return (
    <div style={{
      position: 'relative', aspectRatio: '3/4', borderRadius: '8px',
      overflow: 'hidden', background: '#000',
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 100% 60% at 50% 100%, ${c1}33 0%, transparent 50%),
                     radial-gradient(ellipse 80% 50% at 20% 80%, ${c2}40 0%, transparent 50%),
                     radial-gradient(ellipse 80% 50% at 80% 80%, ${c3}40 0%, transparent 50%),
                     radial-gradient(ellipse 60% 40% at 50% 60%, ${c4}30 0%, transparent 50%),
                     radial-gradient(ellipse 40% 30% at 30% 50%, ${c5}25 0%, transparent 50%),
                     linear-gradient(180deg, #000 0%, #0a0a0a 100%)`
      }} />
      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%', padding: '24px 20px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#fff'
      }}>
        <CoverTagline tagline={book.tagline} author={book.taglineAuthor} />
        <GlitchTitle words={book.bigTitle} size={42} />
        <div style={{ paddingBottom: '40px' }}></div>
      </div>
      <CoverFooter palette={book.palette} />
    </div>
  )
}

// 真实封面渲染
function RealCover({ book }: { book: any }) {
  return (
    <div style={{
      position: 'relative', aspectRatio: '3/4',
      borderRadius: '8px', overflow: 'hidden', background: '#000',
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
    }} className="book-cover-img">
      <img src={book.coverSrc} alt={book.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))',
        pointerEvents: 'none'
      }} />
    </div>
  )
}

// 主 BookCover - 根据 designTheme 选择不同设计
function BookCover({ book }: { book: any }) {
  if (book.hasRealCover && book.coverSrc) {
    return <RealCover book={book} />
  }
  switch (book.designTheme) {
    case 'agent':
      return <AgentCoverDesign book={book} />
    case 'private':
      return <PrivateCoverDesign book={book} />
    case 'rag':
      return <RagCoverDesign book={book} />
    case 'compliance':
      return <ComplianceCoverDesign book={book} />
    default:
      return <DefaultCoverDesign book={book} />
  }
}

function SectionLabel({ number, zh, en }: { number: string; zh: string; en: string }) {
  return (
    <Reveal direction="fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{
          padding: '6px 14px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px',
          fontSize: '12px', fontWeight: 700,
          color: '#06b6d4', letterSpacing: '0.15em',
          fontFamily: 'JetBrains Mono, monospace'
        }}>{number}</span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{zh}</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', fontFamily: 'JetBrains Mono, monospace' }}>{en}</span>
        <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
      </div>
    </Reveal>
  )
}
