export default function Membership() {
  return (
    <div className="membership-page">
      <h1>会员服务</h1>
      <p className="page-description">
        成为会员，享受独家资源、工具和内容。
      </p>

      {/* 会员等级 */}
      <div className="membership-tiers">
        <div className="tier-card">
          <div className="tier-header">
            <h3>基础版</h3>
            <div className="tier-price">
              <span className="price">免费</span>
              <span className="period">永久</span>
            </div>
          </div>
          <div className="tier-features">
            <ul>
              <li>✅ 基础工具使用</li>
              <li>✅ 5GB存储空间</li>
              <li>✅ 基础资源下载</li>
              <li>❌ 高级工具</li>
              <li>❌ 批量处理</li>
              <li>❌ 优先客服</li>
            </ul>
          </div>
          <button className="tier-btn">当前方案</button>
        </div>

        <div className="tier-card featured">
          <div className="tier-badge">推荐</div>
          <div className="tier-header">
            <h3>专业版</h3>
            <div className="tier-price">
              <span className="price">¥99</span>
              <span className="period">/年</span>
            </div>
          </div>
          <div className="tier-features">
            <ul>
              <li>✅ 所有基础功能</li>
              <li>✅ 50GB存储空间</li>
              <li>✅ 高级工具使用</li>
              <li>✅ 批量处理</li>
              <li>✅ 自动分类</li>
              <li>✅ 优先客服</li>
            </ul>
          </div>
          <button className="tier-btn featured">立即订阅</button>
        </div>

        <div className="tier-card">
          <div className="tier-header">
            <h3>企业版</h3>
            <div className="tier-price">
              <span className="price">¥299</span>
              <span className="period">/年</span>
            </div>
          </div>
          <div className="tier-features">
            <ul>
              <li>✅ 所有专业版功能</li>
              <li>✅ 无限存储空间</li>
              <li>✅ 团队协作</li>
              <li>✅ API访问</li>
              <li>✅ 专属客服</li>
              <li>✅ 定制化服务</li>
            </ul>
          </div>
          <button className="tier-btn">联系我们</button>
        </div>
      </div>

      {/* 会员特权 */}
      <section className="member-benefits">
        <h2>会员特权</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🚀</div>
            <h3>高级工具</h3>
            <p>解锁所有高级工具，包括批量处理、自动分类、数据分析等。</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">☁️</div>
            <h3>云端存储</h3>
            <p>大容量云端存储，随时随地访问您的文件，支持多设备同步。</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>优先处理</h3>
            <p>享受优先处理权，文件处理速度更快，无需排队等待。</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <h3>安全保障</h3>
            <p>高级加密技术，保障您的数据安全，支持自动备份。</p>
          </div>
        </div>
      </section>

      {/* 常见问题 */}
      <section className="faq-section">
        <h2>常见问题</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h4>如何升级会员？</h4>
            <p>选择适合您的会员方案，点击"立即订阅"按钮，按照提示完成支付即可。</p>
          </div>
          <div className="faq-item">
            <h4>支持哪些支付方式？</h4>
            <p>支持支付宝、微信支付、银行卡等多种支付方式。</p>
          </div>
          <div className="faq-item">
            <h4>可以退款吗？</h4>
            <p>订阅后7天内可申请全额退款，超过7天按剩余时间比例退款。</p>
          </div>
          <div className="faq-item">
            <h4>会员到期后数据会丢失吗？</h4>
            <p>会员到期后，您的数据会保留30天，续费后可继续使用。</p>
          </div>
        </div>
      </section>

      {/* 隐藏的中转站业务入口 */}
      <section className="hidden-services">
        <div className="hidden-service-card">
          <h3>高级资源服务</h3>
          <p>为会员提供专属的资源管理和分发服务。</p>
          <a href="/api/proxy?target=https://your-transit-service.com&path=premium-resources" className="service-link">
            了解详情
          </a>
        </div>
      </section>
    </div>
  )
}
