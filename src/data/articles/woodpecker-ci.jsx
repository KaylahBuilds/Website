const post = {
  slug: 'woodpecker-hardened-ci-pipelines',
  title: 'Hardening Woodpecker CI beyond the scanner checklist',
  date: '2026-10-10',
  tags: ['security', 'CI/CD', 'devsecops'],
  excerpt: 'A Woodpecker lab that separates untrusted checks from release authority, with scoped plugins, disposable runners, explicit image policy, and honest verification limits.',
  body: (
    <>
      <p className="section-label">Security lab series / 02</p>
      <p>
        Adding scanners does not make a pipeline trustworthy. CI executes code from a repository,
        downloads tools, handles credentials, and sometimes publishes software. The important question
        is not just what it detects, but what an untrusted change can make it do.
      </p>
      <p>
        I built a local Woodpecker 3.19.0 security lab around that boundary. Its small Python JSON
        service has no third-party runtime dependencies. The pipeline defines syntax checks, unit
        tests, Semgrep, Trivy, and Gitleaks, while keeping publishing disabled. This is a testable
        starting point, not a claim of production readiness.
      </p>

      <h2>Start with the untrusted pull request</h2>
      <p>
        The active checks workflow accepts pull requests targeting main without pipeline secrets,
        privileged steps, host mounts, or ignored security failures. Source ZIP creation is limited
        to push, manual, and tag events. A contributor should be able to test a change without
        acquiring the authority to release it.
      </p>
      <p>
        Woodpecker excludes pull requests from secret access by default; explicitly enabling that
        event removes this protection. Branch filters also need care: they match the target branch
        of a pull request and do not apply to tags. The optional release gate therefore checks the
        exact tag, repository, commit, and main ancestry separately. See the official{' '}
        <a href="https://woodpecker-ci.org/docs/usage/secrets">secret controls</a> and{' '}
        <a href="https://woodpecker-ci.org/docs/usage/workflow-syntax">workflow conditions</a>.
      </p>

      <h2>A scanner container is not a trusted plugin</h2>
      <p>
        Semgrep, Trivy, and Gitleaks run as ordinary command steps here. The optional publisher is
        different: a settings-only release plugin receives a narrowly scoped secret. Adding commands
        or an entrypoint is incompatible with plugin handling; adding environment changes its
        classification and removes plugin-filtered secret access. Those details are explicit in the{' '}
        <a href="https://woodpecker-ci.org/docs/usage/plugins/overview">plugin documentation</a>.
      </p>
      <p>
        I separate three controls: privileged-plugin permission, trusted-clone credential handling,
        and each secret's repository, event, and exact image restrictions. They are not one universal
        image allowlist. An approved plugin remains trusted executable code that can read its assigned
        secret. A tagless secret filter can also broaden access to every tag of an image, as the{' '}
        <a href="https://woodpecker-ci.org/docs/usage/secrets">secret documentation</a> explains.
      </p>

      <h2>Disposable means the whole runner</h2>
      <p>
        The infrastructure example separates the server from a Docker-backed agent on a disposable
        Linux VM. Pipeline steps do not receive the Docker socket, but the agent does. That is still
        a powerful boundary: controlling a conventional rootful Docker daemon can mean controlling
        its host. A read-only socket mount does not make its API read-only.{' '}
        <a href="https://docs.docker.com/engine/security/">Docker's security guidance</a> describes
        why daemon access belongs only with trusted actors.
      </p>
      <p>
        One-shot agent mode exits after a workflow; it does not erase disks, workspace, daemon state,
        or credentials. External automation must destroy the VM and revoke its token. The example
        explicitly enables gRPC TLS and certificate verification, and calls for server-side agent
        filters. Self-reported labels are scheduling hints, not authorization. These distinctions
        follow Woodpecker's <a href="https://woodpecker-ci.org/docs/administration/configuration/agent">agent configuration</a>.
      </p>

      <h2>Release authority stays blocked</h2>
      <p>
        The server template closes registration, identifies an administrator, limits timeouts,
        disables privileged plugins, and defaults new repositories to approval for all events.
        Existing repository settings still require inspection. These are operator controls, not
        protections a contributor should be able to rewrite inside a pull request. See the{' '}
        <a href="https://woodpecker-ci.org/docs/administration/configuration/server">server configuration reference</a>.
      </p>
      <p>
        The release file is an ignored example, and its policy defaults to disabled. Reviewed version
        tags are recorded, but registry digests remain deliberately unresolved. Release validation
        fails until immutable references are supplied and reviewed. Enabling publication also needs
        protected main, tags, and CI configuration, approvals, restricted secrets, and a separately
        controlled release pool. A repository-owned validator can catch regressions; a hostile change
        can edit it too. External enforcement remains essential.
      </p>

      <h2>Hashes are not attestations</h2>
      <p>
        The artifact builder creates a reproducible, narrowly scoped source ZIP and records its
        SHA-256 hash, source hashes, and supplied commit metadata. The provenance explicitly says
        it is unsigned. It is not a SLSA attestation or evidence that scanners passed. This lab does
        not build an OCI image in CI; Trivy's filesystem check does not establish that the final
        container's OS packages are safe.
      </p>

      <h2>Validate before granting release authority</h2>
      <ol>
        <li>
          Run the offline policy validator, syntax checks, and unit tests. Confirm that substituted
          images, host mounts, ignored failures, and unauthorized release metadata are rejected.
        </li>
        <li>
          Run Semgrep, Trivy, and Gitleaks in an isolated sandbox. Add intentionally failing test
          cases, using only fake credentials, and verify that findings actually stop the pipeline.
        </li>
        <li>
          Validate configuration with the matching Woodpecker CLI, then exercise the real CI and
          Compose deployment. Check OAuth restrictions, TLS certificate verification, and approval
          behavior rather than relying on configuration inspection alone.
        </li>
        <li>
          Test an untrusted pull request with harmless canaries, not production secrets. Confirm
          secret isolation, server-side runner restrictions, and complete VM teardown and token
          revocation after each workflow.
        </li>
        <li>
          Keep release disabled until reviewed image digests, protected configuration, and release
          gates are verified. Reject invalid tags or commits, check artifact hashes, and describe
          unsigned provenance accurately instead of treating it as an attestation.
        </li>
      </ol>
      <p>
        Live scanner, container, TLS, and OAuth validation is still outstanding for this lab.
        Complete those checks before granting publishing authority.
      </p>
      <p>
        Continue the series with{' '}
        <a href="/#/blog/ghas-controls-automation-remediation">GitHub security controls and remediation</a>,{' '}
        <a href="/#/blog/prowler-kubernetes-multicloud-scanning">Prowler and multicloud scanning</a>, and{' '}
        <a href="/#/blog/kubernetes-opa-eks-aks">Kubernetes policy across EKS and AKS</a>.
      </p>
    </>
  ),
};

export default post;
