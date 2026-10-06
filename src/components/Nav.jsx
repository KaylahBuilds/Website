import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { profile } from '../data/profile.js'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Work' },
  { to: '/blog', label: 'Field Notes' },
  { to: '/resume', label: 'Resume' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav">
      <div className="container">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)} aria-label="Kaylah Builds home">KAYLAH<span>BUILDS.</span></Link>
        <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '×' : '+'}</span></button>
        <nav className={`nav-links${open ? ' is-open' : ''}`} id="primary-navigation" aria-label="Main navigation">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <a className="nav-contact" href={`mailto:${profile.email}`}>Let’s talk <span>↗</span></a>
        </nav>
      </div>
    </header>
  )
}
