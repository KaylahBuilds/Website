import { useEffect, useState } from 'react'

// Cycles through phrases with a type/erase animation.
// Returns the first phrase statically under prefers-reduced-motion.
export function useTypewriter(phrases, { typeMs = 55, eraseMs = 26, holdMs = 2200 } = {}) {
  const [text, setText] = useState('')
  const [reduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduced) {
      setText(phrases[0])
      return
    }
    let phrase = 0
    let chars = 0
    let erasing = false
    let timer

    const tick = () => {
      const current = phrases[phrase]
      if (!erasing) {
        chars++
        setText(current.slice(0, chars))
        if (chars === current.length) {
          erasing = true
          timer = setTimeout(tick, holdMs)
          return
        }
        timer = setTimeout(tick, typeMs + Math.random() * 40)
      } else {
        chars--
        setText(current.slice(0, chars))
        if (chars === 0) {
          erasing = false
          phrase = (phrase + 1) % phrases.length
        }
        timer = setTimeout(tick, eraseMs)
      }
    }
    timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [phrases, reduced, typeMs, eraseMs, holdMs])

  return { text, reduced }
}
