export default {
  slug: 'kubernetes-opa-eks-aks',
  title: 'Kubernetes Guardrails That Explain Themselves: OPA, Gatekeeper, EKS, and AKS',
  date: '2026-10-10',
  tags: ['security', 'kubernetes', 'policy-as-code'],
  excerpt:
    'Build testable Kubernetes policies, start with audit instead of surprise denials, and understand what changes when Gatekeeper is yours to operate versus managed through Azure Policy.',
  body: (
    <>
      <p className="section-label">Security lab series / 04</p>
      <p>
        A security requirement like “containers must not run privileged” sounds
        straightforward. The hard part is making it consistent, testable, and
        understandable when someone hits a denial. My new local
        <code> kubernetes-opa-lab </code>
        turns four requirements into small policies with explicit good and bad
        examples. The goal is to learn the control, including its limits, before
        trusting it with a real cluster.
      </p>

      <h2>OPA decides; Gatekeeper connects the decision to Kubernetes</h2>
      <p>
        Open Policy Agent evaluates policy written in Rego. Gatekeeper brings
        that evaluation into Kubernetes: a ConstraintTemplate defines reusable
        logic and its parameter schema; a Constraint selects the scope,
        parameters, and enforcement action.
        {' '}<a href="https://open-policy-agent.github.io/gatekeeper/website/docs/constrainttemplates/">Gatekeeper documents this policy model</a>.
      </p>
      <p>
        Admission evaluates a request before persistence. Background audit
        checks existing resources and reports violations; it does not remove or
        repair them. These are complementary controls, not interchangeable
        evidence.
        {' '}<a href="https://open-policy-agent.github.io/gatekeeper/website/docs/audit/">The audit documentation explains that distinction</a>.
      </p>

      <h2>Four rules, deliberately narrow scope</h2>
      <ul>
        <li>Require effective non-root settings and reject an effective UID of zero.</li>
        <li>Reject privileged regular, init, and ephemeral containers.</li>
        <li>Require an approved registry path and a SHA-256 image digest.</li>
        <li>Require non-empty application and owner labels on Pods.</li>
      </ul>
      <p>
        These constraints match Pods in <code>opa-lab</code>. They do not validate
        a Deployment's embedded template at Deployment admission. A Deployment
        can be accepted while its subsequent Pod creation is denied. That is a
        real troubleshooting boundary, not a successful deployment. The image
        rule checks reference syntax, not signatures, vulnerabilities, or whether
        the image exists.
      </p>

      <h2>A readable Rego rule</h2>
      <p>
        This is the lab's complete privileged-container rule from
        <code> policies/rego/privileged.rego</code>. Missing container collections
        default to an empty list; missing privilege settings default to false.
      </p>
      <pre><code>{`package k8slabprivileged

containers contains c if {
    some field in ["containers", "initContainers", "ephemeralContainers"]
    some c in object.get(input.review.object.spec, field, [])
}

violation contains {"msg": msg} if {
    some c in containers
    context := object.get(c, "securityContext", {})
    object.get(context, "privileged", false) == true
    msg := sprintf("container %s must not be privileged", [c.name])
}`}</code></pre>
      <p>
        The template contains identical logic and explicitly selects Rego v1
        through <code>targets[].code[].source.version</code>. Copying v1 syntax
        into the legacy <code>rego</code> field is not equivalent.
        {' '}<a href="https://open-policy-agent.github.io/gatekeeper/website/docs/constrainttemplates/#enable-opa-rego-v1-syntax-in-constrainttemplates">Use the documented v1 configuration</a>.
      </p>

      <h2>Audit first, then prove enforcement</h2>
      <ol>
        <li>Run offline checks and policy-engine tests before contacting a cluster.</li>
        <li>Use a disposable local cluster and verify the intended context.</li>
        <li>Start with <code>enforcementAction: dryrun</code>; inspect audit timestamps and violations.</li>
        <li>Fix workloads and document justified, time-bounded exceptions.</li>
        <li>Apply the explicit deny overlay, then verify a negative Pod request is rejected.</li>
      </ol>
      <p>
        Constraint dryrun means report without denying. Kubernetes server-side
        dry-run means process a request without storing it. They solve different
        problems. The fixtures use reserved <code>.invalid</code> image names,
        invented digests, and a non-existent scheduler to prevent accidental
        execution; they are test inputs, not applications to launch.
      </p>
      <p>
        Also inspect webhook failure behavior. With
        <code> failurePolicy: Ignore</code>, an unavailable webhook can allow
        requests through without enforcement. Failing closed can instead block
        legitimate operations. Availability monitoring and a tested recovery
        path belong in the design.
        {' '}<a href="https://open-policy-agent.github.io/gatekeeper/website/docs/failing-closed/">Gatekeeper describes both risks</a>.
      </p>

      <h2>EKS versus AKS: compare ownership, not slogans</h2>
      <h3>EKS with self-managed Gatekeeper</h3>
      <p>
        In this design, the platform team owns installation, upgrades, webhook
        availability, policy releases, and reporting. That gives direct control
        and an equally direct operating burden.
        {' '}<a href="https://docs.aws.amazon.com/eks/latest/best-practices/pod-security.html">AWS includes Gatekeeper among EKS policy-as-code options</a>.
      </p>
      <h3>AKS with the Azure Policy add-on</h3>
      <p>
        Azure Policy supplies a managed integration, assignments, and centralized
        compliance reporting. Do not install a second Gatekeeper beside the
        add-on: Microsoft does not support that combination. Port requirements
        through supported definitions and check the actual add-on version;
        this lab's Rego v1 configuration is not a compatibility promise.
        {' '}<a href="https://learn.microsoft.com/en-us/azure/governance/policy/concepts/policy-for-kubernetes">See Microsoft's integration and installation restrictions</a>.
      </p>
      <p>
        AKS can also use a self-managed approach instead of the add-on. Either
        way, admission policy does not replace RBAC, workload identity, network
        controls, or runtime detection. Compare controller ownership, recovery,
        private-network reachability, and engineering time alongside resource
        costs. Neither cloud becomes secure merely because a controller exists.
      </p>

      <h2>What is verified, and what comes next</h2>
      <p>
        Twelve static tests passed locally. The lab includes eighteen OPA unit
        tests and nineteen gator cases, but those engine tests have not executed
        yet. No cluster has been deployed, and the repository remains local and
        unpublished. Static validation proves artifact consistency, not working
        admission or cloud compatibility.
      </p>
      <p>
        Try this exercise: add a failing case for a privileged init container,
        explain its violation, and compare it with an allowed Pod. Then write
        down who can change enforcement and how you recover from a webhook
        outage. A useful guardrail needs both a decision and an operating plan.
      </p>
      <p>
        Continue the pipeline with
        {' '}<a href="/#/blog/ghas-controls-automation-remediation">repository controls and remediation</a>,
        {' '}<a href="/#/blog/woodpecker-hardened-ci-pipelines">hardened CI pipelines</a>, and
        {' '}<a href="/#/blog/prowler-kubernetes-multicloud-scanning">Kubernetes and multi-cloud scanning</a>.
      </p>
    </>
  ),
}
