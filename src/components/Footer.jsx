import { profile } from '../data/profile.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>© 2026 {profile.name} · built with React</span>
        <span>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          · <a href={`mailto:${profile.email}`}>Email</a>
        </span>
      </div>
    </footer>
  )
}
