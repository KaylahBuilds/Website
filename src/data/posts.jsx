// Blog posts. To add one: append an object here with a unique `slug`.
// `body` is JSX so posts can use any markup the article styles support.
export const posts = [
  {
    slug: 'credential-scanner',
    title: 'How I found 100+ exposed secrets (and why your org probably has them too)',
    date: '2026-07-28',
    tags: ['devsecops', 'aws', 'security'],
    excerpt:
      'Built a scanner to look for exposed credentials in S3. Found 100+ in the first month. Here\'s what they were, why they existed, and what it taught me about security at scale.',
    body: (
      <>
        <p>
          The S3 secrets scanner started as a side project. I wanted to know: if someone actually looked for exposed credentials across our AWS accounts, what would they find? The answer terrified me. 100+ live credentials. Database passwords. API keys. SSH private keys. All sitting in S3, waiting to become a breach headline.
        </p>

        <p>
          What made it worse: some had been there for months. They weren't hidden. They were just sitting in buckets that "nobody uses anymore" or "is only for internal tools." The infrastructure was supposed to be secure. But security without visibility is just faith.
        </p>

        <h2>The problem nobody wants to admit</h2>
        <p>
          Most organizations have a secrets problem they haven't discovered yet. Not because they're negligent — because they haven't looked. Security audits catch what they know to look for. But if nobody's ever written a scanner to sweep S3 for exposed credentials, nobody knows the real state of affairs.
        </p>

        <p>
          Developers upload test credentials, commit them in JSON configs, dump them in logs that get backed up to S3. In the moment, each individual decision makes sense. The sum total is a minefield.
        </p>

        <h2>Building the scanner</h2>
        <p>
          The scanner is Python + boto3 + a set of 28 detection patterns. Database connection strings, AWS API keys (both live and rotated), SSH private keys, GitHub tokens, the works. It runs continuously across five AWS accounts, looking through
everything in S3.
        </p>

        <p>
          The detection patterns matter. A random base64-encoded string isn't a secret — but one prefixed with `AKIA` (AWS access key ID marker) followed by 16 specific characters? That's a secret. Same with GitHub tokens that start with `ghp_`, or database URIs with identifiable schemas.
        </p>

        <p>
          Once found, the scanner doesn't just alert. It surfaces:
        </p>
        <ul>
          <li>What the credential is (key type, service it accesses)</li>
          <li>Where it was found (bucket, path, when)</li>
          <li>How old it is (is it still valid?)</li>
          <li>What we should do (revoke immediately, check for abuse, etc.)</li>
        </ul>

        <h2>What we learned</h2>
        <p>
          The finding: every single exposed credential was preventable. Not because the security was bad — because nobody had visibility into the problem. Once the scanner was running, the team got serious. Credentials got rotated. Processes changed. S3 buckets got locked down.
        </p>

        <p>
          The meta-lesson: the most dangerous security gap isn't often a technical flaw. It's a visibility gap. You defend what you can see. The scanner didn't add new security controls — it made existing problems visible.
        </p>

        <blockquote>
          Security at scale isn't about perfect controls. It's about making the invisible visible enough to act on it.
        </blockquote>

        <p>
          Now it runs in the background, silently. Every credential found gets remediated. It's not exciting security work — but it's the kind that prevents the incidents nobody sees coming.
        </p>
      </>
    ),
  },
  {
    slug: 'gitops-at-scale',
    title: 'How we went from 1 team to 50 teams on GitOps without breaking things',
    date: '2026-07-27',
    tags: ['kubernetes', 'gitops', 'argocd'],
    excerpt:
      'Scaled a GitOps platform from one team to organization-wide. The key wasn\'t a better tool — it was tenant isolation that actually works.',
    body: (
      <>
        <p>
          One team had a working GitOps setup on ArgoCD. It was clean. It worked. Then the question came: can we do this for everyone?
        </p>

        <p>
          The obvious answer is "yes, just replicate the setup." The real answer is much harder. Because the moment you go multi-tenant, you're not just deploying code anymore — you're managing isolation, preventing accidents, and ensuring that one team's mistake doesn't take down everyone else's infrastructure.
        </p>

        <h2>The tension</h2>
        <p>
          GitOps is powerful because it's declarative. Everything lives in git. Deployments are just git commits. But with 50 teams, that power becomes a liability. Team A can accidentally overwrite Team B's infrastructure. Someone commits a malformed YAML and takes down the cluster. A leaked AWS credential in a repo gives someone access to everyone's secrets.
        </p>

        <p>
          The goal: give each team the autonomy to deploy fearlessly while ensuring they can't accidentally touch anyone else's infrastructure.
        </p>

        <h2>The architecture</h2>
        <p>
          We used ArgoCD's AppProject feature. Each team gets its own AppProject — a virtual boundary that defines:
        </p>
        <ul>
          <li><strong>Namespaces they can touch</strong> — Team A deploys to `team-a-prod`, Team B to `team-b-prod`. Period.</li>
          <li><strong>Git repos they can deploy from</strong> — They can only deploy from their own repo, not anyone else's.</li>
          <li><strong>Clusters they can access</strong> — Some teams need prod, some only staging.</li>
          <li><strong>RBAC rules that enforce it</strong> — OIDC federation ties deployment permissions to your identity. You can't deploy as someone else.</li>
        </ul>

        <p>
          On top of that, secrets stay in a vault. Every deploy is audited. Every change goes through git, so you can see exactly what changed, who changed it, and when.
        </p>

        <h2>What changed</h2>
        <p>
          Engineers stopped being afraid. When you know the platform won't let you accidentally break production, you deploy faster. You take more risks. You innovate more.
        </p>

        <p>
          One team can run tests in prod without worrying about taking down another team. A malformed config doesn't cascade across the organization. A compromised credential only touches one team's infrastructure.
        </p>

        <p>
          The payoff: we went from one team using GitOps carefully to 50 teams shipping fearlessly. Because the platform made accidents impossible before they happened.
        </p>

        <blockquote>
          The best security isn't about catching mistakes. It's about making mistakes technically impossible.
        </blockquote>
      </>
    ),
  },
  {
    slug: 'observability-as-insurance',
    title: 'Why observability is the thing that saves you at 3am',
    date: '2026-07-26',
    tags: ['observability', 'incident-response'],
    excerpt:
      'Built an observability platform on Elasticsearch that became the org\'s insurance policy against chaos. Here\'s what we learned about making visibility matter.',
    body: (
      <>
        <p>
          It's 3am. Something is wrong in production. Traffic is degraded. You don't know what. Your team is awake. Your customers are frustrated. You have 20 minutes before someone escalates this to the exec team.
        </p>

        <p>
          In that moment, observability is the only thing that matters. Not your code quality. Not your architecture decisions. Not your certifications. Can you see what's happening? Can you find the root cause in the time you have?
        </p>

        <h2>The problem we had</h2>
        <p>
          Our logs were scattered. Application logs in one place. Infrastructure logs in another. Audit logs somewhere else. Network events in a fourth system. When an incident happened, you'd spend half the debugging time just stitching together logs from four different sources.
        </p>

        <p>
          Worse: we didn't have structured logging. Logs were free-form text. Searching for "database connection timeout" meant keyword searches that returned thousands of false positives.
        </p>

        <h2>Building the platform</h2>
        <p>
          We built an Elasticsearch-based observability platform. But it wasn't just "throw logs into Elasticsearch." It was:
        </p>
        <ul>
          <li><strong>Structured logging everywhere</strong> — every log is JSON with standardized fields (timestamp, service, trace ID, severity, etc.)</li>
          <li><strong>Trace IDs that span the entire request</strong> — follow a user request from the load balancer through six different services</li>
          <li><strong>Metrics alongside logs</strong> — CPU, memory, request latency, database query time — not separate from logs, integrated with them</li>
          <li><strong>Real incident templates</strong> — when you search for "database connection pool exhaustion," we show you exactly what that looks like in your logs</li>
        </ul>

        <h2>The 3am difference</h2>
        <p>
          Now when something breaks, the on-call engineer can:
        </p>
        <ol>
          <li>Get a trace ID from a user complaint</li>
          <li>Search the observability platform for that trace</li>
          <li>See every system that request touched, in order, with full context</li>
          <li>Find where it failed</li>
          <li>Understand why (was it a timeout? a bug? a resource limit?)</li>
          <li>Fix it</li>
        </ol>

        <p>
          What used to take 30 minutes takes 3. The incident resolves before it becomes a crisis.
        </p>

        <blockquote>
          Observability isn't about collecting more data. It's about being able to ask questions of your production system that you don't know you need to ask yet.
        </blockquote>

        <p>
          The platform became the source of truth for everything that happens in production. It's not exciting. But it's saved the team hundreds of hours of debugging time.
        </p>
      </>
    ),
  },
  {
    slug: 'infrastructure-as-code-war-story',
    title: 'How we stopped configuration drift before it became a disaster',
    date: '2026-07-25',
    tags: ['terraform', 'infrastructure', 'aws'],
    excerpt:
      'Infrastructure was drifting. Nobody knew the true state. We built a Terraform strategy that made everything declarative and auditable.',
    body: (
      <>
        <p>
          Sometime in 2023, nobody could answer a simple question: what's actually running in production?
        </p>

        <p>
          There was a runbook. There was a CloudFormation template. But the runbook was out of date, and the CloudFormation template didn't match what was actually deployed. Someone had made manual changes months ago and forgotten to update the template. Someone else had spun up an EC2 instance directly in the console. Another team had modified a security group via the AWS console "just to make this one thing work" and never documented it.
        </p>

        <p>
          The infrastructure was a patchwork of intentions and accidents.
        </p>

        <h2>The pain point</h2>
        <p>
          Every deployment was a gamble. When you deployed new infrastructure, you couldn't be sure the old stuff would tear down correctly. You couldn't onboard new team members because you couldn't explain how anything actually worked. A security audit became a nightmare — proving that your infrastructure matches your security policies when you're not sure what you actually have.
        </p>

        <p>
          Worse, people got defensive. "I don't remember why I made that change." "That's been there for so long, I'm afraid to remove it." "If I automate it, I'll break production."
        </p>

        <h2>Starting from scratch (kind of)</h2>
        <p>
          We built a Terraform strategy. Not a quick migration — a real strategy:
        </p>
        <ul>
          <li><strong>Inventory everything</strong> — what actually exists in AWS right now?</li>
          <li><strong>Import it into Terraform</strong> — tell Terraform "this resource exists, I'm managing it now"</li>
          <li><strong>Document it</strong> — why does this resource exist? What depends on it?</li>
          <li><strong>Automate it</strong> — write Terraform that reproduces the current state</li>
          <li><strong>Version control it</strong> — every change goes through git, gets reviewed, gets tested</li>
          <li><strong>Enforce it</strong> — terraform validate, terraform plan, tests before anything touches prod</li>
        </ul>

        <p>
          The Mac fleet was the toughest part. EC2 Mac instances are expensive and constrained — you can't just spin them up on a whim. We had to optimize them carefully. Terraform + auto-scaling rules meant developers got the resources they needed without manual intervention or waste.
        </p>

        <h2>What changed</h2>
        <p>
          Within months, you could read the Terraform code and know exactly what's in production. A new team member could read the code and understand the architecture. A security audit became trivial — "what's in Terraform is in production, and vice versa."
        </p>

        <p>
          Deployments became safe. You could make changes confidently because you could see the diff. You could tear down infrastructure because you knew it was safe to recreate it from code.
        </p>

        <p>
          People stopped being afraid. Fear of automation isn't about the automation — it's about uncertainty. Once you know what you're deploying, the fear goes away.
        </p>

        <blockquote>
          Infrastructure as code isn't about being cool or modern. It's about being able to sleep at night knowing what's actually running in production.
        </blockquote>
      </>
    ),
  },
  {
    slug: 'agents-and-developer-experience',
    title: 'Can AI make engineers more productive? What we learned from building agentic workflows',
    date: '2026-07-24',
    tags: ['ai', 'llm', 'developer-tools'],
    excerpt:
      'Explored multi-agent LLM systems to automate developer workflows. Found that AI doesn\'t replace engineers — it handles the tedious parts so humans can think.',
    body: (
      <>
        <p>
          There's a lot of hype around AI in developer productivity. "Copilot wrote my code." "ChatGPT answered my question." The reality is more nuanced.
        </p>

        <p>
          The question I wanted to answer: what if AI handled the parts of engineering that don't require creative thinking? What if there was a system that could look at a PR, identify common issues, run tests, and suggest fixes — before a human even had to look?
        </p>

        <h2>The experiment</h2>
        <p>
          We built a system using Google's Agent Development Kit and Gemini LLMs. The architecture was multi-agent:
        </p>
        <ul>
          <li><strong>The reviewer agent</strong> — looks at a PR, identifies potential issues (logic errors, performance problems, missing edge cases)</li>
          <li><strong>The executor agent</strong> — runs tests, checks if the change actually works</li>
          <li><strong>The suggester agent</strong> — based on what the reviewer and executor found, suggests concrete fixes</li>
        </ul>

        <p>
          The key insight: each agent is independent. The reviewer doesn't know what the executor will find. They both work in parallel and then synthesize. This mirrors how human code review actually works.
        </p>

        <h2>What we learned</h2>
        <p>
          AI didn't replace code review. It accelerated the tedious part — the mechanical checking. "Does this variable get initialized?" "Is this array bounds-checked?" "Will this timeout under load?"
        </p>

        <p>
          But it also couldn't replace the human judgment: "Is this the right design? Does this align with the system's goals? Is there a simpler way to solve this?"
        </p>

        <p>
          The sweet spot: AI handles the checklist. Humans handle the strategy.
        </p>

        <p>
          The impact: PRs that would have taken 30 minutes of back-and-forth review now take 10, because AI surfaced the common issues first. Engineers spend their time on high-value judgments, not mechanical checks.
        </p>

        <h2>The future</h2>
        <p>
          This isn't the last word on AI and developer productivity. But it's a hint at what it could be: not AI replacing engineers, but AI handling the boring parts so engineers can spend their time on the parts that require actual thinking.
        </p>

        <blockquote>
          The best tools don't replace experts. They automate the parts that don't require expertise, so experts can focus on the parts that do.
        </blockquote>
      </>
    ),
  },
  {
    slug: 'from-defense-to-offense',
    title: 'Why I\'m learning to break what I built',
    date: '2026-07-23',
    tags: ['devsecops', 'research'],
    excerpt:
      'I spent years building defenses. Now I\'m learning the attacker\'s perspective. Here\'s why that matters for everyone building systems.',
    body: (
      <>
        <p>
          A few months ago, my secrets scanner found 100+ exposed credentials across five AWS accounts. Some had been sitting there for months. They were all preventable — if I'd known to look. That's when I realized something: you can't defend against attacks you don't understand.
        </p>

        <p>
          I've spent my career on the defensive side. Policy-as-code gates in CI/CD. Continuous scanning. RBAC and tenant isolation. Compliance automation. It's good work — critical work. But defensive security is essentially reactive: you look for what you know to look for. Research is the inverse: you learn what you didn't know to look for.
        </p>

        <h2>The moment it clicked</h2>
        <p>
          Working at Apple, AWS, and Google, I noticed something consistent: the most dangerous vulnerabilities aren't the ones people know about. They're the ones nobody's thought to check for yet. Your firewall is perfect — until someone finds the one port you forgot to think about. Your RBAC is locked down — until someone discovers an edge case in how assume-role works under pressure.
        </p>

        <p>
          If I want to build systems that actually don't break, I need to think like someone trying to break them first.
        </p>

        <h2>What this means in practice</h2>
        <p>
          I'm diving into the research side:
        </p>
        <ul>
          <li>
            <strong>Low-level fundamentals:</strong> OS internals, memory, assembly — understanding the layers beneath the abstractions I work in daily
          </li>
          <li>
            <strong>Reverse engineering:</strong> Ghidra, x64dbg, crackmes, malware samples in an isolated lab
          </li>
          <li>
            <strong>Cloud-native attacks:</strong> Kubernetes escape paths, supply-chain compromise, IAM privilege escalation — the offensive mirror of everything I've defended
          </li>
          <li>
            <strong>Detection engineering:</strong> Taking what I learn offensively and turning it into Sigma rules, hunt queries, actual defenses
          </li>
          <li>
            <strong>CTFs and write-ups:</strong> Real problems, published here — keeping it honest
          </li>
        </ul>

        <h2>The ground rules</h2>
        <blockquote>
          Research only in my own lab or explicitly authorized platforms. Everything worth learning gets written up publicly. No excuses, no secrecy — if I'm learning, the community learns.
        </blockquote>

        <p>
          If you're building platforms and thinking about this too — reach out. The best defenses come from understanding the offense.
        </p>
      </>
    ),
  },
]
