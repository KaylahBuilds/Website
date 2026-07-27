# kaylah.dev — Personal Portfolio

React + Vite portfolio: interactive terminal hero, animated particle network,
framer-motion transitions, timeline resume, and a data-driven blog.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Where content lives

All content is data — no digging through markup to edit:

| File | Contains |
|---|---|
| `src/data/profile.js` | Name, email, GitHub link, taglines, hero blurb, stats, focus areas |
| `src/data/resume.js` | Summary, competencies, experience timeline, certifications |
| `src/data/projects.js` | Project cards |
| `src/data/posts.jsx` | Blog posts (JSX bodies) — append an object to publish |
| `src/index.css` | Entire theme — every color is a token in `:root` |
| `src/components/Terminal.jsx` | Terminal commands & easter eggs |

## Deploy (GitHub Pages)

1. Create a repo and push this folder:

   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/kaylahbuilds/portfolio.git
   git push -u origin main
   ```

2. In the repo settings → **Pages** → set Source to **GitHub Actions**.

The included workflow (`.github/workflows/deploy.yml`) builds and deploys on
every push to `main`. The site uses hash-based routing and relative asset
paths, so it works at any Pages URL with zero config. A custom domain can be
added later in the same Pages settings screen.

## Notes

- `public/Kaylah-Gore-Resume.docx` backs the "Download resume" button — drop in
  a new file with the same name to update it.
- Animations respect `prefers-reduced-motion`.
- `npm audit` flags React Router's RSC-mode CSRF advisory; it applies to
  server-rendered action execution, which this static client-side SPA does not
  use.
