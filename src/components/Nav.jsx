import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'home', end: true },
  { to: '/blog', label: 'blog' },
  { to: '/projects', label: 'projects' },
  { to: '/resume', label: 'resume' },
]

export default function Nav() {
  return (
    <header className="nav">
      <div className="container">
        <Link to="/" className="nav-logo">
          <span className="path">~/</span>kaylah
        </Link>
        <nav className="nav-links">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
