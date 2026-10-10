import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap.jsx'
import Reveal from '../components/Reveal.jsx'
import Terminal from '../components/Terminal.jsx'
import WorkShowcase from '../components/WorkShowcase.jsx'
import BlogCard from '../components/BlogCard.jsx'
import { profile } from '../data/profile.js'
import { posts } from '../data/posts.jsx'

const lenses = [
  { name: 'Reliability', label: '01 / Build for pressure', title: 'Make failure a plan. Not a surprise.', description: 'From cloud infrastructure to observability, reliability starts with knowing what the system is doing and designing for the moments when it stops.', signals: ['Clear telemetry', 'Repeatable infrastructure', 'Smaller blast radius'], accent: 'teal' },
  { name: 'Security', label: '02 / Secure the boundaries', title: 'The safe path should be the easy path.', description: 'Credential discovery, practical access boundaries, and security embedded in the platform. Find the exposure before it becomes the incident.', signals: ['Credential discovery', 'Identity-first access', 'Guardrails by default'], accent: 'magenta' },
  { name: 'Developer experience', label: '03 / Scale the people', title: 'Give teams a system they can trust.', description: 'GitOps, shared standards, and useful automation turn platform complexity into a predictable workflow. Engineers get to ship without reinventing infrastructure.', signals: ['Self-service workflows', 'Git as the source of truth', 'Useful automation'], accent: 'lime' },
]

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })

export default function Home() {
  const [lens, setLens] = useState(0)
  const current = lenses[lens]

  return (
    <PageWrap>
      <section className="hero cinematic-hero">
        <img className="hero-backdrop" src={import.meta.env.BASE_URL + 'images/platform-night-v2.webp'} alt="" fetchPriority="high" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-noise" aria-hidden="true" />
        <div className="hud-corners" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="hero-status"><span>PLATFORM / SECURITY</span><strong>BUILT FOR PRESSURE</strong><small>KAYLAH GORE · ENGINEER</small></div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="kicker"><span className="live-dot" /> Platform engineering · security research</p>
            <h1 className="hero-name">Complex systems.<br /><em>Built to hold.</em></h1>
            <p className="hero-blurb">I build secure, resilient platforms that empower engineers to ship with confidence.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/projects">Explore the work <span>→</span></Link>
              <Link className="btn btn-ghost" to="/blog">Read the field notes</Link>
            </div>
            <div className="hero-trust"><span>Apple · AWS · Google</span><span>Cloud + platform security</span><span>Research in progress</span></div>
          </div>
          <button className="hero-scroll" onClick={() => scrollTo('selected-work')}>Meet the systems <span>↓</span></button>
        </div>
      </section>

      <div className="signal-strip" aria-label="Areas of expertise"><div className="signal-track">{[0, 1].map((copy) => <div key={copy} aria-hidden={copy === 1}>{['Kubernetes', 'GitOps', 'DevSecOps', 'Security research', 'Platform reliability'].map((word) => <span key={word}>{word}<b>✦</b></span>)}</div>)}</div></div>

      <section className="container work-home-section" id="selected-work">
        <div className="section-heading"><div><p className="kicker">Selected work / Systems with a purpose</p><h2 className="section-title">Built for the real world.<br /><em>Not the demo.</em></h2></div><p>Different challenges. One through line: resilient platforms, clearer signals, and security that works in practice.</p></div>
        <WorkShowcase limit={3} />
        <div className="section-end"><Link className="btn btn-ghost" to="/projects">Explore all six systems <span>→</span></Link><span className="meta">Architecture · implementation · lessons learned</span></div>
      </section>

      <section className="systems-section">
        <div className="container">
          <div className="section-heading"><div><p className="kicker">One operating model</p><h2 className="section-title">Nothing scales<br /><em>in isolation.</em></h2></div><p>Reliability, security, and developer experience are connected. The weakest boundary still decides what breaks.</p></div>
          <div className="systems-map" aria-label="Connected platform operating model">
            <div className="system-node security"><small>01 / Protect</small><strong>Security</strong><p>Guardrails by default.<br />Boundaries that matter.</p></div>
            <div className="system-line" aria-hidden="true"><span>→</span></div>
            <div className="system-core"><small>THE SHARED FOUNDATION</small><strong>ONE<br /><em>PLATFORM.</em></strong><p>Clear standards.<br />Connected signals.</p></div>
            <div className="system-line" aria-hidden="true"><span>←</span></div>
            <div className="system-node reliability"><small>02 / Sustain</small><strong>Reliability</strong><p>Design for pressure.<br />Make failure visible.</p></div>
            <div className="system-node research"><small>03 / Investigate</small><strong>Research</strong><p>Learn how it breaks.<br />Build better defenses.</p></div>
            <div className="system-node experience"><small>04 / Enable</small><strong>Developer XP</strong><p>Safe paths feel fast.<br />Teams can ship.</p></div>
          </div>
          <p className="diagram-note">One operating model / Four connected disciplines</p>
        </div>
      </section>

      <section className="container intel-section">
        <div className="section-heading"><div><p className="kicker">Inside the architecture</p><h2 className="section-title">Change the lens.<br /><em>See the system.</em></h2></div><p>There is more than one way to read an engineering problem. Explore the principles behind the work.</p></div>
        <div className="intel-tabs" role="tablist" aria-label="Engineering focus">{lenses.map((item, index) => <button key={item.name} role="tab" id={'lens-tab-' + index} aria-selected={lens === index} aria-controls="lens-panel" tabIndex={lens === index ? 0 : -1} className={lens === index ? 'active' : ''} onClick={() => setLens(index)} onKeyDown={(event) => {
          if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? lenses.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + lenses.length) % lenses.length
            setLens(next)
            document.getElementById('lens-tab-' + next)?.focus()
          }
        }}>{item.name}<span>0{index + 1}</span></button>)}</div>
        <div className="intel-panel" id="lens-panel" role="tabpanel" aria-labelledby={'lens-tab-' + lens} data-accent={current.accent}>
          <div className="intel-visual" aria-hidden="true"><div className="intel-orbit orbit-one" /><div className="intel-orbit orbit-two" /><div className="intel-crosshair" /><span className="intel-center">{current.name === 'Developer experience' ? 'BUILD' : current.name === 'Security' ? 'SECURE' : 'SUSTAIN'}</span><span className="intel-marker marker-a">BOUNDARIES</span><span className="intel-marker marker-b">FEEDBACK</span><span className="intel-marker marker-c">CONFIDENCE</span><small>CONCEPTUAL SYSTEM VIEW / 0{lens + 1}</small></div>
          <div className="intel-copy"><p className="kicker">{current.label}</p><h3>{current.title}</h3><p>{current.description}</p><ul>{current.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul></div>
        </div>
      </section>

      <section className="career-section"><div className="container">
        <div className="section-heading"><div><p className="kicker">The operating principles</p><h2 className="section-title">Build the platform.<br /><em>Raise the standard.</em></h2></div><Link className="text-link" to="/resume">The full career record <span>↗</span></Link></div>
        <div className="career-track">{profile.focus.map((focus, i) => { const [head, ...rest] = focus.split(' — '); return <Reveal key={head} delay={i * 0.04}><div className="focus-card"><span className="focus-index">0{i + 1}</span><h3>{head}</h3><p>{rest.join(' — ')}</p></div></Reveal> })}</div>
        <div className="stats">{profile.stats.map((stat, index) => <div className="stat" key={stat.value}><small>PROOF / 0{index + 1}</small><strong>{stat.value}</strong><p>{stat.label}</p></div>)}</div>
      </div></section>

      <section className="container lab-section"><div className="lab-copy"><p className="kicker">A different way in</p><h2 className="section-title">Go beyond<br /><em>the interface.</em></h2><p>A small interactive terminal for exploring the site. Try <code>whoami</code>, <code>projects</code>, or <code>help</code>.</p><small className="meta">Portfolio playground / No actual shell access</small></div><Terminal /></section>

      <section className="container notes-preview">
        <div className="section-heading">
          <div><p className="kicker">Research &amp; practice</p><h2 className="section-title">Behind the build.<br /><em>Decisions. Tradeoffs. Lessons.</em></h2></div>
          <Link className="text-link" to="/blog">All blogs <span>↗</span></Link>
        </div>
        <div className="notes-preview-grid">
          {posts.slice(0, 4).map((post, index) => <BlogCard key={post.slug} post={post} index={index} headingLevel="h3" />)}
        </div>
      </section>

      <section className="conversion-band"><div className="container"><p className="kicker">Let’s build something that holds</p><h2>Bring me the system<br /><em>that keeps you up.</em></h2><div className="conversion-bottom"><p>Platform strategy, security architecture, research collaboration, or one unusually stubborn infrastructure problem.</p><a className="btn btn-dark" href={'mailto:' + profile.email}>Start a conversation <span>↗</span></a></div><span className="conversion-watermark" aria-hidden="true">BUILD.</span></div></section>
    </PageWrap>
  )
}
