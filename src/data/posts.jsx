// Blog posts. To add one: append an object here with a unique `slug`.
// `body` is JSX so posts can use any markup the article styles support.
export const posts = [
  {
    slug: 'from-defense-to-offense',
    title: 'Why I\'m learning to break what I built',
    date: '2026-07-27',
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
