import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import Terminal from '../components/Terminal.jsx'
import Carousel from '../components/Carousel.jsx'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { profile } from '../data/profile.js'
import { posts } from '../data/posts.jsx'
import { projects } from '../data/projects.js'
import { fetchViewCounts } from '../lib/goatcounter.js'

export default function Home() {
  const { text, reduced } = useTypewriter(profile.taglines)

  // Live view counts from GoatCounter; null until they arrive (or forever,
  // when analytics aren't configured — ranking then falls back to recency).
  const [views, setViews] = useState(null)
  useEffect(() => {
    const paths = [
      ...posts.map((p) => `/blog/${p.slug}`),
      ...projects.map((p) => `/projects/${p.slug}`),
    ]
    fetchViewCounts(paths).then((v) => {
      if (Object.values(v).some((n) => n > 0)) setViews(v)
    })
  }, [])

  // Alternate posts and projects so the carousel features both evenly.
  // Within each list view count ranks first, then recency; projects carry
  // no date, so sort() stability keeps them in curated order.
  const withViews = (list, kind, base) =>
    list.map((p) => ({
      ...p,
      kind,
      views: (views && views[`${base}/${p.slug}`]) || p.views || 0,
    }))
  const rank = (list) =>
    [...list].sort(
      (a, b) =>
        (b.views || 0) - (a.views || 0) ||
        new Date(b.date || 0) - new Date(a.date || 0)
    )
  const rankedPosts = rank(withViews(posts, 'post', '/blog'))
  const rankedProjects = rank(withViews(projects, 'project', '/projects'))
  const featured = []
  for (let i = 0; featured.length < 8 && (rankedPosts[i] || rankedProjects[i]); i++) {
    if (rankedPosts[i]) featured.push(rankedPosts[i])
    if (rankedProjects[i] && featured.length < 8) featured.push(rankedProjects[i])
  }

  return (
    <PageWrap>
      <div className="container">
        <section className="hero">
          <div>
            <p className="kicker">whoami</p>
            <h1 className="hero-name gradient-text">{profile.name}</h1>
            <p className="hero-type">
              {text}
              {!reduced && <span className="type-caret" />}
            </p>
            <p className="hero-blurb">{profile.blurb}</p>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/projects">
                View projects
              </Link>
              <Link className="btn btn-ghost" to="/resume">
                Resume
              </Link>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <Terminal />
          </motion.div>
        </section>

        <Carousel items={featured} />

        <section className="section">
          <Reveal>
            <p className="kicker">focus areas</p>
            <h2 className="section-title">What I work on</h2>
          </Reveal>
          <div className="card-grid">
            {profile.focus.map((f, i) => {
              const [head, ...rest] = f.split(' — ')
              return (
                <Reveal key={head} delay={i * 0.06}>
                  <div className="card">
                    <h3>{head}</h3>
                    <p>{rest.join(' — ')}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section className="section">
          <Reveal>
            <p className="kicker">stay connected</p>
            <h2 className="section-title">Subscribe & reach out</h2>
          </Reveal>

          <div className="contact-grid">
            <Reveal>
              <div className="card">
                <h3>Subscribe to posts</h3>
                <p>Get new articles on platform engineering, security, and infrastructure delivered to your inbox.</p>
                <form className="contact-form" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Subscribe
                  </button>
                </form>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="card">
                <h3>Send me a message</h3>
                <p>Have a question, idea, or just want to chat? Drop me a line and I'll get back to you.</p>
                <form className="contact-form" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Your message..."
                    rows="4"
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Send
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageWrap>
  )
}
