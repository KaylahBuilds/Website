import { Link } from 'react-router-dom'
import { profile } from '../data/profile.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div><Link to="/"><strong>Kaylah Builds.</strong></Link><small>Platform engineering · security research</small></div>
        <nav aria-label="Footer navigation">
          <Link to="/projects">Work</Link>
          <Link to="/blog">Field notes</Link>
          <Link to="/resume">Resume</Link>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={profile.twitch} target="_blank" rel="noreferrer">Twitch ↗</a>
          <a href={`mailto:${profile.email}`}>Email ↗</a>
        </nav>
        <p className="footer-bottom">© {new Date().getFullYear()} {profile.name} / Built with purpose.</p>
      </div>
    </footer>
  )
}
