import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from './Reveal.jsx'

export default function Carousel({ items }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [items.length])

  const item = items[current]
  const isProject = item.slug && item.tags // Projects have tags

  return (
    <section className="section carousel-section">
      <Reveal>
        <p className="kicker">featured</p>
        <h2 className="section-title">Articles & Projects</h2>
      </Reveal>

      <div className="carousel-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="carousel-item"
          >
            <Link
              to={isProject ? `/projects/${item.slug}` : `/blog/${item.slug}`}
              className="card-link"
            >
              <div className="card carousel-card">
                <p className="meta">{item.date || 'Project'}</p>
                <h3>{item.title}</h3>
                <p>{isProject ? item.description : item.excerpt}</p>
                <div className="tag-row">
                  {(item.tags || []).map((t) => {
                    const label = typeof t === 'string' ? t : t.label
                    const color = typeof t === 'string' ? '' : t.color
                    return (
                      <span
                        key={label}
                        className={`tag${color ? ` ${color}` : ''}`}
                      >
                        {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="carousel-nav">
          {items.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${current === i ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        <div className="carousel-counter">
          {current + 1} / {items.length}
        </div>
      </div>
    </section>
  )
}
