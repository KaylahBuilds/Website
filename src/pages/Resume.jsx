import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import { profile } from '../data/profile.js'
import { summary, competencies, experience, certifications } from '../data/resume.js'

export default function Resume() {
  return (
    <PageWrap>
      <header className="content-hero resume-hero">
        <div className="container">
        <p className="content-kicker">Career record · Platform + security</p>
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
        <div className="btn-row">
          <a className="btn btn-primary" href="./Kaylah-Gore-Resume.docx" download>
            Download resume
          </a>
          <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
        </div>
        </div>
      </header>
      <nav className="content-subnav" aria-label="Resume sections">
        {['Summary', 'Competencies', 'Experience', 'Certifications'].map((label) => <button type="button" key={label} onClick={() => document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{label}</button>)}
      </nav>

      <div className="reading-shell resume-shell">

        <Reveal id="summary" className="resume-section">
          <span className="section-label">01 · Profile</span>
          <h2 className="section-title">Summary</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '72ch' }}>{summary}</p>
        </Reveal>

        <section className="resume-section" id="competencies">
          <Reveal>
            <span className="section-label">02 · Capabilities</span>
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

        <section className="resume-section" id="experience">
          <Reveal>
            <span className="section-label">03 · Track record</span>
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

        <section className="resume-section" id="certifications">
          <Reveal>
            <span className="section-label">04 · Credentials</span>
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
