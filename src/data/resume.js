export const summary =
  'Platform engineering leader designing and operating mission-critical cloud infrastructure at scale across Google Cloud and AWS in parallel production environments. Architect and govern multi-tenant platforms consumed by dozens of engineering teams; establish architectural standards and enforce compliance through policy-as-code and automated controls. Known for translating business consequence into infrastructure decisions: availability directly tied to revenue, security embedded at design time, and developer experience as a platform product metric.'

export const competencies = [
  'Platform Architecture & Governance',
  'Multi-Tenant Design & Isolation',
  'Terraform / IaC at Scale',
  'Kubernetes & GitOps',
  'CI/CD Platform Ownership',
  'Security Architecture',
  'DevSecOps & Policy-as-Code',
  'Automated Compliance',
  'Observability Platforms',
  'Technical Leadership',
  'Engineering Mentorship',
]

export const experience = [
  {
    role: 'Lead Platform Engineer',
    where: 'Apple',
    when: 'March 2024 – Present',
    bullets: [
      'Lead platform engineering organization designing, delivering, and governing enterprise cloud infrastructure on GKE serving millions of daily retail transactions.',
      'Established multi-tenant GitOps platform on ArgoCD, scaling from single team to organization-wide adoption — AppProject tenant isolation, RBAC boundaries, OIDC federation, and secrets governance for compliance and deployment auditability.',
      'Built Python-based continuous S3 secrets-scanning service across 5 AWS accounts using 28 detection patterns; surfaced 100+ exposed credentials, converting security auditing into an always-on automated control.',
      'Architect and operate AWS EC2 Mac dedicated host fleet — constrained capacity management, tenancy optimization, and autoscaling tuned to developer demand; integrated SonarQube quality gates as a platform standard.',
      'Designed and operate enterprise observability platform on the Elasticsearch stack — the organizational source of truth for diagnostics and production incident response across global GKE infrastructure.',
      'Drove Terraform provisioning strategy across multi-OS Kubernetes node pools, cluster networking, and capacity management — from manual configuration drift to declarative, auditable IaC with Terraform Cloud governance.',
      'Championed AI-driven platform innovation: architected adoption of Google Agent Development Kit with Gemini LLMs for agentic developer workflows and multi-agent system design.',
    ],
  },
  {
    role: 'Solutions Architect',
    where: 'Amazon Web Services',
    when: 'May 2022 – September 2023',
    bullets: [
      'Trusted technical architect to strategic accounts representing over $30 billion in annual cloud spend; shaped architecture decisions at executive level.',
      'Led Amazon EKS modernization engagements, guiding enterprises from legacy monoliths through containerization and Kubernetes adoption; coached internal platform teams on cloud-native practice.',
      'Architected MLOps platform patterns — training orchestration, deployment automation, monitoring, and lifecycle governance — enabling customers to operationalize ML at scale.',
      'Influenced AWS product roadmap by synthesizing customer need patterns and bridging strategic accounts with product teams.',
    ],
  },
  {
    role: 'Solutions Engineer',
    where: 'Google',
    when: 'May 2021 – May 2022',
    bullets: [
      'Led technical discovery and architecture design for enterprise application modernization to cloud-native architectures on GCP, including risk assessment and phased transition planning.',
      'Delivered proof-of-concept demonstrations and architecture workshops on Google Kubernetes Engine for containerization and cloud-native deployment strategy.',
      'Architected scalable real-time and batch analytics pipelines on Google Cloud Dataflow, unlocking customer observability and operational intelligence.',
    ],
  },
  {
    role: 'DevOps Engineer',
    where: 'Leidos',
    when: 'August 2020 – May 2021',
    bullets: [
      'Led Infrastructure-as-Code modernization in a regulated environment, centralizing management of Linux and Windows servers across hybrid on-prem and cloud infrastructure.',
      'Automated configuration lifecycle management for RHEL systems with Ansible — the organizational standard for auditable, compliance-aware provisioning.',
      'Designed and executed petabyte-scale health data migration to AWS with data integrity, regulatory compliance, and operational continuity throughout.',
    ],
  },
  {
    role: 'Linux Systems Engineer',
    where: 'Yale University',
    when: 'February 2019 – August 2020',
    bullets: [
      'Deployed and operated containerized application infrastructure with Docker Swarm and Jenkins CI/CD pipelines.',
      'Managed Linux server infrastructure spanning on-premises and Azure environments with VMware vSphere and NetApp.',
    ],
  },
  {
    role: 'Channel Sales Partner Manager – CMDB',
    where: 'Device42',
    when: 'August 2017 – June 2019',
    bullets: [
      'Led cross-regional sales engineering teams delivering CMDB platform implementations across EMEA and APAC.',
    ],
  },
]

export const certifications = [
  'CNCF — Certified GitOps Associate (CGOA)',
  'Linux Foundation — Kubernetes & Cloud Native Associate (KCNA)',
  'Google Cloud — Professional Cloud Architect',
  'AWS — Certified Solutions Architect – Associate',
]
