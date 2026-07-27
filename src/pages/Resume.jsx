import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import { profile } from '../data/profile.js'
import { summary, competencies, experience, certifications } from '../data/resume.js'

export default function Resume() {
  return (
    <PageWrap>
      <div className="container">
        <p className="kicker">cat resume.txt</p>
        <h1 className="page-title gradient-text">{profile.name}</h1>
        <p className="page-sub">{profile.title}</p>

        <div className="btn-row" style={{ marginBottom: '2.5rem' }}>
          <a className="btn btn-primary" href="./Kaylah-Gore-Resume.docx" download>
            Download resume
          </a>
          <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
        </div>

        <Reveal>
          <h2 className="section-title">Summary</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '72ch' }}>{summary}</p>
        </Reveal>

        <section className="section">
          <Reveal>
            <h2 className="section-title">Core competencies</h2>
            <div className="chip-grid">
              {competencies.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section">
          <Reveal>
            <h2 className="section-title">Experience</h2>
          </Reveal>
          <div className="timeline">
            {experience.map((job, i) => (
              <Reveal key={`${job.where}-${job.role}`} delay={i * 0.04}>
                <div className="tl-entry">
                  <div className="tl-role">{job.role}</div>
                  <div className="tl-where">
                    {job.where} · {job.when}
                  </div>
                  <ul>
                    {job.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section">
          <Reveal>
            <h2 className="section-title">Certifications</h2>
            <div className="chip-grid">
              {certifications.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      </div>
    </PageWrap>
  )
}
