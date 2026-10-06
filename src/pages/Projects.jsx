import PageWrap from '../components/PageWrap.jsx'
import WorkShowcase from '../components/WorkShowcase.jsx'
import { projects } from '../data/projects.js'

export default function Projects() {
  return (
    <PageWrap>
      <header className="work-page-hero">
        <div className="container">
          <p className="kicker"><span className="work-page-count">{String(projects.length).padStart(2, '0')} CASE FILES</span> / Selected engineering work</p>
          <h1 className="work-page-title">Built for<br /><em>the real world.</em></h1>
          <div className="work-page-intro">
            <p>Platforms with guardrails. Signals you can trust. Infrastructure you can explain. A closer look at the systems behind the work.</p>
            <button className="work-page-index" type="button" onClick={() => document.getElementById('case-files')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Open the case files <span aria-hidden="true">↓</span></button>
          </div>
        </div>
      </header>
      <section className="container work-page-files" id="case-files" aria-label="Selected project case files">
        <WorkShowcase />
      </section>
    </PageWrap>
  )
}
