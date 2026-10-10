export default {
  slug: 'prowler-kubernetes-multicloud-scanning',
  title: 'Prowler on Kubernetes: Public Access, Private Findings',
  date: '2026-10-10',
  tags: ['security', 'kubernetes', 'multi-cloud'],
  excerpt:
    'A practical design for an authenticated Prowler UI, scoped cross-account scans, and a clear boundary between a healthy dashboard and a trustworthy assessment.',
  body: (
    <>
      <p className="section-label">Security lab series / 03</p>
      <p>
        A security scanner collects an unusually useful map of an environment: account identities,
        resource names, permission gaps, and potential attack paths. Making that scanner convenient
        to reach should not make its findings convenient to steal. That is the starting point for
        my <code>prowler-kubernetes-lab</code> project.
      </p>
      <p>
        The design exposes the Prowler UI through an authenticated HTTPS load balancer while keeping
        its API and state services private. It also separates running the application from authorizing
        it to inspect AWS, Azure, or GCP. Those are different responsibilities, even when they share
        a Kubernetes namespace.
      </p>
      <blockquote>
        <p><strong>Build status:</strong> the local project targets Prowler 5.44.0. Its 20 offline tests
          and Helm render checks pass. No cloud scan, database migration, container startup, or public
          deployment has been tested live. Repository publication is pending; this is an implementation
          walkthrough, not a production deployment claim.</p>
      </blockquote>

      <h2>Put authentication in front of public reachability</h2>
      <p>
        On EKS, the example uses the open-source AWS Load Balancer Controller with an internet-facing
        ALB. The request path is browser, HTTPS listener, Cognito authentication, then the UI Service.
        Only the UI has ingress. The API and MCP endpoint remain ClusterIP services, and the data
        services sit on private networks.
      </p>
      <p>
        The following annotations illustrate the access policy; they are not a complete manifest.
        The actual <code>ingress.yaml</code> also needs a hostname, certificate ARN, Cognito configuration,
        and a Service backend. The lab renderer rejects missing settings rather than silently publishing
        an unauthenticated endpoint.
      </p>
      <pre><code>{`alb.ingress.kubernetes.io/scheme: internet-facing
alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
alb.ingress.kubernetes.io/auth-type: cognito
alb.ingress.kubernetes.io/auth-on-unauthenticated-request: authenticate`}</code></pre>
      <p>
        Cognito is an outer gate, not automatic authorization inside Prowler. Disable public
        self-registration, invite approved users, and still configure Prowler tenants and roles.
        Validate callbacks and unauthenticated requests before adding a provider. The{' '}
        <a href="https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/ingress/annotations/">controller documentation</a>{' '}
        describes the ALB requirements; these annotations are not a portable recipe for every ingress controller.
      </p>

      <h2>The application is more than a UI container</h2>
      <p>
        The chart defines a UI, API, scan worker, singleton scheduler, and private MCP service.
        PostgreSQL, authenticated Valkey, compatible graph storage, and shared report storage are
        prerequisites. Compare those components with the{' '}
        <a href="https://github.com/prowler-cloud/prowler/blob/5.44.0/docker-compose.yml">pinned upstream deployment</a>{' '}
        before changing their versions.
      </p>
      <ul>
        <li><strong>Migration ordering:</strong> workers wait for API readiness; the API initializes its database schema.</li>
        <li><strong>Bounded work:</strong> worker concurrency is explicitly limited instead of inheriting the host's CPU count.</li>
        <li><strong>Shared output:</strong> API and workers mount the same RWX volume. Separate temporary directories would make generated reports unavailable to the API.</li>
        <li><strong>Durable secrets:</strong> provider-encryption keys need backup alongside data. Losing a key can make stored credentials unusable.</li>
      </ul>
      <p>
        Review also exposed configuration details worth testing: the MCP service needs the local API
        address rather than its cloud default, and Django needs a generated secret. Valkey TLS needs
        certificate and hostname verification, not just a <code>rediss</code> prefix. The lab's settings
        wrapper applies verification to both Celery and direct Redis clients. A rendered chart checks
        configuration structure; it does not prove a database connection is secure.
      </p>

      <h2>Make scan scope an explicit input</h2>
      <p>
        For AWS, the scanner identity needs permission to assume a named target role, and that target
        must trust the scanner. Start with approved audit permissions, inspect missing-check coverage,
        and avoid broadening the role to AdministratorAccess. If the trust requires an external ID,
        the scan must supply the matching value. An external ID is not a replacement for a scoped
        principal. See{' '}
        <a href="https://github.com/prowler-cloud/prowler/blob/5.44.0/docs/user-guide/providers/aws/role-assumption.mdx">Prowler's role-assumption guide</a>.
      </p>
      <p>
        The local runner requires named targets and explicit roles, subscription IDs, or project IDs.
        Its default mode only prints commands. Execution requires both flags below and rejects the
        sample account identifiers. These commands refer to the prepared local project, not an
        available public clone.
      </p>
      <pre><code>{`python tools/scan.py --targets .local/scan-targets.json
# Only after reviewing and authorizing every target:
python tools/scan.py --targets .local/scan-targets.json --execute --acknowledge-scope`}</code></pre>
      <p>
        Azure CLI authentication and GCP Application Default Credentials support the local exercises.
        They do not automatically configure the web application's providers. Review{' '}
        <a href="https://github.com/prowler-cloud/prowler/blob/5.44.0/docs/user-guide/providers/azure/authentication.mdx">Azure's additional check permissions</a>{' '}
        and <a href="https://github.com/prowler-cloud/prowler/blob/5.44.0/docs/user-guide/providers/gcp/authentication.mdx">GCP's project and impersonation permissions</a>{' '}
        separately. Missing permission can mean missing findings, not a clean environment.
      </p>

      <h2>Choose hosting around the operating work</h2>
      <p>
        EKS fits when a Kubernetes platform already exists. It also introduces controller IAM,
        network-policy enforcement, persistent storage, and upgrade responsibilities. EC2 with the
        upstream container deployment may be simpler for a small private lab; ECS requires a separate
        deployment translation. None of those choices removes backups, authentication, patching,
        or the cost of data services and egress.
      </p>
      <p>
        My first acceptance exercise would be deliberately small: prove that an unauthenticated
        browser cannot reach the UI, run one authorized scan, restart its worker, and retrieve the
        report. Then check denied cross-namespace access and incomplete-scan errors. A healthy
        homepage alone does not establish any of those properties.
      </p>
      <p>
        CLI output is also separate from the application's database: local CSV or OCSF reports do
        not appear in the UI automatically. Keep findings out of Git, and treat remediation as a
        separately authorized change with review and rollback.
      </p>

      <h2>Continue the security lab series</h2>
      <ul>
        <li><a href="/#/blog/ghas-controls-automation-remediation">GitHub security controls and remediation</a></li>
        <li><a href="/#/blog/woodpecker-hardened-ci-pipelines">Hardening a Woodpecker CI pipeline</a></li>
        <li><a href="/#/blog/kubernetes-opa-eks-aks">OPA policy design across EKS and AKS</a></li>
      </ul>
    </>
  ),
}
