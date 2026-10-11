import { Link } from 'react-router-dom'

// Short display titles keep the guide-card rhythm; articles retain their full titles.
const cardTitles = {
  'falco-runtime-security-tiers': 'Falco. Runtime signals.',
  'kyverno-policy-security-tiers': 'Kyverno. Policy that holds.',
  'software-supply-chain-security-tiers': 'Secure the supply chain.',
  'sast-vs-dast-security-testing-tiers': 'SAST vs DAST. Three tiers.',
  'ghas-controls-automation-remediation': 'GHAS that earns its keep',
  'woodpecker-hardened-ci-pipelines': 'Harden the pipeline',
  'prowler-kubernetes-multicloud-scanning': 'Cloud scans. Clear boundaries.',
  'kubernetes-opa-eks-aks': 'Policy before production',
  'small-commits-big-signal': 'Small commits. Big signal.',
  'defining-the-hackfluencer': 'The Hackfluencer',
  'credential-scanner': '100+ exposed secrets',
  'gitops-at-scale': 'GitOps at scale',
  'observability-as-insurance': 'Observability at 3am',
  'infrastructure-as-code-war-story': 'Stopping configuration drift',
  'agents-and-developer-experience': 'Agentic workflows',
  'from-defense-to-offense': 'From defense to offense',
}

const accents = ['lime', 'blue', 'magenta', 'teal']

export default function BlogCard({ post, index, headingLevel = 'h2' }) {
  const Heading = headingLevel

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="field-guide-card card-link"
      data-accent={accents[index % accents.length]}
      data-number={String(index + 1).padStart(2, '0')}
      aria-label={`Read the blog: ${post.title}`}
    >
      <p className="guide-card-top">{post.tags.slice(0, 3).join(' · ')}</p>
      <Heading className="guide-card-title">{cardTitles[post.slug] || post.title}</Heading>
      <p className="guide-card-description">{post.excerpt}</p>
      <span className="guide-card-footer">Read the blog <span aria-hidden="true">→</span></span>
    </Link>
  )
}
