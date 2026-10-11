const post = {
  slug: 'kyverno-policy-security-tiers',
  title: 'Kyverno Security: Three Tiers from Audit to Enforced Guardrails',
  date: '2026-10-10',
  tags: ['security', 'kubernetes', 'policy-as-code'],
  excerpt:
    'Build Kubernetes guardrails with current Kyverno CEL policies: learn in Audit, enforce tested constraints, and define ownership, exceptions, and image trust explicitly.',
  body: (
    <>
      <p className="section-label">Policy as code / decisions you can explain</p>
      <p>
        A Kubernetes requirement becomes useful when a team can test it, understand a failure,
        and fix the resource. “Use safe containers” is too vague. “This Pod must disable privilege
        escalation and declare a non-root execution policy” gives reviewers and developers
        something concrete to evaluate. Kyverno lets you express such requirements as policies
        and apply them at defined boundaries.
      </p>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/kyverno-tiered-lab">Kyverno Tiered Lab</a>{' '}
        progresses from Audit to enforcement to broader governance. These are our learning and
        adoption tiers, not official Kyverno maturity levels, certifications, or a complete
        Kubernetes security baseline. The exercises use synthetic manifests and the native
        Kyverno CLI. Passing them does not establish that any live cluster is protected.
        Each tier uses a separate lab namespace; carrying earlier controls into a combined
        deployment requires deliberately matching that deployment’s scope.
      </p>

      <h2>Use the policy API that matches your version</h2>
      <p>
        This lab targets Kyverno 1.19.1 and the CEL-based{' '}
        <a href="https://kyverno.io/docs/policy-types/validating-policy/">ValidatingPolicy API</a>,
        using <code>policies.kyverno.io/v1</code>. Its <code>validationActions</code> include{' '}
        <code>Audit</code> and <code>Deny</code>. Here, “enforce” describes the adoption step;
        the blocking action in these files is <code>Deny</code>. Older examples using
        ClusterPolicy and <code>validationFailureAction</code> are a different schema. Check
        versioned documentation before combining examples or migrating an existing policy.
      </p>
      <div
        className="article-table-wrap"
        role="region"
        aria-label="Kyverno adoption tiers"
        tabIndex={0}
      >
        <table className="article-comparison">
          <caption>Each tier adds a decision and the tests needed to trust it.</caption>
          <thead>
            <tr>
              <th scope="col">Tier</th>
              <th scope="col">Lab control</th>
              <th scope="col">What a passing test means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1 / Audit</th>
              <td>Require a nonempty team label</td>
              <td>The example satisfies the label expression</td>
            </tr>
            <tr>
              <th scope="row">2 / Enforce</th>
              <td>Deny selected unsafe Pod settings</td>
              <td>The example satisfies these explicit hardening constraints</td>
            </tr>
            <tr>
              <th scope="row">3 / Governance</th>
              <td>Check owners and registry/digest reference format</td>
              <td>The declared metadata and image references match policy</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Tier 1: Audit a rule people can understand</h2>
      <p>
        Start with the{' '}
        <a href="https://github.com/KaylahBuilds/kyverno-tiered-lab/tree/main/tier-1-audit">
          team-label policy
        </a>.
        A resource with a useful team label passes; missing and empty labels fail the expression.
        An object outside the matching scope should be skipped. That last case matters: a
        green test suite can conceal a policy that never evaluated the resource you intended
        to protect. Review matching rules as carefully as validation expressions.
      </p>
      <p>
        Audit allows an admission request to proceed even when the policy expression fails.
        Use the resulting findings to identify owners, discover incompatible workloads, and
        improve the failure message. Kyverno’s{' '}
        <a href="https://kyverno.io/docs/guides/reports/">policy reports</a> describe observed
        resource results. They are a view of resource state, not an immutable history of every
        attempted request; deleting a resource removes its corresponding report information.
        Preserve separate records when you need a durable audit trail.
      </p>
      <p>
        Admission evaluation and background evaluation answer different questions. Admission
        evaluates a request as it reaches the API boundary; background evaluation examines
        existing objects. ValidatingPolicy exposes separate controls for those paths. A scan
        can reveal an existing violation, but a validation result does not repair or evict the
        workload. Request-only identity information also needs separate consideration when
        designing checks that must work against stored resources.
      </p>

      <h2>Tier 2: Enforce a tested, bounded requirement</h2>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/kyverno-tiered-lab/tree/main/tier-2-enforce">
          second tier
        </a>{' '}
        uses <code>Deny</code> for selected Linux Pod hardening constraints. Its fixtures cover
        application, init, and ephemeral containers alongside host namespace and hostPath
        restrictions. Inspect which settings are required explicitly and which Kubernetes
        defaults are accepted. Missing fields, a single unsafe container among safe ones, and
        an out-of-scope namespace deserve individual tests.
      </p>
      <p>
        These checks are an educational subset, not a claim of full Pod Security Standards
        compliance. Kubernetes publishes the{' '}
        <a href="https://kubernetes.io/docs/concepts/security/pod-security-standards/">
          Baseline and Restricted requirements
        </a>{' '}
        separately, with version and operating-system details. Compare your intended baseline
        against that source before deciding whether a custom policy is sufficient.
      </p>
      <p>
        Promote a policy only after the positive and negative cases behave as intended and
        affected owners can fix their manifests. Use a limited rollout scope, inspect actual
        admission responses, and document recovery access. Test updates as well as creation,
        including the workload controllers and subresources your scope covers. A direct Pod
        fixture does not establish how a Deployment or an ephemeral-container request will
        behave through the installed webhooks.
      </p>
      <p>
        Distinguish a policy violation from a policy-engine failure. <code>Deny</code> defines
        the response to a failed validation; webhook failure policy governs errors such as
        timeouts or an unreachable service. Kubernetes’{' '}
        <a href="https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#failure-policy">
          failure-policy documentation
        </a>{' '}
        explains <code>Fail</code> and <code>Ignore</code>. Choose and test that operational
        behavior deliberately: a security control in the admission path can affect availability.
      </p>

      <h2>Tier 3: Define ownership and the limits of image checks</h2>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/kyverno-tiered-lab/tree/main/tier-3-governance">
          governance tier
        </a>{' '}
        combines an approved-owner list with a bounded registry/repository pattern and a
        SHA-256 digest reference format. A lookalike registry should fail even when its name
        begins with familiar text. Check complete boundaries, not a loose substring. Include
        init and ephemeral container image references in the scope you intend to govern.
      </p>
      <p>
        An owner label remains a declaration unless another control limits who can set it.
        Likewise, a correctly shaped digest does not prove an image exists, contains safe code,
        or came from an approved build. The lab uses synthetic image references, including
        placeholder digests. These expressions perform no registry lookup and no signature or
        provenance verification.
      </p>
      <p>
        For cryptographic image trust, the repository includes an inactive{' '}
        <a href="https://github.com/KaylahBuilds/kyverno-tiered-lab/blob/main/examples/image-trust.yaml.example">
          ImageValidatingPolicy example
        </a>.
        Before adapting it, define the image scope, trusted signer or key, expected issuer and
        identity, and behavior when evidence cannot be fetched or verified. Kyverno’s{' '}
        <a href="https://kyverno.io/docs/policy-types/image-validating-policy/">
          image-verification documentation
        </a>{' '}
        explains the relevant policy mechanisms. A trusted signature establishes a relationship
        to a signer; it does not certify the program’s safety. Provenance requires additional
        evidence and checks against your expected builder and source.
      </p>

      <h2>Exceptions are changes to the security boundary</h2>
      <p>
        Give an exception a specific resource scope, owner, justification, and expiry process.
        Restrict who can create or change it, and test a neighboring resource that must remain
        denied. Kyverno’s{' '}
        <a href="https://kyverno.io/docs/guides/exceptions/">PolicyException guidance</a>{' '}
        documents CEL-based exceptions and the configuration required to enable them. Read the
        lab’s{' '}
        <a href="https://github.com/KaylahBuilds/kyverno-tiered-lab/blob/main/tier-3-governance/EXCEPTIONS.md">
          exception workflow
        </a>{' '}
        before expanding scope. An expiry annotation alone is only metadata unless a tested
        mechanism actually enforces expiry or removes the exception.
      </p>

      <h2>Validate the expression, then validate the deployment</h2>
      <ul>
        <li>Run native CLI tests with the repository’s pinned version; inspect pass, fail, and skip expectations.</li>
        <li>Change one relevant field at a time and confirm the expected decision changes.</li>
        <li>Check namespace, operation, controller, and subresource coverage before broadening enforcement.</li>
        <li>In a disposable cluster, verify admission responses, background findings, and webhook failure behavior separately.</li>
        <li>For image trust, test wrong identities, missing evidence, unavailable registries, and exception boundaries.</li>
      </ul>
      <p>
        Kyverno’s{' '}
        <a href="https://kyverno.io/docs/guides/testing-policies/">testing guidance</a> makes
        policy tests useful before deployment; they still cannot establish webhook wiring or
        production readiness. Compare these guardrails with{' '}
        <a href="/#/blog/kubernetes-opa-eks-aks">OPA and Gatekeeper</a>, connect image trust to{' '}
        <a href="/#/blog/software-supply-chain-security-tiers">supply-chain evidence</a>, and use{' '}
        <a href="/#/blog/falco-runtime-security-tiers">Falco runtime detection</a> to investigate
        behavior after admission. A valid manifest is one boundary, not the end of security work.
      </p>
    </>
  ),
};

export default post;
