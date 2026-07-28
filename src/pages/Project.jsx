import { Link, useParams } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import { projects } from '../data/projects.js'
import { posts } from '../data/posts.jsx'

export default function Project() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <PageWrap>
        <div className="container">
          <h1 className="page-title">404</h1>
          <p className="page-sub">That project doesn't exist.</p>
          <Link className="back-link" to="/projects">
            ← back to all projects
          </Link>
        </div>
      </PageWrap>
    )
  }

  const writeup = posts.find((p) => p.slug === project.post)

  return (
    <PageWrap>
      <div className="container">
        <article className="article">
          <p className="meta">{project.tags.map((t) => t.label).join(' · ')}</p>
          <h1 className="page-title gradient-text">{project.title}</h1>
          <p style={{ marginTop: '1.5rem' }}>{project.description}</p>

          {writeup && (
            <p style={{ marginTop: '2rem' }}>
              <Link className="back-link" to={`/blog/${writeup.slug}`}>
                Read the write-up: {writeup.title} →
              </Link>
            </p>
          )}

          <p style={{ marginTop: '2.5rem' }}>
            <Link className="back-link" to="/projects">
              ← back to all projects
            </Link>
          </p>
        </article>
      </div>
    </PageWrap>
  )
}
