// GoatCounter analytics (goatcounter.com) — cookie-free, so no consent
// banner is required. Every export is a no-op until GOATCOUNTER_CODE is
// set to the site code chosen at signup (e.g. 'kaylahbuilds' for
// kaylahbuilds.goatcounter.com).
export const GOATCOUNTER_CODE = ''

const origin = () => `https://${GOATCOUNTER_CODE}.goatcounter.com`

// Pageviews recorded before count.js finishes loading, flushed on load.
const pending = []

// Injects the counting script once, with auto-counting off — the hash
// router would otherwise record every page as "/". App.jsx reports the
// logical route instead.
export function initAnalytics() {
  if (!GOATCOUNTER_CODE || window.goatcounter) return
  window.goatcounter = { no_onload: true }
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `${origin()}/count`
  s.addEventListener('load', () => {
    for (const path of pending.splice(0)) window.goatcounter.count({ path })
  })
  document.head.appendChild(s)
}

export function countPageview(path) {
  if (!GOATCOUNTER_CODE) return
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path })
  } else {
    pending.push(path)
  }
}

// Public per-path counts via the visitor-counter endpoint. Requires
// "Visitor counter" to be enabled in the GoatCounter site settings.
// Returns { '/blog/foo': 123, ... }; unavailable paths come back 0.
export async function fetchViewCounts(paths) {
  if (!GOATCOUNTER_CODE) return {}
  const entries = await Promise.all(
    paths.map(async (path) => {
      try {
        const res = await fetch(`${origin()}/counter/${encodeURI(path)}.json`)
        if (!res.ok) return [path, 0]
        const data = await res.json()
        // Counts arrive as display strings like "5 123".
        return [path, Number(String(data.count).replace(/\D/g, '')) || 0]
      } catch {
        return [path, 0]
      }
    })
  )
  return Object.fromEntries(entries)
}
