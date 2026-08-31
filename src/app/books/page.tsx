export default function Books() {
  // 示例书籍数据
  const books = [
    {
      id: 1,
      title: '《书名1》',
      subtitle: '副标题1',
      description: '这本书的主要内容介绍，包括核心观点、适合读者、阅读收获等。',
      cover: '/images/book1.jpg',
      publishDate: '2023年',
      pages: 320,
      price: '¥68',
      buyLinks: {
        amazon: '#',
        jd: '#',
        dangdang: '#'
      },
      tags: ['标签1', '标签2', '标签3']
    },
    {
      id: 2,
      title: '《书名2》',
      subtitle: '副标题2',
      description: '这本书的主要内容介绍，包括核心观点、适合读者、阅读收获等。',
      cover: '/images/book2.jpg',
      publishDate: '2022年',
      pages: 280,
      price: '¥58',
      buyLinks: {
        amazon: '#',
        jd: '#',
        dangdang: '#'
      },
      tags: ['标签1', '标签2', '标签3']
    },
    {
      id: 3,
      title: '《书名3》',
      subtitle: '副标题3',
      description: '这本书的主要内容介绍，包括核心观点、适合读者、阅读收获等。',
      cover: '/images/book3.jpg',
      publishDate: '2021年',
      pages: 350,
      price: '¥78',
      buyLinks: {
        amazon: '#',
        jd: '#',
        dangdang: '#'
      },
      tags: ['标签1', '标签2', '标签3']
    }
  ]

  return (
    <div className="books-page">
      <h1>我的书籍</h1>
      <p className="books-intro">
        这里展示我出版的书籍，涵盖 [领域1]、[领域2] 等方面。
        每本书都凝聚了我的经验和思考，希望能为读者带来价值。
      </p>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-cover">
              {/* 替换为实际书籍封面图片 */}
              <div className="book-cover-placeholder">
                <span>{book.title}</span>
              </div>
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="book-subtitle">{book.subtitle}</p>
              <p className="book-description">{book.description}</p>
              <div className="book-meta">
                <span>出版时间：{book.publishDate}</span>
                <span>页数：{book.pages}页</span>
                <span>价格：{book.price}</span>
              </div>
              <div className="book-tags">
                {book.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <div className="book-links">
                <a href={book.buyLinks.amazon} className="btn-amazon">亚马逊购买</a>
                <a href={book.buyLinks.jd} className="btn-jd">京东购买</a>
                <a href={book.buyLinks.dangdang} className="btn-dangdang">当当购买</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="books-testimonials">
        <h2>读者评价</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"这本书让我对 [领域] 有了全新的认识，非常实用！"</p>
            </div>
            <div className="testimonial-author">
              <strong>读者A</strong>
              <span>★★★★★</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"作者的见解很独到，案例分析很到位，推荐阅读。"</p>
            </div>
            <div className="testimonial-author">
              <strong>读者B</strong>
              <span>★★★★☆</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"书中的方法论很实用，我已经应用到工作中，效果显著。"</p>
            </div>
            <div className="testimonial-author">
              <strong>读者C</strong>
              <span>★★★★★</span>
            </div>
          </div>
        </div>
      </section>

      <section className="books-upcoming">
        <h2>即将出版</h2>
        <div className="upcoming-book">
          <div className="upcoming-cover">
            <div className="upcoming-placeholder">
              <span>即将出版</span>
            </div>
          </div>
          <div className="upcoming-info">
            <h3>《新书预告》</h3>
            <p>预计出版时间：2024年下半年</p>
            <p>内容简介：这本书将探讨 [新主题]，为读者提供 [新价值]。</p>
            <button className="btn-notify">获取出版通知</button>
          </div>
        </div>
      </section>
    </div>
  )
}
