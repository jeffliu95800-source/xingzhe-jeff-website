export default function Tools() {
  // 示例工具数据
  const tools = [
    {
      id: 1,
      name: '文件转换器',
      description: '在线转换各种文件格式，支持PDF、Word、Excel、图片等格式互转。',
      icon: '📄',
      url: '/tools/file-converter',
      category: '文件处理',
      isHiddenService: false
    },
    {
      id: 2,
      name: 'JSON格式化工具',
      description: '在线格式化、验证和压缩JSON数据，支持语法高亮显示。',
      icon: '📋',
      url: '/tools/json-formatter',
      category: '开发工具',
      isHiddenService: false
    },
    {
      id: 3,
      name: '颜色选择器',
      description: '在线选择颜色，生成配色方案，支持HEX、RGB、HSL等格式。',
      icon: '🎨',
      url: '/tools/color-picker',
      category: '设计工具',
      isHiddenService: false
    },
    {
      id: 4,
      name: 'Markdown编辑器',
      description: '在线Markdown编辑器，实时预览，支持导出HTML、PDF等格式。',
      icon: '📝',
      url: '/tools/markdown-editor',
      category: '写作工具',
      isHiddenService: false
    },
    {
      id: 5,
      name: '在线计算器',
      description: '功能强大的在线计算器，支持科学计算、单位转换等。',
      icon: '🧮',
      url: '/tools/calculator',
      category: '实用工具',
      isHiddenService: false
    },
    {
      id: 6,
      name: '资源管理器',
      description: '在线管理您的资源文件，支持上传、下载、预览等功能。',
      icon: '📁',
      url: '/tools/resource-manager',
      category: '文件处理',
      isHiddenService: true // 这是隐藏的中转站业务
    }
  ]

  // 工具分类
  const categories = ['全部', '文件处理', '开发工具', '设计工具', '写作工具', '实用工具']

  return (
    <div className="tools-page">
      <h1>实用工具</h1>
      <p className="tools-intro">
        这里提供各种实用的在线工具，帮助您提高工作效率。
        所有工具都可以在浏览器中直接使用，无需安装。
      </p>

      {/* 工具分类筛选 */}
      <div className="tools-categories">
        {categories.map((category, index) => (
          <button key={index} className="category-btn">
            {category}
          </button>
        ))}
      </div>

      {/* 工具列表 */}
      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.id} className="tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
            <div className="tool-meta">
              <span className="tool-category">{tool.category}</span>
              {tool.isHiddenService && (
                <span className="hidden-badge">会员专享</span>
              )}
            </div>
            <a href={tool.url} className="tool-link">
              立即使用
            </a>
          </div>
        ))}
      </div>

      {/* 会员专区 - 隐藏业务嫁接 */}
      <section className="member-tools-section">
        <div className="member-only">
          <h3>🌟 会员专享工具</h3>
          <p>成为会员，解锁更多高级工具和功能。</p>
          <div className="member-tools-preview">
            <div className="member-tool-card">
              <h4>高级资源管理器</h4>
              <p>支持批量处理、自动分类、云端存储等高级功能。</p>
            </div>
            <div className="member-tool-card">
              <h4>数据分析工具</h4>
              <p>强大的数据分析工具，支持可视化图表生成。</p>
            </div>
          </div>
          <button>了解会员权益</button>
        </div>
      </section>

      {/* 工具使用统计 */}
      <section className="tools-stats">
        <h2>工具使用统计</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">总使用次数</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">活跃用户</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">用户满意度</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">服务可用性</div>
          </div>
        </div>
      </section>

      {/* 工具请求 */}
      <section className="tool-request">
        <h2>需要新工具？</h2>
        <p>如果您有特定的工具需求，欢迎告诉我们。我们会优先考虑开发用户最需要的工具。</p>
        <form className="request-form">
          <input type="text" placeholder="工具名称" required />
          <textarea placeholder="详细描述您需要的工具功能..." required></textarea>
          <button type="submit">提交请求</button>
        </form>
      </section>
    </div>
  )
}
