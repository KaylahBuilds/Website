import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import { posts } from '../data/posts.jsx'

export default function Blog() {
  return (
    <PageWrap>
      <div className="container">
        <p className="kicker">ls ./blog</p>
        <h1 className="page-title gradient-text">Blog</h1>
        <p className="page-sub">Research notes, write-ups, and lessons from the field.</p>

        <div className="post-list">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link to={`/blog/${post.slug}`} className="card-link">
                <div className="card">
                  <p className="meta">{post.date}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="tag-row">
                    {post.tags.map((t, j) => (
                      <span key={t} className={`tag${j % 2 ? ' blue' : ''}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </PageWrap>
  )
}
