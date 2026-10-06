import { useEffect, useRef, useState } from 'react'

function headingSlug(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
}

export default function ArticleContents({ contentKey, articleKey, selector = '.article-body' }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const headingElements = useRef(new Map())

  useEffect(() => {
    const body = document.querySelector(selector)
    if (!body) {
      headingElements.current.clear()
      setHeadings([])
      setActiveId('')
      return
    }

    let intersectionObserver
    let animationFrame
    let elements = []
    const headingBases = new WeakMap()

    function updateActiveHeading() {
      const first = elements[0]
      if (!first) return
      const offset = Math.max(120, parseFloat(window.getComputedStyle(first).scrollMarginTop) || 0) + 24
      let current = first

      for (const element of elements) {
        if (element.getBoundingClientRect().top > offset) break
        current = element
      }

      setActiveId(current.id)
    }

    function scheduleActiveUpdate() {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = undefined
        updateActiveHeading()
      })
    }

    function readHeadings() {
      intersectionObserver?.disconnect()
      elements = [...body.querySelectorAll('h2, h3')].filter((element) => element.textContent.trim())
      const headingSet = new Set(elements)
      const usedIds = new Set([...document.querySelectorAll('[id]')]
        .filter((element) => !headingSet.has(element))
        .map((element) => element.id))
      headingElements.current = new Map()

      const contents = elements.map((element) => {
        const label = element.textContent.trim()
        const previous = headingBases.get(element)
        const baseId = previous?.label === label
          ? previous.id
          : !previous && element.id ? element.id : `section-${headingSlug(label)}`
        headingBases.set(element, { label, id: baseId })
        let id = baseId
        let suffix = 2
        while (usedIds.has(id)) id = `${baseId}-${suffix++}`
        usedIds.add(id)
        element.id = id
        if (!element.hasAttribute('tabindex')) element.tabIndex = -1
        headingElements.current.set(id, element)
        return { id, label, level: element.tagName === 'H3' ? 3 : 2 }
      })

      setHeadings(contents)
      if (!contents.length) setActiveId('')
      scheduleActiveUpdate()

      if (!('IntersectionObserver' in window)) return
      intersectionObserver = new IntersectionObserver(scheduleActiveUpdate, { rootMargin: '-15% 0px -60% 0px', threshold: 0 })
      elements.forEach((element) => intersectionObserver.observe(element))
    }

    readHeadings()
    const mutationObserver = new MutationObserver(readHeadings)
    mutationObserver.observe(body, { childList: true, subtree: true, characterData: true })
    window.addEventListener('scroll', scheduleActiveUpdate, { passive: true })
    window.addEventListener('resize', scheduleActiveUpdate)

    return () => {
      mutationObserver.disconnect()
      intersectionObserver?.disconnect()
      window.removeEventListener('scroll', scheduleActiveUpdate)
      window.removeEventListener('resize', scheduleActiveUpdate)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      headingElements.current.clear()
    }
  }, [contentKey, articleKey, selector])

  function scrollToHeading(id) {
    const element = headingElements.current.get(id)
    if (!element) return
    setActiveId(id)
    element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    element.focus({ preventScroll: true })
  }

  if (!headings.length) return null

  return (
    <nav className="article-contents" aria-label="On this page">
      <p className="article-contents-label">On this page</p>
      <ol className="article-contents-list">
        {headings.map((heading, index) => (
          <li key={heading.id} className={heading.level === 3 ? 'is-subheading' : undefined}>
            <button
              type="button"
              className={`article-contents-button${activeId === heading.id ? ' is-active' : ''}`}
              aria-current={activeId === heading.id ? 'location' : undefined}
              onClick={() => scrollToHeading(heading.id)}
            >
              <span className="article-contents-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span>{heading.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
