import { Link, useParams } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import ArticleContents from '../components/ArticleContents.jsx'
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
      <header className="content-hero">
        <div className="container">
          <p className="content-kicker">Field note · {post.date}</p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </header>
      <nav className="content-subnav" aria-label="Article navigation">
        <Link to="/blog">← All field notes</Link>
        {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </nav>
      <div className="reading-shell article-layout">
        <ArticleContents contentKey={slug} />
        <article className="article reading-article">
          <p className="section-label">
            {post.date} · {post.tags.join(' · ')}
          </p>
          <div className="article-body">{post.body}</div>
          <div className="article-next">
            <span>Continue exploring</span>
            <Link className="back-link" to="/blog">
              Browse all field notes →
            </Link>
          </div>
        </article>
      </div>
    </PageWrap>
  )
}
