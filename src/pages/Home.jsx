import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import Terminal from '../components/Terminal.jsx'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { profile } from '../data/profile.js'
import { posts } from '../data/posts.jsx'

export default function Home() {
  const { text, reduced } = useTypewriter(profile.taglines)
  const latest = posts[0]

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

        <section className="stats">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="stat">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </section>

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
            <p className="kicker">latest post</p>
            <h2 className="section-title">From the blog</h2>
          </Reveal>
          <Reveal>
            <Link to={`/blog/${latest.slug}`} className="card-link">
              <div className="card">
                <p className="meta">{latest.date}</p>
                <h3>{latest.title}</h3>
                <p>{latest.excerpt}</p>
                <div className="tag-row">
                  {latest.tags.map((t, i) => (
                    <span key={t} className={`tag${i % 2 ? ' blue' : ''}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        </section>
      </div>
    </PageWrap>
  )
}
