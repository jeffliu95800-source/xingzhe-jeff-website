'use client'

import { useEffect, useState } from 'react'
import "./page.css"

const skills = [
  { name: 'Writing', level: '10+ books published' },
  { name: 'Development', level: 'Full-stack web' },
  { name: 'Design', level: 'UI/UX & Visual' },
  { name: 'Strategy', level: 'Digital products' },
]

const timeline = [
  { year: '2024', title: 'AI时代生存指南', desc: 'Published latest book on AI survival strategies' },
  { year: '2023', title: 'ToolBox Pro Launch', desc: 'Launched comprehensive developer toolkit' },
  { year: '2023', title: '数字游民手册', desc: 'Published digital nomad guidebook' },
  { year: '2022', title: 'CreativeHub Platform', desc: 'Built creative collaboration platform' },
  { year: '2021', title: 'Started Freelancing', desc: 'Began independent creative development' },
]

export default function About() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`page about-page ${isLoaded ? 'loaded' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="header-back">
          <a href="/" className="mono">← Back</a>
        </div>
        <div className="header-title">
          <span className="mono">About</span>
        </div>
      </header>

      <main className="main">
        {/* Intro */}
        <section className="about-intro">
          <div className="container">
            <div className="about-intro-grid">
              <div className="about-intro-content">
                <h1 className="about-title">
                  <span className="line">
                    <span className="line-inner">About</span>
                  </span>
                  <span className="line">
                    <span className="line-inner">Me</span>
                  </span>
                </h1>
                <p className="about-description">
                  I'm a creative developer and author based in China. 
                  I specialize in building digital products, writing insightful books, 
                  and creating tools that help people work smarter.
                </p>
                <p className="about-description">
                  With over 10 years of experience in the digital space, 
                  I've helped countless clients bring their visions to life through 
                  code, design, and strategic thinking.
                </p>
              </div>
              <div className="about-intro-visual">
                <div className="about-avatar">
                  <div className="avatar-placeholder">
                    <span>YN</span>
                  </div>
                </div>
                <div className="about-stats">
                  <div className="stat">
                    <span className="stat-number">10+</span>
                    <span className="stat-label mono">Books</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50+</span>
                    <span className="stat-label mono">Projects</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">100k+</span>
                    <span className="stat-label mono">Readers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="about-skills">
          <div className="container">
            <div className="section-header">
              <span className="mono">Capabilities</span>
            </div>
            <div className="skills-grid">
              {skills.map((skill, i) => (
                <div key={skill.name} className={`skill-item animate-in delay-${i + 1}`}>
                  <h3 className="skill-name">{skill.name}</h3>
                  <p className="skill-level">{skill.level}</p>
                  <div className="skill-line"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="about-timeline">
          <div className="container">
            <div className="section-header">
              <span className="mono">Timeline</span>
            </div>
            <div className="timeline-list">
              {timeline.map((item, i) => (
                <div key={i} className={`timeline-item animate-in delay-${i + 1}`}>
                  <div className="timeline-year">
                    <span className="mono">{item.year}</span>
                  </div>
                  <div className="timeline-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="about-contact">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-label">
                <span className="mono">Get in touch</span>
              </div>
              <div className="contact-content">
                <a href="mailto:hello@example.com" className="contact-email">
                  hello@example.com
                </a>
                <div className="contact-social">
                  <a href="https://twitter.com" target="_blank" rel="noopener">Twitter</a>
                  <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-back">
              <a href="/" className="mono">← Back to work</a>
            </div>
            <div className="footer-center">
              <span className="mono">© 2024</span>
            </div>
            <div className="footer-right">
              <span className="mono">Your Name</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
