import { useState } from 'react'
import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import BlogCard from '../components/BlogCard.jsx'
import { posts } from '../data/posts.jsx'

const categories = ['All', 'Platform', 'Security', 'Engineering']

function categoryFor(post) {
  const tags = post.tags.map((tag) => tag.toLowerCase())
  if (tags.some((tag) => ['security', 'devsecops', 'research'].includes(tag))) return 'Security'
  if (tags.some((tag) => ['kubernetes', 'gitops', 'terraform', 'observability', 'infrastructure'].includes(tag))) return 'Platform'
  return 'Engineering'
}

export default function Blog() {
  const [category, setCategory] = useState('All')
  const visiblePosts = posts.filter((post) => category === 'All' || categoryFor(post) === category)

  return (
    <PageWrap>
      <header className="content-hero guide-index-hero">
        <div className="container">
          <p className="content-kicker">The field notes / Research &amp; practice</p>
          <h1 className="guide-index-title">Behind the build.<br /><em>Decisions. Tradeoffs. Lessons.</em></h1>
          <p>Field notes on platform engineering, security research, and developer experience—the decisions, tradeoffs, and lessons behind the work.</p>
        </div>
      </header>

      <nav className="content-subnav guide-filter-bar" aria-label="Filter field notes">
        <div className="guide-filter-options">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`guide-filter-button${category === item ? ' is-active' : ''}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="guide-filter-count" role="status" aria-live="polite">
          {String(visiblePosts.length).padStart(2, '0')} field notes
        </p>
      </nav>

      <section className="container guide-index-section" aria-label="Published field notes">
        <div className="guide-index-grid">
          {visiblePosts.map((post, i) => {
            return (
              <Reveal key={post.slug} delay={(i % 2) * 0.06} className="guide-card-reveal">
                <BlogCard post={post} index={posts.indexOf(post)} />
              </Reveal>
            )
          })}
        </div>
      </section>
    </PageWrap>
  )
}
