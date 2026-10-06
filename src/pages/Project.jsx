import { Link, useParams } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import { ProjectDiagram } from '../components/WorkShowcase.jsx'
import { projects } from '../data/projects.js'
import { posts } from '../data/posts.jsx'
import { workVisuals } from '../data/workVisuals.js'

export default function Project() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) return <PageWrap><section className="content-hero"><div className="container"><p className="content-kicker">Case file not found</p><h1>Missing file.</h1><Link className="back-link" to="/projects">Return to all work →</Link></div></section></PageWrap>

  const visual = workVisuals[slug]
  const writeup = posts.find((item) => item.slug === project.post)

  return (
    <PageWrap>
      <header className="content-hero project-hero">
        <div className="container">
          <p className="content-kicker">Selected work / {visual?.eyebrow || 'Engineering case file'}</p>
          <h1>{project.title}</h1>
        </div>
      </header>
      <nav className="content-subnav" aria-label="Project navigation">
        <Link to="/projects">← All work</Link>
        {project.tags.map((tag) => <span key={tag.label}>{tag.label}</span>)}
      </nav>
      <div className="container reading-shell project-detail-grid">
        <article className="article project-brief">
          <p className="section-label">The brief</p>
          <h2>What this system was built to change.</h2>
          <p>{project.description}</p>
          {writeup && <div className="notice"><strong>The full story is in the field notes.</strong><Link className="back-link" to={`/blog/${writeup.slug}`}>Read “{writeup.title}” →</Link></div>}
          <div className="article-next"><span>More systems</span><Link className="back-link" to="/projects">Explore all work →</Link></div>
        </article>
        <ProjectDiagram slug={slug} />
      </div>
    </PageWrap>
  )
}
