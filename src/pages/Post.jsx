import { Link, useParams } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import { posts } from '../data/posts.jsx'

export default function Post() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <PageWrap>
        <div className="container">
          <h1 className="page-title">404</h1>
          <p className="page-sub">That post doesn't exist.</p>
          <Link className="back-link" to="/blog">
            ← back to all posts
          </Link>
        </div>
      </PageWrap>
    )
  }

  return (
    <PageWrap>
      <div className="container">
        <article className="article">
          <p className="meta">
            {post.date} · {post.tags.join(' · ')}
          </p>
          <h1 className="page-title gradient-text">{post.title}</h1>
          <div style={{ marginTop: '1.5rem' }}>{post.body}</div>
          <p style={{ marginTop: '2.5rem' }}>
            <Link className="back-link" to="/blog">
              ← back to all posts
            </Link>
          </p>
        </article>
      </div>
    </PageWrap>
  )
}
