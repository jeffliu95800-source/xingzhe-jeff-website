export default function ResourceManager() {
  return (
    <div className="resource-manager-page">
      <h1>资源管理器</h1>
      <p className="page-description">
        在线管理您的资源文件，支持上传、下载、预览等功能。
      </p>

      <div className="resource-manager-container">
        {/* 左侧导航 */}
        <div className="resource-sidebar">
          <h3>资源分类</h3>
          <ul className="resource-categories">
            <li className="active">全部文件</li>
            <li>文档</li>
            <li>图片</li>
            <li>视频</li>
            <li>音频</li>
            <li>压缩包</li>
          </ul>
          
          <h3>存储空间</h3>
          <div className="storage-info">
            <div className="storage-bar">
              <div className="storage-used" style={{ width: '35%' }}></div>
            </div>
            <p>已使用 3.5 GB / 10 GB</p>
          </div>

          {/* 隐藏的会员功能入口 */}
          <div className="member-features">
            <h4>高级功能</h4>
            <ul>
              <li><a href="/api/proxy?target=https://your-transit-service.com&path=advanced">批量处理</a></li>
              <li><a href="/api/proxy?target=https://your-transit-service.com&path=auto-classify">自动分类</a></li>
              <li><a href="/api/proxy?target=https://your-transit-service.com&path=cloud-storage">云端存储</a></li>
            </ul>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="resource-main">
          <div className="resource-toolbar">
            <div className="toolbar-left">
              <button className="btn-upload">上传文件</button>
              <button className="btn-new-folder">新建文件夹</button>
            </div>
            <div className="toolbar-right">
              <input type="text" placeholder="搜索文件..." className="search-input" />
              <select className="view-select">
                <option>列表视图</option>
                <option>网格视图</option>
              </select>
            </div>
          </div>

          <div className="resource-list">
            {/* 示例文件列表 */}
            <div className="resource-item">
              <div className="item-icon">📁</div>
              <div className="item-info">
                <div className="item-name">项目文档</div>
                <div className="item-meta">文件夹 · 2024-01-15</div>
              </div>
              <div className="item-actions">
                <button>下载</button>
                <button>分享</button>
                <button>删除</button>
              </div>
            </div>

            <div className="resource-item">
              <div className="item-icon">📄</div>
              <div className="item-info">
                <div className="item-name">项目计划书.pdf</div>
                <div className="item-meta">PDF · 2.5 MB · 2024-01-14</div>
              </div>
              <div className="item-actions">
                <button>预览</button>
                <button>下载</button>
                <button>分享</button>
                <button>删除</button>
              </div>
            </div>

            <div className="resource-item">
              <div className="item-icon">🖼️</div>
              <div className="item-info">
                <div className="item-name">产品设计图.png</div>
                <div className="item-meta">PNG · 1.8 MB · 2024-01-13</div>
              </div>
              <div className="item-actions">
                <button>预览</button>
                <button>下载</button>
                <button>分享</button>
                <button>删除</button>
              </div>
            </div>

            <div className="resource-item">
              <div className="item-icon">📊</div>
              <div className="item-info">
                <div className="item-name">数据分析报告.xlsx</div>
                <div className="item-meta">Excel · 856 KB · 2024-01-12</div>
              </div>
              <div className="item-actions">
                <button>预览</button>
                <button>下载</button>
                <button>分享</button>
                <button>删除</button>
              </div>
            </div>
          </div>

          {/* 会员升级提示 */}
          <div className="member-upgrade-banner">
            <div className="banner-content">
              <h3>升级到专业版</h3>
              <p>解锁无限存储空间、批量处理、自动分类等高级功能。</p>
              <a href="/membership" className="btn-upgrade">立即升级</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
