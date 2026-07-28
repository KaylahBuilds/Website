// Each project gets its own URL at /projects/<slug>. `post` points at the
// slug of the write-up in posts.jsx that covers the same work.
export const projects = [
  {
    slug: 'credential-scanner',
    post: 'credential-scanner',
    title: 'The credential scanner nobody knew they needed',
    description:
      'Built a Python service that scans S3 continuously across 5 AWS accounts looking for exposed credentials. It found 100+ in the first month — secrets that were sitting there, waiting to become breach headlines. Now it runs silently in the background as an operational guardrail. The insight: security isn\'t about catching incidents, it\'s about preventing the incidents nobody saw coming.',
    tags: [
      { label: 'python' },
      { label: 'aws', color: 'blue' },
      { label: 'devsecops', color: 'violet' },
    ],
  },
  {
    slug: 'gitops-at-scale',
    post: 'gitops-at-scale',
    title: 'Shipping 50 teams from chaos to confidence',
    description:
      'Started with one team\'s GitOps setup. Scaled it to organization-wide through ArgoCD with tenant isolation so tight you can\'t accidentally touch another team\'s infrastructure. RBAC, OIDC federation, secrets in vaults. The payoff: engineers ship fearlessly because the platform makes bad deployments impossible before they happen.',
    tags: [
      { label: 'kubernetes' },
      { label: 'argocd', color: 'blue' },
      { label: 'governance', color: 'violet' },
    ],
  },
  {
    slug: 'observability-platform',
    post: 'observability-as-insurance',
    title: 'Making every 3am page preventable',
    description:
      'Built an Elasticsearch observability platform that became the org\'s source of truth for what\'s happening in production. Not just logs — structured intelligence. The goal was to eliminate the "wait, what just broke?" moment in incident response. When everything is visible, problems resolve in minutes instead of hours.',
    tags: [
      { label: 'elasticsearch' },
      { label: 'gke', color: 'blue' },
      { label: 'observability', color: 'violet' },
    ],
  },
  {
    slug: 'infrastructure-as-code',
    post: 'infrastructure-as-code-war-story',
    title: 'Turning infrastructure chaos into code',
    description:
      'AWS infrastructure was drifting — teams making manual changes, nobody knowing the true state. Built a Terraform strategy that made the infrastructure declarative and auditable. No more "but I remember someone changed this once" — everything is version-controlled, reviewed, and repeatable. Also optimized a Mac fleet so expensive you\'d want to optimize it.',
    tags: [
      { label: 'terraform' },
      { label: 'aws', color: 'blue' },
      { label: 'platform', color: 'violet' },
    ],
  },
  {
    slug: 'agentic-workflows',
    post: 'agents-and-developer-experience',
    title: 'Agents as developer multipliers',
    description:
      'Explored multi-agent LLM systems (Google ADK + Gemini) as a way to automate developer workflows at scale. The experiment: can AI handle the boring, structured parts so humans focus on the hard problems? Early results are promising. This is where platform engineering meets AI — making both teams faster.',
    tags: [
      { label: 'ai' },
      { label: 'llm', color: 'blue' },
      { label: 'tooling', color: 'violet' },
    ],
  },
  {
    slug: 'security-research',
    post: 'from-defense-to-offense',
    title: 'From defense to offense',
    description:
      'Moving into security research — learning how systems break so I can defend better. Reverse engineering, detection engineering, CTF write-ups. If you build platforms, you need to think like an attacker. Coming soon: actual write-ups of what I find.',
    tags: [
      { label: 'research' },
      { label: 'in progress', color: 'blue' },
    ],
  },
]
