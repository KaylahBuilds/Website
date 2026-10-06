# Kaylah Builds — Personal Portfolio

React + Vite portfolio: cinematic platform-engineering showcases, dark editorial
blog cards, guide-style articles, an interactive terminal, and a timeline resume.

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

The repository is [KaylahBuilds/Website](https://github.com/KaylahBuilds/Website).
In repository Settings → Pages, set Source to **GitHub Actions**. The included
workflow (`.github/workflows/deploy.yml`) builds and deploys every push to `main`.
Publishing a commit publishes all changes in that commit, not just the domain.

Hash-based routing and relative asset paths support both the original GitHub
Pages URL and the custom domain without a Vite base-path change.

### Custom domain: kaylahbuilds.io

Site files are prepared for `https://kaylahbuilds.io/`; live configuration still
requires the account settings below. `public/CNAME` is copied into the build, but
GitHub Actions deployments do **not** use it to set the Pages custom domain.

1. In your **GitHub account** Settings → Pages, add and verify `kaylahbuilds.io`.
   GitHub supplies a unique TXT record; add its exact host and value in Spaceship
   Advanced DNS, then complete verification in GitHub. Keep that TXT record.
2. In **KaylahBuilds/Website** Settings → Pages → Custom domain, enter
   `kaylahbuilds.io` and save it **before** pointing website DNS at GitHub.
3. In Spaceship → Advanced DNS → `kaylahbuilds.io`, add these website records
   if Spaceship is the domain's active DNS provider:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | kaylahbuilds.github.io |

   Use the provider's default TTL. Check existing records for conflicts at `@`
   and `www` before replacing website/parking records. Preserve email records
   (MX, SPF, DKIM, DMARC), verification TXT records, and unrelated subdomains.
   Do not use URL forwarding or wildcard DNS. If custom nameservers are active,
   make these changes at that DNS provider instead of changing nameservers.
4. Publish the approved site changes to `main`, confirm the deployment succeeds,
   and let DNS and certificate provisioning finish. In repository Pages settings,
   enable **Enforce HTTPS** when available. Check both `https://kaylahbuilds.io/`
   and `https://www.kaylahbuilds.io/`; `www` should redirect to the primary domain.

DNS changes and HTTPS availability can take up to 24 hours. The browser routes
remain `/#/blog`, `/#/projects`, and `/#/resume`; a custom domain alone does not
remove hash routing.

References: [GitHub custom-domain setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site),
[GitHub domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages),
[Spaceship DNS management](https://www.spaceship.com/domain-management/).

## Notes

- `public/Kaylah-Gore-Resume.docx` backs the "Download resume" button — drop in
  a new file with the same name to update it.
- Animations respect `prefers-reduced-motion`.
- `npm audit` flags React Router's RSC-mode CSRF advisory; it applies to
  server-rendered action execution, which this static client-side SPA does not
  use.
