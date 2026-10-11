import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import BlogCard from '../components/BlogCard.jsx'
import { posts } from '../data/posts.jsx'
import './NyuCybersecurityFellow.css'

const focusAreas = [
  {
    title: 'Cloud & platform security',
    description: 'Explore identity, configuration, and policy boundaries—and what it takes to make them hold across real systems.',
    label: 'Identity · Infrastructure · Policy',
  },
  {
    title: 'Secure software delivery',
    description: 'Connect repository controls, pipeline isolation, and remediation to the way engineers actually build and ship.',
    label: 'Code · Pipelines · Supply chain',
  },
  {
    title: 'Research & evidence',
    description: 'Start with a question, test it in an authorized environment, and document what the results do—and do not—prove.',
    label: 'Questions · Experiments · Findings',
  },
]

const relatedSlugs = [
  'ghas-controls-automation-remediation',
  'woodpecker-hardened-ci-pipelines',
  'prowler-kubernetes-multicloud-scanning',
  'kubernetes-opa-eks-aks',
]

export default function NyuCybersecurityFellow() {
  const relatedPosts = relatedSlugs.map((slug) => posts.find((post) => post.slug === slug)).filter(Boolean)

  function jumpTo(id) {
    const section = document.getElementById(id)
    section?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    section?.focus({ preventScroll: true })
  }

  return (
    <PageWrap>
      <header className="content-hero nyu-fellow-hero">
        <div className="container nyu-fellow-intro">
          <div>
            <p className="content-kicker">Learning · Research · Practice</p>
            <h1><span>NYU</span>{' '}<br /><em>Cybersecurity Fellow</em></h1>
            <p className="nyu-fellow-lede">Where platform engineering meets security research.</p>
            <p className="nyu-fellow-description">A personal space for security learning, independently authored labs, and field notes—focused on understanding how systems break and building stronger defenses.</p>
          </div>
          <aside className="nyu-fellow-method" aria-label="My approach">
            <p className="section-label">The working method</p>
            <ol>
              <li><span aria-hidden="true">01</span>Question the assumptions.</li>
              <li><span aria-hidden="true">02</span>Test the controls.</li>
              <li><span aria-hidden="true">03</span>Document the evidence.</li>
            </ol>
            <p>Curiosity in. Clearer decisions out.</p>
          </aside>
        </div>
      </header>

      <nav className="content-subnav" aria-label="NYU Cybersecurity Fellow sections">
        <button type="button" onClick={() => jumpTo('nyu-focus')}>Research focus</button>
        <button type="button" onClick={() => jumpTo('nyu-field-notes')}>Independent labs &amp; notes</button>
        <button type="button" onClick={() => jumpTo('nyu-practice')}>Responsible practice</button>
      </nav>

      <section className="container nyu-fellow-section" id="nyu-focus" tabIndex={-1} aria-labelledby="nyu-focus-title">
        <div className="section-heading">
          <div><p className="kicker">01 / Research focus</p><h2 className="section-title" id="nyu-focus-title">Study the risk.<br /><em>Build the defense.</em></h2></div>
          <p>The questions that connect my security learning with practical platform engineering.</p>
        </div>
        <div className="nyu-focus-grid">
          {focusAreas.map((area, index) => (
            <article className="nyu-focus-card" key={area.title}>
              <span className="nyu-focus-number" aria-hidden="true">0{index + 1}</span>
              <p className="meta">{area.label}</p>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container nyu-fellow-section" id="nyu-field-notes" tabIndex={-1} aria-labelledby="nyu-notes-title">
        <div className="section-heading">
          <div><p className="kicker">02 / Independent labs &amp; notes</p><h2 className="section-title" id="nyu-notes-title">Ideas into<br /><em>practice.</em></h2></div>
          <p>Related work from my portfolio. These are independent projects and articles, not NYU assignments or course materials.</p>
        </div>
        <div className="guide-index-grid">
          {relatedPosts.map((post, index) => <BlogCard key={post.slug} post={post} index={index} headingLevel="h3" />)}
        </div>
        <div className="section-end"><Link className="text-link" to="/blog">Explore all field notes <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="container nyu-fellow-section" id="nyu-practice" tabIndex={-1} aria-labelledby="nyu-practice-title">
        <div className="nyu-practice-panel">
          <div><p className="kicker">03 / Responsible practice</p><h2 id="nyu-practice-title">Learn deliberately.<br /><em>Work responsibly.</em></h2></div>
          <div>
            <p>Use authorized environments, keep credentials and private coursework out of public examples, and make the limits of every experiment clear.</p>
            <p className="nyu-fellow-disclaimer">This is my personal learning portfolio, not an official NYU publication.</p>
            <Link className="text-link" to="/projects">See the wider work <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </PageWrap>
  )
}
