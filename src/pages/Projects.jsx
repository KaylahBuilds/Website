import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import { projects } from '../data/projects.js'

export default function Projects() {
  return (
    <PageWrap>
      <div className="container">
        <p className="kicker">ls ./projects</p>
        <h1 className="page-title gradient-text">Projects</h1>
        <p className="page-sub">Selected platform &amp; security engineering work.</p>

        <div className="card-grid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08}>
              <Link to={`/projects/${p.slug}`} className="card-link">
                <div className="card">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="tag-row">
                    {p.tags.map((t) => (
                      <span key={t.label} className={`tag${t.color ? ` ${t.color}` : ''}`}>
                        {t.label}
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
