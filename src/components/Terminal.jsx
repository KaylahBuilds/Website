import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profile } from '../data/profile.js'

const PROMPT = 'kaylah@platform ~ %'

const BOOT_LINES = [
  { cls: 't-out', text: 'Booting kaylah.dev terminal…' },
  { cls: 't-out', text: 'Loading: resilience ✓  security ✓  coffee ✓' },
  { cls: 't-accent', text: 'Welcome. This terminal is real — try typing something.' },
  { cls: 't-out', text: "Type 'help' or 'whoami' to get started." },
]

export default function Terminal() {
  const navigate = useNavigate()
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [booted, setBooted] = useState(false)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  // Boot sequence: reveal lines one by one
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      const line = BOOT_LINES[i]
      setLines((prev) => [...prev, line])
      i++
      if (i >= BOOT_LINES.length) {
        clearInterval(timer)
        setBooted(true)
      }
    }, 350)
    return () => clearInterval(timer)
  }, [])

  // Keep scrolled to bottom
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const print = (out) => setLines((prev) => [...prev, ...out])

  const run = (raw) => {
    const cmd = raw.trim()
    const echo = { cls: 'echo', text: cmd }

    if (!cmd) return
    const [name, ...args] = cmd.toLowerCase().split(/\s+/)

    const outputs = {
      help: [
        { cls: 't-out', text: 'Commands:' },
        { cls: 't-out', text: '  whoami      who is building this' },
        { cls: 't-out', text: '  blog        read the blog' },
        { cls: 't-out', text: '  projects    see what i\'ve built' },
        { cls: 't-out', text: '  resume      download the resume' },
        { cls: 't-out', text: '  contact     get in touch' },
        { cls: 't-out', text: '  ls          list sections' },
        { cls: 't-out', text: '  clear       clear screen' },
      ],
      whoami: [
        { cls: 't-accent', text: profile.name },
        { cls: 't-out', text: profile.title },
        { cls: 't-out', text: 'Building platforms that don\'t break. Learning how to break them better.' },
      ],
      ls: [
        { cls: 't-blue', text: 'blog/  projects/  resume/  research/' },
      ],
      certs: [
        { cls: 't-out', text: '✓ CNCF Certified GitOps Associate' },
        { cls: 't-out', text: '✓ Kubernetes & Cloud Native Associate' },
        { cls: 't-out', text: '✓ GCP Professional Cloud Architect' },
        { cls: 't-out', text: '✓ AWS Certified Solutions Architect' },
      ],
      contact: [
        { cls: 't-out', text: `email: ${profile.email}` },
        { cls: 't-out', text: `github: ${profile.github.replace('https://', '')}` },
        { cls: 't-out', text: `twitch: ${profile.twitch.replace('https://', '')}` },
      ],
      sudo: [
        { cls: 't-red', text: 'sudo: kaylah is not in the sudoers file. This incident will be reported.' },
        { cls: 't-out', text: '' },
        { cls: 't-amber', text: '(but seriously, read the blog instead)' },
      ],
       'make coffee': [
        { cls: 't-out', text: 'brewing dark roast…' },
        { cls: 't-amber', text: '(actual coffee takes 3 minutes, not 0.2s, but I appreciate the vibe)' },
      ],
      nmap: [
        { cls: 't-out', text: 'Starting Nmap scan against localhost…' },
        { cls: 't-out', text: 'All ports: filtered' },
        { cls: 't-out', text: '' },
        { cls: 't-blue', text: 'Defense in depth. It\'s kind of my whole thing.' },
      ],
      exit: [
        { cls: 't-out', text: 'There\'s no escape. Try "blog" instead.' },
      ],
      pwd: [
        { cls: 't-out', text: '~/building-better-platforms' },
      ],
      tree: [
        { cls: 't-out', text: '├── defsec (the basics)' },
        { cls: 't-out', text: '├── offensec (the new frontier)' },
        { cls: 't-out', text: '├── platforms (where it all connects)' },
        { cls: 't-out', text: '└── thoughts (documented here)' },
      ],
    }

    if (name === 'clear') {
      setLines([])
      return
    }
    if (name === 'resume' || (name === 'cat' && args[0] === 'resume')) {
      print([echo, { cls: 't-accent', text: 'Opening /resume …' }])
      setTimeout(() => navigate('/resume'), 450)
      return
    }
    if (name === 'projects' || (name === 'cd' && args[0]?.includes('project'))) {
      print([echo, { cls: 't-accent', text: 'Opening /projects …' }])
      setTimeout(() => navigate('/projects'), 450)
      return
    }
    if (name === 'blog' || (name === 'cd' && args[0]?.includes('blog'))) {
      print([echo, { cls: 't-accent', text: 'Opening /blog …' }])
      setTimeout(() => navigate('/blog'), 450)
      return
    }

    const out = outputs[name] || [
      { cls: 't-red', text: `command not found: ${name}` },
      { cls: 't-out', text: "Type 'help' for available commands." },
    ]
    print([echo, ...out])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input)
      if (input.trim()) setCmdHistory((prev) => [input, ...prev])
      setHistIdx(-1)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      if (cmdHistory[next]) {
        setHistIdx(next)
        setInput(cmdHistory[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      setHistIdx(next)
      setInput(next >= 0 ? cmdHistory[next] : '')
    }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-bar">
        <span className="terminal-dot r" />
        <span className="terminal-dot y" />
        <span className="terminal-dot g" />
        <span className="terminal-title">kaylah@platform — zsh</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {lines.filter(Boolean).map((line, i) =>
          line.cls === 'echo' ? (
            <div className="t-line" key={i}>
              <span className="t-prompt">{PROMPT}</span>{' '}
              <span className="t-cmd">{line.text}</span>
            </div>
          ) : (
            <div className={`t-line ${line.cls}`} key={i}>
              {line.text}
            </div>
          ),
        )}
        {booted && (
          <div className="t-input-row">
            <span className="t-prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              className="t-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
            />
          </div>
        )}
      </div>
      <div className="terminal-hint">
        try <span className="t-accent">whoami</span> • <span className="t-accent">blog</span> •{' '}
        <span className="t-accent">make coffee</span> • or just scroll down
      </div>
    </div>
  )
}
