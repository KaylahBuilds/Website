import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ParticleField from './components/ParticleField.jsx'
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import Post from './pages/Post.jsx'
import Projects from './pages/Projects.jsx'
import Project from './pages/Project.jsx'
import Resume from './pages/Resume.jsx'
import { initAnalytics, countPageview } from './lib/goatcounter.js'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  // Scroll to top and record the pageview on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    countPageview(location.pathname)
  }, [location.pathname])

  return (
    <>
      <ParticleField />
      <Nav />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Post />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<Project />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
